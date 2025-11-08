// lib/urls.ts
import { headers } from "next/headers";

/**
 * Safely read a header value in both request and non-request contexts.
 * Works whether `headers()` returns ReadonlyHeaders or Promise<ReadonlyHeaders>.
 * Returns null during build/static render or if not available.
 */
function safeHeaderGet(name: string): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hFactory = headers as unknown as () => any; // tolerate differing return types
    const res = hFactory?.();
    // If some Next versions/types surface a Promise, we can't await in sync code; bail to env.
    if (res && typeof res.then === "function") return null;
    return res?.get?.(name) ?? null;
  } catch {
    return null; // no request context
  }
}

export function envBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (!base) throw new Error("NEXT_PUBLIC_SITE_URL is not set");
  return base;
}

export function requestHost(): string | null {
  return safeHeaderGet("x-forwarded-host") || safeHeaderGet("host");
}

export function requestBaseUrl(): string {
  const host = requestHost();
  const proto = "https";
  return host ? `${proto}://${host}` : envBaseUrl();
}

export function absoluteUrl(path = "/"): string {
  const base = requestBaseUrl();
  return new URL(path, base).toString();
}

export function isApex(): boolean {
  const host =
    requestHost() ||
    (() => {
      try {
        return new URL(envBaseUrl()).host;
      } catch {
        return null;
      }
    })();
  return host === "buy.vodka";
}
