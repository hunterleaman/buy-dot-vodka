import { defineField, defineType } from "sanity";

const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description:
        "Optional override for the HTML <title>. Leave blank to fall back to the document title.",
      // No hard length constraint here; recommendations live in editorial guidance.
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "string",
      description:
        "Optional description for search and social. Recommended 50-160 characters.",
      validation: (rule) =>
        rule
          .max(160)
          .warning(
            "Meta descriptions longer than ~160 characters may be truncated in search results."
          ),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description:
        "Preferred image for social sharing (Open Graph / Twitter). Should be a high-quality 1200x630 image.",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Accessible description of the image. Required for all images, even if not shown directly on the page.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description:
        "Optional canonical URL if this page’s content also appears elsewhere.",
      validation: (rule) =>
        rule
          .uri({
            allowRelative: false,
            scheme: ["http", "https"],
          })
          .warning("Canonical URLs should generally be absolute http(s) URLs."),
    }),
    defineField({
      name: "noIndex",
      title: "No index",
      type: "boolean",
      description:
        "If true, signals that search engines should not index this page (robots noindex).",
      initialValue: false,
      // Specific invariants (e.g. producerStage, labNoteInternal always noIndex)
      // are enforced at the document level where context is available.
    }),
  ],
});

export default seo;
