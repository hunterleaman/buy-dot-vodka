import { defineType, defineField } from "sanity";

export default defineType({
  name: "labNote",
  title: "Lab Note",
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
    defineField({
      name: "date",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({
      name: "topics",
      type: "array",
      of: [{ type: "reference", to: [{ type: "topic" }] }],
    }),
  ],
});
