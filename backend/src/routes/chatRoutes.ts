import express, { Request, Response, NextFunction } from "express";
import { userAuth } from "../middleware/auth";
import { isUuid } from "../models/connectionRequest";
import { getChatHistory } from "../models/chatMessage";

const chatRouter = express.Router();

// GET /chat/:targetUserId — message history with one connection, oldest
// first. Shape mirrors the old Mongo populate: { messages: [{ senderId:
// { _id, first_name, last_name }, message, createdAt }] }.
chatRouter.get(
  "/chat/:targetUserId",
  userAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }
      const targetUserId = req.params.targetUserId as string;
      // Non-uuid ids (legacy Mongo ObjectIds) have no Postgres messages.
      const messages = isUuid(targetUserId)
        ? await getChatHistory(req.pgUser.id, targetUserId)
        : [];
      res.json({ messages });
    } catch (err) {
      next(err);
    }
  }
);

export default chatRouter;
