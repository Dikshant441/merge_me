const express = require("express");
const { userAuth } = require("../middleware/auth");
const ChatRouter = express.Router();

const Chat = require("../models/chat");

ChatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
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

module.exports = ChatRouter;
