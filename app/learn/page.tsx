// app/learn/page.tsx
// Learn hub: Topics grid + recent Guides with basic pagination via ?page=.
// Follows list page patterns from Brands. :contentReference[oaicite:4]{index=4}

import Link from "next/link";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/lib/sanity.fetch";
import { TOPIC_LIST, GUIDE_LIST } from "@/lib/sanity.queries";
import type { Topic, Guide } from "@/lib/sanity.types";

export const revalidate = 120;

const PAGE_SIZE = 12;

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page || 1));
  const offset = (page - 1) * PAGE_SIZE;
  const end = offset + PAGE_SIZE;

  const { isEnabled } = await draftMode();
  const preview = isEnabled;

  const [topics, guides] = await Promise.all([
    sanityFetch<Topic[]>(TOPIC_LIST, {
      revalidate,
      tags: ["topic:list"],
      preview,
    }),
    sanityFetch<Guide[]>(GUIDE_LIST, {
      params: { offset, end },
      revalidate,
      tags: ["guide:list"],
      preview,
    }),
  ]);

  const nextPageHref =
    guides.length === PAGE_SIZE ? `/learn?page=${page + 1}` : null;
  const prevPageHref = page > 1 ? `/learn?page=${page - 1}` : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Learn</h1>
      <p className="text-sm text-neutral-600 mt-1">
        Topics and the latest guides {preview ? "(preview)" : ""}
      </p>

      {/* Topics */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-medium">Topics</h2>
          <Link
            href="/learn/topics"
            className="text-sm text-blue-600 underline"
          >
            View all
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics
            .filter((t) => !!t.slug)
            .map((t) => (
              <li key={t._id} className="rounded-lg border p-4">
                <div className="font-medium">
                  <Link href={`/learn/topics/${t.slug}`}>{t.title}</Link>
                </div>
                {t.description && (
                  <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                    {t.description}
                  </p>
                )}
              </li>
            ))}
        </ul>
      </section>

      {/* Latest Guides */}
      <section className="mt-10">
        <h2 className="text-xl font-medium">Latest Guides</h2>
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

        {/* Pagination */}
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
      </section>
    </main>
  );
}
