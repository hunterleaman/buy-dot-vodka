// app/api/sanity-ping/route.ts
import { NextResponse } from "next/server";
import { publishedClient, previewClient } from "@/lib/sanity.client";

const Q = `{
  published: *[_type in ["producer","brand","topic","guide"] && defined(_id)][0...5]{_type,_id, "slug": slug.current},
  preview: *[_type in ["producer","brand","topic","guide"] && defined(_id)][0...5]{_type,_id, "slug": slug.current}
}`;

export async function GET() {
  try {
    const pub = await publishedClient.fetch(Q);
    const prv = await previewClient.fetch(Q).catch(() => null);

    return NextResponse.json({
      counts: {
        published: pub?.published?.length ?? 0,
        preview: prv?.preview?.length ?? 0,
      },
      samples: { published: pub?.published ?? [], preview: prv?.preview ?? [] },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
