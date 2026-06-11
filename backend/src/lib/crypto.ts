import crypto from "node:crypto";

// SHA-256 is correct for tokens (high-entropy random bytes, not passwords).
// Bcrypt's slow hash defeats the purpose here — we want a fast deterministic
// fingerprint for DB lookup, with no reversibility risk because the input
// has 256 bits of entropy.
export const sha256 = (raw: string): string =>
  crypto.createHash("sha256").update(raw).digest("hex");

// 32 random bytes = 256 bits. base64url is URL-safe (good for email links).
export const randomToken = (bytes = 32): string =>
  crypto.randomBytes(bytes).toString("base64url");

export const newUuid = (): string => crypto.randomUUID();