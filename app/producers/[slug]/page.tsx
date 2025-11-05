import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/lib/sanity.fetch";
import { ALL_PRODUCER_SLUGS, PRODUCER_BY_SLUG } from "@/lib/sanity.queries";
import type { Producer } from "@/lib/sanity.types";
import Link from "next/link";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(ALL_PRODUCER_SLUGS, {
    revalidate: 3600,
    tags: ["producer:list"],
  });
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const preview = isEnabled;

  const { slug } = await props.params;

  const producer = await sanityFetch<Producer | null>(PRODUCER_BY_SLUG, {
    params: { slug },
    revalidate,
    tags: [`producer:doc:${slug}`],
    preview,
  });

  if (!producer) return {};

  const title = producer.seo?.title || producer.name;
  const description = producer.seo?.description || producer.notes || "";
  const ogImage = producer.seo?.image?.url;

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

export default async function ProducerPage(props: { params: Promise<Params> }) {
  const { isEnabled } = await draftMode();
  const preview = isEnabled;

  const { slug } = await props.params;

  const producer = await sanityFetch<Producer | null>(PRODUCER_BY_SLUG, {
    params: { slug },
    revalidate,
    tags: [`producer:doc:${slug}`],
    preview,
  });

  if (!producer) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{producer.name}</h1>

      <div className="mt-2 text-sm text-neutral-600">
        {producer.country ?? "Country unknown"}
      </div>

      {producer.website && (
        <p className="mt-3">
          <a
            href={producer.website}
            className="text-blue-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            {producer.website}
          </a>
        </p>
      )}

      {producer.notes && <div className="prose mt-6">{producer.notes}</div>}

      <p className="mt-8 text-xs text-neutral-500">
        {preview ? "Preview is on. Draft content is visible." : null}
      </p>

      <p className="mt-8">
        <Link href="/producers" className="underline">
          Back to producers
        </Link>
      </p>
    </main>
  );
}
