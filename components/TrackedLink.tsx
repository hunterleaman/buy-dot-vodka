// components/TrackedLink.tsx
"use client";

import Link, { LinkProps } from "next/link";
import { MouseEvent } from "react";
import {
  isAnalyticsEnabled,
  trackAffiliate,
  trackOutbound,
  getAffiliateBrand,
  isExternalHref,
} from "@/lib/analytics";

type TrackedLinkProps = LinkProps & {
  href: string; // concrete string href
  children: React.ReactNode;
  affiliateHosts?: string[]; // override if desired
  label?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function TrackedLink({
  href,
  children,
  affiliateHosts,
  label,
  ...rest
}: TrackedLinkProps) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    rest.onClick?.(e);
    if (!isAnalyticsEnabled) return;
    if (!isExternalHref(href)) return;

    const list =
      affiliateHosts ??
      process.env.NEXT_PUBLIC_AFFILIATE_HOSTS?.split(",").map((s) =>
        s.trim()
      ) ??
      [];

    const brand = getAffiliateBrand(href, list);
    if (brand) trackAffiliate(href, brand);
    else trackOutbound(href, label);
  }

  return (
    <Link href={href} {...rest} onClick={onClick}>
      {children}
    </Link>
  );
}
