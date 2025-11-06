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

  const hasReadToken = Boolean(process.env.SANITY_READ_TOKEN);

  const client = preview
    ? previewClient
    : hasReadToken
      ? publishedClient
      : publicClient;

  return client.fetch<TData>(query, params, { next: { revalidate, tags } });
}
