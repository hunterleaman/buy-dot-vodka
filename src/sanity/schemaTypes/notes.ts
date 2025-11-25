import { defineField, defineType } from "sanity";

const notes = defineType({
  name: "notes",
  title: "Notes",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: "public",
      title: "Public notes",
      type: "blockContent",
      description:
        "Short, user-visible clarifications that annotate the main content. Never the primary source of facts.",
      // PT itself enforces no empty blocks etc; no extra validation needed here.
      // Notes content is Sanity-owned and fully editable.
      initialValue: [],
    }),
    defineField({
      name: "private",
      title: "Private notes",
      type: "blockContent",
      description:
        "Internal research and editorial reasoning. Not visible to end users. May not contain embedProduct or embedCTA.",
      // embedProduct/embedCTA are blocked in notes.private by blockContent’s
      // path-aware validation (internal-only context).
      initialValue: [],
    }),
  ],
});

export default notes;
