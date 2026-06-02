import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

// Same shape as email_verifications but with a shorter expiry (15–30 min
// recommended) because the security implications are bigger. tokenHash is
// SHA-256 of the raw token; raw token only appears in the reset email URL.
// On successful reset, app code must: update accounts.passwordHash where
// provider='password', mark this row used(FIELD IN TABLE), and delete all sessions
// rows for this userId (the "kick out everywhere" step).
export const passwordResets = pgTable(
  "password_resets",
  {
    tokenHash: text("token_hash").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("password_resets_user_id_idx").on(t.userId)]
);
