import { defineType, defineField } from "sanity";

export default defineType({
  name: "processStage",
  title: "Process Stage",
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
    defineField({ name: "order", type: "number" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "body", type: "blockContent" }),
  ],
});
