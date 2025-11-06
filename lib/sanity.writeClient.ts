// lib/sanity.writeClient.ts
import { createClient } from "@sanity/client";
import { reqEnv } from "./env";

export const sanityWriteClient = createClient({
  projectId: reqEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: reqEnv("NEXT_PUBLIC_SANITY_DATASET"),
  apiVersion: reqEnv("SANITY_API_VERSION"),
  token: reqEnv("SANITY_WRITE_TOKEN"), // editor token, required for writes
  useCdn: false,
  perspective: "published",
});
