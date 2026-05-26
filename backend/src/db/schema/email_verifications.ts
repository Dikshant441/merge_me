import { pgTable, uuid } from "drizzle-orm/pg-core";

export const emailVerifications = pgTable("email_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
});
