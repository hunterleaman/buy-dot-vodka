import { sanityFetch } from "@/lib/sanity.fetch";
import { BRAND_LIST } from "@/lib/sanity.queries";
import type { Brand } from "@/lib/sanity.types";
import Link from "next/link";
import { draftMode } from "next/headers";

export const revalidate = 120;

export default async function BrandsPage() {
  const { isEnabled } = await draftMode();
  const preview = isEnabled;

  const brands = await sanityFetch<Brand[]>(BRAND_LIST, {
    revalidate,
    tags: ["brand:list"],
    preview,
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Brands</h1>
      <p className="text-sm text-neutral-600 mt-1">
        Live from Sanity {preview ? "(preview)" : ""}
      </p>

      <ul className="mt-6 space-y-3">
        {brands.map((b) => (
          <li key={b._id} className="rounded-lg border p-4">
            <div className="font-medium">
              <Link href={`/brands/${b.slug}`}>{b.name}</Link>
            </div>
            {b.producer?.name && (
              <div className="text-sm text-neutral-600">
                Producer:{" "}
                <Link href={`/producers/${b.producer.slug}`}>
                  {b.producer.name}
                </Link>
              </div>
            )}
            {b.website && (
              <a
                href={b.website}
                className="text-sm text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                {b.website}
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
