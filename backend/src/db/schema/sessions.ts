import { index, inet, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

// One row per active refresh token. refreshTokenHash is SHA-256 of the raw
// token (not bcrypt — these are 32-byte random tokens, not passwords).
// familyId groups a token with all its rotated descendants so reuse of an
// old token can revoke the entire family. revokedAt is set instead of
// deleting, to preserve an audit trail.
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    refreshTokenHash: text("refresh_token_hash").notNull().unique(),
    familyId: uuid("family_id").notNull(),
    userAgent: text("user_agent"),
    ip: inet("ip"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_id_idx").on(t.userId)]
);
