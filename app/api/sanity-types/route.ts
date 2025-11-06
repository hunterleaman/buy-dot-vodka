// app/api/sanity-types/route.ts
import { NextResponse } from "next/server";
import { publishedClient, previewClient } from "@/lib/sanity.client";

const Q = `{
  total: count(*[]),
  types: unique(*[defined(_type)]._type)[],
  samples: *[defined(_type)][0...20]{_id, _type, "slug": select(defined(slug.current)=>slug.current, null)}
}`;

export async function GET() {
  try {
    const pub = await publishedClient.fetch(Q);
    const prv = await previewClient.fetch(Q).catch(() => null);
    return NextResponse.json({
      env: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      },
      published: pub,
      preview: prv,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
