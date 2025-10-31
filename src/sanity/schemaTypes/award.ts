import { defineType, defineField } from "sanity";

export default defineType({
  name: "award",
  title: "Award",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "competition", type: "string" }),
    defineField({ name: "year", type: "number" }),
    defineField({
      name: "medal",
      type: "string",
      options: { list: ["Double Gold", "Gold", "Silver", "Bronze"] },
    }),
    defineField({ name: "url", type: "url" }),
  ],
});
