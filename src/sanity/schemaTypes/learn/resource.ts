import { defineType, defineField } from "sanity";

export default defineType({
  name: "resource",
  title: "Resource",
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
    defineField({ name: "url", type: "url", validation: (r) => r.required() }),
    defineField({
      name: "type",
      type: "string",
      options: { list: ["Article", "Book", "Video", "Tool", "Standard"] },
    }),
    defineField({ name: "description", type: "text" }),
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
  ],
});
