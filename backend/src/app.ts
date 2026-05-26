import "dotenv/config";
import express, { Request } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db";
import { userAuth } from "./middleware/auth";
import authRouter from "./routes/authRoutes";
import profileRouter from "./routes/profileRoutes";
import requestRouter from "./routes/requestRoutes";
import userRouter from "./routes/userRoutes";
import paymentRouter from "./routes/paymentRoutes";
import chatRouter from "./routes/chatRoutes";
import initChatServer from "./sockets";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://3.107.231.184"],
    credentials: true,
  })
);

app.use(
  express.json({
    verify: (req: Request, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", paymentRouter);
app.use("/", userAuth, profileRouter);
app.use("/", userAuth, requestRouter);
app.use("/", userAuth, userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initChatServer(server);

connectDB()
  .then(() => {
    console.log("Database connection seccesful ...");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  })
  .catch((err: any) => {
    console.error(
      "database can't be connected:",
      err && err.message ? err.message : err
    );
    process.exit(1);
  });
