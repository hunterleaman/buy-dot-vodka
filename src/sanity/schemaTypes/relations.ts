import { defineField, defineType } from "sanity";

const relations = defineType({
  name: "relations",
  title: "Relations",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    // Single identity pointers
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      description:
        "Canonical brand for this document (for example SKU or MarketVariant).",
    }),
    defineField({
      name: "producer",
      title: "Producer",
      type: "reference",
      to: [{ type: "producer" }],
      description: "Canonical producer for this document.",
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "reference",
      to: [{ type: "sku" }],
      description:
        "Canonical SKU relationship (required for MarketVariants; used by tasting notes and lab notes).",
    }),
    defineField({
      name: "marketVariant",
      title: "Market variant",
      type: "reference",
      to: [{ type: "marketVariant" }],
      description:
        "Canonical MarketVariant relationship (used by tasting notes and lab notes).",
    }),

    // Multi-entity narrative pointers
    defineField({
      name: "brands",
      title: "Brands",
      type: "array",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
      description:
        "Narrative brand references (for example on Producer, Guide, Topic, Resource, Author).",
    }),
    defineField({
      name: "producers",
      title: "Producers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "producer" }] }],
      description:
        "Narrative producer references (for example on Guide, Topic, Resource, Author).",
    }),
    defineField({
      name: "skus",
      title: "SKUs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "sku" }] }],
      description:
        "Narrative SKU references (for example on Brand or guides/topics). Commerce facts stay in SKU documents.",
    }),
    defineField({
      name: "marketVariants",
      title: "Market variants",
      type: "array",
      of: [{ type: "reference", to: [{ type: "marketVariant" }] }],
      description:
        "Narrative MarketVariant references; commercial facts remain on MarketVariant documents.",
    }),
    defineField({
      name: "relatedVariants",
      title: "Related variants",
      type: "array",
      of: [{ type: "reference", to: [{ type: "marketVariant" }] }],
      description:
        "Sibling or closely related MarketVariants for navigation and comparison.",
    }),

    // Topical graph
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [{ type: "reference", to: [{ type: "topic" }] }],
      description:
        "Topical graph for Guides, Brands, Resources, and other narrative docs.",
    }),
    defineField({
      name: "guides",
      title: "Guides",
      type: "array",
      of: [{ type: "reference", to: [{ type: "guide" }] }],
      description:
        "Guide documents that relate to this entity (for example Topics, Resources, SKUs).",
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [{ type: "reference", to: [{ type: "resource" }] }],
      description:
        "Regulations, papers, datasets, and external sources cited by this document.",
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "author" }] }],
      description: "Editorial authors responsible for this document.",
    }),

    // Modules: global module library (Track E)
    defineField({
      name: "modules",
      title: "Modules",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            { type: "aromaPalateFinishBreakdown" },
            { type: "authorCard" },
            { type: "availabilitySummary" },
            { type: "buyCtaCompact" },
            { type: "citationModule" },
            { type: "factSheetBasic" },
            { type: "factSheetExtended" },
            { type: "galleryModule" },
            { type: "glossaryPanel" },
            { type: "inlineInfobox" },
            { type: "producerProcessMatrixSummary" },
            { type: "producerProcessOverview" },
            { type: "regulatoryFlags" },
            { type: "relatedBrands" },
            { type: "relatedGuides" },
            { type: "relatedResources" },
            { type: "relatedTopics" },
            { type: "servingSuggestions" },
            { type: "siblingSkus" },
            { type: "siblingVariants" },
            { type: "socialLinksCard" },
            { type: "stageInfobox" },
            { type: "storyHighlight" },
            { type: "tastingSummaryPublic" },
            { type: "timelineModule" },
            { type: "whereToBuyGuide" },
          ],
        },
      ],
      description:
        "Sidebar and inline modules attached to this document. Placement, priority, and exclusivity rules are enforced per doc type (Track E).",
    }),
  ],
  validation: (rule) =>
    rule.custom((value, context) => {
      if (!value) return true;

      const docType = context?.document?._type as string | undefined;

      // Track D/G: labNoteInternal and tastingNotePublic must point to
      // exactly one SKU or one MarketVariant, not both and not neither.
      if (docType === "labNoteInternal" || docType === "tastingNotePublic") {
        const hasSku = Boolean(value.sku);
        const hasVariant = Boolean(value.marketVariant);

        if (hasSku === hasVariant) {
          return "Exactly one of relations.sku or relations.marketVariant is required for this document.";
        }
      }

      return true;
    }),
});

export default relations;
