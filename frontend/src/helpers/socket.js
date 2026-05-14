import io from "socket.io-client";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io("http://localhost:3000");
  } else {
    return io("/", { path: "/api/socket.io" });
  }

};


export default createSocketConnection;