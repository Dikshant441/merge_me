import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import User from "../models/user";
import { verifyAccessToken } from "../lib/tokens";
import { getUserById, toPublicUser } from "../services/auth.service";
import { db } from "../db";
import { users } from "../db/schema";

// Postgres identity for a user who logged in with the LEGACY Mongo JWT.
// After the data migration every Mongo user has a Postgres row linked via
// legacy_mongo_id; email is the fallback for rows linked before that column
// existed. Returns null until the data migration has run.
const findPgUserForMongoUser = async (mongoUser: any) => {
  const [byLegacyId] = await db
    .select()
    .from(users)
    .where(eq(users.legacyMongoId, String(mongoUser._id)))
    .limit(1);
  if (byLegacyId) return toPublicUser(byLegacyId);

  const [byEmail] = await db
    .select()
    .from(users)
    .where(eq(users.email, mongoUser.email))
    .limit(1);
  return byEmail ? toPublicUser(byEmail) : null;
};

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // New auth system: access_token cookie (Postgres users)
    const accessToken = req.cookies?.access_token;
    if (accessToken) {
      const claims = verifyAccessToken(accessToken);
      const pgUser = await getUserById(claims.sub);
      if (!pgUser) return res.status(401).send("User not authorized");

      // Postgres identity — used by the migrated routes (feed, requests,
      // connections). Mongo-backed routes keep reading req.user below.
      req.pgUser = pgUser;

      // Find the matching Mongo user by email (for legacy Mongo routes)
      const mongoUser = await User.findOne({ email: pgUser.email });
      if (mongoUser) {
        req.user = mongoUser;
        return next();
      }

      // Postgres-only user (no Mongo doc yet) — attach a minimal object so
      // Mongo queries that filter by _id still run without crashing.
      req.user = {
        _id: null,
        email: pgUser.email,
        first_name: pgUser.first_name,
        last_name: pgUser.last_name,
      } as any;
      return next();
    }

    // Legacy system: token cookie (old Mongo users)
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("User not authorized, Please login first");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await User.findOne({ _id: decoded.id });
    if (!user) throw new Error("User not found");

    req.user = user;
    req.pgUser = (await findPgUserForMongoUser(user)) ?? undefined;
    next();
  } catch (error: any) {
    res.status(401).send("Error: " + error.message);
  }
};

export { userAuth };
