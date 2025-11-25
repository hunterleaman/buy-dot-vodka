import { defineField, defineType } from "sanity";

export default defineType({
  name: "tastingSummaryPublic",
  title: "Tasting summary (public)",
  type: "document",
  fields: [
    // Module metadata (Track G 3.4)
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description: "Layout slot where this module is rendered.",
      options: {
        list: [{ title: "Right", value: "right" }],
        layout: "radio",
      },
      // Fixed to `right` per Track E allowedSlots
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description: "Priority tier for layout ordering.",
      options: {
        list: [{ title: "P1", value: "P1" }],
        layout: "radio",
      },
      // Fixed to P1 per Track E
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description:
        "Editorial context hint (canonical for SKU; conditional when used on a distinct-flavor variant).",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
        layout: "radio",
      },
    }),

    // Module fields (Track E 4.4.1)
    defineField({
      name: "aroma",
      title: "Aroma",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "palate",
      title: "Palate",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "finish",
      title: "Finish",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mood",
      title: "Mood",
      type: "string",
      description:
        "Optional vibe or usage note (for example “Built for martinis and highballs”).",
    }),
  ],
});
