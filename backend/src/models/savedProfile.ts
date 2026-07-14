// Postgres saved-profiles model — the "Saved Collection" bookmarks.
// Pure bookmarks, completely independent of connection_requests: saving
// never creates or changes a request, never affects the feed, and is
// invisible to the saved user. A bookmark coexists freely with any request
// status (or none), and only an explicit unsave removes it.
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { savedProfiles, users } from "../db/schema";
import { USER_SAFE_COLUMNS, type SafeUser } from "./connectionRequest";

export type SavedUser = SafeUser & { savedAt: Date };

/**
 * Bookmark a profile. Idempotent: saving an already-saved profile is a no-op
 * (uniq_saved_pair + onConflictDoNothing). Returns whether a row was created.
 */
export async function saveProfile(userId: string, savedUserId: string) {
  const inserted = await db
    .insert(savedProfiles)
    .values({ userId, savedUserId })
    .onConflictDoNothing()
    .returning({ id: savedProfiles.id });
  return { created: inserted.length > 0 };
}

/**
 * Remove a bookmark. Idempotent: unsaving something not saved is a no-op.
 */
export async function unsaveProfile(userId: string, savedUserId: string) {
  const deleted = await db
    .delete(savedProfiles)
    .where(
      and(
        eq(savedProfiles.userId, userId),
        eq(savedProfiles.savedUserId, savedUserId)
      )
    )
    .returning({ id: savedProfiles.id });
  return { removed: deleted.length > 0 };
}

/**
 * All profiles I saved, newest first, in the same _id-aliased safe shape the
 * feed returns (+ savedAt for display).
 */
export async function getSavedProfiles(userId: string): Promise<SavedUser[]> {
  return db
    .select({ ...USER_SAFE_COLUMNS, savedAt: savedProfiles.createdAt })
    .from(savedProfiles)
    .innerJoin(users, eq(users.id, savedProfiles.savedUserId))
    .where(eq(savedProfiles.userId, userId))
    .orderBy(desc(savedProfiles.createdAt));
}
