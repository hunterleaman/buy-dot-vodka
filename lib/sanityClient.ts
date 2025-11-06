// lib/sanityClient.ts
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.SANITY_API_VERSION!;
const token = process.env.SANITY_READ_TOKEN; // was SANITY_TOKEN

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // If you have a private dataset, keep token defined to read published content.
  // If public dataset, token can be undefined and CDN can be used.
  token,
  useCdn: token ? false : true,
  perspective: "published",
});
