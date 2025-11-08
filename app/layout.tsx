// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { getDefaultSeo } from "@/lib/seo";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { Suspense } from "react";
import { absoluteUrl, envBaseUrl, isApex } from "@/lib/urls";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDefaultSeo();

  // Canonical + robots derived from current host; metadataBase from env (stable)
  const allowIndex = isApex();
  const metadataBase = new URL(envBaseUrl());

  // Ensure absolute image URL(s)
  const ogImage = seo.images?.[0]?.url
    ? new URL(seo.images[0].url, metadataBase).toString()
    : absoluteUrl("/og/default.png");

  return {
    title: seo.title,
    description: seo.description,
    metadataBase,
    robots: {
      index: allowIndex,
      follow: allowIndex,
    },
    alternates: {
      canonical: absoluteUrl("/"),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage }],
      url: absoluteUrl("/"),
      siteName: "BUY.VODKA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV?.trim() || "preview";
  const enableGA = Boolean(GA4_ID && APP_ENV === "production");

  return (
    <html lang="en">
      <body>
        {children}

        {enableGA && (
          <>
            <Script
              id="ga4-src"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}

        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
      </body>
    </html>
  );
}
