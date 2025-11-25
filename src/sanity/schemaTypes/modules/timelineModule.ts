import { defineField, defineType } from "sanity";

export default defineType({
  name: "timelineModule",
  title: "Timeline module",
  type: "document",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description:
        "Where this timeline module should appear relative to the main content.",
      options: {
        layout: "radio",
        list: [{ title: "Below main content", value: "below" }],
      },
      initialValue: "below",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description:
        "Layout priority hint used when multiple modules compete for space.",
      options: {
        list: [
          { title: "P1 - Canonical", value: "P1" },
          { title: "P2 - High value", value: "P2" },
          { title: "P3 - Enrichment", value: "P3" },
        ],
      },
      initialValue: "P2",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description: "Editorial context hint to help layout decisions.",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
      },
      initialValue: "supporting",
    }),
    defineField({
      name: "events",
      title: "Timeline events",
      type: "array",
      description: "Short sequence of milestone events in chronological order.",
      of: [
        {
          name: "event",
          title: "Event",
          type: "object",
          fields: [
            defineField({
              name: "year",
              title: "Year",
              type: "string",
              description:
                "Year label for this event (for example 1932, 1975, 2020, or a short era label).",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description: "Short title describing what happened that year.",
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .max(10)
          .warning("Timelines work best with between 1 and 10 events."),
    }),
  ],
});
