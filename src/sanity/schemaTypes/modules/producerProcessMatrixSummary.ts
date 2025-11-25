import { defineField, defineType } from "sanity";

// type ProducerProcessMatrixStage = {
//   stageTitle?: string;
//   category?: string;
// };

export default defineType({
  name: "producerProcessMatrixSummary",
  title: "Producer process matrix summary",
  type: "document",

  fields: [
    // Module metadata (Track G 3.4)
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      options: {
        list: [
          { title: "Right", value: "right" },
          { title: "Below", value: "below" },
        ],
        layout: "radio",
      },
      initialValue: "below",
      description:
        "Where this module should appear relative to the main content.",
      validation: (rule) => rule.required(),
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
      initialValue: "P2",
      description:
        "Relative importance of this module when multiple modules are present for a producer.",
      validation: (rule) => rule.required(),
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
      initialValue: "conditional",
      description:
        "Editorial hint about how this module should be treated in layouts. Does not affect data.",
    }),

    // Track E 4.1.3 - producerProcessMatrixSummary
    defineField({
      name: "stages",
      title: "Stages",
      type: "array",
      of: [
        defineField({
          name: "stage",
          title: "Stage",
          type: "object",
          fields: [
            defineField({
              name: "stageTitle",
              title: "Stage title",
              type: "string",
              description:
                "Human-readable name, for example “Fermentation” or “Filtration”.",
              validation: (rule) => rule.required().min(2),
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              description:
                "High-level category, ideally matching `processStage.stageCategory` (for example “fermentation”, “distillation”, “filtration”).",
              validation: (rule) => rule.required().min(2),
            }),
          ],
        }),
      ],
      description:
        "Key process stages for this producer, derived from producerStage join docs and processStage taxonomy.",
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error(
            "Producer process matrix summary must include at least one stage."
          ),
    }),

    defineField({
      name: "notes",
      title: "Notes",
      type: "blockContent",
      description:
        "Short narrative notes about how stages fit together (for example which stages are in-house vs subcontracted).",
    }),
  ],

  preview: {
    select: {
      firstStageTitle: "stages.0.stageTitle",
      firstStageCategory: "stages.0.category",
      slot: "slot",
    },
    prepare(selection) {
      const { firstStageTitle, firstStageCategory, slot } = selection as {
        firstStageTitle?: string;
        firstStageCategory?: string;
        slot?: string;
      };

      const title =
        firstStageTitle && firstStageCategory
          ? `${firstStageTitle} (${firstStageCategory})`
          : "Producer process matrix summary";

      const slotLabel = slot ? ` · ${slot}` : "";

      return {
        title,
        subtitle: `Key stages${slotLabel}`,
      };
    },
  },
});
