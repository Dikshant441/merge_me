// Postgres payment model (replaces the Mongoose Payment document).
import { eq } from "drizzle-orm";
import { db } from "../db";
import { payments, users, type PaymentNotes } from "../db/schema";

export async function createPayment(row: {
  userId: string;
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  receipt?: string | null;
  notes?: PaymentNotes;
}) {
  const [payment] = await db.insert(payments).values(row).returning();
  return payment;
}

/**
 * Webhook: record the gateway's status for an order (and the Razorpay
 * payment id). Returns null when the order isn't ours.
 */
export async function markPaymentStatus(
  orderId: string,
  status: string,
  paymentId?: string
) {
  const [payment] = await db
    .update(payments)
    .set({ status, ...(paymentId ? { paymentId } : {}) })
    .where(eq(payments.orderId, orderId))
    .returning();
  return payment ?? null;
}

/** Captured payment → flip the Postgres user to premium. */
export async function grantPremium(userId: string, membershipType?: string) {
  await db
    .update(users)
    .set({
      isPremium: true,
      ...(membershipType ? { membership: membershipType } : {}),
    })
    .where(eq(users.id, userId));
}
