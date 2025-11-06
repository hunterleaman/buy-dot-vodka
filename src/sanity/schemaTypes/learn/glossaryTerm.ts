import { defineType, defineField } from "sanity";

export default defineType({
  name: "glossaryTerm",
  title: "Glossary Term",
  type: "document",
  fields: [
    defineField({
      name: "term",
      title: "Term",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "term" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slugHistory",
      title: "Slug history",
      type: "array",
      of: [{ type: "string" }],
      readOnly: true,
    }),
    defineField({
      name: "definition",
      title: "Definition",
      type: "blockContent",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "related",
      title: "Related Terms",
      type: "array",
      of: [{ type: "reference", to: [{ type: "glossaryTerm" }] }],
    }),
    defineField({
      name: "readyToPublish",
      title: "Ready to Publish",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
