// lib/analytics.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "";
const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? "preview";

export const isAnalyticsEnabled =
  typeof window !== "undefined" &&
  GA4_ID.length > 0 &&
  APP_ENV === "production";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Safe gtag shim
export function gtag(...args: any[]) {
  if (!isAnalyticsEnabled) return;
  window.gtag?.(...args);
}

// Pageview
export function pageview(path: string, title?: string) {
  if (!isAnalyticsEnabled) return;
  gtag("event", "page_view", {
    page_location: window.location.href,
    page_path: path,
    page_title: title ?? document.title,
  });
}

type GAParams = Record<string, string | number | boolean | undefined>;

// Generic event
export function trackEvent(name: string, params: GAParams = {}) {
  if (!isAnalyticsEnabled) return;
  gtag("event", name, params);
}

// BUY.VODKA conventions
export function trackOutbound(
  destination_url: string,
  label?: string,
  extra?: GAParams
) {
  trackEvent("click_outbound", {
    event_category: "engagement",
    event_label: label ?? "Outbound Click",
    destination_url,
    ...extra,
  });
}

export function trackAffiliate(
  destination_url: string,
  brand?: string,
  extra?: GAParams
) {
  trackEvent("click_affiliate", {
    event_category: "engagement",
    event_label: brand ?? "Affiliate Click",
    destination_url,
    brand,
    ...extra,
  });
}

// Helpers used by the provider
export function hostnameFromHref(href: string): string | null {
  try {
    return new URL(href, window.location.href).hostname;
  } catch {
    return null;
  }
}

export function isExternalHref(href: string): boolean {
  const host = hostnameFromHref(href);
  return !!host && host !== window.location.hostname;
}

export function getAffiliateBrand(
  href: string,
  affiliateHosts: string[]
): string | null {
  const host = hostnameFromHref(href);
  if (!host) return null;
  const found = affiliateHosts.find(
    (h) => host === h || host.endsWith(`.${h}`)
  );
  return found ?? null;
}
