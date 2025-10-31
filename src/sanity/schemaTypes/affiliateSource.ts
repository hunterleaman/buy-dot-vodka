import { defineType, defineField } from "sanity";

export default defineType({
  name: "affiliateSource",
  title: "Affiliate Source",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "network",
      type: "string",
      options: { list: ["Skimlinks", "Impact", "CJ", "Other"] },
    }),
    defineField({ name: "affiliateId", type: "string" }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "clickUrl", title: "Tracking URL", type: "url" }),
    defineField({ name: "notes", type: "text" }),
  ],
});
