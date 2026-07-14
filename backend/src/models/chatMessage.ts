// Postgres chat model (replaces the Mongoose Chat document). One row per
// message; a "chat" is the pair's messages in either direction. History
// keeps the legacy populate() shape — messages[].senderId is a nested
// { _id, first_name, last_name } — so the frontend contract doesn't change.
import { and, asc, eq, or } from "drizzle-orm";
import { db } from "../db";
import { chatMessages, connectionRequests, users } from "../db/schema";

export async function saveChatMessage(
  senderId: string,
  receiverId: string,
  message: string
) {
  const [row] = await db
    .insert(chatMessages)
    .values({ senderId, receiverId, message })
    .returning();
  return row;
}

/**
 * Message history between two users, oldest first, either direction.
 */
export async function getChatHistory(userId: string, targetUserId: string) {
  return db
    .select({
      _id: chatMessages.id,
      senderId: {
        _id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
      },
      message: chatMessages.message,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .innerJoin(users, eq(users.id, chatMessages.senderId))
    .where(
      or(
        and(
          eq(chatMessages.senderId, userId),
          eq(chatMessages.receiverId, targetUserId)
        ),
        and(
          eq(chatMessages.senderId, targetUserId),
          eq(chatMessages.receiverId, userId)
        )
      )
    )
    .orderBy(asc(chatMessages.createdAt));
}

/**
 * True iff the pair has an accepted connection (in either direction) —
 * the gate for who is allowed to message whom.
 */
export async function areConnected(a: string, b: string): Promise<boolean> {
  const [row] = await db
    .select({ id: connectionRequests.id })
    .from(connectionRequests)
    .where(
      and(
        eq(connectionRequests.status, "accepted"),
        or(
          and(
            eq(connectionRequests.fromUserId, a),
            eq(connectionRequests.toUserId, b)
          ),
          and(
            eq(connectionRequests.fromUserId, b),
            eq(connectionRequests.toUserId, a)
          )
        )
      )
    )
    .limit(1);
  return Boolean(row);
}
