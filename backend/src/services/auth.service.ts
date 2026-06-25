import { and, eq, isNull } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "../db";
import { users, accounts, sessions, emailVerifications } from "../db/schema";
import { sha256, randomToken, newUuid } from "../lib/crypto";
import { signAccessToken, REFRESH_TTL_SEC } from "../lib/tokens";
import { sendVerificationEmail } from "../lib/mailer";
import { logger } from "../lib/logger";
import { badRequest, conflict, unauthorized } from "../lib/errors";
import type { SignupInput, LoginInput } from "../validators/authSchemas";

const BCRYPT_COST = 12;

// Public-facing user shape — strip anything sensitive before returning.
export type PublicUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  emailVerifiedAt: Date | null;
  avatarUrl: string | null;
};

export const toPublicUser = (u: typeof users.$inferSelect): PublicUser => ({
  id: u.id,
  email: u.email,
  first_name: u.first_name,
  last_name: u.last_name,
  emailVerifiedAt: u.emailVerifiedAt,
  avatarUrl: u.avatarUrl,
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
export async function signup(input: SignupInput, ctx: RequestCtx): Promise<AuthResult> {

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  console.log("existing =>", existing)


  if (existing.length > 0) {
    // Generic — don't reveal which provider owns the email.
    console.log("1111")
    throw conflict("EMAIL_TAKEN", "An account with this email already exists");
  }

  console.log(22222)

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

  const { accessToken, refreshToken } = await issueSession(newUser.id, ctx);
  return { user: toPublicUser(newUser), accessToken, refreshToken };
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

  const { accessToken, refreshToken } = await issueSession(user.id, ctx);
  return { user: toPublicUser(user), accessToken, refreshToken };
}

// ─── Email verification: confirm by token ────────────────────────
export async function confirmEmailVerification(rawToken: string): Promise<void> {
  const hash = sha256(rawToken);
  const [row] = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.tokenHash, hash))
    .limit(1);

  if (!row || row.usedAt !== null || row.expiresAt < new Date()) {
    throw badRequest("INVALID_TOKEN", "Verification link is invalid or expired");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ emailVerifiedAt: new Date() })
      .where(eq(users.id, row.userId));
    await tx
      .update(emailVerifications)
      .set({ usedAt: new Date() })
      .where(eq(emailVerifications.tokenHash, hash));
  });
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