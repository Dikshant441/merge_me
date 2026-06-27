import jwt, { type SignOptions } from "jsonwebtoken";
import type { Response } from "express";

const ACCESS_TTL_SEC = 15 * 60;                     // 15 minutes
export const REFRESH_TTL_SEC = 30 * 24 * 60 * 60;   // 30 days

const isProd = process.env.NODE_ENV === "production";
// Refresh cookie Path must match what the BROWSER requests. The SPA talks to
// the API under /api in both environments (Vite proxy in dev, Nginx prefix in
// prod), so the browser-visible refresh path is /api/auth/refresh.
const REFRESH_COOKIE_PATH = process.env.COOKIE_REFRESH_PATH ?? "/api/auth/refresh";

export type AccessClaims = {
  sub: string;   // user id
  sid: string;   // session id (sessions.id this access belongs to)
  type: "access";
};

export const signAccessToken = (claims: { sub: string; sid: string }): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");
  const opts: SignOptions = { expiresIn: ACCESS_TTL_SEC, algorithm: "HS256" };
  return jwt.sign({ ...claims, type: "access" }, secret, opts);
};

export const verifyAccessToken = (token: string): AccessClaims => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");
  const payload = jwt.verify(token, secret, { algorithms: ["HS256"] }) as AccessClaims;
  if (payload.type !== "access") throw new Error("Wrong token type");
  return payload;
};

export const setAuthCookies = (res: Response, access: string, refresh: string): void => {
  res.cookie("access_token", access, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TTL_SEC * 1000,
  });
  res.cookie("refresh_token", refresh, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    maxAge: REFRESH_TTL_SEC * 1000,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: REFRESH_COOKIE_PATH });
};