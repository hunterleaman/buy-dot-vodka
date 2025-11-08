// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { getDefaultSeo } from "@/lib/seo";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDefaultSeo();

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.images,
      siteName: "BUY.VODKA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.images?.[0]?.url,
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
  // Server-side, safe: Next exposes NEXT_PUBLIC_* to both server & client at build/runtime
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
