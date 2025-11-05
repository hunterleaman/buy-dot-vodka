// app/learn/guides/[slug]/page.tsx
// Guide detail. Renders PortableText body, author credits, and SEO metadata like Brand page. :contentReference[oaicite:7]{index=7}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Image from "next/image";
import { sanityFetch } from "@/lib/sanity.fetch";
import { ALL_GUIDE_SLUGS, GUIDE_BY_SLUG } from "@/lib/sanity.queries";
import type { Guide } from "@/lib/sanity.types";
// If your PortableText component lives elsewhere, adjust this import.
import { PortableText } from "@portabletext/react";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(ALL_GUIDE_SLUGS, {
    revalidate: 3600,
    tags: ["guide:list"],
  });
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const guide = await sanityFetch<Guide | null>(GUIDE_BY_SLUG, {
    params: { slug: params.slug },
    revalidate,
    tags: [`guide:doc:${params.slug}`],
  });

  if (!guide) return {};

  const title = guide.seo?.title || guide.title;
  const description = guide.seo?.description || guide.excerpt || "";
  const ogImage = guide.seo?.image?.url || guide.mainImage?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function GuidePage({ params }: { params: Params }) {
  const { isEnabled } = await draftMode();
  const preview = isEnabled;

  const guide = await sanityFetch<Guide | null>(GUIDE_BY_SLUG, {
    params: { slug: params.slug },
    revalidate,
    tags: [`guide:doc:${params.slug}`],
    preview,
  });

  if (!guide) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{guide.title}</h1>
      {guide.author?.name && (
        <p className="text-sm text-neutral-600 mt-1">By {guide.author.name}</p>
      )}
      {guide.mainImage?.url && (
        <div className="mt-6">
          <Image
            src={guide.mainImage.url}
            alt={guide.mainImage.alt || ""}
            width={1600}
            height={900}
            className="h-auto w-full rounded-lg border"
            priority
          />
          {guide.mainImage.caption && (
            <p className="text-xs text-neutral-600 mt-2">
              {guide.mainImage.caption}
            </p>
          )}
        </div>
      )}

      {guide.body && (
        <article className="prose mt-8">
          <PortableText value={guide.body} />
        </article>
      )}

      {preview && (
        <p className="mt-6 text-xs text-amber-600">
          Preview is on. Draft content is visible.
        </p>
      )}
    </main>
  );
}
