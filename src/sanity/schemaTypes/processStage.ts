import {
  defineField,
  defineType,
  type SanityDocument,
  type ValidationContext,
} from "sanity";
import type { DocumentWithSystemSource } from "@/src/sanity/types";
import { isAirtableOwned } from "@/src/sanity/lib/ownershipMaps";
import { normalizeSlug } from "@/src/sanity/lib/slugHelpers";

type ProcessStageSystem = {
  source?: string | null;
  recId?: string | null;
};

type ProcessStageDocument = SanityDocument & {
  title?: string;
  description?: string | null;
  stageCode?: string | null;
  stageCategory?: string | null;
  stageSubcategory?: string | null;
  isCoreStage?: boolean | null;
  stageOrder?: number | null;
  parentStage?: { _ref?: string } | null;
  taxonomyTags?: string[] | null;
  technicalShortNotes?: string | null;
  isDeprecated?: boolean | null;
  system?: ProcessStageSystem | null;
};

// Ownership checks use the shared ownership map; readOnly callbacks below
// follow the conditional pattern used in `sku.ts`.

export const processStage = defineType({
  name: "processStage",
  title: "Process stage",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Canonical, category-neutral name of the stage.",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Stable slug for internal linking and URLs where needed.",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) => normalizeSlug(input),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugHistory",
      title: "Slug history",
      type: "array",
      description:
        "All previous slugs for this stage, maintained via document actions.",
      of: [{ type: "string" }],
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("processStage.slugHistory")
        );
      },
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      description:
        "120–160 chars preferred, max 240. Category-neutral summary.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Optional longer explanation and editorial context for the stage.",
    }),

    // Structured process taxonomy (Airtable-owned when system.source === "airtable")
    defineField({
      name: "stageCode",
      title: "Stage code",
      type: "string",
      description: "Canonical identifier used by Airtable and integrations.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("processStage.stageCode")
        );
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stageCategory",
      title: "Stage category",
      type: "string",
      description: "High-level, category-neutral bucket for this stage.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("processStage.stageCategory")
        );
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stageSubcategory",
      title: "Stage subcategory",
      type: "string",
      description: "More specific grouping within the stage category.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("processStage.stageSubcategory")
        );
      },
    }),
    defineField({
      name: "isCoreStage",
      title: "Core stage",
      type: "boolean",
      description: "Marks stages that are core in most process graphs.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("processStage.isCoreStage")
        );
      },
    }),
    defineField({
      name: "stageOrder",
      title: "Global ordering hint",
      type: "number",
      description:
        "Optional global sequence hint used for sorting stage lists (positive integer).",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("processStage.stageOrder")
        );
      },
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: "parentStage",
      title: "Parent stage",
      type: "reference",
      to: [{ type: "processStage" }],
      description: "Optional parent for hierarchical taxonomies of stages.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("processStage.parentStage")
        );
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const ctx = context as ValidationContext;
          const doc = ctx.document as ProcessStageDocument | undefined;
          if (!value || !doc?._id) return true;

          const ref = (value as { _ref?: string })._ref;
          if (ref && ref === doc._id) {
            return "Parent stage cannot reference itself.";
          }

          return true;
        }),
    }),
    defineField({
      name: "taxonomyTags",
      title: "Taxonomy tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Optional tags for grouping and faceting in UIs.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("processStage.taxonomyTags")
        );
      },
    }),
    defineField({
      name: "technicalShortNotes",
      title: "Technical short notes",
      type: "string",
      description:
        "Very short technical annotation (single line, no formatting).",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("processStage.technicalShortNotes")
        );
      },
    }),
    defineField({
      name: "isDeprecated",
      title: "Deprecated stage",
      type: "boolean",
      description: "Marks stages that should not be used going forward.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("processStage.isDeprecated")
        );
      },
    }),

    // Global objects (Sanity-owned editorial layer)
    defineField({
      name: "notes",
      title: "Notes",
      type: "notes",
      description: "Public and private notes about this stage definition.",
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
      description: "Sync provenance and Airtable identifiers.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      category: "stageCategory",
      code: "stageCode",
    },
    prepare(selection: { title?: string; category?: string; code?: string }) {
      const { title, category, code } = selection;
      const parts: string[] = [];
      if (category) parts.push(category);
      if (code) parts.push(code);
      return {
        title: title ?? "Untitled stage",
        subtitle: parts.join(" • ") || undefined,
      };
    },
  },

  validation: (rule) =>
    rule.custom((value: SanityDocument | undefined) => {
      const doc = value as ProcessStageDocument | undefined;
      if (!doc) return true;

      if (!doc.title) {
        return "Title is required.";
      }

      if (!doc.description) {
        return "Description is required.";
      }

      if (!doc.stageCode) {
        return "Stage code is required.";
      }

      if (!doc.stageCategory) {
        return "Stage category is required.";
      }

      if (!doc.system?.recId) {
        return "system.recId is required for all process stages.";
      }

      return true;
    }),
});

export default processStage;
