import { defineField, defineType } from "sanity";

export default defineType({
  name: "producerProcessOverview",
  title: "Producer process overview",
  type: "document",

  fields: [
    // Module metadata (Track G 3.4 + Track E 4.5.1)
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      options: {
        list: [{ title: "Below", value: "below" }],
        layout: "radio",
      },
      description:
        "Where this module should appear relative to the main content.",
      validation: (rule) => rule.required(),
      initialValue: "below",
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
      description:
        "Relative importance of this module when multiple modules are present.",
      validation: (rule) => rule.required(),
      initialValue: "P2",
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
      description:
        "Editorial hint about how this module should be treated in layouts. Does not affect data.",
      initialValue: "supporting",
    }),

    // Track E 4.5.1 - producerProcessOverview
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Narrative summary of the producer's process, using the unified Portable Text spec.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "steps",
      title: "Key stages",
      type: "array",
      of: [
        defineField({
          name: "step",
          title: "Step",
          type: "object",
          fields: [
            defineField({
              name: "stageTitle",
              title: "Stage title",
              type: "string",
              description:
                "Human readable name, for example Fermentation, Column distillation, or Filtration.",
              validation: (rule) => rule.required().min(2),
            }),
            defineField({
              name: "summary",
              title: "Summary",
              type: "string",
              description:
                "Short description of what happens at this stage, written for an interested consumer.",
              validation: (rule) => rule.required().min(4),
            }),
          ],
        }),
      ],
      description:
        "Bullet level summary of the main stages in the producer's process. Stage titles should align with the processStage taxonomy.",
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error("Producer process overview must include at least one stage."),
    }),
  ],

  preview: {
    select: {
      firstStageTitle: "steps.0.stageTitle",
      firstStageSummary: "steps.0.summary",
    },
    prepare(selection) {
      const { firstStageTitle, firstStageSummary } = selection as {
        firstStageTitle?: string;
        firstStageSummary?: string;
      };

      const title = "Producer process overview";
      const subtitle =
        firstStageTitle && firstStageSummary
          ? `${firstStageTitle}: ${firstStageSummary}`
          : firstStageTitle || firstStageSummary || "Narrative process summary";

      return {
        title,
        subtitle,
      };
    },
  },
});
