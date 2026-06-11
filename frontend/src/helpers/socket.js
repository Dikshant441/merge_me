import io from "socket.io-client";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000");
  }
  return io("/", { path: "/api/socket.io" });
};

export default createSocketConnection;
