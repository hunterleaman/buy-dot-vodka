// app/api/sanity-ping/route.ts
import { NextResponse } from "next/server";
import { publishedClient, previewClient } from "@/lib/sanity.client";

type Item = { _type: string; _id: string; slug?: string | null };
type PingResult = {
  published: Item[];
  preview: Item[];
};

const Q = `
{
  "published": *[_type in ["producer","brand","topic","guide"] && defined(_id)][0...5]{_type,_id,"slug": slug.current},
  "preview":  *[_type in ["producer","brand","topic","guide"] && defined(_id)][0...5]{_type,_id,"slug": slug.current}
}
`;

export async function GET() {
  try {
    const pub = await publishedClient.fetch<PingResult>(Q);
    // previewClient requires a token if dataset is private
    const prv = await previewClient.fetch<PingResult>(Q).catch(() => null);

    return NextResponse.json({
      counts: {
        published: pub.published.length,
        preview: prv ? prv.preview.length : 0,
      },
      samples: {
        published: pub.published,
        preview: prv?.preview ?? [],
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
