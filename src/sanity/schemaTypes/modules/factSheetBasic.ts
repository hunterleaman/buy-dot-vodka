import { defineField, defineType } from "sanity";
import type { SanityDocument, ValidationContext } from "sanity";

type FactSheetBasicItem = {
  label?: string | null;
  value?: string | null;
};

type FactSheetBasicParentDoc = SanityDocument & {
  _type?: string;
};

export default defineType({
  name: "factSheetBasic",
  title: "Fact sheet (basic)",
  type: "document",
  fields: [
    // Global document fields (Anchor A)
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugHistory",
      title: "Slug history",
      type: "array",
      of: [{ type: "slug" }],
      readOnly: true,
      description:
        "Previous slugs for this module. Managed automatically by the custom publish action.",
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "notes",
      description:
        "Internal and public notes for this module. Do not store primary facts or commerce data here.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "status",
    }),
    defineField({
      name: "system",
      title: "System",
      type: "system",
    }),
    defineField({
      name: "relations",
      title: "Relations",
      type: "relations",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "metrics",
    }),

    // Module-specific fields (Track E — 4.1.1 factSheetBasic)
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
          .min(2)
          .custom(
            (
              value: FactSheetBasicItem[] | undefined,
              context: ValidationContext
            ) => {
              if (!value || value.length === 0) {
                // handled by required()
                return true;
              }

              const parent = context.document as
                | FactSheetBasicParentDoc
                | undefined;
              const parentType = parent?._type;

              if (parentType === "producer" || parentType === "brand") {
                const commercePatterns = [
                  /abv/i,
                  /\bproof\b/i,
                  /\bsize\b/i,
                  /\bml\b/i,
                  /\blitre\b/i,
                  /\bliter\b/i,
                  /\bpack\b/i,
                  /\bcase\b/i,
                  /\bprice\b/i,
                  /\bmsrp\b/i,
                  /\bwholesale\b/i,
                  /\bmargin\b/i,
                ];

                const offending = value.find((item) => {
                  const label = item.label ?? "";
                  return commercePatterns.some((pattern) =>
                    pattern.test(label)
                  );
                });

                if (offending) {
                  return "For producers and brands, Fact Sheet (Basic) cannot contain commerce-only facts like ABV, pack sizes, or prices. Move those details to SKU / variant commerce data.";
                }
              }

              // On sku/marketVariant, ABV/size/origin are allowed as display-only;
              // ownership for authoritative values remains with Airtable + core docs.
              return true;
            }
          ),
      description:
        "Compact identity facts (for example ABV, base ingredient, origin). At least two items are required.",
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer",
      type: "string",
      description:
        "Short disclaimer such as “Specs may vary slightly by market.”",
      validation: (rule) => rule.max(160),
    }),
  ],

  preview: {
    select: {
      title: "title",
      firstLabel: "items.0.label",
      firstValue: "items.0.value",
    },
    prepare(selection) {
      const { title, firstLabel, firstValue } = selection as {
        title?: string;
        firstLabel?: string;
        firstValue?: string;
      };

      return {
        title: title || "Fact sheet (basic)",
        subtitle:
          firstLabel && firstValue
            ? `${firstLabel}: ${firstValue}`
            : "Identity snapshot",
      };
    },
  },
});
