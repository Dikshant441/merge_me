import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/tokens";
import { getUserById } from "../services/auth.service";

// Postgres-only auth (Phase 9 — the per-request Mongo lookup is gone).
// The legacy Mongo `token` cookie is no longer honored: those sessions just
// log in again through the new auth and get an access_token cookie.
const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const accessToken = req.cookies?.access_token;
    if (!accessToken) {
      return res.status(401).send("User not authorized, Please login first");
    }

    const claims = verifyAccessToken(accessToken);
    const pgUser = await getUserById(claims.sub);
    if (!pgUser) {
      return res.status(401).send("User not authorized");
    }

    req.pgUser = pgUser;
    next();
  } catch (error: any) {
    res.status(401).send("Error: " + error.message);
  }
};

export { userAuth };
