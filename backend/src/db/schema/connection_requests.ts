import {
  check,
  index,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

// One row = one directed edge between two users.
// A "connection" is simply a row with status = 'accepted'.
// State machine: (no row) → interested → accepted | rejected (review only by
// the receiver); (no row) → ignored (terminal, silently hides from feed).
export const connectionStatus = pgEnum("connection_status", [
  "ignored",
  "interested",
  "accepted",
  "rejected",
]);

export const connectionRequests = pgTable(
  "connection_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fromUserId: uuid("from_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toUserId: uuid("to_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: connectionStatus("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // You cannot send a request to yourself.
    check("no_self_request", sql`${t.fromUserId} <> ${t.toUserId}`),

    // At most one request in a given direction.
    uniqueIndex("one_per_direction").on(t.fromUserId, t.toUserId),

    // At most one relationship per PAIR, regardless of direction.
    // Consequence: if A ignored B, B can never send a request to A.
    uniqueIndex("uniq_pair").on(
      sql`LEAST(${t.fromUserId}, ${t.toUserId})`,
      sql`GREATEST(${t.fromUserId}, ${t.toUserId})`
    ),

    // "Requests received" page: to_user_id = me AND status = 'interested'
    index("idx_cr_to_status").on(t.toUserId, t.status),

    // Feed exclusion + "requests I sent"
    index("idx_cr_from_status").on(t.fromUserId, t.status),
  ]
);
