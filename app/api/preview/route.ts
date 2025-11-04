// app/api/preview/route.ts
export const runtime = "nodejs";

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirect") || "/";

  const dm = await draftMode();
  dm.enable();

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
