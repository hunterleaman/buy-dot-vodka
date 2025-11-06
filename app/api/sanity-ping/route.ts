// app/api/sanity-ping/route.ts
import { NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { publishedClient, previewClient } from "@/lib/sanity.client";

export const dynamic = "force-dynamic"; // ensure this never caches

type DocLite = { _type: string; _id: string };

export async function GET() {
  const { isEnabled } = await draftMode(); // <-- await fixes the TS error
  const client = isEnabled ? previewClient : publishedClient;

  try {
    const sample = await client.fetch<DocLite[]>(
      '*[_type in ["producer","brand","topic","guide"]][0...3]{_type,_id}'
    );
    return NextResponse.json({ ok: true, preview: isEnabled, sample });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
