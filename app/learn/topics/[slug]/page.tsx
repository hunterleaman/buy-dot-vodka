// app/learn/topics/[slug]/page.tsx
// Topic hub with paginated Guides. Uses ISR and tag strategy per spec. :contentReference[oaicite:6]{index=6}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/lib/sanity.fetch";
import {
  ALL_TOPIC_SLUGS,
  TOPIC_BY_SLUG,
  GUIDES_BY_TOPIC_SLUG,
} from "@/lib/sanity.queries";
import type { Topic, Guide } from "@/lib/sanity.types";

export const revalidate = 180;
const PAGE_SIZE = 12;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(ALL_TOPIC_SLUGS, {
    revalidate: 3600,
    tags: ["topic:list"],
  });
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const topic = await sanityFetch<Topic | null>(TOPIC_BY_SLUG, {
    params: { slug: params.slug },
    revalidate,
    tags: [`topic:doc:${params.slug}`],
  });

  if (!topic) return {};

  const title = topic.seo?.title || topic.title;
  const description = topic.seo?.description || topic.description || "";
  const ogImage = topic.seo?.image?.url;

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

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ page?: string }>;
}) {
  const { isEnabled } = await draftMode();
  const preview = isEnabled;

  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page || 1));
  const offset = (page - 1) * PAGE_SIZE;
  const end = offset + PAGE_SIZE;

  const topic = await sanityFetch<Topic | null>(TOPIC_BY_SLUG, {
    params: { slug: params.slug },
    revalidate,
    tags: [`topic:doc:${params.slug}`],
    preview,
  });

  if (!topic) notFound();

  const guides = await sanityFetch<Guide[]>(GUIDES_BY_TOPIC_SLUG, {
    params: { slug: params.slug, offset, end },
    revalidate,
    tags: ["guide:list", `topic:doc:${params.slug}`],
    preview,
  });

  const nextPageHref =
    guides.length === PAGE_SIZE
      ? `/learn/topics/${params.slug}?page=${page + 1}`
      : null;
  const prevPageHref =
    page > 1 ? `/learn/topics/${params.slug}?page=${page - 1}` : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{topic.title}</h1>
      {topic.description && (
        <p className="text-sm text-neutral-600 mt-1">{topic.description}</p>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-medium">Guides</h2>
        {guides.length === 0 ? (
          <p className="text-sm text-neutral-600 mt-2">No guides yet.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((g) => (
              <li key={g._id} className="rounded-lg border p-4">
                <div className="font-medium">
                  <Link href={`/learn/guides/${g.slug}`}>{g.title}</Link>
                </div>
                {g.excerpt && (
                  <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                    {g.excerpt}
                  </p>
                )}
                {g.author?.name && (
                  <p className="text-xs text-neutral-600 mt-2">
                    By {g.author.name}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div>
            {prevPageHref && (
              <Link
                href={prevPageHref}
                className="text-sm text-blue-600 underline"
              >
                Previous
              </Link>
            )}
          </div>
          <div className="text-sm text-neutral-600">Page {page}</div>
          <div>
            {nextPageHref && (
              <Link
                href={nextPageHref}
                className="text-sm text-blue-600 underline"
              >
                Next
              </Link>
            )}
          </div>
        </div>

        {preview && (
          <p className="mt-6 text-xs text-amber-600">
            Preview is on. Draft content is visible.
          </p>
        )}
      </section>
    </main>
  );
}
