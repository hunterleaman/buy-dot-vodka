import { defineType, defineField } from "sanity";

export default defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "producers",
      title: "Producers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "producer" }] }],
    }),
    defineField({
      name: "skus",
      title: "SKUs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "sku" }] }],
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
