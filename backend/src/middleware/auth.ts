import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { verifyAccessToken } from "../lib/tokens";
import { getUserById } from "../services/auth.service";

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // New auth system: access_token cookie (Postgres users)
    const accessToken = req.cookies?.access_token;
    if (accessToken) {
      const claims = verifyAccessToken(accessToken);
      const pgUser = await getUserById(claims.sub);
      if (!pgUser) return res.status(401).send("User not authorized");

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
    next();
  } catch (error: any) {
    res.status(401).send("Error: " + error.message);
  }
};

export { userAuth };
