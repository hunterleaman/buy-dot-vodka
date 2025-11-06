// lib/sanity.client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.SANITY_API_VERSION || "2025-10-01";
const readToken = process.env.SANITY_READ_TOKEN; // renamed

export const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: { enabled: false },
});

export const publishedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !readToken,
  token: readToken,
  perspective: "published",
  stega: { enabled: false },
});

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: readToken,
  perspective: "previewDrafts",
  stega: { enabled: false },
});
