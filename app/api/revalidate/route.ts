import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const SECRET = process.env.REVALIDATE_SECRET;

type SanityWebhookBody = {
  _id?: string;
  _type?: string;
  slug?: { current?: string };
  // include anything else you might pass from a projection
};

export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  if (SECRET && secret !== SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as SanityWebhookBody;
  const type = body?._type;
  const id = body?._id;
  const slug = body?.slug?.current;

  if (!type) {
    return NextResponse.json(
      { ok: false, error: "Missing _type" },
      { status: 400 }
    );
  }

  // List tags per type
  if (type === "producer") {
    revalidateTag("producer:list", "max");
    if (slug) revalidateTag(`producer:doc:${slug}`, "max");
    if (id) revalidateTag(`producer:doc:${id}`, "max");
  }

  if (type === "brand") {
    revalidateTag("brand:list", "max");
    if (slug) revalidateTag(`brand:doc:${slug}`, "max");
    if (id) revalidateTag(`brand:doc:${id}`, "max");
  }

  if (type === "siteSettings") {
    revalidateTag("site:settings", "max");
  }

  // extend with sku, topics, guides, etc. as you wire those routes

  return NextResponse.json({ ok: true });
}
