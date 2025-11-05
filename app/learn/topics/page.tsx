// app/learn/topics/page.tsx
// All Topics list. Mirrors list page style used elsewhere. :contentReference[oaicite:5]{index=5}

import Link from "next/link";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/lib/sanity.fetch";
import { TOPIC_LIST } from "@/lib/sanity.queries";
import type { Topic } from "@/lib/sanity.types";

export const revalidate = 180;

export default async function TopicsIndexPage() {
  const { isEnabled } = await draftMode();
  const preview = isEnabled;

  const topics = await sanityFetch<Topic[]>(TOPIC_LIST, {
    revalidate,
    tags: ["topic:list"],
    preview,
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">All Topics</h1>
      <p className="text-sm text-neutral-600 mt-1">
        Browse every Learn topic {preview ? "(preview)" : ""}
      </p>

      <ul className="mt-6 space-y-3">
        {topics.map((t) => (
          <li key={t._id} className="rounded-lg border p-4">
            <div className="font-medium">
              <Link href={`/learn/topics/${t.slug}`}>{t.title}</Link>
            </div>
            {t.description && (
              <p className="text-sm text-neutral-600 mt-1">{t.description}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
