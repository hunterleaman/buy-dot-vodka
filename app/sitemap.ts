import { sanityFetch } from "@/lib/sanity.fetch";
import {
  ALL_BRAND_SLUGS,
  ALL_PRODUCER_SLUGS,
  ALL_SKU_SLUGS,
  ALL_TOPIC_SLUGS,
  ALL_GUIDE_SLUGS,
} from "@/lib/sanity.queries";

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://buy.vodka";

  const [producerSlugs, brandSlugs, skuSlugs, topicSlugs, guideSlugs] =
    await Promise.all([
      sanityFetch<{ slug: string }[]>(ALL_PRODUCER_SLUGS, {
        revalidate: 3600,
        tags: ["producer:list"],
      }),
      sanityFetch<{ slug: string }[]>(ALL_BRAND_SLUGS, {
        revalidate: 3600,
        tags: ["brand:list"],
      }),
      sanityFetch<{ slug: string }[]>(ALL_SKU_SLUGS, {
        revalidate: 3600,
        tags: ["sku:list"],
      }),
      sanityFetch<{ slug: string }[]>(ALL_TOPIC_SLUGS, {
        revalidate: 3600,
        tags: ["topic:list"],
      }),
      sanityFetch<{ slug: string }[]>(ALL_GUIDE_SLUGS, {
        revalidate: 3600,
        tags: ["guide:list"],
      }),
    ]);

  const now = new Date().toISOString();

  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/producers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/learn/topics`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const producerRoutes = producerSlugs.map((p) => ({
    url: `${baseUrl}/producers/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const brandRoutes = brandSlugs.map((b) => ({
    url: `${baseUrl}/brands/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const skuRoutes = skuSlugs.map((s) => ({
    url: `${baseUrl}/skus/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  const topicRoutes = topicSlugs.map((b) => ({
    url: `${baseUrl}/topics/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const guideRoutes = guideSlugs.map((b) => ({
    url: `${baseUrl}/guides/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...producerRoutes,
    ...brandRoutes,
    ...skuRoutes,
    ...topicRoutes,
    ...guideRoutes,
  ];
}
