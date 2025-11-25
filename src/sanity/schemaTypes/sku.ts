import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

type SkuValidationDoc = {
  status?: {
    visibility?: "public" | "private" | "embargo";
    archived?: boolean | null;
  };
  relations?: {
    brand?: { _ref?: string | null } | null;
    producer?: { _ref?: string | null } | null;
  } | null;
  title?: string | null;
  slug?: {
    current?: string | null;
  } | null;
  description?: string | null;
  hero?: unknown;
  body?: unknown;
  skuCode?: string | null;
  abv?: number | null;
  primarySizeMl?: number | null;
  country?: string | null;
  notes?: Record<string, unknown> | null;
};

const sku = defineType({
  name: "sku",
  title: "SKU",
  type: "document",
  fields: [
    //
    // Core identity (Sanity-owned)
    //
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Canonical product name for this SKU.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "URL path segment for this SKU. Generated from the title but may be edited.",
      options: {
        source: "title",
        maxLength: 96,
        // isUnique wired via slugHelpers.ts in utilities step.
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugHistory",
      title: "Slug history",
      type: "array",
      description:
        "Historical slugs for this SKU used for redirects and analytics.",
      of: [{ type: "slug" }],
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "string",
      description:
        "120–160 character summary used in listings and as a baseline for SEO copy.",
      validation: (rule) =>
        rule
          .required()
          .max(240)
          .warning(
            "Descriptions longer than ~160 characters may be truncated in some UIs."
          ),
    }),

    //
    // Hero + imagery (Sanity-owned)
    //
    defineField({
      name: "hero",
      title: "Hero image",
      type: "image",
      description:
        "Primary hero image for this SKU, used above the fold on the product page.",
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
      // Presence for public SKUs is enforced at the document level.
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
        "Supporting imagery for this SKU. The first image may be used as a default thumbnail.",
    }),

    //
    // Narrative fields (Sanity-owned)
    //
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Primary narrative for this SKU. Full product story, structured with h2 sections.",
      validation: (rule) =>
        rule.custom((blocks) => {
          if (!Array.isArray(blocks) || blocks.length === 0) {
            return "Body is required.";
          }
          return true;
        }),
    }),
    defineField({
      name: "tastingNotes",
      title: "Tasting notes",
      type: "blockContent",
      description:
        "Structured tasting narrative covering aroma, palate, finish, and other sensory notes.",
    }),
    defineField({
      name: "editorialSummary",
      title: "Editorial summary",
      type: "string",
      description:
        "Short editorial blurb used in cards, modules, and search highlights.",
    }),
    defineField({
      name: "storyHooks",
      title: "Story hooks",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Optional short hooks or angles used to generate snippets and headlines.",
    }),

    //
    // Airtable commercial fields (readOnly)
    // Identity and catalog
    //
    defineField({
      name: "skuCode",
      title: "SKU code",
      type: "string",
      description: "Canonical SKU identifier from Airtable. Immutable.",
      readOnly: true,
    }),
    defineField({
      name: "upc",
      title: "UPC",
      type: "string",
      description: "Primary UPC for the base configuration.",
      readOnly: true,
    }),
    defineField({
      name: "gtin",
      title: "GTIN",
      type: "string",
      description: "GTIN for the base configuration.",
      readOnly: true,
    }),
    defineField({
      name: "alternateCodes",
      title: "Alternate codes",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Additional codes used in channel systems, if any (Airtable-owned).",
      readOnly: true,
    }),
    defineField({
      name: "isDiscontinued",
      title: "Is discontinued",
      type: "boolean",
      description: "True if SKU is discontinued in Airtable.",
      readOnly: true,
    }),

    //
    // Liquid specs (Airtable-owned)
    //
    defineField({
      name: "abv",
      title: "ABV (%)",
      type: "number",
      description: "Alcohol by volume as a percentage.",
      readOnly: true,
    }),
    defineField({
      name: "proof",
      title: "Proof",
      type: "number",
      description: "Proof value for this SKU.",
      readOnly: true,
    }),
    defineField({
      name: "distillateBase",
      title: "Distillate base",
      type: "string",
      description:
        "Base material, for example grain, potato, grape, sugarcane, mixed, or other.",
      readOnly: true,
    }),
    defineField({
      name: "distillationMethod",
      title: "Distillation method",
      type: "string",
      description:
        "Distillation method, freeform or aligned to a controlled vocabulary in Airtable.",
      readOnly: true,
    }),
    defineField({
      name: "filtrationMethod",
      title: "Filtration method",
      type: "string",
      description:
        "Filtration method, freeform or aligned to a controlled vocabulary in Airtable.",
      readOnly: true,
    }),
    defineField({
      name: "flavored",
      title: "Flavored",
      type: "boolean",
      description: "True if SKU is flavored.",
      readOnly: true,
    }),
    defineField({
      name: "additivesPresent",
      title: "Additives present",
      type: "boolean",
      description: "True if any additives are present per Airtable catalog.",
      readOnly: true,
    }),

    //
    // Production and origin (Airtable-owned)
    //
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description: "Country name or code for this SKU’s origin.",
      readOnly: true,
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      description:
        "Freeform origin region string, such as “Midwest”, “Scandinavia”.",
      readOnly: true,
    }),
    defineField({
      name: "bottlingLocation",
      title: "Bottling location",
      type: "string",
      description: "Freeform bottling location string.",
      readOnly: true,
    }),
    defineField({
      name: "producerRecId",
      title: "Producer recId",
      type: "string",
      description: "Airtable Producer recId associated with this SKU.",
      readOnly: true,
    }),
    defineField({
      name: "brandRecId",
      title: "Brand recId",
      type: "string",
      description: "Airtable Brand recId associated with this SKU.",
      readOnly: true,
    }),

    //
    // Packaging (Airtable-owned)
    //
    defineField({
      name: "primarySizeMl",
      title: "Primary size (ml)",
      type: "number",
      description: "Base bottle size in milliliters.",
      readOnly: true,
    }),
    defineField({
      name: "casePack",
      title: "Case pack",
      type: "number",
      description: "Number of bottles per case.",
      readOnly: true,
    }),
    defineField({
      name: "containerType",
      title: "Container type",
      type: "string",
      description: "Container material, for example glass, PET, or other.",
      options: {
        list: [
          { title: "Glass", value: "glass" },
          { title: "PET", value: "PET" },
          { title: "Other", value: "other" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "closureType",
      title: "Closure type",
      type: "string",
      description: "Closure type, for example cork, screwcap, or other.",
      options: {
        list: [
          { title: "Cork", value: "cork" },
          { title: "Screwcap", value: "screwcap" },
          { title: "Other", value: "other" },
        ],
      },
      readOnly: true,
    }),

    //
    // Commerce (Airtable-owned)
    //
    defineField({
      name: "cost",
      title: "Cost",
      type: "number",
      description: "Base cost in the native catalog currency.",
      readOnly: true,
    }),
    defineField({
      name: "wholesalePrice",
      title: "Wholesale price",
      type: "number",
      description: "Wholesale price in the native catalog currency.",
      readOnly: true,
    }),
    defineField({
      name: "msrp",
      title: "MSRP",
      type: "number",
      description: "Suggested retail price in the native catalog currency.",
      readOnly: true,
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      description:
        "High-level availability status for this SKU, sourced from Airtable.",
      options: {
        list: [
          { title: "In production", value: "inProduction" },
          { title: "Seasonal", value: "seasonal" },
          { title: "Limited", value: "limited" },
          { title: "Discontinued", value: "discontinued" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "distributorFlags",
      title: "Distributor flags",
      type: "array",
      of: [{ type: "string" }],
      description: "Channel codes and flags from distributor data.",
      readOnly: true,
    }),
    defineField({
      name: "affiliateSourceRecIds",
      title: "Affiliate source recIds",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Airtable AffiliateSource recIds associated with this SKU for affiliate tracking.",
      readOnly: true,
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
        "Brand, producer, variants, topics, guides, authors, and modules associated with this SKU.",
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
      const doc = value as SkuValidationDoc | undefined;
      if (!doc) return true;

      const visibility = doc.status?.visibility;
      const archived = doc.status?.archived;
      const isPublic = visibility === "public" && archived !== true;

      if (!isPublic) {
        return true;
      }

      const missing: string[] = [];

      // Required editorial basics
      if (!doc.title) missing.push("title");
      if (!doc.slug || !doc.slug.current) missing.push("slug");
      if (!doc.description) missing.push("description");
      if (!doc.hero) missing.push("hero");
      if (!Array.isArray(doc.body) || doc.body.length === 0) {
        missing.push("body");
      }

      // Relations: brand + producer required
      if (!doc.relations?.brand?._ref) {
        missing.push("relations.brand");
      }
      if (!doc.relations?.producer?._ref) {
        missing.push("relations.producer");
      }

      // Minimal Airtable commerce fact set
      if (!doc.skuCode) missing.push("skuCode");
      if (typeof doc.abv !== "number") missing.push("abv");
      if (typeof doc.primarySizeMl !== "number") missing.push("primarySizeMl");
      if (!doc.country) missing.push("country");

      if (missing.length > 0) {
        return `Missing required fields for a public SKU: ${missing.join(
          ", "
        )}`;
      }

      // At least one h2 in body
      const hasH2 =
        Array.isArray(doc.body) &&
        doc.body.some(
          (block) => block?._type === "block" && block.style === "h2"
        );

      if (!hasH2) {
        return "SKU body must contain at least one h2 section.";
      }

      // Notes cannot be an empty object when present (Track C).
      // Our notes object always has public/private arrays, so we only guard
      // against the truly empty-object case that might appear during migration.
      if (doc.notes && Object.keys(doc.notes).length === 0) {
        return "Notes cannot be an empty object when present.";
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

export default sku;
