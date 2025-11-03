import { defineType, defineField } from "sanity";

export default defineType({
  name: "affiliateSource",
  title: "Affiliate Source",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "network",
      title: "Network",
      type: "string",
      options: {
        list: ["Skimlinks", "Impact", "CJ", "Other"],
      },
    }),
    defineField({
      name: "affiliateId",
      title: "Affiliate ID",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "trackingUrl",
      title: "Tracking URL",
      type: "url",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
    }),
    defineField({
      name: "readyToPublish",
      title: "Ready to Publish",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
