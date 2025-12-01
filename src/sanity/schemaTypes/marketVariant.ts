import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";
import type { DocumentWithSystemSource } from "@/src/sanity/types";
import { isAirtableOwned } from "@/src/sanity/lib/ownershipMaps";
import { normalizeSlug } from "@/src/sanity/lib/slugHelpers";

type MarketVariantValidationDoc = {
  status?: {
    visibility?: "public" | "private" | "embargo";
    archived?: boolean | null;
  };
  relations?: {
    sku?: { _ref?: string | null } | null;
  };
  title?: string | null;
  slug?: { current?: string | null } | null;
  description?: string | null;
  market?: string | null;
  sizeMl?: number | null;
  availability?: string | null;
  body?: unknown;
};

const marketVariant = defineType({
  name: "marketVariant",
  title: "Market variant",
  type: "document",
  fields: [
    //
    // Core identity (Sanity-owned global fields)
    //
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Canonical display name for this market-specific variant.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "URL path segment for this variant. Usually based on SKU name + size + market.",
      options: {
        source: "title",
        maxLength: 96,
        // isUnique will be wired via slugHelpers.ts.
        slugify: (input: string) => normalizeSlug(input),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugHistory",
      title: "Slug history",
      type: "array",
      description:
        "Historical slugs for this variant used for redirects and analytics.",
      of: [{ type: "slug" }],
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "string",
      description:
        "Short description of this specific format and market usage, used in variant lists and cards.",
      validation: (rule) =>
        rule
          .required()
          .max(240)
          .warning(
            "Descriptions longer than ~160 characters may be truncated in some UIs."
          ),
    }),

    //
    // Hero + imagery (Sanity-owned; optional, falls back to SKU)
    //
    defineField({
      name: "hero",
      title: "Hero image",
      type: "image",
      description:
        "Optional hero override for this variant. If omitted, SKU hero is used.",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Accessible description of the hero image.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Accessible description of the image.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
      description:
        "Supporting imagery specific to this variant (for example, gift set packaging).",
    }),

    //
    // Sanity narrative fields (Track C 5.2.4)
    //
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Minimal PT narrative. Variant level description or stub that sits under the SKU story.",
      validation: (rule) =>
        rule.custom((blocks) => {
          if (!Array.isArray(blocks) || blocks.length === 0) {
            return "Body is required.";
          }
          return true;
        }),
    }),
    defineField({
      name: "variantIntro",
      title: "Variant intro",
      type: "blockContent",
      description:
        "Short PT context on this format, usage, or market. Often a one or two paragraph intro.",
    }),
    defineField({
      name: "variantNotes",
      title: "Variant notes",
      type: "blockContent",
      description:
        "PT describing any sensory or packaging differences versus the base SKU.",
    }),
    defineField({
      name: "limitedReleaseStory",
      title: "Limited release story",
      type: "blockContent",
      description:
        "Deeper PT narrative for limited releases or commemorative editions.",
    }),

    //
    // Airtable commercial fields (Track C 5.2.3) — always readOnly
    //
    // Identity and market
    defineField({
      name: "variantCode",
      title: "Variant code",
      type: "string",
      description: "Canonical variant identifier from Airtable.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.variantCode")
        );
      },
    }),
    defineField({
      name: "upc",
      title: "UPC",
      type: "string",
      description: "Variant-level UPC for this format.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.upc")
        );
      },
    }),
    defineField({
      name: "gtin",
      title: "GTIN",
      type: "string",
      description: "Variant-level GTIN for this format.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.gtin")
        );
      },
    }),
    defineField({
      name: "market",
      title: "Market",
      type: "string",
      description:
        "Region or market label for this variant (for example, US, EU, UK, JP).",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.market")
        );
      },
    }),
    defineField({
      name: "isLimitedRelease",
      title: "Is limited release",
      type: "boolean",
      description:
        "True if this variant is a limited or commemorative release.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.isLimitedRelease")
        );
      },
    }),

    // Packaging and format
    defineField({
      name: "sizeMl",
      title: "Size (ml)",
      type: "number",
      description: "Bottle size in milliliters for this variant.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.sizeMl")
        );
      },
    }),
    defineField({
      name: "packType",
      title: "Pack type",
      type: "string",
      description:
        "Pack configuration such as single, two pack, six pack, gift set, or holiday set.",
      options: {
        list: [
          { title: "Single", value: "single" },
          { title: "Two pack", value: "twoPack" },
          { title: "Six pack", value: "sixPack" },
          { title: "Gift set", value: "giftSet" },
          { title: "Holiday set", value: "holidaySet" },
          { title: "Other", value: "other" },
        ],
      },
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.packType")
        );
      },
    }),
    defineField({
      name: "labelColorway",
      title: "Label colorway",
      type: "string",
      description:
        "Colorway identifier used for this variant’s label or packaging (for example, blue-silver).",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.labelColorway")
        );
      },
    }),

    // Liquid overrides and batch
    defineField({
      name: "abv",
      title: "ABV (%) override",
      type: "number",
      description:
        "Alcohol by volume at the variant level. If empty, falls back to SKU ABV at read time.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.abv")
        );
      },
    }),
    defineField({
      name: "proof",
      title: "Proof override",
      type: "number",
      description:
        "Proof at the variant level. If empty, falls back to SKU proof at read time.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.proof")
        );
      },
    }),
    defineField({
      name: "distillateBase",
      title: "Distillate base override",
      type: "string",
      description:
        "Optional override of the SKU distillate base for this variant, if different.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.distillateBase")
        );
      },
    }),
    defineField({
      name: "flavored",
      title: "Flavored override",
      type: "boolean",
      description:
        "Optional override of the SKU flavored flag for this variant, if different.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.flavored")
        );
      },
    }),
    defineField({
      name: "batchName",
      title: "Batch name",
      type: "string",
      description: "Optional batch name for this variant.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.batchName")
        );
      },
    }),
    defineField({
      name: "batchNumber",
      title: "Batch number",
      type: "string",
      description: "Optional batch number for this variant.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.batchNumber")
        );
      },
    }),

    // Commerce
    defineField({
      name: "cost",
      title: "Cost",
      type: "number",
      description: "Variant-level cost in the native catalog currency.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.cost")
        );
      },
    }),
    defineField({
      name: "wholesalePrice",
      title: "Wholesale price",
      type: "number",
      description:
        "Variant-level wholesale price in the native catalog currency.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.wholesalePrice")
        );
      },
    }),
    defineField({
      name: "msrp",
      title: "MSRP",
      type: "number",
      description:
        "Variant-level suggested retail price in the native catalog currency.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.msrp")
        );
      },
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      description: "High-level availability status for this variant.",
      options: {
        list: [
          { title: "In production", value: "inProduction" },
          { title: "Seasonal", value: "seasonal" },
          { title: "Limited", value: "limited" },
          { title: "Discontinued", value: "discontinued" },
        ],
      },
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.availability")
        );
      },
    }),
    defineField({
      name: "distributorFlags",
      title: "Distributor flags",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Channel codes and flags from distributor data scoped to this variant.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.distributorFlags")
        );
      },
    }),
    defineField({
      name: "affiliateSourceRecIds",
      title: "Affiliate source recIds",
      type: "array",
      of: [{ type: "string" }],
      description:
        "AffiliateSource recIds associated with this variant for affiliate tracking.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("marketVariant.affiliateSourceRecIds")
        );
      },
    }),

    //
    // Global objects
    //
    defineField({
      name: "notes",
      title: "Notes",
      type: "notes",
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
      description:
        "SKU, related variants, topics, resources, authors, and modules associated with this variant.",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "metrics",
    }),
  ],

  //
  // Document-level validation (Track C + Track G)
  //
  validation: (rule) =>
    rule.custom((value: SanityDocument | undefined) => {
      const doc = value as MarketVariantValidationDoc | undefined;
      if (!doc) return true;

      const visibility = doc.status?.visibility;
      const archived = doc.status?.archived ?? false;
      const isPublic = visibility === "public" && !archived;

      if (!isPublic) {
        return true;
      }

      const missing: string[] = [];

      // Required editorial basics
      if (!doc.title) missing.push("title");
      if (!doc.slug || !doc.slug.current) missing.push("slug");
      if (!doc.description) missing.push("description");
      if (!doc.body || !Array.isArray(doc.body as unknown[])) {
        missing.push("body");
      }

      // Relations: SKU is required for public variants
      if (!doc.relations?.sku?._ref) {
        missing.push("relations.sku");
      }

      // Minimal commercial fact set at the variant level
      if (!doc.market) missing.push("market");
      if (typeof doc.sizeMl !== "number") missing.push("sizeMl");
      if (!doc.availability) missing.push("availability");

      if (missing.length > 0) {
        return `Missing required fields for a public MarketVariant: ${missing.join(
          ", "
        )}`;
      }

      return true;
    }),

  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "hero",
    },
  },
});

export default marketVariant;
