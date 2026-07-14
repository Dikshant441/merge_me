import express, { Request, Response, NextFunction } from "express";
import { userAuth } from "../middleware/auth";
import { getUserBasic, isUuid } from "../models/connectionRequest";
import {
  saveProfile,
  unsaveProfile,
  getSavedProfiles,
} from "../models/savedProfile";

const savedRouter = express.Router();

// GET /saved — my Saved Collection, newest first.
// Bare array of _id-aliased safe users (+ savedAt), matching /feed's shape.
savedRouter.get(
  "/saved",
  userAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }
      const rows = await getSavedProfiles(req.pgUser.id);
      res.send(rows);
    } catch (err) {
      next(err);
    }
  }
);

// POST /saved/:userId — bookmark a profile. Idempotent.
// Pure bookmark: never creates or changes a connection request, never
// affects the feed, invisible to the saved user.
savedRouter.post(
  "/saved/:userId",
  userAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }
      const savedUserId = req.params.userId as string;
      if (savedUserId === req.pgUser.id) {
        return res.status(400).json({ message: "You cannot save yourself!!" });
      }
      const toUser = await getUserBasic(savedUserId);
      if (!toUser) {
        return res
          .status(400)
          .json({ message: "Person not exist in database.!!" });
      }
      const { created } = await saveProfile(req.pgUser.id, savedUserId);
      res.json({ message: created ? "Profile saved" : "Already saved" });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /saved/:userId — remove a bookmark. Idempotent. The ONLY way a
// profile leaves the Saved Collection — swipes and accept/reject never do.
savedRouter.delete(
  "/saved/:userId",
  userAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }
      const savedUserId = req.params.userId as string;
      // Non-uuid ids can't be saved rows — treat as already gone.
      const removed = isUuid(savedUserId)
        ? (await unsaveProfile(req.pgUser.id, savedUserId)).removed
        : false;
      res.json({ message: removed ? "Profile unsaved" : "Was not saved" });
    } catch (err) {
      next(err);
    }
  }
);

export default savedRouter;
