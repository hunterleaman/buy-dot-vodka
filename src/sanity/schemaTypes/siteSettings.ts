// sanity/schemas/siteSettings.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Default <title> tag and OpenGraph title",
    }),
    defineField({
      name: "description",
      title: "Descripton",
      type: "text",
      rows: 3,
      description: "Default meta description and OpenGraph description",
    }),
    defineField({
      name: "ogImage",
      title: "Default Open Graph Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "seo",
      title: "SEO Overrides",
      type: "object",
      fields: [
        { name: "title", type: "string" },
        { name: "description", type: "text", rows: 2 },
        { name: "image", type: "image", options: { hotspot: true } },
      ],
    }),
  ],
});
