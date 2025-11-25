import { defineField, defineType } from "sanity";

export default defineType({
  name: "siblingVariants",
  title: "Sibling variants",
  type: "document",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description: "Layout slot where this module is intended to render.",
      options: {
        list: [
          {
            title: "Below",
            value: "below",
          },
        ],
        layout: "radio",
      },
      initialValue: "below",
      // Track E: allowedSlots = below only
      validation: (rule) =>
        rule.required().custom((value) => {
          if (value === "below") return true;
          return 'Value must be "below".';
        }),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description: "Module priority for layout decisions.",
      options: {
        list: [
          {
            title: "P2 - High value",
            value: "P2",
          },
        ],
      },
      initialValue: "P2",
      // Track E: priority = P2
      validation: (rule) =>
        rule.required().custom((value) => {
          if (value === "P2") return true;
          return 'Value must be "P2".';
        }),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description: "Editorial context hint for this module.",
      options: {
        list: [
          {
            title: "Supporting context",
            value: "supporting",
          },
        ],
        layout: "radio",
      },
      // Track E: default context = supporting-context
      initialValue: "supporting",
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "marketVariant" }],
        },
      ],
      // Track E 4.3.2: variants[] required, length >= 1
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      variants: "variants",
    },
    prepare(selection) {
      const { variants } = selection;
      const count = Array.isArray(variants) ? variants.length : 0;

      return {
        title: "Sibling variants",
        subtitle:
          count > 0
            ? `${count} linked variant${count === 1 ? "" : "s"}`
            : "No variants linked",
      };
    },
  },
});
