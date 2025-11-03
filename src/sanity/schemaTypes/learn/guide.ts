import { defineType, defineField } from "sanity";

export default defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "author" }] }],
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [{ type: "reference", to: [{ type: "topic" }] }],
    }),
    defineField({
      name: "processStages",
      title: "Process Stages",
      type: "array",
      of: [{ type: "reference", to: [{ type: "processStage" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "readyToPublish",
      title: "Ready to Publish",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
