import { defineType, defineField } from "sanity";

export default defineType({
  name: "producer",
  title: "Producer",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "country", title: "Country", type: "string" }),
    defineField({ name: "website", title: "Website", type: "url" }),
    defineField({ name: "notes", title: "Notes", type: "text" }),
    defineField({
      name: "readyToPublish",
      title: "Ready to Publish",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
