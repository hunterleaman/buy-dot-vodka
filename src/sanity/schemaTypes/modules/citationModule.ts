import { defineField, defineType } from "sanity";

export default defineType({
  name: "citationModule",
  title: "Citation module",
  type: "document",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description:
        "Where this citation block should appear relative to the main content.",
      options: {
        layout: "radio",
        list: [
          { title: "Below main content", value: "below" },
          { title: "Right sidebar", value: "right" },
        ],
      },
      initialValue: "below",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description:
        "Layout priority hint used when multiple modules compete for space.",
      options: {
        list: [
          { title: "P1 - Canonical", value: "P1" },
          { title: "P2 - High value", value: "P2" },
          { title: "P3 - Enrichment", value: "P3" },
        ],
      },
      initialValue: "P2",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description: "Editorial context hint to help layout decisions.",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
      },
      initialValue: "supporting",
    }),
    defineField({
      name: "citations",
      title: "Citations",
      type: "array",
      description: "List of sources and references cited in this document.",
      of: [
        {
          name: "citation",
          title: "Citation",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "Short label for this citation (for example source name or note).",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              description: "Full URL for this citation.",
              validation: (rule) =>
                rule.required().uri({
                  scheme: ["http", "https"],
                }),
            }),
          ],
        },
      ],
      validation: (rule) =>
        rule.required().min(1).error("Add at least one citation."),
    }),
  ],
});
