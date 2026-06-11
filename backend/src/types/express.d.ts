// `user` is set by requireUser (new auth). `rawBody` is captured for the
// Razorpay webhook signature check. The `any` fallback exists during the
// transition while legacy Mongo routes still attach a full Mongoose document.
export {};

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; sid: string } | any;
      rawBody?: Buffer;
    }
  }
}