import { defineType, defineField } from "sanity";

export default defineType({
  name: "brand",
  title: "Brand",
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
    defineField({
      name: "producer",
      type: "reference",
      to: [{ type: "producer" }],
    }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "website", type: "url" }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
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
    defineField({
      name: "affiliateSources",
      type: "array",
      of: [{ type: "reference", to: [{ type: "affiliateSource" }] }],
    }),
  ],
});
