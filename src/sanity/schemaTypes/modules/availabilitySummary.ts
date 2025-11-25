import { defineField, defineType } from "sanity";

export default defineType({
  name: "availabilitySummary",
  title: "Availability summary",
  type: "document",

  fields: [
    // Module metadata (Track G 3.4 + Track E 4.1.5)
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

    // Track E 4.1.5 - availabilitySummary
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      description:
        "High-level status, for example inProduction, seasonal, limited, discontinued.",
      validation: (rule) =>
        rule
          .required()
          .min(2)
          .custom((value: string | undefined) => {
            if (!value) return true; // required() already handles empties

            // Guard against pricing or inventory phrasing here.
            const pricingOrInventoryPattern =
              /[$€£]|(?:\b(price|priced|cost)\b)|(?:\b(bottle|bottles|case|cases|units|inventory|stock)\b)/i;

            if (pricingOrInventoryPattern.test(value)) {
              return "Do not include pricing or inventory counts in Availability. Keep this field high level, for example 'In production' or 'Limited release'.";
            }

            return true;
          }),
    }),
    defineField({
      name: "markets",
      title: "Markets",
      type: "array",
      of: [
        defineField({
          name: "market",
          title: "Market",
          type: "string",
          description:
            "Market or region code or label, for example US, Canada, EU.",
        }),
      ],
      description:
        "List of markets or regions where this SKU or market variant is generally available.",
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error("Availability summary must include at least one market."),
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description:
        "Optional clarification, for example that availability can vary by distributor or channel.",
      validation: (rule) =>
        rule.custom((value: string | undefined) => {
          if (!value) return true;

          const pricingOrInventoryPattern =
            /[$€£]|(?:\b(price|priced|cost)\b)|(?:\b(bottle|bottles|case|cases|units|inventory|stock)\b)/i;

          if (pricingOrInventoryPattern.test(value)) {
            return "Do not include pricing or inventory counts in the note. Use this only for qualitative availability context.";
          }

          return true;
        }),
    }),
  ],

  preview: {
    select: {
      availability: "availability",
      markets: "markets",
      slot: "slot",
    },
    prepare(selection) {
      const { availability, markets, slot } = selection as {
        availability?: string;
        markets?: string[];
        slot?: string;
      };

      const firstMarket = markets?.[0];
      const moreCount = markets && markets.length > 1 ? markets.length - 1 : 0;

      const title = availability || "Availability summary";

      const marketPart =
        firstMarket && moreCount > 0
          ? `${firstMarket} +${moreCount} more`
          : firstMarket || "No markets set";

      const slotLabel = slot ? `slot: ${slot}` : undefined;

      const parts = [marketPart, slotLabel].filter(Boolean);
      const subtitle = parts.length > 0 ? parts.join(" · ") : undefined;

      return {
        title,
        subtitle,
      };
    },
  },
});
