import { defineField, defineType } from "sanity";
import type { ValidationContext } from "sanity";

type PortableTextBlock = {
  _type?: string;
  [key: string]: unknown;
};

const hasDisallowedPortableTextObjects = (value: unknown): boolean => {
  if (!Array.isArray(value)) return false;

  return value.some((block) => {
    if (!block || typeof block !== "object") return false;
    const ptBlock = block as PortableTextBlock;
    return ptBlock._type === "embedProduct" || ptBlock._type === "embedCTA";
  });
};

export default defineType({
  name: "storyHighlight",
  title: "Story highlight",
  type: "document",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description:
        "Where this story highlight should appear relative to the main content.",
      options: {
        layout: "radio",
        list: [
          { title: "Right sidebar", value: "right" },
          { title: "Below main content", value: "below" },
        ],
      },
      initialValue: "right",
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
      name: "body",
      title: "Story",
      type: "blockContent",
      description: "One compact narrative that captures what matters most.",
      validation: (rule) => [
        rule.required(),
        rule
          .max(3)
          .warning("Recommended to keep storyHighlight to 3 blocks or fewer."),
        rule.custom((value: unknown, _context: ValidationContext) => {
          if (!value) {
            // Required rule above will handle missing value.
            return true;
          }

          if (hasDisallowedPortableTextObjects(value)) {
            return "Story highlight must not include embedProduct or embedCTA blocks. Keep it purely editorial.";
          }

          return true;
        }),
      ],
    }),
  ],
});
