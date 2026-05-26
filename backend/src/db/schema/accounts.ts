import { pgTable, uuid } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
});
