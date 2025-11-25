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
  name: "glossaryPanel",
  title: "Glossary panel",
  type: "document",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description:
        "Where this glossary panel should appear relative to the main content.",
      options: {
        layout: "radio",
        list: [
          { title: "Right sidebar", value: "right" },
          { title: "Below main content", value: "below" },
          { title: "Inline", value: "inline" },
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
      name: "term",
      title: "Term",
      type: "string",
      description: "The glossary term being defined.",
      validation: (rule) =>
        rule.required().min(1).warning("Use a concise, human-friendly term."),
    }),
    defineField({
      name: "definition",
      title: "Definition",
      type: "blockContent",
      description: "Short, accessible definition of the term.",
      validation: (rule) => [
        rule.required(),
        rule
          .max(3)
          .warning("Keep glossary definitions short (3 blocks or fewer)."),
        rule.custom((value: unknown, _context: ValidationContext) => {
          if (!value) {
            // Required rule above will handle missing value.
            return true;
          }

          if (hasDisallowedPortableTextObjects(value)) {
            return "Glossary definitions must not include embedProduct or embedCTA blocks. Keep this purely explanatory.";
          }

          return true;
        }),
      ],
    }),
  ],
});
