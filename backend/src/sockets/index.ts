import { Server as SocketIOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import crypto from "crypto";
import { isUuid } from "../models/connectionRequest";
import { areConnected, saveChatMessage } from "../models/chatMessage";

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
    socket.on("joinChat", ({ userID, targetUserId }: any) => {
      if (!isUuid(userID) || !isUuid(targetUserId)) return;
      socket.join(getSecretRoomId(userID, targetUserId));
    });

    socket.on(
      "sendMessage",
      async ({ first_name, last_name, userID, targetUserId, message }: any) => {
        try {
          if (!isUuid(userID) || !isUuid(targetUserId)) return;
          if (typeof message !== "string" || message.trim() === "") return;

          // Only accepted connections may talk.
          if (!(await areConnected(userID, targetUserId))) return;

          await saveChatMessage(userID, targetUserId, message);

          // senderId lets receivers drop their own echo client-side.
          io.to(getSecretRoomId(userID, targetUserId)).emit("receivedMessage", {
            senderId: userID,
            first_name,
            last_name,
            message,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

export default initChatServer;
