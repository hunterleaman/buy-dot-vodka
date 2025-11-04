import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/lib/sanity.fetch";
import {
  ALL_BRAND_SLUGS,
  BRAND_BY_SLUG,
  SITE_SETTINGS,
} from "@/lib/sanity.queries";
import type { Brand } from "@/lib/sanity.types";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(ALL_BRAND_SLUGS, {
    revalidate: 3600,
    tags: ["brand:list"],
  });
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const preview = isEnabled;

  const brand = await sanityFetch<Brand | null>(BRAND_BY_SLUG, {
    params: { slug: params.slug },
    revalidate,
    tags: [`brand:doc:${params.slug}`],
    preview,
  });

  if (!brand) return {};

  const title = brand.seo?.title || brand.name;
  const description = brand.seo?.description || brand.description || "";
  const ogImage = brand.seo?.image?.url;

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

export default async function BrandPage({ params }: { params: Params }) {
  const { isEnabled } = await draftMode();
  const preview = isEnabled;


  const brand = await sanityFetch<Brand | null>(BRAND_BY_SLUG, {
    params: { slug: params.slug },
    revalidate,
    tags: [`brand:doc:${params.slug}`],
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

      {preview && (
        <p className="mt-6 text-xs text-amber-600">
          Preview is on. Draft content is visible.
        </p>
      )}
    </main>
  );
}
