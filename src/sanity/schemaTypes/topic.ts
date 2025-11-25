import { defineField, defineType } from "sanity";

export default defineType({
  name: "topic",
  title: "Topic",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Canonical name of the concept or term.",
      validation: (rule) => rule.required().min(2),
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
        "All previous slugs for this topic, used to maintain redirects and canonical history.",
      initialValue: [],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "Short summary used for cards, previews, and meta. Target 120–160 characters, hard cap 240.",
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
        "Primary image for this topic. Required for public-facing content per global standards.",
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
      description: "Optional supporting imagery for the topic.",
    }),
    defineField({
      name: "shortDefinition",
      title: "Short definition",
      type: "text",
      rows: 2,
      description:
        "Concise, reader-friendly definition used in glossary panels, cards, and inline callouts.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "definition",
      title: "Expanded definition",
      type: "blockContent",
      description:
        "Longer definitional explanation and context. For deeper background beyond the short definition.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Full long-form editorial content about this topic. Uses the shared Portable Text specification.",
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
        "Attach related guides, resources, brands, and modules. Topics act as conceptual hubs for cross-linking.",
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
        "System provenance. Topics are Sanity-native; system fields are used for internal bookkeeping only.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "shortDefinition",
      media: "hero",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled topic",
        subtitle: subtitle || "Topic",
        media,
      };
    },
  },
});
