import { defineField, defineType } from "sanity";

// type FactSheetExtendedItem = {
//   label?: string;
//   value?: string;
// };

// type FactSheetExtendedSection = {
//   title?: string;
//   items?: FactSheetExtendedItem[];
// };

export default defineType({
  name: "factSheetExtended",
  title: "Fact sheet (extended)",
  type: "document",

  fields: [
    // Track G 3.4 module metadata
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      options: {
        list: [
          { title: "Right", value: "right" },
          { title: "Below", value: "below" },
        ],
        layout: "radio",
      },
      initialValue: "below",
      description:
        "Where this module should appear relative to the main content.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      options: {
        list: [
          { title: "P1 - Primary", value: "P1" },
          { title: "P2 - Supporting", value: "P2" },
          { title: "P3 - Tertiary", value: "P3" },
        ],
        layout: "radio",
      },
      initialValue: "P2",
      description:
        "Relative importance of this module when multiple modules are present.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
        layout: "radio",
      },
      initialValue: "supporting",
      description:
        "Editorial hint about how this module should be treated in layouts. Does not affect data.",
    }),

    // Track E 4.1.2 fields
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineField({
          name: "section",
          title: "Section",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description:
                "Section heading, for example “Production” or “Packaging”.",
              validation: (rule) => rule.required().min(2),
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [
                defineField({
                  name: "item",
                  title: "Item",
                  type: "object",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      validation: (rule) => rule.required().min(1),
                    }),
                    defineField({
                      name: "value",
                      title: "Value",
                      type: "string",
                      validation: (rule) => rule.required().min(1),
                    }),
                  ],
                }),
              ],
              validation: (rule) =>
                rule
                  .required()
                  .min(1)
                  .error(
                    "Each section in the extended fact sheet must contain at least one item."
                  ),
            }),
          ],
        }),
      ],
      description:
        "Deeper technical spec sections, such as Production, Packaging, or Technical Notes.",
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error("Extended fact sheet must contain at least one section."),
    }),

    defineField({
      name: "footnote",
      title: "Footnote",
      type: "string",
      description:
        "Optional short note for clarifications like batch variation or regulatory caveats.",
    }),
  ],

  preview: {
    select: {
      firstSectionTitle: "sections.0.title",
      firstItemLabel: "sections.0.items.0.label",
      firstItemValue: "sections.0.items.0.value",
      slot: "slot",
    },
    prepare(selection) {
      const { firstSectionTitle, firstItemLabel, firstItemValue, slot } =
        selection as {
          firstSectionTitle?: string;
          firstItemLabel?: string;
          firstItemValue?: string;
          slot?: string;
        };

      const title = firstSectionTitle || "Fact sheet (extended)";
      const firstPair =
        firstItemLabel && firstItemValue
          ? `${firstItemLabel}: ${firstItemValue}`
          : "Extended technical spec";

      const slotLabel = slot ? ` · ${slot}` : "";

      return {
        title,
        subtitle: `${firstPair}${slotLabel}`,
      };
    },
  },
});
