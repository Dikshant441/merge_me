import { customType, pgTable, text, timestamp, uuid, integer, boolean, jsonb, varchar } from "drizzle-orm/pg-core";

// A social/profile link the user chose to show (GitHub, LinkedIn, …). Stored
// as a JSONB array so the whole set travels as one column.
export type Social = { platform: string; url: string };

// Postgres CITEXT is case-insensitive text. Requires the citext extension:
//   CREATE EXTENSION IF NOT EXISTS citext;
// Neon supports it out of the box (run once via SQL editor or psql).
const citext = customType<{ data: string }>({
  dataType() {
    return "citext";
  },
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: citext("email").notNull().unique(),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  avatarUrl: text("avatar_url"),
  about: text("about").default(""),
  skills: text("skills").array().default([]),
  age: integer("age"),
  gender: text("gender"),
  socials: jsonb("socials").$type<Social[]>().default([]),
  membership: text("membership").default("Free"),
  isPremium: boolean("is_premium").default(false),
  // Old MongoDB _id (24-hex chars). Only used by the one-time data migration
  // (scripts/migrate-mongo-to-postgres.ts) to map connection_requests user
  // ids. Drop this column once the cutover is verified:
  //   ALTER TABLE users DROP COLUMN legacy_mongo_id;
  legacyMongoId: varchar("legacy_mongo_id", { length: 24 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
