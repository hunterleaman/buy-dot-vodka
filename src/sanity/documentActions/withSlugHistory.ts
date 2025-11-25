import type {
  DocumentActionComponent,
  DocumentActionProps,
  DocumentActionDescription,
  DocumentActionsContext,
} from "sanity";

/**
 * Type guard for a Publish-like action description.
 * Some Sanity type versions don't expose `name`, but `label` is present.
 */
function isPublishAction(
  desc: DocumentActionDescription | null
): desc is DocumentActionDescription {
  return Boolean(
    desc &&
      typeof desc.label === "string" &&
      desc.label.toLowerCase() === "publish"
  );
}

/**
 * Wrap the built-in Publish action to:
 *  - detect slug changes vs last published
 *  - append previous slug to `slugHistory` (setIfMissing + append)
 */
export function withSlugHistory(
  original: DocumentActionComponent,
  ctx: DocumentActionsContext
): DocumentActionComponent {
  return function SlugHistoryPublishAction(props: DocumentActionProps) {
    const base = original(props);
    if (!isPublishAction(base)) return base;

    return {
      ...base,
      onHandle: async () => {
        try {
          const client = ctx.getClient({
            apiVersion:
              (process.env.SANITY_API_VERSION as string) || "2025-01-01",
          });

          // Strip `drafts.` prefix to address the published document id
          const id = props.id.replace(/^drafts\./, "");

          // Narrow unknown shapes safely
          const nextDraft = props.draft as
            | { slug?: { current?: unknown }; slugHistory?: unknown[] }
            | undefined;
          const publishedPrev =
            (props.published as
              | { slug?: { current?: unknown }; slugHistory?: unknown[] }
              | undefined) ?? (await client.getDocument(id));

          const nextSlug =
            typeof nextDraft?.slug?.current === "string"
              ? nextDraft.slug.current
              : undefined;
          const prevSlug =
            typeof publishedPrev?.slug?.current === "string"
              ? publishedPrev.slug.current
              : undefined;

          if (prevSlug && nextSlug && prevSlug !== nextSlug) {
            await client
              .patch(id)
              .setIfMissing({ slugHistory: [] })
              .append("slugHistory", [prevSlug])
              .commit({ autoGenerateArrayKeys: true });
          }
        } catch (err) {
          // Non-blocking — log and proceed
          console.warn("slugHistory action warning:", err);
        } finally {
          // Continue with the original publish
          base.onHandle?.();
        }
      },
    };
  };
}
