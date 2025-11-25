import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

type ProducerValidationDoc = {
  status?: {
    visibility?: "public" | "private" | "internal";
    archived?: boolean | null;
  };
  relations?: {
    brands?: unknown[] | null;
  };
  productionOverview?: string | null;
  region?: string | null;
};

const producer = defineType({
  name: "producer",
  title: "Producer",
  type: "document",
  fields: [
    //
    // Core identity
    //
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Canonical producer name.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "URL path segment for this producer. Generated from the title but may be edited.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugHistory",
      title: "Slug history",
      type: "array",
      description:
        "Historical slugs for this producer used for redirects and analytics.",
      of: [
        {
          type: "slug",
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "string",
      description:
        "120–160 character summary used in listings and as a baseline for SEO copy.",
      validation: (rule) =>
        rule
          .required()
          .max(240)
          .warning(
            "Descriptions longer than ~160 characters may be truncated in some UIs."
          ),
    }),

    //
    // Hero
    //
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      description:
        "Above-the-fold framing for this producer. Controls how the page opens.",
      fields: [
        defineField({
          name: "subTitle",
          title: "Subtitle",
          type: "string",
          description: "Optional secondary line under the main title.",
        }),
        defineField({
          name: "readingTime",
          title: "Reading time (minutes)",
          type: "number",
          description:
            "Approximate reading time for the main body content, in minutes.",
          validation: (rule) => rule.min(0).precision(0),
        }),
        defineField({
          name: "heroStyle",
          title: "Hero style",
          type: "string",
          description:
            "Editorial style hint for frontend (for example, minimal, feature, story-first).",
          // No enum list here to avoid overspecifying beyond Tracks A–G.
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    //
    // Main narrative
    //
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Primary narrative about who makes the vodka, how, and why. Expected to be an h2-led multi-section narrative.",
      validation: (rule) =>
        rule.custom((blocks) => {
          if (!Array.isArray(blocks) || blocks.length === 0) {
            return "Body is required.";
          }

          let hasH2 = false;
          let hasEmbedProduct = false;

          for (const block of blocks) {
            if (block?._type === "block") {
              if (block.style === "h2") {
                hasH2 = true;
              }
            } else if (block?._type === "embedProduct") {
              hasEmbedProduct = true;
            }
          }

          if (!hasH2) {
            return "Body must contain at least one h2 section.";
          }

          if (hasEmbedProduct) {
            return "embedProduct is not allowed in producer body content.";
          }

          return true;
        }),
    }),

    //
    // Optional imagery
    //
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Accessible description of the image.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
      description:
        "Supporting imagery for this producer. The first image may be used as a default thumbnail.",
    }),

    //
    // Per-type narrative fields
    //
    defineField({
      name: "originSummary",
      title: "Origin summary",
      type: "text",
      rows: 3,
      description: "Structured founding details in prose form.",
    }),
    defineField({
      name: "productionOverview",
      title: "Production overview",
      type: "text",
      rows: 3,
      description:
        "High-level description of production approach and notable practices.",
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      description:
        "Editorial geography tag for this producer (for example, “Scandinavia”, “Pacific Northwest”).",
    }),

    //
    // Global objects
    //
    defineField({
      name: "notes",
      title: "Notes",
      type: "notes",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "status",
    }),
    defineField({
      name: "system",
      title: "System",
      type: "system",
    }),
    defineField({
      name: "relations",
      title: "Relations",
      type: "relations",
      description:
        "Linked brands, process stages, resources, authors, and modules associated with this producer.",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "metrics",
    }),
  ],

  //
  // Document-level validation tying status + relations + per-type rules
  //
  validation: (rule) =>
    rule.custom((value: SanityDocument | undefined) => {
      const doc = value as ProducerValidationDoc | undefined;
      if (!doc) return true;

      const visibility = doc.status?.visibility;
      const archived = doc.status?.archived;
      const brands = doc.relations?.brands || [];
      const productionOverview = doc.productionOverview;
      const region = doc.region;

      // At least one brand unless dormant/non-public.
      const isPublic = visibility === "public" && archived !== true;
      if (isPublic && (!Array.isArray(brands) || brands.length === 0)) {
        return "At least one related brand is required for public producers.";
      }

      // Region required if productionOverview exists.
      if (
        typeof productionOverview === "string" &&
        productionOverview.trim().length > 0 &&
        (!region || !region.trim())
      ) {
        return "Region is required when a production overview is provided.";
      }

      return true;
    }),

  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "images.0",
    },
  },
});

export default producer;
