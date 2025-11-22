# **Track D — Specialized Types Specification**

BUY.VODKA Data Architecture
Anchored to Master Document and Tracks A–C

---

# **0. Scope**

Track D introduces the **specialized process and sensory layer**:

- `processStage`
- `producerStage` (join doc: Producer × ProcessStage)
- `labNoteInternal`
- `tastingNotePublic`

Objectives:

- Model **production stage taxonomies** and a **Producer → Stage matrix** without disrupting the core identity hierarchy.
- Separate **internal evaluation notes** from **public tasting narrative** using Anchor H.
- Keep sensory data, process, and commerce strictly in their lanes.
- Respect all frozen Anchors and avoid scope bleed into Tracks E–G.

Non-goals:

- No new document types.
- No new PT objects.
- No new sensory scales beyond Anchor H.
- No schema changes for Tracks A–C types.

---

# **1. Rehydrated Anchors (D & H)**

## **1.1 Anchor D — Relationships & Inheritance (Process Context)**

Global identity hierarchy:

- `producer` → `brand` → `sku` → `marketVariant`
- `marketVariant` is the commercial leaf.

Specialized Track D additions:

- `producer` ↔ `processStage` is **many to many** via `producerStage` join docs.
- `processStage` is a **global taxonomy node**, producer agnostic.
- `producerStage` is a **purely relational join row**, no narrative, no PT.
- Process graph is **Producer scoped**; it does not modify Brand/SKU/Variant schemas.
- Frontend reconstructs producer workflows from `producerStage` rows + `processStage` taxonomy.

## **1.2 Anchor H — Sensory & Evaluation Data**

Anchor H governs sensory modeling:

- Defines **sensory attribute vocab and scales**.
- Separates **internal R&D / QC** from **public tasting reviews**.
- Sensory content is descriptive, not pseudo-scientific.
- Numeric sensory values (if defined) must use Anchor H scales.

Track D enforcement:

- `labNoteInternal` = private, internal evaluation only.
- `tastingNotePublic` = editorial, public tasting narrative.
- No sensory fields in `processStage` or `producerStage`.
- No sensory data in Producer or Brand types.
- No chemistry metrics anywhere in Track D.

---

# **2. Types & Editorial Intent**

## **2.1 `processStage`**

**Intent**

Global, category neutral vocabulary of production stages.
Defines _what_ a stage is (e.g., fermentation, distillation, filtration) without describing any specific producer’s implementation.

**Audience**

Internal editors, taxonomists, and any UI that needs a structured process vocabulary.

**Usage**

- Source of truth for stage names, categories, and ordering hints.
- Used indirectly by Producer pages via `producerStage` join docs.
- Never stores producer specific or product specific information.

---

## **2.2 `producerStage`**

**Intent**

Join doc representing **Producer × ProcessStage**.
A single row that states: “This producer performs this stage, with these structural flags.”

**Audience**

Internal architecture and frontend components that render producer workflows.

**Usage**

- Links Producer to `processStage` via Airtable recIds.
- Adds structured flags like `isPrimaryStage`, `isOutsourced`, `stageSequence`.
- Contains no narrative, no PT, no sensory data, no modules.

---

## **2.3 `labNoteInternal`**

**Intent**

Private internal tasting and evaluation notes:

- R&D style commentary.
- QC style comparative assessments.
- Internal editorial notes on flavor, structure, and quality.

**Audience**

Internal team: tasters, editors, QC, sourcing, and strategy.

**Usage**

- Attach to a SKU or Variant for batch or sample specific evaluation.
- May use Anchor H sensory attributes and numeric scales.
- Never visible to public, never used directly on frontend.

---

## **2.4 `tastingNotePublic`**

**Intent**

Public facing, consumer readable tasting narrative.
This is BUY.VODKA’s voice for describing how a product smells, tastes, and feels.

**Audience**

Consumers, trade, and SEO.

**Usage**

- Canonical tasting note for a SKU.
- Variant tasting only where the flavor profile is materially different.
- Editorial copy only; no internal QC commentary, no pseudo-science.

---

# **3. Ownership Contracts (Airtable vs Sanity)**

Global rules from Master Doc and Track A:

- Airtable owns:
  - Immutable IDs (`system.recId`)
  - Business logic fields
  - Catalog and matrix fields
- Sanity owns:
  - `title`, `slug`, `slugHistory`
  - All imagery
  - All editorial PT
  - SEO and status
  - Relations and modules

Applied to Track D:

| Type                | Airtable Owns                                              | Sanity Owns                                                                                 |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `processStage`      | `system.recId`, `stageCode`, `stageCategory`, flags, order | `title`, `slug`, `slugHistory`, `description`, `body`, `notes`, `seo`, `status`, imagery    |
| `producerStage`     | All matrix fields, `producerRecId`, `processStageRecId`    | Minimal global shell: `title`, `slug`, `slugHistory`, `status`, `seo.noIndex`, `system.*`   |
| `labNoteInternal`   | `system.recId`, parent SKU/Variant link, timestamps        | All PT content, sensory attributes, `status` (private), `seo.noIndex`, relations, imagery   |
| `tastingNotePublic` | `system.recId`, parent SKU/Variant link, timestamps        | All PT content, sensory attributes allowed by Anchor H, `status`, `seo`, relations, imagery |

---

# **4. `processStage` Spec**

## **4.1 Intent**

Global production stage taxonomy. Independent of any single producer or product.
Used as the vocabulary for all process graphs.

## **4.2 Fields**

### **Global Fields (Sanity)**

Required:

- `title`
- `slug`
- `slugHistory`
- `description`
- `seo`
- `status`
- `system.source`
- `system.recId`

Optional:

- `body` (PT)
- `images[]`
- `hero`
- `notes.public`
- `notes.private`
- `system.createdAt`
- `system.updatedAt`

### **Structured Fields (Airtable)**

- `stageCode` (string; canonical identifier, immutable)
- `stageCategory` (enum, category neutral)
  - `preparation`
  - `fermentation`
  - `distillation`
  - `maturation`
  - `filtration`
  - `finishing`
  - `packaging`
  - `logistics`
- `stageSubcategory` (optional enum)
  - Examples: `holding`, `tempering`, `preBottlingRest`, `transport`, `preFilterPrep`
- `isCoreStage` (boolean)
- `stageOrder` (optional integer; global ordering hint)
- `parentStage` (self reference; optional)
- `taxonomyTags[]` (optional controlled vocab)
- `isDeprecated` (boolean)
- `technicalShortNotes` (optional shortstring, max ~160 chars, no PT)

### **Narrative Fields (Sanity)**

- `body` (PT; generic description)
- `notes.public` (clarifications)
- `notes.private` (editorial taxonomy intent)

## **4.3 Hierarchy Rules**

- `parentStage` must reference another `processStage`.
- No cycles:
  - Parent cannot be self.
  - Max depth: 2 levels (phase → substage).
- Category agnostic:
  - `title` and `description` must not hardcode specific categories (vodka, whisky, etc).
  - Vodka examples allowed only in `body` as examples.

## **4.4 Validation Summary**

- `title`, `slug.current`, `description`, `stageCode`, `stageCategory`, `system.recId` required.
- `description` ≤ 240 chars.
- `stageCode` unique and immutable except by migration.
- `stageOrder` positive integer when present.
- `body` must follow PT rules from Anchor B (no H1, no empty blocks).

---

# **5. `producerStage` Spec (Producer → Stage Matrix)**

## **5.1 Intent**

Pure join doc: one row = one Producer + one ProcessStage + structural flags.

## **5.2 Fields**

### **Global Shell (Sanity)**

Required:

- `title` (system generated, e.g., `"Northern Distilling – Column Distillation"`)
- `slug` (system generated, e.g., `"producer-<rec>-stage-<rec>"`)
- `slugHistory`
- `status` (should default to private)
- `seo.noIndex` (must be `true`)
- `system.source` (must be `"airtable"`)
- `system.recId`

Optional:

- `system.createdAt`
- `system.updatedAt`

**Not present:**

- `body`
- `description`
- `notes.public`, `notes.private`
- `images`, `hero`
- `relations`
- `modules`
- `sensory.*`

### **Matrix Fields (Airtable)**

Required:

- `producerRecId` (FK to Airtable Producer)
- `processStageRecId` (FK to Airtable ProcessStage)

Optional:

- `isPrimaryStage` (boolean)
- `isOutsourced` (boolean)
- `hasOnsiteCapacity` (boolean)
- `percentageOfProduction` (0–100, float or integer)
- `stageSequence` (integer; per producer ordering hint)
- `capabilityNotes` (shortstring, no line breaks)

## **5.3 Behavior and Constraints**

- `(producerRecId, processStageRecId)` must be unique.
- `seo.noIndex` must always be `true`.
- `status.visibility` should be `"private"` and must never be `"public"` in Studio UI.
- On publish:
  - Matching `producer` document and `processStage` document must exist.

---

# **6. `labNoteInternal` Spec**

## **6.1 Intent**

Internal R&D and QC layer for SKUs and Variants.

## **6.2 Fields**

### **Global Fields**

Required:

- `title`
- `slug`
- `slugHistory`
- `body` (PT, internal narrative)
- `status`
- `status.visibility` (must be `"private"`)
- `seo.noIndex` (must be `true`)
- `system.source`
- `system.recId`
- Exactly one of:
  - `relations.sku`
  - `relations.marketVariant`

Optional:

- `notes.private` (internal commentary)
- `hero`, `images[]` (internal use only)
- `system.createdAt`
- `system.updatedAt`

Disallowed:

- `notes.public` field should be absent at schema level.

### **Structured Sensory Fields (Anchor H compliant)**

Examples, subject to Anchor H:

- `sensory.aroma` (enum or shortstring from vocabulary)
- `sensory.palate`
- `sensory.finish`
- `sensory.intensity` (numeric, Anchor H scale)
- `sensory.length` (numeric or enum, Anchor H scale)

### **Session / Context Fields**

All Sanity owned:

- `sessionDate` (date)
- `reviewer` (string or reference to `author`)
- `sampleBatch` (string)
- `sampleSource` (enum or string, e.g., `productionBatch`, `marketBottle`, `experimentalBlend`)
- `confidence` (enum: `low`, `medium`, `high`)
- `panelType` (enum: `internalQC`, `editorialDraft`, `comparativePanel`)

## **6.3 PT Usage**

- `body` and `notes.private` follow global PT spec, with constraints:
  - No `embedCTA`, no `embedProduct`.
  - Narrative is diagnostic and internal.
- No marketing CTAs.

## **6.4 Constraints**

- `status.visibility` must be `"private"`.
- `seo.noIndex` must be `true`.
- `relations.sku` xor `relations.marketVariant` required:
  - Exactly one present.
- No commerce facts or chemical metrics.

---

# **7. `tastingNotePublic` Spec**

## **7.1 Intent**

Public tasting narrative for SKUs and, where justified, Variants.

## **7.2 Fields**

### **Global Fields**

Required:

- `title`
- `slug`
- `slugHistory`
- `description`
- `body` (PT)
- `seo`
- `status`
- `system.source`
- `system.recId`
- Exactly one of:
  - `relations.sku`
  - `relations.marketVariant`

Optional:

- `hero`, `images[]`
- `notes.public`
- `notes.private`
- `relations.modules` (Track E)
- `system.createdAt`
- `system.updatedAt`

### **Structured Sensory Fields (Anchor H compliant)**

Optional, only if defined in Anchor H:

- `sensory.aroma`
- `sensory.palate`
- `sensory.finish`
- `sensory.intensity`
- `sensory.length`

### **Context Fields**

- `tastingContext` (enum):
  - `canonical` (default SKU level note)
  - `variantSpecific`
  - `limitedEdition`
  - `editorialSingleServe`

## **7.3 PT Usage**

- `body` uses full PT union:
  - `block`, `imageFigure`, `infobox`, `callout`, `gallery`, `timeline`, `tableObject` where useful, `embedCTA`, `embedProduct` (sparingly).
- No QC commentary, no internal comparisons.

## **7.4 SEO Behavior**

- Inherits visibility from parent SKU/Variant:
  - If parent is `noIndex`, tastingNotePublic must be `noIndex`.
- Does not define standalone canonical identity:
  - Canonical URL remains the SKU page, except rare editorial exceptions.
- No product schema; tasting note is narrative only.

---

# **8. Process Graph Design**

## **8.1 Producer Process Graph**

Producer workflows are reconstructed as:

1. Fetch all `producerStage` docs for a Producer.
2. Join each to `processStage` via matching `system.recId`.
3. Order by:
   - Primary: `stageSequence` on `producerStage`, then
   - Secondary: `stageOrder` on `processStage`.
4. Group or visualize by `stageCategory` and `stageSubcategory`.

## **8.2 Allowed Patterns**

- Many Producers referencing the same `processStage`.
- Shallow stage hierarchy:
  - `Distillation` (parent) → `Column Distillation` (child).
- Multiple `producerStage` rows per Producer for different stages.

## **8.3 Disallowed Patterns**

- No references from `processStage` to Producer, Brand, SKU, Variant.
- No references from `producerStage` to Brand, SKU, Variant.
- No process data in tasting types.
- No sensory fields in `processStage` or `producerStage`.

---

# **9. Tasting Data Governance & Placement**

## **9.1 Internal vs Public Layers**

- `labNoteInternal`:
  - Strictly private.
  - NoIndex only.
  - Internal diagnostic PT.
- `tastingNotePublic`:
  - Public editorial tasting copy.
  - May be indexed if parent SKU/Variant is public and indexable.

No automated merging or copying from internal notes to public notes.

## **9.2 Placement Rules**

- Only SKU and Variant can have tasting notes.
- Producer and Brand never have tasting types attached.
- Public tasting:
  - Attaches to SKU by default (canonical).
  - Attaches to Variant only when flavor profile is materially distinct.
- Internal lab notes:
  - Attach to SKU or Variant depending on sample specificity.

## **9.3 Numeric vs Descriptive**

- Numeric sensory values must use Anchor H scales only.
- Descriptive sensory language must live in PT, not structured fields.
- No storing numeric sensory values in commerce types (SKU, Variant).

---

# **10. Validation Rules**

## **10.1 Global**

- All present global fields must respect Track A invariants:
  - `description` ≤ 240 chars.
  - `slug.current` unique per type.
  - Valid `status` combinations.
- Any reference or FK must resolve to correct type.
- No sensory fields on process types.
- No process fields on tasting types.

## **10.2 Per-Type Highlights**

### `processStage`

- Required: `title`, `slug.current`, `description`, `stageCode`, `stageCategory`, `system.recId`.
- `stageCode` unique and immutable.
- `stageCategory` must be one of the enum values.
- `parentStage` cannot create cycles; depth ≤ 2.

### `producerStage`

- Required: `title`, `slug.current`, `producerRecId`, `processStageRecId`, `system.recId`, `seo.noIndex`, `status`.
- `seo.noIndex` must always be `true`.
- `(producerRecId, processStageRecId)` pair must be unique.
- No `body`, no notes, no sensory, no modules.

### `labNoteInternal`

- Required: `title`, `slug.current`, `body`, `status.visibility = "private"`, `seo.noIndex = true`, `system.recId`, exactly one of `relations.sku` or `relations.marketVariant`.
- No `notes.public`.
- `panelType` and `sampleType` optional but constrained to enums.
- No commerce facts or chemistry metrics.

### `tastingNotePublic`

- Required: `title`, `slug.current`, `description`, `body`, `seo`, `status`, `system.recId`, exactly one of `relations.sku` or `relations.marketVariant`.
- If parent SKU/Variant is `noIndex`, tastingNotePublic must also be `noIndex`.
- `tastingContext` optional enum; defaults to `canonical` for SKU level notes.
- No commerce facts or process facts as structured fields.

## **10.3 Cross Type Checks**

- No orphan tasting or lab notes:
  - Each must have a valid SKU or Variant reference.
- Warn on multiple canonical tasting notes per SKU.
- Enforce referential integrity on `producerStage`:
  - Producer and processStage must exist.
- Warn on `processStage` hierarchy depth > 2.

---

# **11. Minimal Examples**

(Already validated internally; see design section examples.)

- One `processStage` example (Column Distillation).
- One `producerStage` example (Northern Distilling × Column Distillation).
- One `labNoteInternal` example (NDC Vodka Batch Review).
- One `tastingNotePublic` example (Northern Column Vodka Tasting Notes).

These examples should be added to a separate examples section or dev docs as needed.

---

# **12. Parking Lot (Track D)**

Out of scope for Track D (for future Tracks / Decision Ledger):

- Additional process categories and subcategories for non vodka verticals.
- Richer `sensory` serialization (radar chart presets, per attribute scoring).
- Any UGC tasting systems or external review ingestion.
- Review schema for structured data (Review, AggregateRating).
- Deeper mapping between process stages and flavor outcomes.

---

# **End of Track D**

Track D is frozen with:

- Clean specialization of process and sensory layers.
- Strong separation of internal vs public tasting.
- Producer scoped process graph.
- SKU scoped canonical tasting identity.
- No cross track contamination into E, F, or G.
