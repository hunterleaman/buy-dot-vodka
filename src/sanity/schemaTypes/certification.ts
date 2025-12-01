import { defineField, defineType } from "sanity";

const certification = defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    // Global identity
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
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
      readOnly: true,
      description:
        "All previous slugs for this lab note, maintained by the slug history document action.",
    }),

    // Global description and narrative
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),

    // Airtable-owned business logic
    defineField({
      name: "code",
      title: "Certification code",
      type: "string",
      description:
        "Canonical certification code used for catalog and regulatory flag logic. Airtable-owned business logic field.",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),

    // Global objects
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
      title: "System metadata",
      type: "system",
      readOnly: true,
    }),
    defineField({
      name: "relations",
      title: "Relations",
      type: "relations",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "metrics",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "code",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Untitled certification",
        subtitle: subtitle ? `Code: ${subtitle}` : "",
      };
    },
  },
});

export default certification;
