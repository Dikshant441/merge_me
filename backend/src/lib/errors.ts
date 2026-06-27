// Services throw AppError. errorHandler middleware translates to HTTP.
// `message` MUST be safe to show to a client.

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (code: string, message: string, details?: unknown) =>
  new AppError(400, code, message, details);

export const unauthorized = (code = "UNAUTHENTICATED", message = "Authentication required") =>
  new AppError(401, code, message);

export const forbidden = (code = "FORBIDDEN", message = "Access denied") =>
  new AppError(403, code, message);

export const notFound = (code = "NOT_FOUND", message = "Not found") =>
  new AppError(404, code, message);

export const conflict = (code: string, message: string) =>
  new AppError(409, code, message);

export const tooMany = (code = "TOO_MANY_REQUESTS", message = "Too many requests") =>
  new AppError(429, code, message);