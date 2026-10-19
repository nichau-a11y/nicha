import { Pool } from "pg";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const globalPg = globalThis as unknown as {
  __pool?: Pool;
};

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  if (!globalPg.__pool) {
    const ca = readFileSync(
      join(process.cwd(), "certs", "prod-ca-2021.crt"),
      "utf8"
    );

    globalPg.__pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 2,
      ssl: {
        ca,
        rejectUnauthorized: true,
      },
      idleTimeoutMillis: 10000,
    });
  }

  return globalPg.__pool;
}