// `user` is set by requireUser (new auth). `rawBody` is captured for the
// Razorpay webhook signature check. The `any` fallback exists during the
// transition while legacy Mongo routes still attach a full Mongoose document.
export {};

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; sid: string } | any;
      // Postgres identity, attached by userAuth for both token systems.
      // The migrated routes (feed / requests / connections) read this.
      pgUser?: import("../services/auth.service").PublicUser;
      rawBody?: Buffer;
    }
  }
}