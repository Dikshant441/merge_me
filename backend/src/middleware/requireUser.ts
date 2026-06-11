import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/tokens";
import { unauthorized } from "../lib/errors";

// Verifies the access JWT by SIGNATURE ONLY. No database lookup.
// That's the whole performance point of stateless JWTs — the hot path is
// signature math. Endpoints that need the user record load it themselves.
export const requireUser = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.access_token;
  if (!token) return next(unauthorized("NOT_AUTHENTICATED", "Login required"));

  try {
    const claims = verifyAccessToken(token);
    req.user = { id: claims.sub, sid: claims.sid };
    next();
  } catch {
    // Generic — don't distinguish expired / malformed / wrong-sig.
    next(unauthorized("NOT_AUTHENTICATED", "Login required"));
  }
};