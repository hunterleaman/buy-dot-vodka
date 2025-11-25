import { defineField, defineType } from "sanity";

export default defineType({
  name: "relatedTopics",
  title: "Related topics",
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
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "topic" }],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      topics: "topics",
    },
    prepare(selection: { topics?: unknown[] }) {
      const topics = Array.isArray(selection.topics) ? selection.topics : [];
      const count = topics.length;

      return {
        title: "Related topics",
        subtitle: count === 1 ? "1 topic" : `${count} topics`,
      };
    },
  },
});
