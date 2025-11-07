import { defineType, defineField } from "sanity";

export default defineType({
  name: "sku",
  title: "SKU",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
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
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "abv",
      title: "ABV",
      type: "number",
    }),
    defineField({
      name: "volumeML",
      title: "Volume (mL)",
      type: "number",
    }),
    defineField({
      name: "distillateBase",
      title: "Distillate Base",
      type: "string",
      options: {
        list: [
          { title: "Barley", value: "Barley" },
          { title: "Corn", value: "Corn" },
          { title: "Grape", value: "Grape" },
          { title: "Potato", value: "Potato" },
          { title: "Rice", value: "Rice" },
          { title: "Rye", value: "Rye" },
          { title: "Sugarcane", value: "Sugarcane" },
          { title: "Sweet Potato", value: "Sweet Potato" },
          { title: "Unknown", value: "Unknown" },
          { title: "Wheat", value: "Wheat" },
        ],
      },
    }),
    defineField({
      name: "tastingNotes",
      title: "Tasting Notes",
      type: "text",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "upc",
      title: "UPC",
      type: "string",
    }),
    defineField({
      name: "readyToPublish",
      title: "Ready to Publish",
      type: "boolean",
      readOnly: true, // Airtable-owned
      initialValue: false, // prevent indeterminate UI for new docs
      description: "Driven by Airtable. Edit in Airtable only.",
    }),
  ],
});
