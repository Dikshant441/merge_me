const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");


const getSecretRoomId = (userID, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userID, targetUserId].sort().join("$"))
    .digest("hex");
};

const initChatServer = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userID, targetUserId }) => {
      const roomId = getSecretRoomId(userID, targetUserId);
      console.log(firstName + " joined roomId " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userID, targetUserId, message }) => {
        const roomId = getSecretRoomId(userID, targetUserId);
        console.log(firstName + " send message " + message);

        // save message into DB
        try {
          const roomId = getSecretRoomId(userID, targetUserId);
          console.log(firstName + " " + message);

          // TODO: Check if userID & targetUserId are friends

          let chat = await Chat.findOne({ 
            participants: { $all: [userID, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userID, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userID,
            message,
          });
 
          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName, message });
        } catch (err) {
          console.log(err);
        }
        io.to(roomId).emit("receivedMessage", { firstName, lastName, message });
      },
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initChatServer;
