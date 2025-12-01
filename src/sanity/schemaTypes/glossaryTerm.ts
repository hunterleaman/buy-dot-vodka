import { defineField, defineType } from "sanity";
import { normalizeSlug } from "@/src/sanity/lib/slugHelpers";

const glossaryTerm = defineType({
  name: "glossaryTerm",
  title: "Glossary term",
  type: "document",
  fields: [
    // Global identity
    defineField({
      name: "title",
      title: "Term",
      type: "string",
      description:
        "Canonical term as it should appear in UI and glossary panels.",
      validation: (rule) => rule.required(),
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
      readOnly: true,
      description:
        "All previous slugs for this lab note, maintained by the slug history document action.",
    }),

    // Global description and narrative
    defineField({
      name: "description",
      title: "Short definition",
      type: "text",
      description:
        "Concise definition used in list views and SEO descriptions.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Full definition",
      type: "blockContent",
      description: "Portable Text definition and clarifications for this term.",
      validation: (rule) => rule.required(),
    }),

    // Global objects from Track A
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
      description: "description",
    },
    prepare(selection) {
      const { title, description } = selection;
      return {
        title: title || "Untitled term",
        subtitle: description || "",
      };
    },
  },
});

export default glossaryTerm;
