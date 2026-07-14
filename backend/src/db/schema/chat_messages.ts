import {
  check,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

// chat_messages — one row per direct message between two connected users
// (replaces the Mongoose Chat document). There is no conversation entity:
// a thread is simply every row whose (sender, receiver) matches the pair in
// either direction, ordered by created_at.
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // You cannot message yourself.
    check("no_self_message", sql`${t.senderId} <> ${t.receiverId}`),

    // Thread lookup — the history query ORs both directions of the pair, so
    // the planner can BitmapOr two range scans of this one index.
    index("idx_chat_pair_created").on(t.senderId, t.receiverId, t.createdAt),
  ]
);
