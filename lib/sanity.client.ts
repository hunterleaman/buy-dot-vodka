// lib/sanity.client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.SANITY_API_VERSION || "2025-10-01";
const token = process.env.SANITY_TOKEN;

/**
 * Public client for public datasets only. No token.
 */
export const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: { enabled: false },
});

/**
 * Authenticated client that reads only published content.
 * Works with private datasets on the server.
 */
export const publishedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: "published",
  stega: { enabled: false },
});

/**
 * Preview client that includes drafts.
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: "previewDrafts",
  // turn off stega to avoid studioUrl requirement
  stega: { enabled: false },
});
