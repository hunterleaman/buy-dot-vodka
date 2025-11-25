import { defineField, defineType } from "sanity";
import type { ConditionalPropertyCallbackContext } from "sanity";

type SystemSource = "airtable" | "manual" | "seed" | undefined;
type AirtableBackedDoc = {
  system?: {
    source?: SystemSource;
  };
};

const system = defineType({
  name: "system",
  title: "System",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: "source",
      title: "Source of truth",
      type: "string",
      description:
        "Indicates whether this document is Airtable-first or Sanity-native. Drives ownership and sync direction.",
      options: {
        list: [
          { title: "Airtable", value: "airtable" },
          { title: "Sanity", value: "sanity" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "recId",
      title: "Record ID",
      type: "string",
      description:
        "Authoritative record identifier. Airtable docs use the Airtable recId; Sanity-native docs use a Sanity-side ID.",
      readOnly: ({ document }: ConditionalPropertyCallbackContext) => {
        const doc = document as AirtableBackedDoc | null | undefined;
        return doc?.system?.source === "airtable";
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      description:
        "Creation timestamp mirrored from Airtable for Airtable docs, or managed in Sanity for native docs.",
      readOnly: ({ document }: ConditionalPropertyCallbackContext) => {
        const doc = document as AirtableBackedDoc | null | undefined;
        return doc?.system?.source === "airtable";
      },
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      description:
        "Last updated timestamp mirrored from Airtable for Airtable docs, or managed in Sanity for native docs.",
      readOnly: ({ document }: ConditionalPropertyCallbackContext) => {
        const doc = document as AirtableBackedDoc | null | undefined;
        return doc?.system?.source === "airtable";
      },
    }),
  ],
});

export default system;
