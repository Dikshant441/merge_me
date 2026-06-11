import rateLimit, { type Options } from "express-rate-limit";

// Centralized policies. Add a key here instead of repeating config at call sites.
const POLICIES = {
  signup:  { windowMs: 60 * 60 * 1000, limit: 10, message: "Too many signup attempts" },
  login:   { windowMs: 15 * 60 * 1000, limit: 10, message: "Too many login attempts" },
  refresh: { windowMs: 60 * 1000,      limit: 60, message: "Too many refresh attempts" },
  reset:   { windowMs: 60 * 60 * 1000, limit: 5,  message: "Too many reset requests" },
  verify:  { windowMs: 60 * 60 * 1000, limit: 10, message: "Too many verify requests" },
  oauth:   { windowMs: 60 * 1000,      limit: 20, message: "Too many OAuth attempts" },
} as const;

export type RateKey = keyof typeof POLICIES;

export const rateLimitFor = (key: RateKey, overrides?: Partial<Options>) => {
  const policy = POLICIES[key];
  return rateLimit({
    windowMs: policy.windowMs,
    limit: policy.limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, res) =>
      res.status(429).json({ error: "TOO_MANY_REQUESTS", message: policy.message }),
    ...overrides,
  });
};