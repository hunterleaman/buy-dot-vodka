// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROD_STAGING = "production-staging.buy.vodka";
const PREVIEW = "preview.buy.vodka";
const APEX = "buy.vodka";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";

  // Redirect .vercel.app → custom domain
  if (host.endsWith(".vercel.app")) {
    const env = process.env.VERCEL_ENV; // "production" | "preview" | "development"
    const targetHost = env === "production" ? PROD_STAGING : PREVIEW;
    url.host = targetHost;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // Inject X-Robots-Tag for non-apex
  const res = NextResponse.next();
  if (host !== APEX) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/|og/).*)"],
};
