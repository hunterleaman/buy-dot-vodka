import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

type AromaPalateFinishBreakdownDoc = SanityDocument & {
  aroma?: string | null;
  palate?: string | null;
  finish?: string | null;
  intensity?: string | null;
  length?: string | null;
};

export default defineType({
  name: "aromaPalateFinishBreakdown",
  title: "Aroma / palate / finish breakdown",
  type: "document",
  fields: [
    // Module metadata (Track G 3.4)
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description: "Layout slot where this module is rendered.",
      options: {
        list: [{ title: "Below", value: "below" }],
        layout: "radio",
      },
      // Required; allowedSlots enforcement is handled on relations.modules
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description: "Priority tier for layout ordering.",
      options: {
        list: [{ title: "P2", value: "P2" }],
        layout: "radio",
      },
      // Fixed to P2 per Track E
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description:
        "Editorial context hint (canonical, supporting, or conditional use on the host document.",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
        layout: "radio",
      },
    }),

    // Module fields (Track E 4.4.2)
    defineField({
      name: "aroma",
      title: "Aroma",
      type: "string",
    }),
    defineField({
      name: "palate",
      title: "Palate",
      type: "string",
    }),
    defineField({
      name: "finish",
      title: "Finish",
      type: "string",
    }),
    defineField({
      name: "intensity",
      title: "Intensity",
      type: "string",
      description:
        "Optional perceived intensity (for example light, medium, high).",
    }),
    defineField({
      name: "length",
      title: "Length",
      type: "string",
      description:
        "Optional perceived length of finish (for example short, medium, long).",
    }),
  ],
  // At least one of aroma, palate, or finish must be provided
  validation: (rule) =>
    rule.custom((value: SanityDocument | undefined) => {
      const doc = value as AromaPalateFinishBreakdownDoc | undefined;

      const hasAroma = (doc?.aroma ?? "").trim().length > 0;
      const hasPalate = (doc?.palate ?? "").trim().length > 0;
      const hasFinish = (doc?.finish ?? "").trim().length > 0;

      if (hasAroma || hasPalate || hasFinish) {
        return true;
      }

      return "Enter at least one of aroma, palate, or finish.";
    }),
});
