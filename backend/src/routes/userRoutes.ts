import express, { Request, Response, NextFunction } from "express";
import { userAuth } from "../middleware/auth";
import {
  getReceivedRequests,
  getConnections,
  getFeed,
} from "../models/connectionRequest";

const userRouter = express.Router();

userRouter.get(
  "/user/requests/received",
  userAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      // Migrated route: identities are Postgres ids (set by userAuth).
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }

      const data = await getReceivedRequests(req.pgUser.id);

      res.json({
        message: "Data fetch sucessfully",
        data,
      });
    } catch (error: any) {
      next(error);
    }
  }
);

userRouter.get(
  "/user/connections",
  userAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }

      // Returns "the other user" of each accepted pair directly.
      const data = await getConnections(req.pgUser.id);

      res.json({
        message: "Data fetch sucessfully",
        data,
      });
    } catch (error: any) {
      next(error);
    }
  }
);

userRouter.get(
  "/feed",
  userAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await getFeed(req.pgUser.id, { page, limit });

      // Bare array — the frontend consumes res.data directly.
      res.send(users);
    } catch (error: any) {
      next(error);
    }
  }
);

export default userRouter;
