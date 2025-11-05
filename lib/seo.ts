// lib/seo.ts
import { sanityFetch } from "./sanity.fetch";
import { SITE_SETTINGS } from "./sanity.queries";

export async function getDefaultSeo() {
  const settings = await sanityFetch<{
    title?: string;
    description?: string;
    seo?: { title?: string; description?: string; image?: { url?: string } };
  }>(SITE_SETTINGS, { revalidate: 300, tags: ["site:settings"] });

  const title =
    settings?.seo?.title || settings?.title || "BUY.VODKA (seo.ts fallback)";
  const description =
    settings?.seo?.description ||
    settings?.description ||
    "BUY.VODKA: Your trusted source for vodka knowledge and acquisition. (seo.ts fallback)";
  const images = settings?.seo?.image?.url
    ? [{ url: settings.seo.image.url }]
    : [];

  return { title, description, images };
}
