import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

type BrandValidationDoc = {
  status?: {
    visibility?: "public" | "private" | "internal";
    archived?: boolean | null;
  };
  relations?: {
    producers?: unknown[] | null;
  };
};

const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    //
    // Core identity
    //
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Canonical brand name.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "URL path segment for this brand. Generated from the title but may be edited.",
      options: {
        source: "title",
        maxLength: 96,
        // isUnique will be wired via slugHelpers.ts in the utilities step.
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugHistory",
      title: "Slug history",
      type: "array",
      description:
        "Historical slugs for this brand used for redirects and analytics.",
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
        "Above-the-fold framing for this brand. Controls how the page opens.",
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
          // Track G preserves these editorial fields from Track B without
          // constraining them to a fixed enum.
        }),
      ],
      // Track B: hero required for Brand.
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
        "Primary narrative for this brand. Focused on posture, story, and where it sits in the ecosystem.",
      validation: (rule) =>
        rule.custom((blocks) => {
          if (!Array.isArray(blocks) || blocks.length === 0) {
            return "Body is required.";
          }
          if (blocks.length < 3) {
            return "Body must contain at least three blocks.";
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
        "Supporting imagery for this brand. The first image may be used as a default thumbnail.",
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
        "Linked producer, SKUs, topics, resources, authors, and modules associated with this brand.",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "metrics",
    }),
  ],

  //
  // Document-level validation tying status + relations to Track B rules
  //
  validation: (rule) =>
    rule.custom((value: SanityDocument | undefined) => {
      const doc = value as BrandValidationDoc | undefined;
      if (!doc) return true;

      const visibility = doc.status?.visibility;
      const archived = doc.status?.archived;
      const producers = doc.relations?.producers || [];

      const isPublic = visibility === "public" && archived !== true;

      // Track B: “exactly one producer (unless exceptional override)”.
      // We enforce this for public, non-archived brands; private/dormant brands
      // can be in flux during editorial work.
      if (isPublic) {
        if (!Array.isArray(producers) || producers.length === 0) {
          return "Public brands must be linked to exactly one producer.";
        }
        if (producers.length > 1) {
          return "Public brands must be linked to exactly one producer, not multiple.";
        }
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

export default brand;
