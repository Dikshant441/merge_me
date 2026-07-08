// Postgres connection-request model (replaces the old Mongoose model).
// Translated from the migration kit's SQL — the semantics are preserved:
// duplicate checks happen via DB constraints (error 23505), review is a
// single conditional UPDATE ... RETURNING, feed exclusion uses NOT EXISTS.
// Response objects keep the legacy Mongo field names (_id, photoURL) so the
// frontend contract does not change.
import { and, asc, desc, eq, ne, notExists, or, sql } from "drizzle-orm";
import { db } from "../db";
import { connectionRequests, users } from "../db/schema";

export const SEND_STATUSES = ["interested", "ignored"] as const;
export const REVIEW_STATUSES = ["accepted", "rejected"] as const;

export type SendStatus = (typeof SEND_STATUSES)[number];
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

// Equivalent of the old mongoose USER_SAFE_DATA projection. avatar_url is
// exposed as photoURL — the field name the frontend has always read.
const USER_SAFE_COLUMNS = {
  _id: users.id,
  first_name: users.first_name,
  last_name: users.last_name,
  photoURL: users.avatarUrl,
  age: users.age,
  gender: users.gender,
  about: users.about,
  skills: users.skills,
};

export type SafeUser = {
  _id: string;
  first_name: string;
  last_name: string;
  photoURL: string | null;
  age: number | null;
  gender: string | null;
  about: string | null;
  skills: string[] | null;
};

// Mongo-shaped request row (what the old API returned as `data`).
const toApiRequest = (r: typeof connectionRequests.$inferSelect) => ({
  _id: r.id,
  fromUserId: r.fromUserId,
  toUserId: r.toUserId,
  status: r.status,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});

// Drizzle wraps driver errors (DrizzleQueryError.cause holds the postgres.js
// error); older paths surface .code directly. Check both.
const pgErrorCode = (err: unknown): string | undefined =>
  (err as any)?.cause?.code ?? (err as any)?.code;

const UNIQUE_VIOLATION = "23505"; // one_per_direction or uniq_pair
const CHECK_VIOLATION = "23514"; // no_self_request

/**
 * Feed action: create a request (interested) or hide a profile (ignored).
 * Throws { code: "ALREADY_EXISTS" } if any request already exists between
 * the pair (either direction, any status) — enforced by DB constraints,
 * so it is race-safe without a pre-check query.
 */
export async function sendRequest(
  fromUserId: string,
  toUserId: string,
  status: SendStatus
) {
  try {
    const [row] = await db
      .insert(connectionRequests)
      .values({ fromUserId, toUserId, status })
      .returning();
    return toApiRequest(row);
  } catch (err) {
    if (pgErrorCode(err) === UNIQUE_VIOLATION) {
      const e = new Error("Connection request alredy exists!!") as any;
      e.code = "ALREADY_EXISTS";
      throw e;
    }
    if (pgErrorCode(err) === CHECK_VIOLATION) {
      const e = new Error("Cant connection youself !! ") as any;
      e.code = "SELF_REQUEST";
      throw e;
    }
    throw err;
  }
}

/**
 * Review action: receiver accepts or rejects a pending (interested) request.
 * Single atomic UPDATE — the WHERE clause simultaneously checks that the
 * request exists, belongs to the reviewer, and is still pending.
 * Returns the updated row, or null (caller should respond "not found").
 */
export async function reviewRequest(
  reviewerUserId: string,
  requestId: string,
  status: ReviewStatus
) {
  const [row] = await db
    .update(connectionRequests)
    .set({ status })
    .where(
      and(
        eq(connectionRequests.id, requestId),
        eq(connectionRequests.toUserId, reviewerUserId),
        eq(connectionRequests.status, "interested")
      )
    )
    .returning();
  return row ? toApiRequest(row) : null;
}

/**
 * Pending requests received by a user, with the sender's public profile
 * nested under fromUserId — same shape as the old .populate("fromUserId").
 */
export async function getReceivedRequests(userId: string) {
  return db
    .select({
      _id: connectionRequests.id,
      fromUserId: USER_SAFE_COLUMNS,
      toUserId: connectionRequests.toUserId,
      status: connectionRequests.status,
      createdAt: connectionRequests.createdAt,
      updatedAt: connectionRequests.updatedAt,
    })
    .from(connectionRequests)
    .innerJoin(users, eq(users.id, connectionRequests.fromUserId))
    .where(
      and(
        eq(connectionRequests.toUserId, userId),
        eq(connectionRequests.status, "interested")
      )
    )
    .orderBy(desc(connectionRequests.createdAt));
}

/**
 * Accepted connections for a user. The CASE picks "the other user"
 * regardless of which side sent the original request.
 */
export async function getConnections(userId: string): Promise<SafeUser[]> {
  return db
    .select(USER_SAFE_COLUMNS)
    .from(connectionRequests)
    .innerJoin(
      users,
      eq(
        users.id,
        sql`CASE WHEN ${connectionRequests.fromUserId} = ${userId} THEN ${connectionRequests.toUserId} ELSE ${connectionRequests.fromUserId} END`
      )
    )
    .where(
      and(
        eq(connectionRequests.status, "accepted"),
        or(
          eq(connectionRequests.fromUserId, userId),
          eq(connectionRequests.toUserId, userId)
        )
      )
    )
    .orderBy(desc(connectionRequests.updatedAt));
}

/**
 * Feed: all users except me and anyone who shares ANY connection-request
 * row with me (either direction, any status). Same semantics as the Mongo
 * version, but via NOT EXISTS instead of loading all ids into memory.
 */
export async function getFeed(
  userId: string,
  { page = 1, limit = 10 }: { page?: number; limit?: number } = {}
): Promise<SafeUser[]> {
  const safeLimit = Math.min(Math.max(Math.trunc(limit) || 10, 1), 50);
  const safePage = Math.max(Math.trunc(page) || 1, 1);
  const offset = (safePage - 1) * safeLimit;

  return db
    .select(USER_SAFE_COLUMNS)
    .from(users)
    .where(
      and(
        ne(users.id, userId),
        notExists(
          db
            .select({ one: sql`1` })
            .from(connectionRequests)
            .where(
              or(
                and(
                  eq(connectionRequests.fromUserId, userId),
                  eq(connectionRequests.toUserId, users.id)
                ),
                and(
                  eq(connectionRequests.toUserId, userId),
                  eq(connectionRequests.fromUserId, users.id)
                )
              )
            )
        )
      )
    )
    // Stable pagination order (uuid pks are random, so order by signup time).
    .orderBy(asc(users.createdAt), asc(users.id))
    .limit(safeLimit)
    .offset(offset);
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (v: string): boolean => UUID_RE.test(v);

/**
 * Existence check used before sending a request (gives a clean error
 * instead of an FK violation) — also returns the name for the response
 * message. Non-uuid input (e.g. an old Mongo ObjectId) is simply "not found".
 */
export async function getUserBasic(userId: string): Promise<SafeUser | null> {
  if (!isUuid(userId)) return null;
  const [row] = await db
    .select(USER_SAFE_COLUMNS)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return row ?? null;
}
