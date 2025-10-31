import { defineType, defineField } from "sanity";

export default defineType({
  name: "sku",
  title: "SKU",
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
      name: "brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "abv", title: "ABV %", type: "number" }),
    defineField({ name: "volumeML", title: "Volume (ml)", type: "number" }),
    defineField({
      name: "distillateBase",
      type: "string",
      options: {
        list: ["Wheat", "Rye", "Corn", "Potato", "Grape", "Mixed", "Other"],
      },
    }),
    defineField({ name: "tastingNotes", type: "text" }),
    defineField({ name: "images", type: "array", of: [{ type: "image" }] }),
    defineField({ name: "upc", type: "string" }),
    defineField({
      name: "marketVariants",
      type: "array",
      of: [{ type: "reference", to: [{ type: "marketVariant" }] }],
    }),
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
