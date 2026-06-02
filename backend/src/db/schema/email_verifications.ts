import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

// One row per verification email sent. Hashed, short-lived, single-use.
// tokenHash is SHA-256 of the raw token — the raw token only ever appears
// in the email URL, the DB never stores it in plaintext. Typically
// expiresAt = NOW() + 24 hours. consumedAt is set on first use.
export const emailVerifications = pgTable(
  "email_verifications",
  {
    tokenHash: text("token_hash").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("email_verifications_user_id_idx").on(t.userId)]
);
