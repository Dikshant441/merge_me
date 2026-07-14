import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// payments — one row per Razorpay order (replaces the Mongoose Payment
// document). `notes` mirrors what we send to Razorpay when creating the
// order, so the webhook can grant the right membership without a lookup.
export type PaymentNotes = {
  first_name?: string;
  last_name?: string;
  email?: string;
  membershipType?: string;
};

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    paymentId: text("payment_id"),
    orderId: text("order_id").notNull().unique(),
    status: text("status").notNull(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    receipt: text("receipt"),
    notes: jsonb("notes").$type<PaymentNotes>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("idx_payments_user").on(t.userId)]
);
