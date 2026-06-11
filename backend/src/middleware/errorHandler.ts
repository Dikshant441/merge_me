import type { ErrorRequestHandler } from "express";
import { AppError } from "../lib/errors";
import { logger } from "../lib/logger";

// MUST be the LAST middleware in app.ts.
export const errorHandler: ErrorRequestHandler = (err, req, res, _next): void => {
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: err.code,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Unexpected — log full detail server-side, return generic to client.
  logger.error(
    { err, path: req.path, method: req.method, reqId: (req as any).id },
    "Unhandled error"
  );
  res.status(500).json({ error: "INTERNAL", message: "Internal server error" });
};