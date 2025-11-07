// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { mapRevalidateTargets } from "../../../lib/revalidate";

type SanitySlug = { current?: string | null };
type SanityWebhookBody = {
  _id?: string;
  _type?: string;
  slug?: SanitySlug;
  action?: "create" | "update" | "delete" | "publish" | "unpublish";
  operation?: "create" | "update" | "delete" | "publish" | "unpublish";
  [key: string]: unknown;
};

const BAD_SECRET = { error: "unauthorized" } as const;
const BAD_METHOD = { error: "method not allowed" } as const;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readSecret(req: NextRequest): string | null {
  const urlSecret = req.nextUrl.searchParams.get("secret");
  const headerSecret = req.headers.get("x-revalidate-secret");
  return headerSecret || urlSecret;
}

// Cross-version shims to satisfy differing type signatures
const revalidateTagAny = revalidateTag as unknown as (
  tag: string,
  ..._ignored: unknown[]
) => void;
const revalidatePathAny = revalidatePath as unknown as (
  path: string,
  ..._ignored: unknown[]
) => void;

export async function POST(req: NextRequest) {
  const started = Date.now();

  const provided = readSecret(req);
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || provided !== expected) {
    return NextResponse.json(BAD_SECRET, { status: 401 });
  }

  let payload: SanityWebhookBody | null = null;
  try {
    payload = (await req.json()) as SanityWebhookBody;
  } catch {
    payload = null;
  }

  const type = payload?._type || "unknown";
  const action = (payload?.action || payload?.operation || "unknown") as string;
  const slug = payload?.slug?.current || null;

  const { tags, paths } = mapRevalidateTargets({ type, action, slug, payload });

  if (!tags.length && !paths.length) {
    return NextResponse.json(
      {
        handled: false,
        type,
        action,
        slug,
        tags: [],
        paths: [],
        durationMs: Date.now() - started,
      },
      { status: 200 }
    );
  }

  // Revalidate tags first (primary)
  await Promise.all(
    tags.map(async (t: string) => {
      try {
        revalidateTagAny(t);
      } catch {
        // swallow to avoid blowing up the whole batch
      }
    })
  );

  // Optionally revalidate critical paths
  if (paths.length) {
    await Promise.all(
      paths.map(async (p: string) => {
        try {
          revalidatePathAny(p, "page");
        } catch {
          // swallow
        }
      })
    );
  }

  console.log(
    `[revalidate] ${action} ${type} ${slug ?? ""} → tags=${tags.join(
      ","
    )}${paths.length ? ` paths=${paths.join(",")}` : ""}`
  );

  return NextResponse.json(
    {
      handled: true,
      type,
      action,
      slug,
      tags,
      paths,
      durationMs: Date.now() - started,
    },
    { status: 200 }
  );
}

export async function GET(req: NextRequest) {
  const provided = readSecret(req);
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || provided !== expected) {
    return NextResponse.json(BAD_SECRET, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
