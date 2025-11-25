import { defineField, defineType } from "sanity";

export default defineType({
  name: "authorCard",
  title: "Author card",
  type: "document",
  fields: [
    // Module metadata (Anchor E / Track G 3.4)
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description: "Layout slot where this module is rendered.",
      options: {
        list: [{ title: "Right", value: "right" }],
        layout: "radio",
      },
      // Required; allowedSlots is additionally enforced on relations.modules
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description:
        "Priority tier for layout ordering (P1 on author pages, P2 elsewhere).",
      options: {
        list: [
          { title: "P1", value: "P1" },
          { title: "P2", value: "P2" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description:
        "Editorial context hint (canonical on author pages, supporting when used on other docs).",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
        layout: "radio",
      },
    }),

    // Module fields (Track E 4.6.5)
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "overrideBio",
      title: "Override bio",
      type: "string",
      description:
        "Optional short override for the author bio, used only in this card (host doc remains unchanged).",
    }),
    defineField({
      name: "roleLabel",
      title: "Role label",
      type: "string",
      description:
        'Optional role or byline label (for example "Editor-in-chief").',
    }),
  ],
});
