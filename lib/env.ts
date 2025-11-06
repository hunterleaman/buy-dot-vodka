// lib/env.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

export function reqEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export function optEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v : undefined;
}
