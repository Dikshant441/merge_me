import { Server as SocketIOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import crypto from "crypto";
import Chat from "../models/chat";

const getSecretRoomId = (userID: string, targetUserId: string): string => {
  return crypto
    .createHash("sha256")
    .update([userID, targetUserId].sort().join("$"))
    .digest("hex");
};

const initChatServer = (server: HTTPServer): void => {
  const frontendOrigins = (process.env.FRONTEND_URL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const io = new SocketIOServer(server, {
    cors: {
      origin: frontendOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("joinChat", ({ firstName, userID, targetUserId }: any) => {
      const roomId = getSecretRoomId(userID, targetUserId);
      console.log(firstName + " joined roomId " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userID, targetUserId, message }: any) => {
        const roomId = getSecretRoomId(userID, targetUserId);
        console.log(firstName + " send message " + message);

        try {
          const roomId = getSecretRoomId(userID, targetUserId);
          console.log(firstName + " " + message);

          // TODO: Check if userID & targetUserId are friends

          let chat: any = await Chat.findOne({
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
      }
    );

    socket.on("disconnect", () => {});
  });
};

export default initChatServer;
