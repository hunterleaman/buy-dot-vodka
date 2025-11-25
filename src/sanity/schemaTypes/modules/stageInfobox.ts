import { defineField, defineType } from "sanity";

export default defineType({
  name: "stageInfobox",
  title: "Stage infobox",
  type: "document",
  fields: [
    // Module metadata (Track E / Track G 3.4)
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      description: "Layout slot where this module is rendered.",
      options: {
        list: [
          { title: "Inline", value: "inline" },
          { title: "Right", value: "right" },
          { title: "Below", value: "below" },
        ],
        layout: "radio",
      },
      // Required; allowedSlots is additionally enforced on relations.modules
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description: "Priority tier for layout ordering (P3 process helper).",
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
        "Editorial context hint (typically conditional-context, used where a stage needs extra explanation).",
      options: {
        list: [
          { title: "Canonical", value: "canonical" },
          { title: "Supporting", value: "supporting" },
          { title: "Conditional", value: "conditional" },
        ],
        layout: "radio",
      },
    }),

    // Module fields (Track E 4.5.2)
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
      description:
        "Short explanation of the stage; no commerce or tasting content.",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) {
            // required() handles the empty case; this validator only guards content rules
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
            return "Stage infobox cannot contain product or CTA embeds.";
          }

          return true;
        }),
    }),
    defineField({
      name: "stageCode",
      title: "Stage code",
      type: "string",
      description:
        "Optional stage code (for example DIST_COLUMN) that can align with processStage or internal codes.",
    }),
  ],
});
