import { defineField, defineType } from "sanity";

export default defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Canonical name of the resource.",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugHistory",
      title: "Slug history",
      type: "array",
      of: [{ type: "string" }],
      description:
        "All previous slugs for this resource, used to maintain redirects and canonical history.",
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
      description:
        "Primary image for this resource. Required for public-facing content per global standards.",
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
      description: "Optional supporting imagery for the resource.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Full long-form editorial content for this resource. Uses the unified Portable Text specification.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "notes",
      description:
        "Editorial notes. Public = surface-level clarifications; Private = lexicon and editorial notes.",
      validation: (rule) => rule.required(),
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
        "Attach related guides, topics, brands, SKUs, variants, authors, and modules. Resources are connective tissue in the content graph.",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "metrics",
      description:
        "Optional analytics and engagement rollups, populated by external pipelines.",
    }),
    defineField({
      name: "system",
      title: "System",
      type: "system",
      description:
        "System provenance. Resources may originate from Airtable or be Sanity-native; authority is enforced at the mapping layer.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "hero",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled resource",
        subtitle: subtitle || "Resource",
        media,
      };
    },
  },
});
