import { defineType, defineField } from "sanity";

export default defineType({
  name: "producer",
  title: "Producer",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "country", type: "string" }),
    defineField({ name: "website", type: "url" }),
    defineField({ name: "notes", type: "text" }),
    defineField({
      name: "certifications",
      type: "array",
      of: [{ type: "reference", to: [{ type: "certification" }] }],
    }),
    defineField({
      name: "awards",
      type: "array",
      of: [{ type: "reference", to: [{ type: "award" }] }],
    }),
  ],
});
