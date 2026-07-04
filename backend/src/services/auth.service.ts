import { and, desc, eq, isNull } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "../db";
import { users, accounts, sessions, emailVerifications, passwordResets } from "../db/schema";
import { sha256, randomToken, newUuid } from "../lib/crypto";
import { signAccessToken, REFRESH_TTL_SEC } from "../lib/tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/mailer";
import { logger } from "../lib/logger";
import { badRequest, conflict, unauthorized } from "../lib/errors";
import type { SignupInput, LoginInput } from "../validators/authSchemas";

const BCRYPT_COST = 12;
const RESET_TTL_MIN = 15;
const RESET_RESEND_COOLDOWN_MS = 60 * 1000;

// Public-facing user shape — strip anything sensitive before returning.
export type PublicUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatarUrl: string | null;
  about: string | null;
  skills: string[] | null;
  age: number | null;
  gender: string | null;
  membership: string | null;
  isPremium: boolean | null;
};

export const toPublicUser = (u: typeof users.$inferSelect): PublicUser => ({
  id: u.id,
  email: u.email,
  first_name: u.first_name,
  last_name: u.last_name,
  avatarUrl: u.avatarUrl,
  about: u.about,
  skills: u.skills,
  age: u.age,
  gender: u.gender,
  membership: u.membership,
  isPremium: u.isPremium,
});

export type RequestCtx = {
  ip: string | null;
  userAgent: string | null;
};

export type AuthResult = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

// Returned by signup(): no session is issued until the user clicks the
// verification link, so the route can't (and shouldn't) set auth cookies.
export type SignupResult = {
  user: PublicUser;
  emailSent: true;
};

// ─── Internal: convergence point for ALL auth entry paths ────────
export async function issueSession(
  userId: string,
  ctx: RequestCtx,
  familyId: string = newUuid()
): Promise<{ accessToken: string; refreshToken: string; sessionId: string }> {
  const refreshRaw = randomToken(32);
  const sessionId = newUuid();
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    refreshTokenHash: sha256(refreshRaw),
    familyId,
    userAgent: ctx.userAgent,
    ip: ctx.ip,
    expiresAt,
  });

  const accessToken = signAccessToken({ sub: userId, sid: sessionId });
  return { accessToken, refreshToken: refreshRaw, sessionId };
}

// ─── Signup ──────────────────────────────────────────────────────
// Password signup creates the user but does NOT log them in. We can't trust
// the email until the user proves they own it by clicking the link. The
// session is issued on confirmEmailVerification() instead.
export async function signup(input: SignupInput, _ctx: RequestCtx): Promise<SignupResult> {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existing.length > 0) {
    // Generic — don't reveal which provider owns the email.
    throw conflict("EMAIL_TAKEN", "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);

  // Atomic user + account. Either both rows commit or neither.
  const newUser = await db.transaction(async (tx) => {
    const [u] = await tx
      .insert(users)
      .values({
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
      })
      .returning();

    if (!u) throw new Error("Failed to insert user");

    await tx.insert(accounts).values({
      userId: u.id,
      provider: "password",
      providerAccountId: u.id, // keeps UNIQUE(provider, providerAccountId) clean
      passwordHash,
    });

    return u;
  });

  // Verification token: raw goes in email link, only sha256 hits the DB.
  const verifyRaw = randomToken(32);
  await db.insert(emailVerifications).values({
    userId: newUser.id,
    tokenHash: sha256(verifyRaw),
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
  });

  // Fire-and-forget — signup MUST NOT fail if Resend is down.
  sendVerificationEmail({ to: newUser.email, token: verifyRaw }).catch((err) =>
    logger.error({ err, to: newUser.email }, "Failed to send verification email")
  );

  return { user: toPublicUser(newUser), emailSent: true };
}

// ─── Login ───────────────────────────────────────────────────────
export async function login(input: LoginInput, ctx: RequestCtx): Promise<AuthResult> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (!user) {
    throw unauthorized("INVALID_CREDENTIALS", "Invalid email or password");
  }

  const [account] = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.userId, user.id), eq(accounts.provider, "password")))
    .limit(1);

  if (!account?.passwordHash) {
    throw unauthorized("INVALID_CREDENTIALS", "Invalid email or password");
  }

    const valid = await bcrypt.compare(input.password, account.passwordHash);
  if (!valid) {
    throw unauthorized("INVALID_CREDENTIALS", "Invalid email or password");
  }

  // Block password logins for unverified emails. (OAuth-only users have no
  // password account row, so they never reach this branch.)
  if (user.emailVerifiedAt === null) {
    throw unauthorized(
      "EMAIL_NOT_VERIFIED",
      "Please verify your email before signing in"
    );
  }

  const { accessToken, refreshToken } = await issueSession(user.id, ctx);
  return { user: toPublicUser(user), accessToken, refreshToken };
}

// ─── Email verification: confirm by token, then sign the user in ─
// Clicking the link is itself proof of email ownership, so we drop them
// straight into the app instead of forcing a second login round-trip.
export async function confirmEmailVerification(
  rawToken: string,
  ctx: RequestCtx
): Promise<AuthResult> {
  const hash = sha256(rawToken);
  const [row] = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.tokenHash, hash))
    .limit(1);

  if (!row || row.usedAt !== null || row.expiresAt < new Date()) {
    throw badRequest("INVALID_TOKEN", "Verification link is invalid or expired");
  }

  const verifiedUser = await db.transaction(async (tx) => {
    const [u] = await tx
      .update(users)
      .set({ emailVerifiedAt: new Date() })
      .where(eq(users.id, row.userId))
      .returning();
    await tx
      .update(emailVerifications)
      .set({ usedAt: new Date() })
      .where(eq(emailVerifications.tokenHash, hash));
    if (!u) throw new Error("Verified user vanished mid-transaction");
    return u;
  });

  const { accessToken, refreshToken } = await issueSession(verifiedUser.id, ctx);
  return { user: toPublicUser(verifiedUser), accessToken, refreshToken };
}

// ─── Refresh (rotation + reuse detection) ────────────────────────
export async function refresh(
  rawRefreshToken: string,
  ctx: RequestCtx
): Promise<{ accessToken: string; refreshToken: string }> {
  const hash = sha256(rawRefreshToken);

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.refreshTokenHash, hash))
    .limit(1);

  if (!session) {
    throw unauthorized("SESSION_INVALID", "Session expired");
  }

  // 🚨 REUSE DETECTION — token was rotated already but is being replayed.
  // Revoke the entire family lineage (this device's whole history).
  if (session.revokedAt !== null) {
    logger.warn(
      { userId: session.userId, familyId: session.familyId, ip: ctx.ip },
      "Refresh token reuse detected — revoking family"
    );
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(
        and(eq(sessions.familyId, session.familyId), isNull(sessions.revokedAt))
      );
    throw unauthorized("SESSION_INVALID", "Session expired");
  }

  if (session.expiresAt < new Date()) {
    throw unauthorized("SESSION_INVALID", "Session expired");
  }

  // Rotate atomically: revoke old + INSERT new (SAME family_id).
  const newSessionId = newUuid();
  const newRefreshRaw = randomToken(32);
  const newExpires = new Date(Date.now() + REFRESH_TTL_SEC * 1000);

  await db.transaction(async (tx) => {
    await tx
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.id, session.id));

    await tx.insert(sessions).values({
      id: newSessionId,
      userId: session.userId,
      refreshTokenHash: sha256(newRefreshRaw),
      familyId: session.familyId,
      userAgent: ctx.userAgent,
      ip: ctx.ip,
      expiresAt: newExpires,
    });
  });

  const accessToken = signAccessToken({ sub: session.userId, sid: newSessionId });
  return { accessToken, refreshToken: newRefreshRaw };
}

// ─── Logout: this device only ────────────────────────────────────
export async function logout(rawRefreshToken: string | undefined): Promise<void> {
  if (!rawRefreshToken) return; // graceful no-op — never error on logout
  const hash = sha256(rawRefreshToken);
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(
      and(eq(sessions.refreshTokenHash, hash), isNull(sessions.revokedAt))
    );
}

// ─── Logout all: every device for this user ──────────────────────
export async function logoutAll(userId: string): Promise<void> {
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)));
}

// ─── Whoami helper (used by /auth/me if you add it) ──────────────
export async function getUserById(userId: string): Promise<PublicUser | null> {
  const [u] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return u ? toPublicUser(u) : null;
}

// ─── Password reset: request ─────────────────────────────────────
// The route ALWAYS responds 200 no matter what happens in here — user
// enumeration defense. A token is only minted when the email belongs to a
// user who actually has a password account (OAuth-only users no-op).
export async function requestPasswordReset(email: string): Promise<void> {
  const [row] = await db
    .select({ user: users })
    .from(users)
    .innerJoin(
      accounts,
      and(eq(accounts.userId, users.id), eq(accounts.provider, "password"))
    )
    .where(eq(users.email, email))
    .limit(1);

  if (!row) return; // unknown email OR OAuth-only — silently do nothing

  await issuePasswordReset(row.user.id, row.user.email);
}

const issuePasswordReset = async (userId: string, email: string): Promise<void> => {
  const [recent] = await db
    .select({
      createdAt: passwordResets.createdAt,
      expiresAt: passwordResets.expiresAt,
    })
    .from(passwordResets)
    .where(and(eq(passwordResets.userId, userId), isNull(passwordResets.usedAt)))
    .orderBy(desc(passwordResets.createdAt))
    .limit(1);

  if (
    recent &&
    recent.expiresAt > new Date() &&
    recent.createdAt.getTime() > Date.now() - RESET_RESEND_COOLDOWN_MS
  ) {
    logger.info({ userId }, "Password-reset resend skipped during cooldown");
    return;
  }

  // One active link at a time: burn earlier unused tokens for this user.
  await db
    .delete(passwordResets)
    .where(and(eq(passwordResets.userId, userId), isNull(passwordResets.usedAt)));

  const raw = randomToken(32);
  await db.insert(passwordResets).values({
    tokenHash: sha256(raw),
    userId,
    expiresAt: new Date(Date.now() + RESET_TTL_MIN * 60 * 1000),
  });

  // Fire-and-forget — the 200 must not depend on (or time) the email send.
  sendPasswordResetEmail({ to: email, token: raw }).catch((err) =>
    logger.error({ err, to: email }, "Failed to send password-reset email")
  );
};

export async function resendPasswordReset(rawToken: string): Promise<void> {
  const hash = sha256(rawToken);
  const [row] = await db
    .select()
    .from(passwordResets)
    .where(eq(passwordResets.tokenHash, hash))
    .limit(1);

  if (!row || row.usedAt !== null) {
    throw badRequest("INVALID_TOKEN", "Reset link can no longer be resent");
  }

  const [user] = await db
    .select({ email: users.email })
    .from(users)
    .innerJoin(
      accounts,
      and(eq(accounts.userId, users.id), eq(accounts.provider, "password"))
    )
    .where(eq(users.id, row.userId))
    .limit(1);

  if (!user) {
    throw badRequest("INVALID_TOKEN", "Reset link can no longer be resent");
  }

  await issuePasswordReset(row.userId, user.email);
}

// ─── Password reset: confirm ─────────────────────────────────────
// Sets the new password, burns the token, and revokes EVERY session — the
// whole reason someone resets is "my account may be compromised", so any
// session an attacker holds must die. Then issues a fresh session for this
// device: the user just proved email ownership AND set the password.
export async function confirmPasswordReset(
  rawToken: string,
  newPassword: string,
  ctx: RequestCtx
): Promise<AuthResult> {
  const hash = sha256(rawToken);
  const [row] = await db
    .select()
    .from(passwordResets)
    .where(eq(passwordResets.tokenHash, hash))
    .limit(1);

  if (!row || row.usedAt !== null || row.expiresAt < new Date()) {
    throw badRequest("INVALID_TOKEN", "Reset link is invalid or expired");
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST);

  const resetUser = await db.transaction(async (tx) => {
    const [acct] = await tx
      .update(accounts)
      .set({ passwordHash })
      .where(and(eq(accounts.userId, row.userId), eq(accounts.provider, "password")))
      .returning({ id: accounts.id });
    // Tokens are only ever minted for password users; no row here means
    // something is deeply wrong — abort so nothing half-applies.
    if (!acct) throw new Error("No password account for reset token");

    await tx
      .update(passwordResets)
      .set({ usedAt: new Date() })
      .where(eq(passwordResets.tokenHash, hash));

    // Kick out everywhere — invalidate any session an attacker may hold.
    await tx
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(sessions.userId, row.userId), isNull(sessions.revokedAt)));

    const [u] = await tx.select().from(users).where(eq(users.id, row.userId)).limit(1);
    if (!u) throw new Error("Reset user vanished mid-transaction");
    return u;
  });

  const { accessToken, refreshToken } = await issueSession(resetUser.id, ctx);
  return { user: toPublicUser(resetUser), accessToken, refreshToken };
}
