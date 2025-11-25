import { defineField, defineType } from "sanity";

export default defineType({
  name: "siblingSkus",
  title: "Sibling SKUs",
  type: "document",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description: "Module placement slot as defined in Track E.",
      options: {
        list: [{ title: "Below", value: "below" }],
        layout: "radio",
      },
      initialValue: "below",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description: "Editorial priority for this module.",
      options: {
        list: [
          { title: "P1", value: "P1" },
          { title: "P2", value: "P2" },
          { title: "P3", value: "P3" },
        ],
        layout: "radio",
      },
      initialValue: "P2",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description: "Editorial context hint for this module.",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
        layout: "radio",
      },
      initialValue: "supporting",
    }),
    defineField({
      name: "skus",
      title: "Sibling SKUs",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "sku" }],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});
