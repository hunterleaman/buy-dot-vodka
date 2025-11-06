/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { defineConfig } from "sanity";
import { visionTool } from "@sanity/vision";
import { structureTool } from "sanity/structure";
import { codeInput } from "@sanity/code-input";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { withSlugHistory } from "./src/sanity/documentActions/withSlugHistory";

export default defineConfig({
  name: "buy-dot-vodka-studio",
  title: "BUY.VODKA Studio",
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  schema: { types: schemaTypes },
  document: {
    actions: (prev, ctx) =>
      prev.map((action) => {
        // Wrap only the Publish action safely using its label
        return withSlugHistory(action, ctx);
      }),
  },
  plugins: [
    structureTool(), // minimal, no custom structure for now
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool(),
    codeInput(),
  ],
});
