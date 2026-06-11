import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true, translateTime: "SYS:HH:MM:ss" },
    },
  }),
  // Strip sensitive fields if they slip into logged objects.
  redact: {
    paths: [
      "*.password",
      "*.password_hash",
      "*.passwordHash",
      "*.token",
      "*.access_token",
      "*.refresh_token",
      "req.headers.cookie",
      "req.headers.authorization",
      'res.headers["set-cookie"]',
    ],
    censor: "[REDACTED]",
  },
});