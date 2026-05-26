import express, { Request, Response } from "express";
import { userAuth } from "../middleware/auth";
import Chat from "../models/chat";

const ChatRouter = express.Router();

ChatRouter.get("/chat/:targetUserId", userAuth, async (req: Request, res: Response) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "first_name last_name",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.log(err);
  }
});

export default ChatRouter;
