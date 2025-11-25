import { defineField, defineType } from "sanity";

export default defineType({
  name: "servingSuggestions",
  title: "Serving suggestions",
  type: "document",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description: "Layout slot for this module. Fixed per module type.",
      options: {
        list: [{ title: "Below", value: "below" }],
        layout: "radio",
      },
      initialValue: "below",
      readOnly: true,
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description: "Priority tier for layout decisions. Fixed per module type.",
      options: {
        list: [
          { title: "P1 - Highest", value: "P1" },
          { title: "P2 - Standard", value: "P2" },
          { title: "P3 - Support", value: "P3" },
        ],
        layout: "radio",
      },
      initialValue: "P2",
      readOnly: true,
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description:
        "Editorial context hint for layout and ranking. Fixed per module type.",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
        layout: "radio",
      },
      initialValue: "conditional",
      readOnly: true,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Serving suggestions and simple service recommendations. No commerce facts (ABV, pack, price).",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      body: "body",
    },
    prepare() {
      return {
        title: "Serving suggestions",
        subtitle: "Tasting module",
      };
    },
  },
});
