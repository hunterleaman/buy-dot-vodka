import { defineField, defineType } from "sanity";

export default defineType({
  name: "status",
  title: "Status",
  type: "object",
  fields: [
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description:
        "Editorial publish flag. True when the document is ready for public consumption.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "archived",
      title: "Archived",
      type: "boolean",
      description:
        "Archive flag for deprecated or superseded documents. Does not delete content.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "visibility",
      title: "Visibility",
      type: "string",
      description:
        "High level visibility state. Certain types (for example producerStage, labNoteInternal) are forced to private at the document level.",
      options: {
        list: [
          { title: "Public", value: "public" },
          { title: "Private", value: "private" },
          { title: "Embargo", value: "embargo" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastReviewedAt",
      title: "Last Reviewed At",
      type: "datetime",
      description:
        "Optional editorial review timestamp for tracking when this document was last checked.",
    }),
    defineField({
      name: "dataConfidence",
      title: "Data Confidence",
      type: "string",
      description:
        "Editorial confidence in the accuracy and completeness of this document.",
      options: {
        list: [
          { title: "Low", value: "low" },
          { title: "Medium", value: "medium" },
          { title: "High", value: "high" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
