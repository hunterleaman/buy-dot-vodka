import { defineField, defineType } from "sanity";

export default defineType({
  name: "inlineInfobox",
  title: "Inline infobox",
  type: "document",
  fields: [
    // Module metadata (Track G / Track E)
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description: "Layout slot where this module is rendered.",
      options: {
        list: [
          { title: "Inline", value: "inline" },
          { title: "Below", value: "below" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description: "Priority tier for layout ordering.",
      options: {
        list: [{ title: "P3", value: "P3" }],
        layout: "radio",
      },
      // Fixed to P3 per Track E
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description:
        "Editorial context hint (canonical, supporting, or conditional use on the host document).",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
        layout: "radio",
      },
    }),

    // Module fields (Track E 4.6.7)
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (rule) =>
        rule.required().custom((value) => {
          // Required is handled by rule.required; here we only enforce disallowed embeds.
          if (!value) {
            return true;
          }

          if (!Array.isArray(value)) {
            return "Body must be Portable Text content.";
          }

          const hasForbiddenObject = value.some((item) => {
            if (!item || typeof item !== "object") {
              return false;
            }

            const candidate = item as { _type?: unknown };

            return (
              candidate._type === "embedCTA" ||
              candidate._type === "embedProduct"
            );
          });

          if (hasForbiddenObject) {
            return "Inline infobox cannot contain product or CTA embeds.";
          }

          return true;
        }),
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      description: "Optional tone to hint styling and emphasis.",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Warning", value: "warning" },
          { title: "Tip", value: "tip" },
        ],
        layout: "radio",
      },
    }),
  ],
});
