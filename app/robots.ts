// app/robots.ts
import { isApex, requestBaseUrl } from "@/lib/urls";

export default function robots() {
  const base = requestBaseUrl();
  const allowIndex = isApex();

  return {
    rules: {
      userAgent: "*",
      ...(allowIndex ? { allow: "/" } : { disallow: "/" }),
    },
    sitemap: `${base}/sitemap.xml`,
    host: allowIndex ? "https://buy.vodka" : undefined,
  };
}
