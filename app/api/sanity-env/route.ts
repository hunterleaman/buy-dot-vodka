// app/api/sanity-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || null,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || null,
    apiVersion: process.env.SANITY_API_VERSION || null,
    hasToken: Boolean(
      process.env.SANITY_TOKEN || process.env.SANITY_READ_TOKEN
    ),
    env: process.env.VERCEL_ENV || "unknown",
  });
}
