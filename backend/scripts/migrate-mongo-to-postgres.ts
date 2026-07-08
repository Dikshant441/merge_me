/**
 * One-time data migration: MongoDB -> PostgreSQL.
 *
 * Phase 1: copy users, storing each Mongo _id in users.legacy_mongo_id.
 *          Users that ALREADY exist in Postgres (signed up via the new auth
 *          system — matched by email) are only linked, never overwritten.
 *          New rows also get an accounts row (provider='password') carrying
 *          the bcrypt hash, and email_verified_at is set (Mongo-era accounts
 *          predate email verification; without it login would be blocked).
 * Phase 2: copy connection requests, mapping fromUserId/toUserId through
 *          legacy_mongo_id. Duplicate pairs that Mongo allowed (A->B and
 *          B->A) are resolved newest-updatedAt-wins; older rows are logged
 *          and skipped via ON CONFLICT DO NOTHING.
 *
 * Prerequisites:
 *   - Drizzle migrations applied (pnpm db:migrate) — creates
 *     users.legacy_mongo_id and the connection_requests table.
 *   - MONGODB_URI and DATABASE_URL set (see .env / .env.example).
 *
 * Run:  pnpm exec tsx scripts/migrate-mongo-to-postgres.ts
 * Safe to re-run: both phases are idempotent.
 */
import "dotenv/config";
import mongoose from "mongoose";
import postgres from "postgres";

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_URL = process.env.DATABASE_URL;

const USERS_COLLECTION = "users";
// The mongoose model is named "ConectionRequest" (historical typo), so the
// real collection is "conectionrequests". Both spellings are probed anyway.
const REQUESTS_COLLECTION_CANDIDATES = ["conectionrequests", "connectionrequests"];

const VALID_STATUSES = new Set(["ignored", "interested", "accepted", "rejected"]);

async function migrateUsers(mongoDb: mongoose.mongo.Db, sql: postgres.Sql) {
  const cursor = mongoDb.collection(USERS_COLLECTION).find({});
  let inserted = 0;
  let linked = 0;
  let accountsCreated = 0;

  for await (const u of cursor) {
    // Upsert by email: the auth middleware bridges Mongo<->Postgres by email,
    // so a user may already have a Postgres row. In that case only attach
    // legacy_mongo_id — their newer Postgres profile wins.
    const [row] = await sql`
      INSERT INTO users
        (first_name, last_name, email, avatar_url, about, skills, age, gender,
         is_premium, membership, email_verified_at, legacy_mongo_id,
         created_at, updated_at)
      VALUES
        (${u.first_name ?? ""},
         ${u.last_name ?? ""},
         ${u.email},
         ${u.photoURL ?? null},
         ${u.about ?? ""},
         ${Array.isArray(u.skills) ? u.skills : []},
         ${u.age ?? null},
         ${u.gender ?? null},
         ${u.isPremium ?? false},
         ${u.membershipType ?? "Free"},
         ${u.createdAt ?? new Date()},
         ${String(u._id)},
         ${u.createdAt ?? new Date()},
         ${u.updatedAt ?? new Date()})
      ON CONFLICT (email) DO UPDATE
        SET legacy_mongo_id = EXCLUDED.legacy_mongo_id
      RETURNING id, (xmax = 0) AS was_inserted
    `;
    row.was_inserted ? inserted++ : linked++;

    // Password account for the new auth system. ON CONFLICT keeps any hash
    // the user already created through the new signup flow.
    if (u.password) {
      const res = await sql`
        INSERT INTO accounts (user_id, provider, provider_account_id, password_hash)
        VALUES (${row.id}, 'password', ${row.id}, ${u.password})
        ON CONFLICT (provider, provider_account_id) DO NOTHING
      `;
      if (res.count === 1) accountsCreated++;
    }
  }
  console.log(
    `users: inserted=${inserted} linked(existing pg user)=${linked} password_accounts_created=${accountsCreated}`
  );
}

async function migrateConnectionRequests(
  mongoDb: mongoose.mongo.Db,
  sql: postgres.Sql
) {
  const collectionNames = (await mongoDb.listCollections().toArray()).map(
    (c) => c.name
  );
  const requestsCollection = REQUESTS_COLLECTION_CANDIDATES.find((n) =>
    collectionNames.includes(n)
  );
  if (!requestsCollection) {
    console.warn(
      `no connection-request collection found (looked for: ${REQUESTS_COLLECTION_CANDIDATES.join(", ")})`
    );
    return;
  }
  console.log(`reading requests from collection "${requestsCollection}"`);

  // Build the Mongo _id -> Postgres id map once.
  const rows = await sql`
    SELECT id, legacy_mongo_id FROM users WHERE legacy_mongo_id IS NOT NULL
  `;
  const idMap = new Map<string, string>(
    rows.map((r) => [r.legacy_mongo_id as string, r.id as string])
  );

  // Newest first so that with ON CONFLICT DO NOTHING, the most recently
  // updated row of a duplicate pair wins.
  const cursor = mongoDb
    .collection(requestsCollection)
    .find({})
    .sort({ updatedAt: -1 });

  let inserted = 0;
  let conflicts = 0;
  let unmapped = 0;
  let invalid = 0;

  for await (const r of cursor) {
    const fromId = idMap.get(String(r.fromUserId));
    const toId = idMap.get(String(r.toUserId));
    if (!fromId || !toId) {
      unmapped++;
      console.warn(`skip (user not migrated): request ${r._id}`);
      continue;
    }
    if (fromId === toId) {
      console.warn(`skip (self request): request ${r._id}`);
      continue;
    }
    if (!VALID_STATUSES.has(r.status)) {
      invalid++;
      console.warn(`skip (invalid status "${r.status}"): request ${r._id}`);
      continue;
    }
    const res = await sql`
      INSERT INTO connection_requests
        (from_user_id, to_user_id, status, created_at, updated_at)
      VALUES
        (${fromId}, ${toId}, ${r.status},
         ${r.createdAt ?? new Date()}, ${r.updatedAt ?? new Date()})
      ON CONFLICT DO NOTHING
    `;
    if (res.count === 1) {
      inserted++;
    } else {
      conflicts++;
      console.warn(`skip (duplicate pair, older row): request ${r._id}`);
    }
  }
  console.log(
    `connection_requests: inserted=${inserted} duplicates_skipped=${conflicts} unmapped=${unmapped} invalid_status=${invalid}`
  );
}

async function verify(mongoDb: mongoose.mongo.Db, sql: postgres.Sql) {
  const mongoUsers = await mongoDb.collection(USERS_COLLECTION).countDocuments();
  const collectionNames = (await mongoDb.listCollections().toArray()).map(
    (c) => c.name
  );
  const requestsCollection = REQUESTS_COLLECTION_CANDIDATES.find((n) =>
    collectionNames.includes(n)
  );
  const mongoReqs = requestsCollection
    ? await mongoDb.collection(requestsCollection).countDocuments()
    : 0;

  const [{ c: pgUsers }] = await sql`SELECT count(*)::int AS c FROM users`;
  const [{ c: pgLinked }] =
    await sql`SELECT count(*)::int AS c FROM users WHERE legacy_mongo_id IS NOT NULL`;
  const [{ c: pgReqs }] =
    await sql`SELECT count(*)::int AS c FROM connection_requests`;
  const byStatus = await sql`
    SELECT status, count(*)::int AS c
    FROM connection_requests GROUP BY status ORDER BY status
  `;

  console.log("--- verification ---");
  console.log(`users:    mongo=${mongoUsers}  postgres=${pgUsers} (linked to mongo: ${pgLinked})`);
  console.log(
    `requests: mongo=${mongoReqs}  postgres=${pgReqs} (diff = duplicates/self/unmapped skipped)`
  );
  console.log("postgres requests by status:", byStatus);
}

async function main() {
  if (!MONGODB_URI || !DATABASE_URL) {
    console.error("Set MONGODB_URI and DATABASE_URL before running.");
    process.exit(1);
  }
  const mongo = await mongoose
    .createConnection(MONGODB_URI, { serverSelectionTimeoutMS: 10_000 })
    .asPromise();
  const sql = postgres(DATABASE_URL, { max: 1 });
  try {
    const mongoDb = mongo.db as unknown as mongoose.mongo.Db; // db name comes from the URI

    await migrateUsers(mongoDb, sql);
    await migrateConnectionRequests(mongoDb, sql);
    await verify(mongoDb, sql);
  } finally {
    await mongo.close();
    await sql.end();
  }
}

main().catch((err) => {
  console.error("migration failed:", err);
  process.exit(1);
});
