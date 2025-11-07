import { defineType, defineField } from "sanity";

export default defineType({
  name: "award",
  title: "Award",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "competition",
      title: "Competition",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "medal",
      title: "Medal",
      type: "string",
      options: {
        list: [
          { title: "Double Gold", value: "Double Gold" },
          { title: "Gold", value: "Gold" },
          { title: "Silver", value: "Silver" },
          { title: "Bronze", value: "Bronze" },
          { title: "Finalist", value: "Finalist" },
        ],
      },
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "skus",
      title: "SKUs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "sku" }] }],
    }),
    defineField({
      name: "brands",
      title: "Brands",
      type: "array",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
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
