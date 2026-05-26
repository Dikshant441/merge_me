// Augment Express.Request to carry the authenticated user attached by auth middleware,
// and the raw request body captured by the express.json `verify` hook (used by the
// Razorpay webhook signature check).
// Typed loosely during the JS->TS migration; tighten once models/user has a real type.

export {};

declare global {
  namespace Express {
    interface Request {
      user?: any;
      rawBody?: Buffer;
    }
  }
}
