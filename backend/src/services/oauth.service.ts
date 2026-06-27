import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { users, accounts } from "../db/schema";
import { conflict, notFound } from "../lib/errors";
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


export type OAuthIntent = "login" | "signup";

export async function loginWithOAuth(
  profile: OAuthProfile,
  ctx: RequestCtx,
  intent: OAuthIntent
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

  // 2. Email exists under a DIFFERENT identity (e.g. a password account) →
  //    REFUSE. Auto-linking would let anyone who controls a Google/GitHub
  //    account with your email silently take over your password account.
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, profile.email))
    .limit(1);

  if (existing) {
    throw conflict(
      "EMAIL_EXISTS_USE_PASSWORD",
      "This email already has an account. Sign in with your password first, then link this provider from settings."
    );
  }

  // 3. Brand-new email. Only auto-create when the user explicitly chose to
  //    SIGN UP. Hitting the LOGIN button with an unknown email is a mistake
  //    (typo / wrong Google account), not a request to register.
  if (intent === "login") {
    throw notFound("NO_ACCOUNT", "No account found for this email. Please sign up first.");
  }

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