// components/AnalyticsProvider.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  isAnalyticsEnabled,
  pageview,
  trackAffiliate,
  trackOutbound,
  getAffiliateBrand,
  isExternalHref,
} from "@/lib/analytics";

type Props = {
  /** Comma-separated hostnames (e.g., "drizly.com,caskers.com") */
  affiliateHosts?: string[];
};

export default function AnalyticsProvider({ affiliateHosts = [] }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrlRef = useRef<string>("");

  // Route change -> page_view
  useEffect(() => {
    if (!isAnalyticsEnabled) return;

    const url = `${pathname || "/"}${
      searchParams?.toString() ? `?${searchParams.toString()}` : ""
    }`;

    if (url !== lastUrlRef.current) {
      lastUrlRef.current = url;
      pageview(url);
    }
  }, [pathname, searchParams]);

  // DOM-delegated outbound/affiliate click tracking
  useEffect(() => {
    if (!isAnalyticsEnabled) return;

    const affiliateList =
      process.env.NEXT_PUBLIC_AFFILIATE_HOSTS?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? affiliateHosts;

    function handleCandidate(el: Element | null) {
      const a = el?.closest?.("a");
      if (!a) return;

      // Opt-out escape hatch
      if ((a as HTMLElement).dataset.track === "off") return;

      const href = (a as HTMLAnchorElement).href;
      if (!href) return;
      if (!isExternalHref(href)) return;

      // Affiliate?
      const brand = getAffiliateBrand(href, affiliateList);

      // Prefer non-blocking gtag; no navigation delay
      if (brand) {
        trackAffiliate(href, brand);
      } else {
        const label =
          (a as HTMLAnchorElement).title || a.textContent || undefined;
        trackOutbound(href, label);
      }
    }

    // Mouse click
    const onClick = (e: MouseEvent) => {
      // Only main button, no modified new-window shortcuts (we still log those if they bubble)
      if (e.defaultPrevented) return;
      handleCandidate(e.target as Element | null);
    };

    // Keyboard "Enter" activation for accessible links
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      handleCandidate(e.target as Element | null);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [affiliateHosts]);

  return null;
}
