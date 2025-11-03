import { defineType, defineField } from "sanity";

export default defineType({
  name: "marketVariant",
  title: "Market Variant",
  type: "document",
  fields: [
    defineField({
      name: "sku",
      title: "SKU",
      type: "reference",
      to: [{ type: "sku" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "marketCountry",
      title: "Market Country",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "distributor",
      title: "Distributor",
      type: "string",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
    }),
    defineField({
      name: "msrp",
      title: "MSRP",
      type: "number",
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      options: {
        list: ["Available", "Limited", "Discontinued"],
      },
    }),
    defineField({
      name: "affiliateUrl",
      title: "Affiliate URL",
      type: "url",
    }),
    defineField({
      name: "readyToPublish",
      title: "Ready to Publish",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "sku.title",
      subtitle: "marketCountry",
    },
  },
});
