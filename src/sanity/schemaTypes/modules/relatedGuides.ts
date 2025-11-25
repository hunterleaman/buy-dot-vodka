import { defineField, defineType } from "sanity";

export default defineType({
  name: "relatedGuides",
  title: "Related guides",
  type: "document",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description:
        "Where this module should appear relative to the main content.",
      options: {
        list: [
          { title: "Right sidebar", value: "right" },
          { title: "Below content", value: "below" },
        ],
        layout: "radio",
      },
      initialValue: "below",
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
      description: "Editorial context hint used by layout.",
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
      name: "guides",
      title: "Guides",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "guide" }],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      guides: "guides",
    },
    prepare(selection: { guides?: unknown[] }) {
      const guides = Array.isArray(selection.guides) ? selection.guides : [];
      const count = guides.length;
      return {
        title: "Related guides",
        subtitle: count === 1 ? "1 guide" : `${count} guides`,
      };
    },
  },
});
