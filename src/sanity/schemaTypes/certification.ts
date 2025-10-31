import { defineType, defineField } from "sanity";

export default defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "organization", type: "string" }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "icon", type: "image" }),
    defineField({ name: "description", type: "text" }),
  ],
});
