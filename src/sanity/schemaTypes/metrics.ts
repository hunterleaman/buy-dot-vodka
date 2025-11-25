import { defineField, defineType } from "sanity";

const metrics = defineType({
  name: "metrics",
  title: "Metrics",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  // Track A + G specify `metrics` as a reserved object for future
  // engagement and analytics. No inner fields are defined in Tracks A–G,
  // so this remains an empty object to avoid introducing new schema.
  fields: [
    defineField({
      name: "pageViews",
      title: "Page views",
      type: "number",
      readOnly: true,
      description:
        "Reserved for analytics backfills. Editors should not edit manually.",
    }),
  ],
});

export default metrics;
