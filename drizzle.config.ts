import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Supabase: use the *direct* connection string (port 5432) for migrations,
    // not the pooled one — DDL through pgbouncer in transaction mode misbehaves.
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
