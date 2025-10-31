import { defineType, defineField } from "sanity";

export default defineType({
  name: "marketVariant",
  title: "Market Variant",
  type: "document",
  fields: [
    defineField({
      name: "sku",
      type: "reference",
      to: [{ type: "sku" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "marketCountry",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "distributor", type: "string" }),
    defineField({ name: "currency", type: "string" }),
    defineField({ name: "priceMSRP", type: "number" }),
    defineField({
      name: "availability",
      type: "string",
      options: {
        list: [
          "In stock",
          "Limited",
          "Seasonal",
          "Out of stock",
          "Discontinued",
        ],
      },
    }),
    defineField({ name: "affiliateUrl", type: "url" }),
  ],
});
