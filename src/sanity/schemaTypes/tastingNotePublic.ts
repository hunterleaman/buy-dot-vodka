import { defineField, defineType, type SanityDocument } from "sanity";

type TastingNotePublicRelations = {
  sku?: { _ref?: string | undefined } | undefined;
  marketVariant?: { _ref?: string | undefined } | undefined;
};

type TastingNotePublicNotes = {
  public?: unknown;
  private?: unknown;
};

type TastingNotePublicSeo = {
  noIndex?: boolean | null;
};

type TastingNotePublicStatus = {
  visibility?: "public" | "private" | "internal";
};

type TastingNotePublicSystem = {
  source?: string | null;
  recId?: string | null;
};

type TastingNotePublicSensory = {
  aroma?: string | null;
  palate?: string | null;
  finish?: string | null;
  intensity?: number | null;
  length?: number | null;
};

type TastingContext =
  | "canonical"
  | "variantSpecific"
  | "limitedEdition"
  | "editorialSingleServe";

type TastingNotePublicDocument = SanityDocument & {
  title?: string;
  slug?: { current?: string | null } | null;
  slugHistory?: string[] | null;
  description?: string | null;
  body?: unknown;
  hero?: unknown;
  images?: unknown[];
  sensory?: TastingNotePublicSensory | null;
  tastingContext?: TastingContext | null;
  notes?: TastingNotePublicNotes | null;
  relations?: TastingNotePublicRelations | null;
  seo?: TastingNotePublicSeo | null;
  status?: TastingNotePublicStatus | null;
  system?: TastingNotePublicSystem | null;
};

export const tastingNotePublic = defineType({
  name: "tastingNotePublic",
  title: "Tasting note (public)",
  type: "document",
  initialValue: {
    tastingContext: "canonical" as TastingContext,
  },
  fields: [
    // Global shell
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "Public-facing label for this tasting note, usually SKU-level.",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Slug for linking and tooling; canonical URL remains the SKU page.",
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
      of: [{ type: "string" }],
      readOnly: true,
      description:
        "All previous slugs for this tasting note, maintained via the slug history document action.",
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      description:
        "120–160 character summary for search and social snippets (max 240 characters).",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Editorial tasting narrative. Uses full PT spec, including images, callouts, and (sparingly) CTAs or product embeds.",
      validation: (rule) => rule.required(),
    }),

    // Optional hero + gallery for narrative layouts
    defineField({
      name: "hero",
      title: "Hero image",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Optional hero image for the tasting note section on SKU/Variant pages.",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
      description:
        "Optional supporting images used in galleries or inline with the tasting narrative.",
    }),

    // Structured sensory (Anchor H)
    defineField({
      name: "sensory",
      title: "Sensory",
      type: "object",
      fields: [
        defineField({
          name: "aroma",
          title: "Aroma",
          type: "string",
          description:
            "Short aroma descriptor from the shared sensory vocabulary.",
        }),
        defineField({
          name: "palate",
          title: "Palate",
          type: "string",
          description:
            "Short palate descriptor from the shared sensory vocabulary.",
        }),
        defineField({
          name: "finish",
          title: "Finish",
          type: "string",
          description:
            "Short finish descriptor from the shared sensory vocabulary.",
        }),
        defineField({
          name: "intensity",
          title: "Intensity",
          type: "number",
          description: "Overall intensity using the Anchor H numeric scale.",
        }),
        defineField({
          name: "length",
          title: "Length",
          type: "number",
          description: "Finish length using the Anchor H numeric scale.",
        }),
      ],
      description:
        "Optional structured sensory scaffolding; complements, but does not replace, the narrative body.",
    }),

    // Context of this tasting note
    defineField({
      name: "tastingContext",
      title: "Tasting context",
      type: "string",
      options: {
        list: [
          { title: "Canonical (SKU)", value: "canonical" },
          { title: "Variant-specific", value: "variantSpecific" },
          { title: "Limited edition", value: "limitedEdition" },
          { title: "Editorial single serve", value: "editorialSingleServe" },
        ],
        layout: "radio",
      },
      description:
        "Clarifies whether this is the canonical SKU note or a more specific editorial context.",
    }),

    // Notes (public + private)
    defineField({
      name: "notes",
      title: "Notes",
      type: "notes",
      description:
        "Optional annotation system. Public notes may surface inline; private notes are editorial-only.",
    }),

    // Relations: SKU or Variant + modules
    defineField({
      name: "relations",
      title: "Relations",
      type: "relations",
      description:
        "Exactly one parent SKU or Variant is required. Modules attach via relations.modules, per Track E.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description:
        "SEO metadata for the tasting note section. Must respect the parent SKU/Variant noIndex behavior.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "status",
      description:
        "Editorial status and visibility. Public tasting notes typically use visibility=public when live.",
    }),
    defineField({
      name: "system",
      title: "System",
      type: "system",
      description:
        "System-level provenance (source, recId, timestamps). Typically Sanity-native for tasting notes.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      context: "tastingContext",
      sku: "relations.sku._ref",
      variant: "relations.marketVariant._ref",
    },
    prepare(selection: {
      title?: string;
      context?: TastingContext;
      sku?: string;
      variant?: string;
    }) {
      const { title, context, sku, variant } = selection;
      const parts: string[] = [];

      if (context === "canonical") {
        parts.push("Canonical");
      } else if (context === "variantSpecific") {
        parts.push("Variant-specific");
      } else if (context === "limitedEdition") {
        parts.push("Limited edition");
      } else if (context === "editorialSingleServe") {
        parts.push("Single-serve editorial");
      }

      if (sku) parts.push(`SKU: ${sku}`);
      if (variant) parts.push(`Variant: ${variant}`);

      return {
        title: title ?? "Tasting note",
        subtitle: parts.join(" • ") || "Public tasting narrative",
      };
    },
  },

  validation: (rule) =>
    rule.custom((value: SanityDocument | undefined) => {
      const doc = value as TastingNotePublicDocument | undefined;
      if (!doc) return true;

      // Required global fields
      if (!doc.title) {
        return "Title is required.";
      }

      if (!doc.slug?.current) {
        return "Slug is required.";
      }

      if (!doc.description) {
        return "Short description is required.";
      }

      if (!doc.body) {
        return "Body is required.";
      }

      if (!doc.system?.source) {
        return "system.source is required for tastingNotePublic.";
      }

      if (!doc.system.recId) {
        return "system.recId is required for tastingNotePublic.";
      }

      if (!doc.status) {
        return "Status is required.";
      }

      if (!doc.seo) {
        return "SEO is required.";
      }

      // Relations: exactly one parent SKU or Variant
      const relations = doc.relations;
      const hasSku = Boolean(relations?.sku?._ref);
      const hasVariant = Boolean(relations?.marketVariant?._ref);
      if (hasSku === hasVariant) {
        return "Exactly one of relations.sku or relations.marketVariant is required.";
      }

      // SEO behavior: schema cannot see parent, but we at least ensure noIndex is explicitly set.
      if (typeof doc.seo.noIndex === "undefined") {
        return "seo.noIndex must be explicitly set to true or false for tastingNotePublic.";
      }

      return true;
    }),
});

export default tastingNotePublic;
