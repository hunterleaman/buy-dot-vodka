// lib/sanity.fetch.ts
import type { QueryParams } from "next-sanity";
import { publicClient, publishedClient, previewClient } from "./sanity.client";

export type SanityFetchOptions<TParams extends QueryParams = QueryParams> = {
  params?: TParams;
  revalidate?: number | false;
  tags?: string[];
  preview?: boolean;
};

export async function sanityFetch<
  TData,
  TParams extends QueryParams = QueryParams,
>(query: string, opts: SanityFetchOptions<TParams> = {}): Promise<TData> {
  const {
    params = {} as TParams,
    revalidate = 120,
    tags = [],
    preview = false,
  } = opts;

  // Use drafts when preview is on
  const client = preview
    ? previewClient
    : // If a token exists, prefer the authenticated published client
      process.env.SANITY_TOKEN
      ? publishedClient
      : publicClient;

  return client.fetch<TData>(query, params, {
    next: { revalidate, tags },
  });
}
