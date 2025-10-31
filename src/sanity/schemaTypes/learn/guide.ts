import { defineType, defineField } from "sanity";

export default defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({
      name: "body",
      type: "blockContent",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "authors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "author" }] }],
    }),
    defineField({
      name: "topics",
      type: "array",
      of: [{ type: "reference", to: [{ type: "topic" }] }],
    }),
    defineField({
      name: "processStages",
      type: "array",
      of: [{ type: "reference", to: [{ type: "processStage" }] }],
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
  ],
});
