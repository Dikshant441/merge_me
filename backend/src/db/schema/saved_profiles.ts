import {
  check,
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

// saved_profiles — private, one-directional bookmarks ("Saved Collection").
//
// Completely independent of connection_requests: saving never touches the
// request state machine, never affects the feed, and is invisible to the
// saved user. A row here coexists freely with any request status (or none).
export const savedProfiles = pgTable(
  "saved_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    savedUserId: uuid("saved_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // You cannot save yourself.
    check("no_self_save", sql`${t.userId} <> ${t.savedUserId}`),

    // One bookmark per (saver, saved) pair — makes saving idempotent.
    uniqueIndex("uniq_saved_pair").on(t.userId, t.savedUserId),

    // "Saved Collection" page + sidebar badge: user_id = me, newest first.
    index("idx_saved_user_created").on(t.userId, t.createdAt),
  ]
);
