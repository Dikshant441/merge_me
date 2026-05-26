import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/**",
  dialect: "postgresql",
  dbCredentials: { url: databaseUrl },
  verbose: true,
  strict: true,
});
