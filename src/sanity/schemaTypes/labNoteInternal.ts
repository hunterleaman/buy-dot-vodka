import { defineField, defineType, type SanityDocument } from "sanity";

type LabNoteInternalRelations = {
  sku?: { _ref?: string | undefined } | undefined;
  marketVariant?: { _ref?: string | undefined } | undefined;
  // modules exists globally on relations, but must not be used here
  modules?: { _ref?: string | undefined }[] | undefined;
};

type LabNoteInternalNotes = {
  public?: unknown;
  private?: unknown;
};

type LabNoteInternalSeo = {
  noIndex?: boolean | null;
};

type LabNoteInternalStatus = {
  visibility?: "public" | "private" | "internal";
};

type LabNoteInternalSystem = {
  source?: string | null;
  recId?: string | null;
};

type LabNoteInternalDocument = SanityDocument & {
  title?: string;
  slug?: { current?: string | null } | null;
  slugHistory?: string[] | null;
  body?: unknown;
  notes?: LabNoteInternalNotes | null;
  hero?: unknown;
  images?: unknown[];
  sensory?: {
    aroma?: string | null;
    palate?: string | null;
    finish?: string | null;
    intensity?: number | null;
    length?: number | null;
  } | null;
  sessionDate?: string | null;
  reviewer?: string | null;
  sampleBatch?: string | null;
  sampleSource?: string | null;
  confidence?: "low" | "medium" | "high" | null;
  panelType?: "internalQC" | "editorialDraft" | "comparativePanel" | null;
  relations?: LabNoteInternalRelations | null;
  seo?: LabNoteInternalSeo | null;
  status?: LabNoteInternalStatus | null;
  system?: LabNoteInternalSystem | null;
};

export const labNoteInternal = defineType({
  name: "labNoteInternal",
  title: "Lab note (internal)",
  type: "document",
  initialValue: {
    status: {
      visibility: "private",
    },
    seo: {
      noIndex: true,
    },
  },
  fields: [
    // Global shell
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal label for this lab / QC note.",
      validation: (rule) => rule.required().min(2),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Internal slug for linking and future tooling; never exposed publicly.",
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
        "All previous slugs for this lab note, maintained by the slug history document action.",
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Diagnostic, internal-only narrative. No marketing language or CTAs; see constraints below.",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return "Body is required.";
          if (!Array.isArray(value)) return "Body must be Portable Text.";
          const blocks = value as { _type?: string }[];
          const invalid = blocks.find(
            (block) =>
              block._type === "embedCTA" || block._type === "embedProduct"
          );
          if (invalid) {
            return "Lab notes cannot use embedCTA or embedProduct in body.";
          }
          return true;
        }),
    }),

    // Notes: private only; public notes are disallowed by spec
    defineField({
      name: "notes",
      title: "Notes",
      type: "notes",
      description:
        "Optional internal commentary; do not use public notes for lab notes.",
    }),

    // Optional internal hero and image gallery
    defineField({
      name: "hero",
      title: "Hero image (internal)",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Optional hero image used only for internal UIs.",
    }),

    defineField({
      name: "images",
      title: "Images (internal)",
      type: "array",
      of: [{ type: "image" }],
      description: "Optional supporting images for internal reference only.",
    }),

    // Structured sensory fields (Anchor H compliant scaffolding)
    defineField({
      name: "sensory",
      title: "Sensory",
      type: "object",
      fields: [
        defineField({
          name: "aroma",
          title: "Aroma",
          type: "string",
          description: "Short aroma descriptor from the sensory vocabulary.",
        }),
        defineField({
          name: "palate",
          title: "Palate",
          type: "string",
          description: "Short palate descriptor from the sensory vocabulary.",
        }),
        defineField({
          name: "finish",
          title: "Finish",
          type: "string",
          description: "Short finish descriptor from the sensory vocabulary.",
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
    }),

    // Session / context fields (all Sanity-owned)
    defineField({
      name: "sessionDate",
      title: "Session date",
      type: "date",
      description: "Date this sample was evaluated.",
    }),

    defineField({
      name: "reviewer",
      title: "Reviewer",
      type: "string",
      description: "Name or initials of the primary reviewer.",
    }),

    defineField({
      name: "sampleBatch",
      title: "Sample batch",
      type: "string",
      description: "Batch identifier or lot code for this sample.",
    }),

    defineField({
      name: "sampleSource",
      title: "Sample source",
      type: "string",
      description:
        "Where the sample came from, e.g. productionBatch, marketBottle, experimentalBlend.",
    }),

    defineField({
      name: "confidence",
      title: "Confidence",
      type: "string",
      options: {
        list: [
          { title: "Low", value: "low" },
          { title: "Medium", value: "medium" },
          { title: "High", value: "high" },
        ],
        layout: "radio",
      },
      description: "Reviewer confidence in this evaluation.",
    }),

    defineField({
      name: "panelType",
      title: "Panel type",
      type: "string",
      options: {
        list: [
          { title: "Internal QC", value: "internalQC" },
          { title: "Editorial draft", value: "editorialDraft" },
          { title: "Comparative panel", value: "comparativePanel" },
        ],
      },
      description: "What kind of internal session this note comes from.",
    }),

    // Relations: exactly one of sku or marketVariant
    defineField({
      name: "relations",
      title: "Relations",
      type: "relations",
      description:
        "Parent SKU or Variant for this lab note. Exactly one is required.",
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "SEO metadata; lab notes must always be no-indexed.",
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "status",
      description: "Editorial status; lab notes are always private.",
    }),

    defineField({
      name: "system",
      title: "System",
      type: "system",
      description: "System-level provenance; Sanity-native for lab notes.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      sessionDate: "sessionDate",
      sku: "relations.sku._ref",
      variant: "relations.marketVariant._ref",
    },
    prepare(selection: {
      title?: string;
      sessionDate?: string;
      sku?: string;
      variant?: string;
    }) {
      const { title, sessionDate, sku, variant } = selection;
      const parts: string[] = [];

      if (sessionDate) parts.push(sessionDate);
      if (sku) parts.push(`SKU: ${sku}`);
      if (variant) parts.push(`Variant: ${variant}`);

      return {
        title: title ?? "Lab note (internal)",
        subtitle: parts.join(" • ") || "Internal QC / R&D note",
      };
    },
  },

  validation: (rule) =>
    rule.custom((value: SanityDocument | undefined) => {
      const doc = value as LabNoteInternalDocument | undefined;
      if (!doc) return true;

      // Required global fields
      if (!doc.title) {
        return "Title is required.";
      }

      if (!doc.slug?.current) {
        return "Slug is required.";
      }

      if (!doc.body) {
        return "Body is required.";
      }

      if (!doc.system?.source) {
        return "system.source is required for labNoteInternal.";
      }

      if (!doc.system.recId) {
        return "system.recId is required for labNoteInternal.";
      }

      // Visibility and index constraints
      if (!doc.status) {
        return "Status is required.";
      }

      if (doc.status.visibility !== "private") {
        return 'labNoteInternal must always have visibility set to "private".';
      }

      if (!doc.seo?.noIndex) {
        return "labNoteInternal must always be no-indexed (seo.noIndex = true).";
      }

      // Relations: exactly one parent SKU or Variant
      const relations = doc.relations;
      const hasSku = Boolean(relations?.sku?._ref);
      const hasVariant = Boolean(relations?.marketVariant?._ref);
      if (hasSku === hasVariant) {
        return "Exactly one of relations.sku or relations.marketVariant is required.";
      }

      // Disallow notes.public usage
      if (doc.notes && typeof doc.notes.public !== "undefined") {
        return "notes.public is not allowed on labNoteInternal; use notes.private or body instead.";
      }

      // Disallow modules on relations for this type
      if (relations?.modules && relations.modules.length > 0) {
        return "relations.modules must not be used on labNoteInternal.";
      }

      // Enforce PT constraints on notes.private (no embedCTA or embedProduct)
      if (doc.notes?.private && Array.isArray(doc.notes.private)) {
        const blocks = doc.notes.private as { _type?: string }[];
        const invalid = blocks.find(
          (block) =>
            block._type === "embedCTA" || block._type === "embedProduct"
        );
        if (invalid) {
          return "notes.private on labNoteInternal cannot use embedCTA or embedProduct.";
        }
      }

      return true;
    }),
});

export default labNoteInternal;
