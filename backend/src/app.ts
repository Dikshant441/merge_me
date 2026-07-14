import "dotenv/config";
import express, { Request } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { userAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./lib/logger";

import authRouter from "./routes/authRoutes";     // NEW (Drizzle + Postgres)
import profileRouter from "./routes/profileRoutes";
import requestRouter from "./routes/requestRoutes";
import userRouter from "./routes/userRoutes";
import savedRouter from "./routes/savedRoutes";
import paymentRouter from "./routes/paymentRoutes";
import chatRouter from "./routes/chatRoutes";
import initChatServer from "./sockets";
import oauthRouter from "./routes/oauthRoutes"; 

const app = express();
const PORT = process.env.PORT ?? 3000;

// CRITICAL behind Cloudflare + Nginx — without this, req.ip is wrong
// and Secure cookies break in production.
app.set("trust proxy", 1);

app.use(helmet());
app.use(pinoHttp({
  logger,
  customLogLevel: (_req, res, err) => {
    if (err) return "error";
    if (res.statusCode === 304) return "silent";
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
}));

const frontendOrigins = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({ origin: frontendOrigins, credentials: true }));

app.use(
  express.json({
    limit: "1mb",                                  // memory-exhaustion defense (allows base64 avatar uploads)
    verify: (req: Request, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());

// ─── New auth (Drizzle + Postgres) ──────────────────────────────
app.use("/auth", authRouter);
app.use("/auth", oauthRouter); 
// ─── App routes (all Drizzle + Postgres) ────────────────────────
app.use("/", paymentRouter);
app.use("/", userAuth, profileRouter);
app.use("/", userAuth, requestRouter);
app.use("/", userAuth, userRouter);
// Saved Collection (Postgres only) — savedRouter applies userAuth per-route.
app.use("/", savedRouter);
app.use("/", chatRouter);

// 404 catcher
app.use((_req, res) => {
  res.status(404).json({ error: "NOT_FOUND", message: "Route not found" });
});

// MUST be last — translates AppError to HTTP, logs unexpected errors.
app.use(errorHandler);

const server = http.createServer(app);
initChatServer(server);

server.listen(PORT, () => logger.info(`Server listening on :${PORT}`));