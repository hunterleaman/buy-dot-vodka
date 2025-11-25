import { defineField, defineType } from "sanity";

export default defineType({
  name: "buyCtaCompact",
  title: "Buy CTA (compact)",
  type: "document",

  fields: [
    // Module metadata (Track G 3.4 + Track E 4.3.3)
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      options: {
        list: [{ title: "Right", value: "right" }],
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
      initialValue: "P1",
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
      initialValue: "canonical",
    }),

    // Track E 4.3.3 - buyCtaCompact
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description:
        "Primary call to action label, for example Buy now or Shop this vodka.",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "subLabel",
      title: "Sub-label",
      type: "string",
      description:
        "Optional supporting text, for example Trusted retailer links or Prices set by retailers.",
    }),
    defineField({
      name: "affiliateTargets",
      title: "Affiliate targets",
      type: "array",
      of: [
        defineField({
          name: "affiliateTarget",
          title: "Affiliate target",
          type: "string",
          description:
            "Affiliate source ID or code, for example recAff123 or AMAZON_US_VODKA.",
          validation: (rule) => rule.required().min(2),
        }),
      ],
      description:
        "One or more affiliate source IDs or codes that the front end can resolve to outbound links.",
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error("Buy CTA must include at least one affiliate target."),
    }),
  ],

  preview: {
    select: {
      label: "label",
      subLabel: "subLabel",
      firstTarget: "affiliateTargets.0",
    },
    prepare(selection) {
      const { label, subLabel, firstTarget } = selection as {
        label?: string;
        subLabel?: string;
        firstTarget?: string;
      };

      const title = label || "Buy CTA (compact)";
      const parts: string[] = [];

      if (subLabel) {
        parts.push(subLabel);
      }

      if (firstTarget) {
        parts.push(firstTarget);
      }

      const subtitle =
        parts.length > 0 ? parts.join(" · ") : "Single compact purchase CTA";

      return {
        title,
        subtitle,
      };
    },
  },
});
