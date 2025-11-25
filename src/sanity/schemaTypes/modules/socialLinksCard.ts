import { defineField, defineType } from "sanity";

export default defineType({
  name: "socialLinksCard",
  title: "Social links card",
  type: "document",
  fields: [
    // Module metadata (Track E / Track G 3.4)
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description: "Layout slot where this module is rendered.",
      options: {
        list: [
          { title: "Right", value: "right" },
          { title: "Below", value: "below" },
        ],
        layout: "radio",
      },
      // Required; allowedSlots is additionally enforced on relations.modules
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description: "Priority tier for layout ordering (P2 supporting module).",
      options: {
        list: [{ title: "P2", value: "P2" }],
        layout: "radio",
      },
      // Fixed to P2 per Track E
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description:
        "Editorial context hint (supporting or conditional use on author/brand docs).",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
        layout: "radio",
      },
    }),

    // Module fields (Track E 4.6.6)
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        defineField({
          name: "link",
          title: "Link",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                'Human-readable label (for example "Website", "Instagram").',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              description:
                'Platform identifier (for example "site", "instagram", "facebook", "x").',
              // Left unconstrained; values like "site" / "instagram" shown in Track E example.
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "string",
              description: "Full URL for this profile or site.",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});
