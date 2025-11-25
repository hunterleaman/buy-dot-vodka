import { defineField, defineType } from "sanity";

export default defineType({
  name: "relatedResources",
  title: "Related resources",
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
      // Track E 4.6.4: allowedSlots = right, below
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
      // Track E 4.6.4: priority = P2
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
      // Track E 4.6.4: default context = supporting-context
      initialValue: "supporting",
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "resource" }],
        },
      ],
      description:
        "Related internal or external resources to cross-link from this context.",
      // Track E 4.6.4: resources[] required, length >= 1
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      resources: "resources",
    },
    prepare(selection) {
      const { resources } = selection as { resources?: unknown };
      const count = Array.isArray(resources) ? resources.length : 0;

      return {
        title: "Related resources",
        subtitle:
          count > 0
            ? `${count} linked resource${count === 1 ? "" : "s"}`
            : "No resources linked",
      };
    },
  },
});
