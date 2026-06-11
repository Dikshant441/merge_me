import express, { type Request, type Response } from "express";
import { generateState, generateCodeVerifier } from "arctic";
import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  getGoogle,
  getGitHub,
  setOAuthStateCookie,
  readOAuthStateCookie,
  clearOAuthStateCookie,
} from "../lib/oauthClients";
import { loginWithOAuth, type OAuthProfile } from "../services/oauth.service";
import { setAuthCookies } from "../lib/tokens";
import { rateLimitFor } from "../middleware/rateLimit";
import { AppError } from "../lib/errors";
import { logger } from "../lib/logger";

const router = express.Router();

const APP_URL = process.env.APP_URL ?? "http://localhost:5173";

// Per-request context for the service layer (same shape as authRoutes).
const ctx = (req: Request) => ({
  ip: req.ip ?? null,
  userAgent: req.get("user-agent") ?? null,
});

// Callbacks are full-page browser navigations, not XHR — failures must
// REDIRECT back to the login page (with a machine-readable code the form
// can show), never render raw JSON at localhost:3000.
const failRedirect = (res: Response, code: string): void => {
  res.redirect(`${APP_URL}/login?error=${encodeURIComponent(code)}`);
};

// Google's public signing keys, fetched once and cached by jose. Verifying
// the id_token signature against these is NON-NEGOTIABLE — without it,
// anyone who can reach the callback could hand us forged claims.
const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

type GoogleIdClaims = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  picture?: string;
  nonce?: string;
};

// === 4.9 START — GET /auth/google ==================================
router.get("/google", rateLimitFor("oauth"), (req: Request, res: Response) => {
  try {
    const state = generateState(); // CSRF defense on the callback
    const codeVerifier = generateCodeVerifier(); // PKCE — stops code interception
    const nonce = generateState(); // OIDC replay defense

    const url = getGoogle().createAuthorizationURL(state, codeVerifier, [
      "openid",
      "email",
      "profile",
    ]);
    url.searchParams.set("nonce", nonce);

    setOAuthStateCookie(res, { provider: "google", state, codeVerifier, nonce });
    res.redirect(url.toString());
  } catch (err) {
    logger.error({ err }, "Google OAuth start failed (check GOOGLE_* env vars)");
    failRedirect(res, "oauth_failed");
  }
});

// === 4.9 CALLBACK — GET /auth/google/callback ======================
router.get("/google/callback", async (req: Request, res: Response) => {
  const stored = readOAuthStateCookie(req);
  clearOAuthStateCookie(res); // single-use, success or fail

  const code = typeof req.query.code === "string" ? req.query.code : "";
  const state = typeof req.query.state === "string" ? req.query.state : "";

  // CSRF check: the state Google echoes back must match our cookie.
  if (!stored || stored.provider !== "google" || !code || state !== stored.state) {
    logger.warn({ ip: req.ip }, "Google OAuth state mismatch");
    return failRedirect(res, "oauth_state");
  }

  try {
    // Exchange code (+ PKCE verifier) for Google's tokens.
    const tokens = await getGoogle().validateAuthorizationCode(
      code,
      stored.codeVerifier ?? ""
    );

    // Verify id_token signature via Google's JWKS + iss/aud/exp, then nonce.
    const { payload } = await jwtVerify(tokens.idToken(), GOOGLE_JWKS, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const claims = payload as GoogleIdClaims;

    if (!claims.nonce || claims.nonce !== stored.nonce) {
      logger.warn({ ip: req.ip }, "Google id_token nonce mismatch");
      return failRedirect(res, "oauth_state");
    }
    if (!claims.email || claims.email_verified !== true) {
      return failRedirect(res, "no_verified_email");
    }

    const profile: OAuthProfile = {
      provider: "google",
      providerAccountId: claims.sub,
      email: claims.email.toLowerCase(),
      firstName: claims.given_name ?? "",
      lastName: claims.family_name ?? "",
      avatarUrl: claims.picture ?? null,
    };

    const result = await loginWithOAuth(profile, ctx(req));
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.redirect(`${APP_URL}/feed`);
  } catch (err) {
    if (err instanceof AppError && err.code === "EMAIL_EXISTS_USE_PASSWORD") {
      return failRedirect(res, "email_exists_password");
    }
    logger.error({ err }, "Google OAuth callback failed");
    failRedirect(res, "oauth_failed");
  }
});

// === 4.10 START — GET /auth/github =================================
// Same shape as Google minus PKCE/nonce: GitHub web apps don't support
// PKCE and GitHub is plain OAuth2 (no id_token), so state is the defense.
router.get("/github", rateLimitFor("oauth"), (req: Request, res: Response) => {
  try {
    const state = generateState();
    const url = getGitHub().createAuthorizationURL(state, ["read:user", "user:email"]);

    setOAuthStateCookie(res, { provider: "github", state });
    res.redirect(url.toString());
  } catch (err) {
    logger.error({ err }, "GitHub OAuth start failed (check GITHUB_* env vars)");
    failRedirect(res, "oauth_failed");
  }
});

// === 4.10 CALLBACK — GET /auth/github/callback =====================
router.get("/github/callback", async (req: Request, res: Response) => {
  const stored = readOAuthStateCookie(req);
  clearOAuthStateCookie(res);

  const code = typeof req.query.code === "string" ? req.query.code : "";
  const state = typeof req.query.state === "string" ? req.query.state : "";

  if (!stored || stored.provider !== "github" || !code || state !== stored.state) {
    logger.warn({ ip: req.ip }, "GitHub OAuth state mismatch");
    return failRedirect(res, "oauth_state");
  }

  try {
    const tokens = await getGitHub().validateAuthorizationCode(code);
    const ghHeaders = {
      Authorization: `Bearer ${tokens.accessToken()}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "mergeme-auth", // GitHub API rejects requests without a UA
    };

    // No id_token on GitHub — fetch the profile + emails from the API.
    const userRes = await fetch("https://api.github.com/user", { headers: ghHeaders });
    if (!userRes.ok) throw new Error(`GitHub /user responded ${userRes.status}`);
    const ghUser = (await userRes.json()) as {
      id: number;
      login: string;
      name: string | null;
      avatar_url: string | null;
    };

    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: ghHeaders,
    });
    if (!emailsRes.ok) throw new Error(`GitHub /user/emails responded ${emailsRes.status}`);
    const ghEmails = (await emailsRes.json()) as Array<{
      email: string;
      primary: boolean;
      verified: boolean;
    }>;

    // Only trust an email GitHub itself verified — otherwise anyone could
    // claim someone else's address and take over the matching account.
    const primary = ghEmails.find((e) => e.primary && e.verified);
    if (!primary) {
      return failRedirect(res, "no_verified_email");
    }

    // GitHub `name` is often null → fall back to the login handle.
    const nameParts = (ghUser.name ?? "").trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] ?? ghUser.login;
    const lastName = nameParts.slice(1).join(" ");

    const profile: OAuthProfile = {
      provider: "github",
      providerAccountId: String(ghUser.id),
      email: primary.email.toLowerCase(),
      firstName,
      lastName,
      avatarUrl: ghUser.avatar_url,
    };

    const result = await loginWithOAuth(profile, ctx(req));
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.redirect(`${APP_URL}/feed`);
  } catch (err) {
    if (err instanceof AppError && err.code === "EMAIL_EXISTS_USE_PASSWORD") {
      return failRedirect(res, "email_exists_password");
    }
    logger.error({ err }, "GitHub OAuth callback failed");
    failRedirect(res, "oauth_failed");
  }
});

export default router;