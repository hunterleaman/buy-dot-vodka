import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryModule",
  title: "Gallery module",
  type: "document",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description:
        "Where this gallery should appear relative to the main content.",
      options: {
        layout: "radio",
        list: [{ title: "Below main content", value: "below" }],
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
      initialValue: "P3",
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
      name: "images",
      title: "Images",
      type: "array",
      description: "Lightweight image gallery for this page.",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .warning("Gallery works best when you add at least one image."),
    }),
  ],
});
