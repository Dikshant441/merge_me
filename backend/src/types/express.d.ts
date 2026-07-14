// `user` is set by requireUser (token claims only). `pgUser` is the full
// Postgres identity attached by userAuth. `rawBody` is captured for the
// Razorpay webhook signature check.
export {};

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; sid: string };
      pgUser?: import("../services/auth.service").PublicUser;
      rawBody?: Buffer;
    }
  }
}
