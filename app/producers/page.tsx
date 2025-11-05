// app/producers/page.tsx
import { sanityFetch } from "@/lib/sanity.fetch";
import { PRODUCER_LIST } from "@/lib/sanity.queries";
import type { Producer } from "@/lib/sanity.types";
import Link from "next/link";

export const revalidate = 120; // ISR interval for this route

export default async function ProducersPage() {
  const producers = await sanityFetch<Producer[]>(PRODUCER_LIST, {
    revalidate, // same as export, but explicit works with nested fetches
    tags: ["producer:list"],
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Producers</h1>
      <p className="text-sm text-neutral-600 mt-1">Live from Sanity</p>
      <ul className="mt-6 space-y-3">
        {producers.map((p) => (
          <li key={p._id} className="rounded-lg border p-4">
            <div className="font-medium">
              <Link href={`/producers/${p.slug}`}>{p.name}</Link>
            </div>
            <div className="text-sm text-neutral-600">
              {p.country ?? "Country unknown"}
            </div>
            {p.website && (
              <a
                href={p.website}
                className="text-sm text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                {p.website}
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
