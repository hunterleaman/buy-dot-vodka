import { defineField, defineType } from "sanity";

export default defineType({
  name: "relatedBrands",
  title: "Related brands",
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
            title: "Right",
            value: "right",
          },
          {
            title: "Below",
            value: "below",
          },
        ],
        layout: "radio",
      },
      // Track E: allowedSlots = right, below
      initialValue: "right",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (value === "right" || value === "below") return true;
          return 'Value must be "right" or "below".';
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
            title: "P2 – High value utility",
            value: "P2",
          },
        ],
        layout: "radio",
      },
      // Track E: priority = P2
      initialValue: "P2",
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
            title: "Canonical",
            value: "canonical",
          },
          {
            title: "Supporting",
            value: "supporting",
          },
          {
            title: "Conditional",
            value: "conditional",
          },
        ],
        layout: "radio",
      },
      // Track E: default context = supporting-context
      initialValue: "supporting",
    }),
    defineField({
      name: "brands",
      title: "Brands",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "brand" }],
        },
      ],
      description: "Related brands to cross-link from this context.",
      // Track E 4.6.1: brands[] required, length >= 1
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      brands: "brands",
    },
    prepare(selection) {
      const { brands } = selection as { brands?: unknown };
      const count = Array.isArray(brands) ? brands.length : 0;

      return {
        title: "Related brands",
        subtitle:
          count > 0
            ? `${count} linked brand${count === 1 ? "" : "s"}`
            : "No brands linked",
      };
    },
  },
});
