import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/lib/sanity.fetch";
import { ALL_BRAND_SLUGS, BRAND_BY_SLUG } from "@/lib/sanity.queries";
import type { Brand } from "@/lib/sanity.types";
import Link from "next/link";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(ALL_BRAND_SLUGS, {
    revalidate: 3600,
    tags: ["brand:list"],
  });
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  const brand = await sanityFetch<Brand | null>(BRAND_BY_SLUG, {
    params: { slug },
    revalidate,
    tags: [`brand:doc:${slug}`],
  });

  if (!brand) return {};

  return {
    title: brand.seo?.title ?? brand.name,
    description: brand.seo?.description ?? "",
    openGraph: {
      title: brand.seo?.title ?? brand.name,
      description: brand.seo?.description ?? "",
      images: brand.seo?.image?.url ? [{ url: brand.seo.image.url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: brand.seo?.title ?? brand.name,
      description: brand.seo?.description ?? "",
      images: brand.seo?.image?.url ? [brand.seo.image.url] : undefined,
    },
  };
}

export default async function BrandPage(props: { params: Promise<Params> }) {
  const { isEnabled } = await draftMode();
  const preview = isEnabled;

  const { slug } = await props.params;

  const brand = await sanityFetch<Brand | null>(BRAND_BY_SLUG, {
    params: { slug },
    revalidate,
    tags: [`brand:doc:${slug}`],
    preview,
  });

  if (!brand) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{brand.name}</h1>

      {brand.producer?.name && (
        <p className="text-sm text-neutral-600 mt-1">
          Producer: {brand.producer.name}
        </p>
      )}

      {brand.website && (
        <p className="mt-2">
          <a
            href={brand.website}
            className="text-blue-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            {brand.website}
          </a>
        </p>
      )}

      {brand.description && (
        <div className="prose mt-6">{brand.description}</div>
      )}

      <p className="mt-8 text-xs text-neutral-500">
        {preview ? "Preview is on. Draft content is visible." : null}
      </p>

      <p className="mt-8">
        <Link href="/brands" className="underline">
          Back to brands
        </Link>
      </p>
    </main>
  );
}
