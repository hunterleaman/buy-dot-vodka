// lib/env.ts
import * as dotenv from "dotenv";

// Only load dotenv in Node (scripts/build), never in the browser
if (typeof window === "undefined") {
  dotenv.config({ path: ".env.local" }); // developer overrides
  dotenv.config(); // fallback to .env if present
}

export function reqEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export function optEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v : undefined;
}
