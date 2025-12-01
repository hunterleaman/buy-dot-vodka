import { defineField, defineType, type SanityDocument } from "sanity";
import type { DocumentWithSystemSource } from "@/src/sanity/types";
import { isAirtableOwned } from "@/src/sanity/lib/ownershipMaps";
import { normalizeSlug } from "@/src/sanity/lib/slugHelpers";

type ProducerStageSeo = {
  noIndex?: boolean | null;
};

type ProducerStageStatus = {
  visibility?: "public" | "private" | "internal";
};

type ProducerStageSystem = {
  source?: string | null;
  recId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ProducerStageDocument = SanityDocument & {
  title?: string;
  slug?: {
    current?: string | null;
  } | null;
  status?: ProducerStageStatus | null;
  seo?: ProducerStageSeo | null;
  system?: ProducerStageSystem | null;
  producerRecId?: string | null;
  processStageRecId?: string | null;
  isPrimaryStage?: boolean | null;
  isOutsourced?: boolean | null;
  hasOnsiteCapacity?: boolean | null;
  percentageOfProduction?: number | null;
  stageSequence?: number | null;
  capabilityNotes?: string | null;
};

// Ownership checks are delegated to the shared ownership map. See `sku.ts`
// for the canonical conditional style used below.

export const producerStage = defineType({
  name: "producerStage",
  title: "Producer × Stage",
  type: "document",
  initialValue: {
    status: {
      visibility: "private",
    },
    seo: {
      noIndex: true,
    },
    system: {
      source: "airtable",
    },
  },
  fields: [
    // Global shell (Sanity)
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        'System-generated label, e.g., "Northern Distilling – Column Distillation".',
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: 'System-generated slug, e.g., "producer-<rec>-stage-<rec>".',
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
        "All previous slugs for this join, maintained via the custom slug history action.",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "status",
      description:
        "Editorial status; visibility must remain private for this join.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description:
        "SEO settings; producerStage docs must always be no-indexed.",
    }),
    defineField({
      name: "system",
      title: "System",
      type: "system",
      description: "Sync provenance and Airtable identifiers.",
    }),

    // Matrix fields (Airtable-owned when system.source === "airtable")
    defineField({
      name: "producerRecId",
      title: "Producer recId",
      type: "string",
      description: "Airtable recId for the Producer record.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("producerStage.producerRecId")
        );
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "processStageRecId",
      title: "Process stage recId",
      type: "string",
      description: "Airtable recId for the ProcessStage record.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("producerStage.processStageRecId")
        );
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isPrimaryStage",
      title: "Primary stage",
      type: "boolean",
      description:
        "Marks this stage as primary in the producer’s process graph.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("producerStage.isPrimaryStage")
        );
      },
    }),
    defineField({
      name: "isOutsourced",
      title: "Outsourced",
      type: "boolean",
      description: "True if this stage is performed by a third party.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("producerStage.isOutsourced")
        );
      },
    }),
    defineField({
      name: "hasOnsiteCapacity",
      title: "Onsite capacity",
      type: "boolean",
      description:
        "True if the producer has internal capacity to perform this stage, even if currently outsourced.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("producerStage.hasOnsiteCapacity")
        );
      },
    }),
    defineField({
      name: "percentageOfProduction",
      title: "Share of production (%)",
      type: "number",
      description:
        "Approximate share of total production volume using this configuration (0–100).",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("producerStage.percentageOfProduction")
        );
      },
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "stageSequence",
      title: "Per-producer sequence index",
      type: "number",
      description:
        "Ordering hint for this stage within this producer’s workflow.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("producerStage.stageSequence")
        );
      },
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: "capabilityNotes",
      title: "Capability notes",
      type: "string",
      description: "Short, single-line annotation of capability context.",
      readOnly: ({ document }) => {
        const doc = document as DocumentWithSystemSource | undefined;
        return (
          doc?.system?.source === "airtable" &&
          isAirtableOwned("producerStage.capabilityNotes")
        );
      },
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          if (typeof value !== "string")
            return "Capability notes must be text.";
          if (value.includes("\n")) {
            return "Capability notes must be a single line with no line breaks.";
          }
          return true;
        }),
    }),
  ],

  preview: {
    select: {
      title: "title",
      producerRecId: "producerRecId",
      processStageRecId: "processStageRecId",
      sequence: "stageSequence",
    },
    prepare(selection: {
      title?: string;
      producerRecId?: string;
      processStageRecId?: string;
      sequence?: number;
    }) {
      const { title, producerRecId, processStageRecId, sequence } = selection;
      const parts: string[] = [];
      if (producerRecId) parts.push(`Producer: ${producerRecId}`);
      if (processStageRecId) parts.push(`Stage: ${processStageRecId}`);
      if (typeof sequence === "number") parts.push(`Seq ${sequence}`);
      return {
        title: title ?? "Producer × Stage",
        subtitle: parts.join(" • ") || undefined,
      };
    },
  },

  validation: (rule) =>
    rule.custom((value: SanityDocument | undefined) => {
      const doc = value as ProducerStageDocument | undefined;
      if (!doc) return true;

      if (!doc.title) {
        return "Title is required.";
      }

      if (!doc.slug?.current) {
        return "Slug is required.";
      }

      if (!doc.producerRecId) {
        return "producerRecId is required.";
      }

      if (!doc.processStageRecId) {
        return "processStageRecId is required.";
      }

      if (!doc.system?.recId) {
        return "system.recId is required for all producerStage documents.";
      }

      if (doc.system?.source !== "airtable") {
        return 'system.source must be "airtable" for producerStage documents.';
      }

      if (!doc.status) {
        return "Status is required.";
      }

      if (doc.status.visibility === "public") {
        return "producerStage documents must not be public. Set visibility to private.";
      }

      if (!doc.seo?.noIndex) {
        return "seo.noIndex must be true for all producerStage documents.";
      }

      // Note: uniqueness of (producerRecId, processStageRecId) and existence
      // of matching producer/processStage docs are enforced at the sync/migration layer.

      return true;
    }),
});

export default producerStage;
