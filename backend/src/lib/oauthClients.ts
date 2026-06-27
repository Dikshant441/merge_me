import { Google, GitHub } from "arctic";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

// === Provider clients ==============================================
// arctic builds the authorize URLs and does the code→token exchange for us
// (including PKCE for Google). Redirect URIs must EXACTLY match what's
// registered in the Google Cloud Console / GitHub OAuth App settings.

const need = (name: string): string => {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set — add it to backend/.env`);
  return v;
};

// Lazy singletons so the server still boots when OAuth env isn't configured
// yet; the route only fails when someone actually clicks the button.
let googleClient: Google | null = null;
let githubClient: GitHub | null = null;

export const getGoogle = (): Google => {
  if (!googleClient) {
    googleClient = new Google(
      need("GOOGLE_CLIENT_ID"),
      need("GOOGLE_CLIENT_SECRET"),
      process.env.GOOGLE_REDIRECT_URI ?? "http://localhost:3000/auth/google/callback"
    );
  }
  return googleClient;
};

export const getGitHub = (): GitHub => {
  if (!githubClient) {
    githubClient = new GitHub(
      need("GITHUB_CLIENT_ID"),
      need("GITHUB_CLIENT_SECRET"),
      process.env.GITHUB_REDIRECT_URI ?? "http://localhost:3000/auth/github/callback"
    );
  }
  return githubClient;
};

// === OAuth state cookie ============================================
// Between the redirect TO the provider and the callback FROM it, we must
// remember { state, codeVerifier, nonce }. They go in a short-lived signed
// cookie: the JWT signature stops tampering, HttpOnly stops JS reading it,
// 10-min expiry bounds the window. Single-use: cleared in the callback.
//
// `__Host-` prefix (prod) forces Secure + Path=/ + no Domain — the most
// locked-down cookie a browser supports. Dev uses a plain name because
// `__Host-` requires the Secure flag, which plain-HTTP localhost can't set.

const isProd = process.env.NODE_ENV === "production";
const STATE_COOKIE = isProd ? "__Host-oauth" : "oauth_state";
const STATE_TTL_SEC = 10 * 60;

export type OAuthStatePayload = {
  provider: "google" | "github";
  state: string;
  intent: "login" | "signup"; // which button the user clicked
  codeVerifier?: string; // Google only (PKCE)
  nonce?: string; // Google only (OIDC replay defense)
};

export const setOAuthStateCookie = (res: Response, payload: OAuthStatePayload): void => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");
  const token = jwt.sign({ ...payload, type: "oauth_state" }, secret, {
    expiresIn: STATE_TTL_SEC,
    algorithm: "HS256",
  });
  res.cookie(STATE_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax", // must survive the top-level redirect back from the provider
    path: "/",
    maxAge: STATE_TTL_SEC * 1000,
  });
};

export const readOAuthStateCookie = (req: Request): OAuthStatePayload | null => {
  const raw = req.cookies?.[STATE_COOKIE];
  if (!raw) return null;
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");
  try {
    const payload = jwt.verify(raw, secret, { algorithms: ["HS256"] }) as
      OAuthStatePayload & { type?: string };
    if (payload.type !== "oauth_state") return null;
    return payload;
  } catch {
    return null;
  }
};

export const clearOAuthStateCookie = (res: Response): void => {
  res.clearCookie(STATE_COOKIE, { path: "/" });
};