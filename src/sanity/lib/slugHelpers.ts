// src/sanity/lib/slugHelpers.ts

/**
 * Canonical slug normalization + slugHistory helpers.
 *
 * Grounded in:
 * - Track A — Global Standards
 * - Track C — Commerce URL & canonical strategy
 * - Track G — Schemas & Migrations (`slugHelpers.ts` contract)
 */

/**
 * Normalize a human-readable string (typically `title`) into a
 * URL-safe slug that matches the examples in Track C, e.g.:
 *
 *  "Northern Column Vodka"        → "northern-column-vodka"
 *  "Holiday Pack 750ml (US)"     → "holiday-pack-750ml-us"
 *  "Northern-column-vodka"       → "northern-column-vodka"
 */
export function normalizeSlug(input: string): string {
  if (!input) return "";

  // 1. Trim and normalize unicode (strip diacritics).
  const trimmed = input.trim();
  if (!trimmed) return "";

  const withoutDiacritics = trimmed
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  // 2. Lowercase.
  const lower = withoutDiacritics.toLowerCase();

  // 3. Replace any run of non-alphanumeric characters with a single dash.
  //    This:
  //      - removes spaces, punctuation, and parentheses
  //      - keeps 0–9 and a–z
  const dashed = lower.replace(/[^a-z0-9]+/g, "-");

  // 4. Trim leading/trailing dashes and collapse multi-dash runs.
  const collapsed = dashed.replace(/-+/g, "-");
  const cleaned = collapsed.replace(/^-+/, "").replace(/-+$/, "");

  return cleaned;
}

/**
 * Minimal contract used by document actions / migrations when deciding
 * whether to regenerate `slug.current` from `title`.
 *
 * Track G does not currently define type-specific exceptions, so we keep
 * behavior uniform and centralize the switch here for future use.
 */
export function shouldUpdateSlug(docType: string): boolean {
  // All public-facing and internal narrative docs share the same behavior
  // for now: slugs may be regenerated from the title when it changes.
  // If we later decide to lock specific types, this function is the single
  // place to encode that rule.
  return Boolean(docType);
}

export type SlugHistoryDoc = {
  slugHistory?: string[];
  slug?: {
    current?: string | null;
  } | null;
};

/**
 * Append the previous slug to `slugHistory` when appropriate.
 *
 * - No-op if `previousSlug` is falsy, empty, or equal to `slug.current`.
 * - Initializes `slugHistory` as [] when missing.
 * - Idempotent: never adds duplicates.
 *
 * Safe to use from:
 * - `withSlugHistory.ts` document action
 * - Migration scripts (Track G backfills)
 */
export function appendSlugHistory<T extends SlugHistoryDoc>(
  doc: T,
  previousSlug: string | null | undefined
): T {
  const prev = (previousSlug ?? "").trim();
  if (!prev) return doc;

  const current = (doc.slug?.current ?? "").trim();
  if (!current || prev === current) {
    // Either we don't have a new slug yet, or nothing actually changed.
    return doc;
  }

  const existing = Array.isArray(doc.slugHistory)
    ? doc.slugHistory.slice()
    : [];

  if (existing.includes(prev)) {
    // Idempotent: do not add duplicates.
    return doc;
  }

  return {
    ...doc,
    slugHistory: [...existing, prev],
  };
}

/**
 * A slug or multi-part slug.
 *
 * For example:
 *  - "northern-column-vodka"
 *  - ["old-brand-slug", "old-sku-slug"]
 */
export type SlugParts = string | string[];

/**
 * Normalize SlugParts into a path-like string without leading/trailing slashes.
 *
 * Examples:
 *  - "foo"                 → "foo"
 *  - "/foo/bar/"           → "foo/bar"
 *  - ["foo", "bar"]        → "foo/bar"
 *  - ["", "foo", "/bar/"]  → "foo/bar"
 */
export function normalizeSlugParts(parts: SlugParts): string {
  if (Array.isArray(parts)) {
    const cleaned = parts
      .map((segment) => segment.trim())
      .filter(Boolean)
      .map((segment) => segment.replace(/^\/+|\/+$/g, ""));
    return cleaned.join("/").replace(/\/+/g, "/");
  }

  return parts.trim().replace(/^\/+|\/+$/g, "");
}

/**
 * Build a stable key for redirect entries derived from slug changes.
 *
 * The key must:
 * - Be deterministic for a given type + old/new slug pair.
 * - Work for both single-part and multi-part slugs (brand + sku, etc.).
 *
 * Examples:
 *  buildRedirectKey("brand", "old-brand", "new-brand")
 *    → "brand:old-brand=>new-brand"
 *
 *  buildRedirectKey(
 *    "sku",
 *    ["old-brand", "old-sku"],
 *    ["new-brand", "new-sku"]
 *  )
 *    → "sku:old-brand/old-sku=>new-brand/new-sku"
 */
export function buildRedirectKey(
  typeName: string,
  oldSlug: SlugParts,
  newSlug: SlugParts
): string {
  const oldPath = normalizeSlugParts(oldSlug);
  const newPath = normalizeSlugParts(newSlug);

  return `${typeName}:${oldPath}=>${newPath}`;
}
