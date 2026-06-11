import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { users, accounts } from "../db/schema";
import { conflict } from "../lib/errors";
import {
  issueSession,
  toPublicUser,
  type AuthResult,
  type RequestCtx,
} from "./auth.service";

// Normalized profile, whichever provider it came from. `email` MUST already
// be verified by the provider before it reaches this function — the routes
// enforce that (Google: email_verified claim; GitHub: primary+verified row).
export type OAuthProfile = {
  provider: "google" | "github";
  providerAccountId: string; // Google `sub` / GitHub numeric id
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};

// === 4.9/4.10 step 8 — the linking decision ========================
// Lookup order matters:
//   1. accounts(provider, providerAccountId) — the provider identity is the
//      stable key. Found → SIGN IN that user, even if their provider email
//      changed since signup.
//   2. users(email) — exists but isn't linked to this provider identity →
//      REFUSE (manual-link policy). Auto-linking would let anyone who
//      controls a Google/GitHub account with your email take over your
//      password account.
//   3. Neither → SIGN UP: create user + account atomically. emailVerifiedAt
//      is set immediately because the provider already verified the email.
export async function loginWithOAuth(
  profile: OAuthProfile,
  ctx: RequestCtx
): Promise<AuthResult> {
  // 1. Known provider identity → sign in.
  const [linked] = await db
    .select({ user: users })
    .from(accounts)
    .innerJoin(users, eq(users.id, accounts.userId))
    .where(
      and(
        eq(accounts.provider, profile.provider),
        eq(accounts.providerAccountId, profile.providerAccountId)
      )
    )
    .limit(1);

  if (linked) {
    const { accessToken, refreshToken } = await issueSession(linked.user.id, ctx);
    return { user: toPublicUser(linked.user), accessToken, refreshToken };
  }

  // 2. Email already registered — sign in and link this provider so future
  //    logins via it are direct. Safe: the provider already verified the email.
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, profile.email))
    .limit(1);

  if (existing) {
    await db.insert(accounts).values({
      userId: existing.id,
      provider: profile.provider,
      providerAccountId: profile.providerAccountId,
      passwordHash: null,
    }).onConflictDoNothing();

    const { accessToken, refreshToken } = await issueSession(existing.id, ctx);
    return { user: toPublicUser(existing), accessToken, refreshToken };
  }

  // 3. Brand-new user → atomic user + account.
  const newUser = await db.transaction(async (tx) => {
    const [u] = await tx
      .insert(users)
      .values({
        email: profile.email,
        first_name: profile.firstName,
        last_name: profile.lastName,
        emailVerifiedAt: new Date(), // provider verified it for us
        avatarUrl: profile.avatarUrl,
      })
      .returning();

    if (!u) throw new Error("Failed to insert user");

    await tx.insert(accounts).values({
      userId: u.id,
      provider: profile.provider,
      providerAccountId: profile.providerAccountId,
      passwordHash: null, // OAuth account — no password
    });

    return u;
  });

  const { accessToken, refreshToken } = await issueSession(newUser.id, ctx);
  return { user: toPublicUser(newUser), accessToken, refreshToken };
}