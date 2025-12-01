import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";
import { normalizeSlug } from "@/src/sanity/lib/slugHelpers";

type GuideRelations = {
  topics?: { _ref?: string }[] | null;
  authors?: { _ref?: string }[] | null;
};

type GuideValidationDoc = SanityDocument & {
  relations?: GuideRelations | null;
};

export default defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Canonical name of the guide.",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) => normalizeSlug(input),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugHistory",
      title: "Slug history",
      type: "array",
      of: [{ type: "string" }],
      description:
        "All previous slugs for this guide, used to generate redirects.",
      initialValue: [],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "Short summary used for cards, previews, and SEO meta. Target 120–160 characters, hard cap 240.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "hero",
      title: "Hero image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Primary image for this guide.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Additional images",
      type: "array",
      of: [{ type: "image" }],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Long-form educational content for this guide. Uses the unified Portable Text spec.",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!Array.isArray(value)) {
            return "Body content is required.";
          }

          // Require at least two h2 blocks, per Track B guidance
          const h2Count = value.filter((block) => {
            if (
              block &&
              typeof block === "object" &&
              (block as { _type?: string; style?: string })._type === "block" &&
              (block as { _type?: string; style?: string }).style === "h2"
            ) {
              return true;
            }
            return false;
          }).length;

          if (h2Count < 2) {
            return "Guides should include at least two h2 sections.";
          }

          return true;
        }),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "notes",
      description:
        "Public and private annotation fields. Do not store primary facts here.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
        layout: "radio",
      },
      description: "Intended reader level for this guide.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "estimatedReadMinutes",
      title: "Estimated read time (minutes)",
      type: "number",
      description: "Rough estimate of how long this guide takes to read.",
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "status",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "relations",
      title: "Relations",
      type: "relations",
      description:
        "Attach topics, resources, producers, brands, authors, and modules to this guide per Track B and Track E.",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "metrics",
      description:
        "Optional analytics rollups. Populated by external pipelines, not required for publishing.",
    }),
    defineField({
      name: "system",
      title: "System",
      type: "system",
      description:
        "Provenance information. Guides are Sanity-native; system fields are optional and Sanity-owned.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "difficulty",
      media: "hero",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled guide",
        subtitle: subtitle ? `Difficulty: ${subtitle}` : "Guide",
        media,
      };
    },
  },

  validation: (rule) =>
    rule.custom((value) => {
      const doc = value as GuideValidationDoc | undefined;
      const relations = doc?.relations;

      const topicCount = relations?.topics?.length ?? 0;
      const authorCount = relations?.authors?.length ?? 0;

      if (topicCount < 1) {
        return "At least one Topic is required for every Guide.";
      }

      if (authorCount < 1) {
        return "At least one Author is required for every Guide.";
      }

      return true;
    }),
});
