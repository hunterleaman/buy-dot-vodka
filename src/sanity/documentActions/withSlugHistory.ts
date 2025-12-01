import type {
  DocumentActionComponent,
  DocumentActionProps,
  DocumentActionDescription,
  DocumentActionsContext,
} from "sanity";
import {
  appendSlugHistory,
  type SlugHistoryDoc,
} from "@/src/sanity/lib/slugHelpers";

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
            // Build a minimal doc shape for the helper: prefer the published
            // document's `slugHistory` if present, otherwise fall back to the
            // draft's value (if any). `appendSlugHistory` will initialize the
            // array when missing and is idempotent.
            const existingHistory = Array.isArray(publishedPrev?.slugHistory)
              ? (publishedPrev!.slugHistory as string[])
              : Array.isArray(nextDraft?.slugHistory)
              ? (nextDraft!.slugHistory as string[])
              : undefined;

            const docForHelper: SlugHistoryDoc = {
              slug: { current: nextSlug },
              slugHistory: existingHistory,
            };

            const updated = appendSlugHistory(docForHelper, prevSlug);

            // Only commit if the helper produced a new/changed slugHistory.
            const oldHasPrev =
              Array.isArray(existingHistory) &&
              existingHistory.includes(prevSlug);
            if (Array.isArray(updated.slugHistory) && !oldHasPrev) {
              await client
                .patch(id)
                .set({ slugHistory: updated.slugHistory })
                .commit({ autoGenerateArrayKeys: true });
            }
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
