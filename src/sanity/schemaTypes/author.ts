import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";
import { normalizeSlug } from "@/src/sanity/lib/slugHelpers";

type AuthorRelations = {
  guides?: { _ref?: string }[] | null;
  topics?: { _ref?: string }[] | null;
  resources?: { _ref?: string }[] | null;
};

type AuthorValidationDoc = SanityDocument & {
  expertise?: string[] | null;
  relations?: AuthorRelations | null;
};

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      description: "Canonical display name for this author.",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) => normalizeSlug(input),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugHistory",
      title: "Slug history",
      type: "array",
      of: [{ type: "string" }],
      description:
        "All previous slugs for this author, used to maintain redirects and canonical history.",
      initialValue: [],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short bio",
      type: "text",
      rows: 3,
      description:
        "Short, card-friendly bio used for previews and SEO descriptions. Target 120–160 characters, hard cap 240.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "hero",
      title: "Portrait",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Primary portrait or representative image for this author. Recommended for public-facing profiles.",
    }),
    defineField({
      name: "images",
      title: "Additional images",
      type: "array",
      of: [{ type: "image" }],
      options: {
        layout: "grid",
      },
      description:
        "Optional supporting imagery (event photos, context shots, etc.).",
    }),
    defineField({
      name: "credentials",
      title: "Credentials",
      type: "array",
      of: [
        defineField({
          name: "credential",
          title: "Credential",
          type: "string",
        }),
      ],
      description:
        "Notable roles, certifications, or formal credentials. One item per line (e.g., 'MS Chemical Engineering', 'WSET Level 3').",
    }),
    defineField({
      name: "expertise",
      title: "Expertise tags",
      type: "array",
      of: [
        defineField({
          name: "tag",
          title: "Tag",
          type: "string",
        }),
      ],
      description:
        "Topical expertise tags used for discovery and filtering (e.g., 'distillation', 'sensory analysis', 'data architecture').",
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "socialLinks",
      title: "Social & contact links",
      type: "array",
      of: [
        defineField({
          name: "socialLink",
          title: "Social link",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "Human-readable label (e.g., 'Website', 'LinkedIn', 'Instagram').",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              description:
                "Optional platform key to align with modules (e.g., 'site', 'linkedin', 'instagram').",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              description: "Full URL to the profile or site.",
              validation: (rule) =>
                rule.required().uri({ allowRelative: false }),
            }),
          ],
        }),
      ],
      description:
        "Links used by author- and social-link modules (website, social profiles, contact destinations).",
    }),
    defineField({
      name: "body",
      title: "Extended bio",
      type: "blockContent",
      description:
        "Long-form editorial bio using the shared Portable Text spec. Supports infoboxes and images per PT guidance.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "notes",
      description:
        "Public notes clarify attribution/roles; private notes capture internal editorial context. Never store primary facts here.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "status",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "relations",
      title: "Relations",
      type: "relations",
      description:
        "Attach authored Guides, Topics, and Resources, plus optional Brand/Producer relationships used for attribution and modules.",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "metrics",
      description:
        "Optional analytics and engagement rollups for author content, populated by external pipelines.",
    }),
    defineField({
      name: "system",
      title: "System",
      type: "system",
      description:
        "System provenance. Authors are Sanity-native; this is used for internal bookkeeping only.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "hero",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled author",
        subtitle: subtitle || "Author profile",
        media,
      };
    },
  },

  validation: (rule) =>
    rule.custom((value) => {
      const doc = value as AuthorValidationDoc | undefined;

      const expertiseCount = doc?.expertise?.length ?? 0;
      if (expertiseCount < 1) {
        return "Authors must have at least one expertise tag.";
      }

      const relations = doc?.relations;
      const guidesCount = relations?.guides?.length ?? 0;
      const topicsCount = relations?.topics?.length ?? 0;
      const resourcesCount = relations?.resources?.length ?? 0;

      if (guidesCount + topicsCount + resourcesCount < 1) {
        return "Authors must be attached to at least one Guide, Topic, or Resource.";
      }

      return true;
    }),
});
