// app/api/preview/route.ts
import { draftMode } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  // Enable draft mode
  const dm = await draftMode();
  dm.enable();

  // Optional redirect target back to a page
  const redirectTo = searchParams.get("redirect") || "/";
  return new Response(null, {
    status: 307,
    headers: { Location: redirectTo },
  });
}
