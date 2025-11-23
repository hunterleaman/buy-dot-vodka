import { defineArrayMember, defineField, defineType } from "sanity";

const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    // Core text blocks
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
        { title: "Code", value: "code" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          // External link annotation
          {
            name: "link",
            title: "External link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (Rule: any) => Rule.required(),
              }),
              defineField({
                name: "openInNewTab",
                title: "Open in new tab",
                type: "boolean",
                initialValue: true,
              }),
              defineField({
                name: "rel",
                title: "Rel attribute",
                type: "string",
                description:
                  'Required for external links (for example, "noopener noreferrer").',
              }),
            ],
            validation: (Rule: any) =>
              Rule.custom((value: any) => {
                if (!value) return true;
                const href: string | undefined = value.href;
                const rel: string | undefined = value.rel;
                if (!href) return "Link URL is required.";
                const isExternal = /^https?:\/\//i.test(href);
                if (isExternal && (!rel || !rel.trim())) {
                  return "External links must include a rel attribute.";
                }
                return true;
              }),
          },
          // Internal link annotation
          {
            name: "internalLink",
            title: "Internal link",
            type: "object",
            fields: [
              defineField({
                name: "reference",
                title: "Reference",
                type: "reference",
                to: [
                  { type: "producer" },
                  { type: "brand" },
                  { type: "sku" },
                  { type: "marketVariant" },
                  { type: "guide" },
                  { type: "topic" },
                  { type: "resource" },
                  { type: "tastingNotePublic" },
                  { type: "labNoteInternal" },
                  { type: "processStage" },
                  { type: "producerStage" },
                ],
                validation: (Rule: any) => Rule.required(),
              }),
            ],
          },
        ],
      },
    }),

    // Inline objects
    defineArrayMember({
      name: "inlineBadge",
      title: "Inline badge",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        }),
        defineField({
          name: "color",
          title: "Color",
          type: "string",
          description: "Optional color token or hex.",
        }),
      ],
    }),
    defineArrayMember({
      name: "simpleTag",
      title: "Simple tag",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Text",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        }),
      ],
    }),
    defineArrayMember({
      name: "statPair",
      title: "Stat pair",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        }),
        defineField({
          name: "value",
          title: "Value",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        }),
      ],
    }),

    // Block objects
    defineArrayMember({
      name: "imageFigure",
      title: "Image",
      type: "object",
      fields: [
        defineField({
          name: "asset",
          title: "Image",
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Accessible description of the image.",
              validation: (Rule: any) => Rule.required(),
            }),
          ],
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
    defineArrayMember({
      name: "callout",
      title: "Callout",
      type: "object",
      fields: [
        defineField({
          name: "tone",
          title: "Tone",
          type: "string",
          description: "For example: info, success, warning, danger.",
        }),
        defineField({
          name: "body",
          title: "Body",
          // Reuse unified PT for callout content
          type: "blockContent",
        }),
      ],
    }),
    defineArrayMember({
      name: "infobox",
      title: "Infobox",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "blockContent",
        }),
      ],
    }),
    defineArrayMember({
      name: "gallery",
      title: "Gallery",
      type: "object",
      fields: [
        defineField({
          name: "images",
          title: "Images",
          type: "array",
          of: [
            defineArrayMember({
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                  description: "Accessible description of the image.",
                  validation: (Rule: any) => Rule.required(),
                }),
                defineField({
                  name: "caption",
                  title: "Caption",
                  type: "string",
                }),
              ],
            }),
          ],
          validation: (Rule: any) => Rule.min(1),
        }),
      ],
    }),
    defineArrayMember({
      name: "timeline",
      title: "Timeline",
      type: "object",
      fields: [
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [
            defineArrayMember({
              name: "timelineItem",
              title: "Timeline item",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (Rule: any) => Rule.required(),
                }),
                defineField({
                  name: "body",
                  title: "Body",
                  type: "blockContent",
                }),
              ],
            }),
          ],
          validation: (Rule: any) => Rule.min(1),
        }),
      ],
    }),
    defineArrayMember({
      name: "tableObject",
      title: "Table",
      type: "object",
      fields: [
        defineField({
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            defineArrayMember({
              name: "row",
              title: "Row",
              type: "object",
              fields: [
                defineField({
                  name: "cells",
                  title: "Cells",
                  type: "array",
                  of: [
                    defineArrayMember({
                      type: "string",
                    }),
                  ],
                  validation: (Rule: any) => Rule.min(1),
                }),
              ],
            }),
          ],
          validation: (Rule: any) =>
            Rule.custom((rows: any) => {
              if (!Array.isArray(rows)) return true;
              for (const row of rows) {
                const cells = row?.cells || [];
                if (Array.isArray(cells) && cells.length > 10) {
                  return "Table width is limited to 10 columns.";
                }
              }
              return true;
            }),
        }),
      ],
    }),
    defineArrayMember({
      name: "embedProduct",
      title: "Embedded product",
      type: "object",
      fields: [
        defineField({
          name: "ref",
          title: "Product",
          type: "reference",
          to: [{ type: "sku" }, { type: "marketVariant" }],
          validation: (Rule: any) => Rule.required(),
        }),
      ],
    }),
    defineArrayMember({
      name: "embedCTA",
      title: "Embedded CTA",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        }),
        defineField({
          name: "url",
          title: "URL",
          type: "url",
          validation: (Rule: any) => Rule.required(),
        }),
      ],
    }),
  ],
  validation: (Rule: any) =>
    Rule.custom((blocks: any, context: any) => {
      if (!Array.isArray(blocks)) return true;

      const docType = context?.document?._type as string | undefined;
      const path: any[] = Array.isArray(context?.path) ? context.path : [];

      const isInternalOnly =
        docType === "labNoteInternal" ||
        (path.includes("notes") && path.includes("private"));

      for (const block of blocks) {
        // No completely empty blocks
        if (block?._type === "block") {
          const children = Array.isArray(block.children) ? block.children : [];
          const hasText = children.some(
            (child: any) =>
              typeof child.text === "string" && child.text.trim().length > 0
          );
          if (!hasText) {
            return "Empty blocks are not allowed in rich text.";
          }
        }

        // Disallow embedProduct / embedCTA in internal-only PT
        if (
          isInternalOnly &&
          (block?._type === "embedProduct" || block?._type === "embedCTA")
        ) {
          return "embedProduct and embedCTA are not allowed in internal-only content.";
        }
      }

      return true;
    }),
});

export default blockContent;
