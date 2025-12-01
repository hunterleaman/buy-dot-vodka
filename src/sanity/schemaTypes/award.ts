import { defineField, defineType } from "sanity";
import type { DocumentWithSystemSource } from "@/src/sanity/types";
import { isAirtableOwned } from "@/src/sanity/lib/ownershipMaps";
import { normalizeSlug } from "@/src/sanity/lib/slugHelpers";

const award = defineType({
  name: "award",
  title: "Award",
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

    // Airtable owned business logic
    defineField({
      name: "code",
      title: "Award code",
      type: "string",
      description:
        "Canonical award code used for catalog logic and sidebar badge modules. Airtable owned business logic field.",
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
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("award.system.source")
        );
      },
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
        title: title || "Untitled award",
        subtitle: subtitle ? `Code: ${subtitle}` : "",
      };
    },
  },
});

export default award;
