import { defineField, defineType } from "sanity";

// type RegulatoryFlag = {
//   label?: string;
//   code?: string;
// };

export default defineType({
  name: "regulatoryFlags",
  title: "Regulatory flags",
  type: "document",

  fields: [
    // Module metadata (Track G 3.4 + Track E 4.1.4)
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
      description:
        "Where this module should appear relative to the main content.",
      validation: (rule) => rule.required(),
      initialValue: "right",
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
      description:
        "Relative importance of this module when multiple modules are present.",
      validation: (rule) => rule.required(),
      initialValue: "P2",
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
      description:
        "Editorial hint about how this module should be treated in layouts. Does not affect data.",
      initialValue: "supporting",
    }),

    // Track E 4.1.4 - regulatoryFlags
    defineField({
      name: "flags",
      title: "Flags",
      type: "array",
      of: [
        defineField({
          name: "flag",
          title: "Flag",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "Human facing label, for example Organic EU or Double Gold - SF Spirits.",
              validation: (rule) => rule.required().min(2),
            }),
            defineField({
              name: "code",
              title: "Code",
              type: "string",
              description:
                "Stable code that maps to a certification, award, or compliance configuration (for example ORG_EU, SF_DG_2024).",
              validation: (rule) =>
                rule
                  .required()
                  .min(2)
                  .custom((value: string | undefined) => {
                    if (!value) return true; // required() handles empties
                    // Keep schema level validation to basic shape;
                    // deeper mapping to known configurations is handled by lint scripts.
                    if (!/^[A-Z0-9_]+$/.test(value)) {
                      return "Codes should use only A-Z, 0-9, and underscores.";
                    }
                    return true;
                  }),
            }),
          ],
        }),
      ],
      description:
        "Certifications, awards, and compliance badges to display for this SKU or market variant.",
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error("Regulatory flags must include at least one flag."),
    }),

    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description:
        "Optional clarification, for example that awards or certifications may differ by batch or market.",
    }),
  ],

  preview: {
    select: {
      firstLabel: "flags.0.label",
      firstCode: "flags.0.code",
      slot: "slot",
    },
    prepare(selection) {
      const { firstLabel, firstCode, slot } = selection as {
        firstLabel?: string;
        firstCode?: string;
        slot?: string;
      };

      const title = firstLabel || "Regulatory flags";
      const parts: string[] = [];

      if (firstCode) {
        parts.push(firstCode);
      }

      if (slot) {
        parts.push(`slot: ${slot}`);
      }

      const subtitle =
        parts.length > 0 ? parts.join(" · ") : "Certifications and awards";

      return {
        title,
        subtitle,
      };
    },
  },
});
