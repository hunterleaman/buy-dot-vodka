import { defineField, defineType } from "sanity";

export default defineType({
  name: "whereToBuyGuide",
  title: "Where to buy guide",
  type: "document",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description: "Layout slot where this module may appear.",
      options: {
        list: [{ title: "Below content", value: "below" }],
        layout: "radio",
      },
      initialValue: "below",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description: "Layout priority tier for this module.",
      options: {
        list: [
          { title: "P1 - Canonical", value: "P1" },
          { title: "P2 - High value", value: "P2" },
          { title: "P3 - Enrichment", value: "P3" },
        ],
        layout: "radio",
      },
      initialValue: "P2",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description: "Editorial context hint used by layout heuristics.",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
        layout: "radio",
      },
      initialValue: "supporting",
      readOnly: true,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description: "Editorial guidance on where and how to purchase this SKU.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      body: "body",
    },
    prepare(_selection: { body?: unknown }) {
      return {
        title: "Where to buy guide",
        subtitle: "Editorial where to buy guidance",
      };
    },
  },
});
