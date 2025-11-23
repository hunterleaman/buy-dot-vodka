# **Track G — Schemas & Migrations**

BUY.VODKA Data Architecture
Anchored to Master Document and Tracks A–F + H

---

## **0. Scope**

Track G turns the frozen data architecture into:

- Final **Sanity schemas** for all document and object types.
- **TypeScript utilities** for ownership, slug history, and field grouping.
- A safe, repeatable **migration and backfill pipeline** from Airtable to Sanity.

Track G does not change any decisions made in Tracks A–F, does not introduce new fields or types, and does not alter the ownership model or module taxonomy.

Because current data is minimal and test only, Track G assumes we may **wipe existing Sanity content** and repopulate from Airtable once schemas are implemented.

---

## **1. Anchors Rehydrated (Summary)**

Only the schema and migration implications:

- **Anchor A — Field Taxonomy & Naming**
  Global fields (`title`, `slug`, `slugHistory`, `description`, `body`, `notes`, `seo`, `status`, `system`, `relations`, `metrics`) and naming rules are frozen. All documents must use these consistently.

- **Anchor B — Portable Text Spec**
  A single PT type (current `blockContent`) implements allowed styles, marks, and objects; no extra PT variants.

- **Anchor C — Notes System**
  `notes.public` and `notes.private` are PT arrays. Notes cannot store primary facts or commerce data.

- **Anchor D — Relationships & Inheritance**
  Identity hierarchy: `producer → brand → sku → marketVariant`. Inheritance is read time only; schemas do not propagate values.

- **Anchor E — Modules**
  Module taxonomy, allowed slots (`right`, `below`, `inline`), and placement rules are fixed. Modules are separate docs referenced via `relations.modules[]`.

- **Anchor F — Ownership & Authority**
  Airtable owns structured facts (commerce, process, matrix). Sanity owns narrative, SEO, status, notes, modules. Ownership rules are enforced in schema and sync.

- **Anchor G — Migration Architecture**
  Migrations must be additive, idempotent, and run against staging first, with dry runs, logging, and rollback.

- **Anchor H — Sensory**
  Sensory fields are limited to `labNoteInternal` and `tastingNotePublic`, with vocab and constraints from Track D/H.

---

## **2. Repo Integration Context**

Existing repo structure (simplified):

- `app/` → Next App Router, pages, Studio route.
- `lib/` → sanity client, fetch helpers, PT renderer, SEO, URLs.
- `src/sanity/schemaTypes/` → existing schemas (producer, brand, sku, marketVariant, learn/\*, awards, certifications, affiliateSource, siteSettings).
- `src/sanity/documentActions/withSlugHistory.ts` → custom Publish action to append slugHistory.
- `src/sanity/structure.ts` → simple document list.

Track G will:

- Upgrade `blockContent` to the unified PT spec.
- Replace thin document schemas with Track A–F aligned types.
- Add new doc types (`producerStage`, `labNoteInternal`, `tastingNotePublic`, `module.*`).
- Keep `withSlugHistory` as is, backed by the new `slugHistory` field.

---

## **3. G1 — Schema Implementation**

### **3.1 File Layout**

All in `src/sanity/schemaTypes`:

- **Objects**
  - `blockContent.ts` (Anchor B unified PT)
  - `seo.ts`
  - `status.ts`
  - `notes.ts`
  - `system.ts`
  - `relations.ts`
  - `metrics.ts`

- **Core docs (upgraded)**
  - `producer.ts`
  - `brand.ts`
  - `sku.ts`
  - `marketVariant.ts`
  - `guide.ts`
  - `topic.ts`
  - `resource.ts`
  - `author.ts`

- **Specialized docs**
  - `processStage.ts` (taxonomy + optional editorial)
  - `producerStage.ts` (join shell)
  - `labNoteInternal.ts`
  - `tastingNotePublic.ts`

- **Module docs (Track E)**
  - `modules/factSheetBasic.ts`
  - `modules/factSheetExtended.ts`
  - `modules/producerProcessMatrixSummary.ts`
  - `modules/regulatoryFlags.ts`
  - `modules/availabilitySummary.ts`
  - `modules/storyHighlight.ts`
  - `modules/timelineModule.ts`
  - `modules/galleryModule.ts`
  - `modules/glossaryPanel.ts`
  - `modules/citationModule.ts`
  - `modules/siblingSkus.ts`
  - `modules/siblingVariants.ts`
  - `modules/buyCtaCompact.ts`
  - `modules/whereToBuyGuide.ts`
  - `modules/tastingSummaryPublic.ts`
  - `modules/aromaPalateFinishBreakdown.ts`
  - `modules/servingSuggestions.ts`
  - `modules/producerProcessOverview.ts`
  - `modules/stageInfobox.ts`
  - `modules/relatedBrands.ts`
  - `modules/relatedGuides.ts`
  - `modules/relatedTopics.ts`
  - `modules/relatedResources.ts`
  - `modules/authorCard.ts`
  - `modules/socialLinksCard.ts`
  - `modules/inlineInfobox.ts`

`index.ts` continues exporting a flat `schemaTypes` array, now including all the above.

---

### **3.2 Global Objects**

#### **3.2.1 `blockContent` (Unified PT)**

- **Type**: array of blocks and objects.
- **Block styles**: `normal`, `h2`, `h3`, `h4`, `blockquote`, `code` plus lists `bullet`, `numbered`.
- **Marks**: `strong`, `em`, `underline`, `code`, `link`, `internalLink`.
- **Objects**: `imageFigure`, `callout`, `infobox`, `gallery`, `timeline`, `tableObject`, `embedProduct`, `embedCTA`, plus inline `inlineBadge`, `simpleTag`, `statPair`.

Validation:

- No H1.
- No completely empty blocks.
- `embedProduct` and `embedCTA` disallowed in internal-only contexts (e.g. lab notes, notes.private).

This replaces the old simple `blockContent` and is reused everywhere PT is required.

#### **3.2.2 `seo`**

Fields:

- `metaTitle` (string)
- `metaDescription` (string, recommended ≤160 chars)
- `noIndex` (boolean)
- `canonicalUrl` (url, optional)

Defaults:

- Airtable-first shells: `noIndex = true`.
- `producerStage` and `labNoteInternal`: always `noIndex = true` (enforced by validation).

#### **3.2.3 `status`**

Fields:

- `published` (boolean)
- `archived` (boolean)
- `visibility` (`public` | `private`)
- `dataConfidence` (`low` | `medium` | `high`)

Invariants:

- `producerStage` and `labNoteInternal`: `visibility = "private"`.

#### **3.2.4 `notes`**

- `public`: `blockContent`
- `private`: `blockContent`

Constraints:

- No commerce facts or pricing in notes.
- `notes.public` omitted entirely in `labNoteInternal`.

#### **3.2.5 `system`**

- `source`: `"airtable"` | `"sanity"`
- `recId`: string
- `createdAt`: datetime
- `updatedAt`: datetime

Ownership:

- Airtable-first docs: Airtable owns `recId`, `createdAt`, `updatedAt`.
- Sanity-native docs: Sanity owns them.

#### **3.2.6 `relations`**

Base:

- `modules`: array of references to `module.*` docs (optional).

Per-type additions:

- Producer: brands[], guides[], topics[], resources[], authors[].
- Brand: producer, skus[], topics[], guides[].
- SKU: brand, producer, marketVariants[], guides[], topics[], authors[], resources[], modules.
- MarketVariant: sku, relatedVariants[], modules.
- Guide, Topic, Resource, Author: as defined in Track B.
- `labNoteInternal` / `tastingNotePublic`: exactly one of `sku` or `marketVariant`.

`metrics` is reserved for analytics counters; structure can remain minimal for now.

---

### **3.3 Document Schemas**

All documents get the global field pattern:

- `title` (string, required)
- `slug` (slug, required, unique per type)
- `slugHistory` (string[])
- `description` (string, optional max ~240)
- `body` (`blockContent`) where relevant
- `hero` (image, optional unless Track B says required)
- `images` (image[], optional)
- `notes`, `seo`, `status`, `system`, `relations`, `metrics`

#### **3.3.1 Narrative Docs (Track B)**

`producer`, `brand`, `guide`, `topic`, `resource`, `author`.

- Existing fields like `name`, `website`, etc. are mapped to either:
  - `title` (Sanity-owned), or
  - Airtable-owned factual fields (readOnly).

- Additional editorial fields per Track B (e.g. `subTitle`, `readingTime`, `heroStyle`) are preserved from that spec.

Validation:

- `title` and `slug.current` required to publish.
- For `guide` and `topic`, at least one related topic or guide respectively.

#### **3.3.2 Commerce Docs (Track C)**

`sku`, `marketVariant`.

**SKU**:

- Airtable-owned commerce fields:
  - Identity: `skuCode`, `upc`, `gtin`, `isDiscontinued`.
  - Liquid: `abv`, `proof`, `distillateBase`, `distillationMethod`, `filtrationMethod`, `flavored`, `additivesPresent`.
  - Origin: `country`, `region`, `bottlingLocation`, `producerRecId`, `brandRecId`.
  - Packaging: `primarySizeMl`, `casePack`, `containerType`, `closureType`.
  - Commerce: `cost`, `wholesalePrice`, `msrp`, `availability`, `distributorFlags[]`, `affiliateSourceRecIds[]`.

- Sanity-owned narrative:
  - `tastingNotes` (PT)
  - `editorialSummary` (string)
  - `storyHooks[]` (string)

Validation to publish:

- `title`, `slug.current`, `description`, `hero`, `body`.
- `relations.brand`, `relations.producer`.
- Minimal commerce fact set populated from Airtable (`skuCode`, `abv`, `primarySizeMl`, `country` at least).

**MarketVariant**:

- Airtable-owned variant fields: `variantCode`, `market`, `sizeMl`, `packType`, `casePack`, optional variant overrides for ABV, proof, etc.
- Sanity narrative fields: `variantIntro`, `variantNotes`, `limitedReleaseStory` (PT).
- Validation: `relations.sku` required to publish.

SEO default: `noIndex = true` on variants unless curated.

#### **3.3.3 Specialized Docs (Track D/H)**

**processStage**

- Mixed Airtable and Sanity: taxonomy fields Airtable-owned, title/slug/description/body Sanity-owned.
- `stageCode` unique and immutable without migration.
- Parent stage field with no cycles, depth capped.

**producerStage**

- Shell doc with:
  - `title`, `slug`, `slugHistory`, `status`, `seo`, `system.*`.
  - Airtable-owned matrix fields: `producerRecId`, `processStageRecId`, `isPrimaryStage`, `isOutsourced`, `hasOnsiteCapacity`, `percentageOfProduction`, `stageSequence`, `capabilityNotes`.

- No body, notes, images, or modules.
- Invariants: `status.visibility="private"` and `seo.noIndex=true`.

**labNoteInternal**

- Internal QC and sensory notes: title, slug, slugHistory, body(PT), `status`, `seo`, `system`, `relations`.
- Relations: exactly one `sku` or `marketVariant`.
- Sensory fields according to Anchor H (aroma, palate, finish, intensity, etc.).
- No `notes.public`.
- Always private and noIndex.

**tastingNotePublic**

- Editorial tasting content for public.
- Title, slug, slugHistory, description, body, notes, seo, status, hero/images, system, relations.
- Relations: exactly one `sku` or `marketVariant`.
- Optional structured sensory fields; editorial overrides lab notes, but never stores commerce facts.

---

### **3.4 Module Schemas (Track E)**

Each module from Track E is a doc type with:

- `_type` = module name (for example `factSheetBasic`).
- Fields exactly as defined in Track E (arrays of items, PT bodies, references).
- Extra metadata fields:
  - `slot`: `"right" | "below" | "inline"`
  - `priority`: `"P1" | "P2" | "P3"`
  - `context`: `"canonical" | "supporting" | "conditional"` (optional, editorial hint)

Modules are **Sanity-owned only**. Airtable cannot create or modify modules.

Parent docs:

- `relations.modules`: array of references to module docs.
- Custom validator on `relations.modules` enforces:
  - Allowed types per host doc.
  - Allowed slots.
  - Exclusivity (`siblingSkus` vs `siblingVariants`, single `buyCtaCompact`, no `factSheetBasic` + `factSheetExtended` in same slot, etc).

Publishing is blocked when a module placement violates Track E.

---

### **3.5 Studio Configuration**

- **Initial values** for Airtable-first docs (Producer, Brand, SKU, MarketVariant, ProcessStage, ProducerStage, Airtable-backed Resources, Certifications, Awards, AffiliateSources):

  Use the Track F shell template:
  - `title = "Untitled {Type}"`
  - `description = "Editorial description coming soon."`
  - `body` = single empty PT block
  - `seo.noIndex = true`
  - `status = { published: false, archived: false, visibility: "private", dataConfidence: "low" }`
  - `notes.public = []`, `notes.private = []`
  - `relations = {}`
  - `hero = null`, `images = []`

- Sanity-native docs (Guides, Topics, Authors, labNoteInternal, tastingNotePublic, Sanity-native Resources, modules) get only status defaults; editors are expected to fill content.

- **ReadOnly / hidden rules** use `ownershipMap` and `system.source`:
  - Airtable-owned fields: `readOnly: true`, visible if helpful, hidden if noise.
  - Sanity-owned fields: always editable.

---

### **3.6 TypeScript Utilities**

Location: `src/sanity/lib` (or `lib/`):

1. **`ownershipMaps.ts`**

   ```ts
   type Owner = "airtable" | "sanity" | "mixed";

   export const ownershipMap: Record<string, Owner> = {
     "sku.skuCode": "airtable",
     "sku.abv": "airtable",
     "sku.title": "sanity",
     "producerStage.producerRecId": "airtable",
     "labNoteInternal.body": "sanity",
     // ...
   };
   ```

   Used by schemas and migrations to determine write authority.

2. **`fieldGroups.ts`**

   Exports arrays like:
   - `identityFields`, `narrativeFields`, `commerceFields`, `sensoryFields`, `processFields`, `systemFields`.

   Used for form grouping and lint checks.

3. **`slugHelpers.ts`**
   - `normalizeSlug(title: string): string` implementing Track A rules.
   - `appendSlugHistory(doc, previousSlug)`
   - `buildRedirectKey(type, oldSlugParts, newSlugParts)`

   Works with `withSlugHistory.ts` document action and redirect generation from Track C.

---

## **4. G2 — Migration & Backfills**

### **4.1 Migration Runner**

A Node/TS script, for example `scripts/migrateTrackG.ts`:

- Args:
  - `--dataset=staging|production`
  - `--dry-run`
  - `--steps=all|01-init|02-import|...`
  - `--confirm` required for production writes.

Defaults:

- Dataset = `staging`.
- `dry-run = true` if not specified.
- No production writes without `--dataset=production --confirm`.

The runner loads Airtable snapshots and Sanity docs, then executes steps in order. Steps are idempotent upserts.

---

### **4.2 Steps**

#### **Step 01 — Schema deploy**

Deploy new schemas to staging; no data writes.

#### **Step 02 — Initialize slugHistory and system**

For all docs in scoped types:

- If `slugHistory` missing, set to `[]`.
- If `system` missing:
  - For Airtable-first types: set `system.source="airtable"`, `recId` from existing recId field if present, otherwise leave blank and log.
  - For Sanity-native: `system.source="sanity"`, `recId = _id`.

#### **Step 03 — Airtable import / upsert**

Per Airtable table:

- Lookup doc via `system.recId` and type.
- If doc exists:
  - Upsert Airtable-owned fields, including null overwrites for those fields.

- If missing:
  - Create doc with Airtable fields + Track F shell initial values.

All writes use the Sanity write client with transactions and retries.

#### **Step 04 — Relations backfill**

Using Airtable FKs:

- SKU:
  - Set `relations.brand` and `relations.producer` from `brandRecId`, `producerRecId`.

- MarketVariant:
  - Set `relations.sku` from sku recId.

- ProducerStage:
  - Ensure each matrix row has a ProducerStage doc with matching `producerRecId` and `processStageRecId`.

- Resources:
  - Backfill relations to guides, topics, brands, etc., if present in Airtable.

Mismatches are logged and flagged for manual resolution.

#### **Step 05 — Slug normalization and slugHistory backfill**

For narrative and commerce docs:

- Compute new slug from `title` via `normalizeSlug`.
- If it differs from `slug.current`, append the old slug to `slugHistory`.
- Build a redirect map object for each doc type (old path → new path) stored in `./.tmp/redirects.json` for Next.js routing.

#### **Step 06 — Process graph enforcement**

For each ProducerStage Airtable row:

- Ensure a single ProducerStage doc; enforce uniqueness on `(producerRecId, processStageRecId)` at data level.
- Ensure `seo.noIndex=true` and `status.visibility="private"`.

For each ProcessStage:

- Validate parent relationships; log and flag any depth > 2 or cycles.

#### **Step 07 — Legacy labNote migration**

Current state: no legacy labNote content.
This step remains in the pipeline as a no-op for now:

- Detect legacy `labNote` docs (old schema).
- Optionally map them to `labNoteInternal` or `tastingNotePublic` if they appear in the future.

For now, the script logs “no legacy lab notes found”.

---

### **4.3 Orphans and lifecycle**

- **Airtable row deleted, Sanity doc exists**:
  - Never delete doc automatically.
  - Set `status.visibility="private"` and `seo.noIndex=true`.
  - Optionally append a private note marking it as orphaned.

- **Sanity doc deleted, Airtable row exists**:
  - Next sync recreates a shell doc with the same `system.recId` and Track F initial values.
  - This preserves the canonical Airtable → Sanity mapping.

An orphan sweeper report lists all orphans for manual review later.

---

### **4.4 Integrity & Linting**

A separate `scripts/lintTrackG.ts` runs **read only**:

Checks:

1. **Ownership violations**
   - For Airtable-first docs, compare Airtable snapshot vs Sanity.
   - Any non-matching Airtable-owned field is logged as an illegal edit.

2. **Hierarchy**
   - Each SKU has exactly one Brand and one Producer.
   - Each Variant has exactly one SKU.

3. **Process graph**
   - ProducerStage uniqueness, valid recIds.
   - ProcessStage hierarchy constraints.

4. **Modules**
   - For each doc, load `relations.modules[]`, check module types and slots against allowed per type.
   - Enforce exclusivity rules from Track E.

5. **PT and sensory**
   - No commerce facts in PT (heuristic + allowlist).
   - Sensory fields only on `labNoteInternal` and `tastingNotePublic`.

Lint output is JSONL; CI can treat any errors as failures.

---

### **4.5 Rollback & Safety**

Before any non dry run:

- Export Sanity dataset: `sanity dataset export {dataset} backups/sanity-{dataset}-{timestamp}.ndjson`.
- Export Airtable tables as CSV/JSON into `backups/airtable-{timestamp}/`.

If something goes sideways:

- Small issues: revert docs using Sanity version history.
- Large issues: re-import NDJSON snapshot into the dataset.

All scripts and sync layers check `process.env.SYNC_ENABLED`. If false, they log and exit with no writes.

---

## **5. GATE Checklist (Track G)**

Track G is considered complete when:

1. **All schemas compile and match Tracks A–F**
   - Every doc type has the correct global fields and per-type fields.
   - All module schemas match Track E exactly.

2. **Ownership enforced at schema level**
   - Airtable-owned fields are readOnly (and hidden where appropriate).
   - Sanity-owned fields editable, never overwritten by sync.

3. **Initial values and defaults are correct**
   - Airtable-first shells follow Track F template.
   - `producerStage` and `labNoteInternal` are always private and noIndex.

4. **Migrations produce a clean staging dataset**
   - All Airtable rows map to Sanity docs.
   - Relations are backfilled, no broken FKs.
   - Slugs normalized and slugHistory populated.

5. **Integrity checks pass**
   - No ownership violations.
   - No module placement violations.
   - No invalid sensory or PT content.

6. **Rollback is proven**
   - At least one full staging run has been rolled back successfully using exported snapshots.

7. **Parking Lot created and acknowledged**
   - All out of scope items for Track G are captured (module rendering UI, CI wiring, orphan management UI, etc).

---

## **6. Parking Lot**

Track G Parking Lot is as previously defined:

- Frontend module rendering system.
- Rich PT components for new objects.
- Tasting and process UI.
- Module auto ordering and personalization.
- CI wiring for lints.
- Orphan management tooling.
- Multi language editorial, UGC ingestion, advanced sensory expansions.
