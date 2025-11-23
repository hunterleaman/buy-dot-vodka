# **Track E — Sidebar Modules Specification**

BUY.VODKA Data Architecture
Anchored to Master Document and Tracks A–D

---

# **0. Scope**

Track E defines the **sidebar and module system** for BUY.VODKA:

- Global **module taxonomy** and families.
- Per-module **intent, fields, placement rules, and validation**.
- Slot system semantics: `right`, `below`, `inline`.
- Per-type **module placement maps** (Producer, Brand, Guide, Topic, Resource, Author, SKU, MarketVariant, Track D types).
- Non-breaking **priority tiers, context flags, and exclusivity rules** for future-proof layout and rendering.

Track E **does not**:

- Change global fields or PT objects (Anchors A & B are frozen). :contentReference[oaicite:1]{index=1}
- Change narrative type schemas (Track B). :contentReference[oaicite:2]{index=2}
- Change commerce type schemas (Track C). :contentReference[oaicite:3]{index=3}
- Change specialized/process/tasting type schemas (Track D). :contentReference[oaicite:4]{index=4}
- Implement ownership/authority maps (Track F).
- Generate schema code or migrations (Track G).

All modules are **Sanity-owned editorial structures** attached via `relations.modules[]` on parent documents.

---

# **1. Rehydrated Anchors A–E (Module Context)**

## **1.1 Anchor A — Field Taxonomy & Naming (Context)**

Global document fields (`title`, `slug`, `description`, `body`, `notes`, `seo`, `status`, `system`, `relations`, `metrics`) and naming rules are frozen. Modules must **not introduce new global fields** or alter meaning of existing ones. Narrative remains in PT; facts remain in structured fields. :contentReference[oaicite:5]{index=5}

## **1.2 Anchor B — Portable Text Specification (Context)**

All module PT fields must use the **unified PT spec**:

- Styles: `normal`, `h2`, `h3`, `h4`, bullet, numbered, blockquote, codeBlock.
- Marks: strong, em, underline, code, link, internalLink.
- Objects: `imageFigure`, `callout`, `infobox`, `gallery`, `timeline`, `tableObject`, `embedProduct`, `embedCTA`. :contentReference[oaicite:6]{index=6}

Track E defines **no new PT objects**.

## **1.3 Anchor C — Notes System (Context)**

`notes.public` and `notes.private` remain doc-level annotations only. Modules **may not** move critical facts into notes or depend on notes for required information. :contentReference[oaicite:7]{index=7}

## **1.4 Anchor D — Relationships & Inheritance (Context)**

Global identity hierarchy:

- `producer` → `brand` → `sku` → `marketVariant`
- `marketVariant` is the commercial leaf; process and tasting types hang off SKU/Variant.

Modules must respect this hierarchy and cannot change ownership of identity, commerce, or sensory data.

## **1.5 Anchor E — Sidebar & Modules Layout (Context)**

Anchor E defines:

- Slots: `right`, `below`, `inline`.
- Modules attach via `relations.modules` with explicit ordering.
- Page layouts draw from a shared module library. :contentReference[oaicite:9]{index=9}

Track E **completes** Anchor E by specifying:

- The full module taxonomy.
- Per-module field sets and constraints.
- Per-slot and per-type placement rules.
- Priority tiers, context flags, and mutual exclusivity.

---

# **2. Global Module Principles**

## **2.1 Definition of a Module**

A **module** is a reusable, typed content object with:

- A single, clear **editorial purpose**.
- Structured fields and/or PT fields (within Anchor B).
- Strict rules for **which document types** and **which slots** it may appear in.
- Optional metadata logic (priority, context, exclusivity) for layout governance.

Modules are attached via:

```ts
relations: {
  modules?: Reference<"module">[]
}
```

(Actual schema lives in Track G.)

## **2.2 Module Families**

Modules are grouped into six families:

1. **Fact modules** – compact, structured facts (identity, specs, availability).
2. **Narrative modules** – small PT-driven storytelling units.
3. **Commerce modules** – purchasing and product navigation helpers.
4. **Tasting modules** – structured public flavor summaries (Anchor H compliant via Track D).
5. **Process modules** – human-readable process summaries built over Track D matrix.
6. **Utility / navigation modules** – cross-linking (brands, guides, topics, resources, authors).

Each module belongs to **exactly one** family.

## **2.3 Slots**

- `right` – compact, high-signal, scannable cards.
- `below` – extended, multi-block, deeper modules.
- `inline` – inline with PT, localized semantics.

Modules declare allowed slots; front-end can adapt rendering but **cannot violate slot semantics**.

## **2.4 Priority Tiers**

Each module has a **priority tier**:

- **P1 — Canonical**: critical to understanding the page (for example, SKU FactSheetBasic, AvailabilitySummary).
- **P2 — High-value**: strongly recommended; can be dropped if needed.
- **P3 — Enrichment**: nice-to-have; safe to drop on constrained layouts.

Within each slot, modules should be rendered in **priority order** (P1 → P2 → P3) before applying editor ordering.

## **2.5 Context Flags**

Each module has a **default context** per type:

- `canonical-context` – defines the “spine” of the page when present.
- `supporting-context` – enriches but is not required.
- `conditional-context` – allowed only under specific editorial conditions (for example, variant’s tasting module only when flavor differs materially).

Context flags are **conceptual** (not new fields) but guide validation and rendering logic.

## **2.6 Exclusivity**

Some modules have **mutual exclusivity** to avoid redundancy or confusion (for example, a page should not surface both SiblingSKUs and SiblingVariants, and only one BuyCTACompact per page).

Exclusivity is enforced at the **spec and validation** level, not via new schema primitives.

---

# **3. Module Taxonomy Overview**

Short list of all modules (detailed specs in Section 4):

### **Fact Modules**

1. `factSheetBasic`
2. `factSheetExtended`
3. `producerProcessMatrixSummary`
4. `regulatoryFlags`
5. `availabilitySummary`

### **Narrative Modules**

6. `storyHighlight`
7. `timelineModule`
8. `galleryModule`
9. `glossaryPanel`
10. `citationModule`

### **Commerce Modules**

11. `siblingSkus`
12. `siblingVariants`
13. `buyCtaCompact`
14. `whereToBuyGuide`

### **Tasting Modules**

15. `tastingSummaryPublic`
16. `aromaPalateFinishBreakdown`
17. `servingSuggestions`

### **Process Modules**

18. `producerProcessOverview`
19. `stageInfobox`

### **Utility / Navigation Modules**

20. `relatedBrands`
21. `relatedGuides`
22. `relatedTopics`
23. `relatedResources`
24. `authorCard`
25. `socialLinksCard`
26. `inlineInfobox`

---

# **4. Module Specifications**

Each module spec includes:

- **Family**
- **Intent & placement**
- **Allowed types**
- **Allowed slots**
- **Priority, context, exclusivity**
- **Field list (required / optional)**
- **PT usage rules**
- **Validation rules**
- **JSON-like example**

## **4.1 Fact Modules**

---

### **4.1.1 `factSheetBasic`**

**Family:** Fact
**Intent:** Compact identity snapshot card (Producer/Brand/SKU/Variant).
**Placement:** Typically `right` slot as the first factual card.

- **allowedTypes:** `producer`, `brand`, `sku`, `marketVariant`
- **allowedSlots:** `right`, `below` (rare)
- **priority:** P1
- **context:** canonical-context
- **exclusivity:** Cannot share the **same slot** with `factSheetExtended`.

**Fields**

- **Required**
  - `items[]`:
    - `label` (string)
    - `value` (string)

- **Optional**
  - `disclaimer` (string, short)

**PT usage:** None.

**Validation**

- `items.length >= 2`.
- On `brand`/`producer`, items must not encode catalog-only commerce facts (ABV, pack, prices).
- On `sku`/`marketVariant`, ABV/size/origin are allowed as **display** values only; authoritative data remains in Airtable and doc fields.

**Example**

```json
{
  "_type": "factSheetBasic",
  "items": [
    { "label": "ABV", "value": "40%" },
    { "label": "Base", "value": "Winter wheat" },
    { "label": "Origin", "value": "Poland" }
  ],
  "disclaimer": "Specs may vary slightly by market."
}
```

---

### **4.1.2 `factSheetExtended`**

**Family:** Fact
**Intent:** Deeper technical spec for SKUs only.

- **allowedTypes:** `sku`
- **allowedSlots:** `below` (preferred), optionally `right` in compact layouts
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** Cannot appear in `right` when `factSheetBasic` is also in `right`.

**Fields**

- **Required**
  - `sections[]`:
    - `title` (string)
    - `items[]`:
      - `label` (string)
      - `value` (string)

- **Optional**
  - `footnote` (string)

**PT usage:** None.

**Validation**

- `sections.length >= 1`.
- Each `sections[i].items.length >= 1`.
- SKU-only.

**Example**

```json
{
  "_type": "factSheetExtended",
  "sections": [
    {
      "title": "Production",
      "items": [
        { "label": "Distillation", "value": "Multi-column" },
        { "label": "Filtration", "value": "Charcoal" }
      ]
    },
    {
      "title": "Packaging",
      "items": [
        { "label": "Bottle size", "value": "750ml" },
        { "label": "Case pack", "value": "12" }
      ]
    }
  ],
  "footnote": "Specs as of 2025 production."
}
```

---

### **4.1.3 `producerProcessMatrixSummary`**

**Family:** Fact
**Intent:** Surface key process stages derived from `producerStage` join docs.

- **allowedTypes:** `producer`
- **allowedSlots:** `below`, `right` (compact)
- **priority:** P2
- **context:** conditional-context
- **exclusivity:** Should not appear in the same slot as `producerProcessOverview`.

**Fields**

- **Required**
  - `stages[]`:
    - `stageTitle` (string)
    - `category` (enum: `preparation` | `fermentation` | `distillation` | `maturation` | `filtration` | `finishing` | `packaging` | `logistics`)

- **Optional**
  - `notes` (PT; short)

**Validation**

- `stages.length >= 1`.
- Each stage must map to a valid `processStage` by title or code.

**Example**

```json
{
  "_type": "producerProcessMatrixSummary",
  "stages": [
    { "stageTitle": "Fermentation", "category": "fermentation" },
    { "stageTitle": "Column distillation", "category": "distillation" },
    { "stageTitle": "Filtration", "category": "filtration" }
  ],
  "notes": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "All stages are performed in-house at the main facility."
        }
      ]
    }
  ]
}
```

---

### **4.1.4 `regulatoryFlags`**

**Family:** Fact
**Intent:** Display certifications, awards, compliance badges.

- **allowedTypes:** `sku`, `marketVariant`
- **allowedSlots:** `right`, `below`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `flags[]`:
    - `label` (string)
    - `code` (string)

- **Optional**
  - `note` (string)

**Validation**

- `flags.length >= 1`.
- `code` must map to a known certification/award configuration.

**Example**

```json
{
  "_type": "regulatoryFlags",
  "flags": [
    { "label": "Organic EU", "code": "ORG_EU" },
    { "label": "Double Gold - SF Spirits", "code": "SF_DG_2024" }
  ],
  "note": "Awards may differ by batch or market."
}
```

---

### **4.1.5 `availabilitySummary`**

**Family:** Fact
**Intent:** High-level availability and markets snapshot.

- **allowedTypes:** `sku`, `marketVariant`
- **allowedSlots:** `right`
- **priority:** P1
- **context:** canonical-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `availability` (string or enum; e.g. `inProduction`, `seasonal`, `limited`, `discontinued`)
  - `markets[]` (array of strings)

- **Optional**
  - `note` (string)

**Validation**

- `markets.length >= 1`.
- No pricing or inventory counts.

**Example**

```json
{
  "_type": "availabilitySummary",
  "availability": "In production",
  "markets": ["US", "Canada", "EU"],
  "note": "Availability can vary by region and distributor."
}
```

---

## **4.2 Narrative Modules**

---

### **4.2.1 `storyHighlight`**

**Family:** Narrative
**Intent:** One compact story block that encapsulates “what matters most”.

- **allowedTypes:** `producer`, `brand`, `guide`, `topic`, `resource`, `author`, `sku`
- **allowedSlots:** `right`, `below`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `body` (PT; short narrative)

**Validation**

- Recommended ≤ 3 blocks.
- No `embedProduct` or `embedCTA` (keep purely editorial).

**Example**

```json
{
  "_type": "storyHighlight",
  "body": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "Family-run distillery crafting vodka from winter wheat since 1932."
        }
      ]
    }
  ]
}
```

---

### **4.2.2 `timelineModule`**

**Family:** Narrative
**Intent:** Short historical timeline.

- **allowedTypes:** `producer`, `brand`, `sku`, `guide` (occasionally)
- **allowedSlots:** `below`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `events[]`:
    - `year` (number or string)
    - `title` (string)
    - `description` (optional string)

**Validation**

- `events.length >= 1`.
- Front-end should sort by `year` ascending.

**Example**

```json
{
  "_type": "timelineModule",
  "events": [
    { "year": 1932, "title": "Distillery founded" },
    { "year": 1975, "title": "First export to Western Europe" },
    { "year": 2020, "title": "Launch of flagship vodka" }
  ]
}
```

---

### **4.2.3 `galleryModule`**

**Family:** Narrative
**Intent:** Lightweight image gallery.

- **allowedTypes:** `producer`, `brand`, `sku`, `marketVariant`, `guide`, `topic`
- **allowedSlots:** `below`
- **priority:** P3
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `images[]` (Sanity images)

**Validation**

- `images.length >= 2`.

**Example**

```json
{
  "_type": "galleryModule",
  "images": [
    { "_type": "image", "asset": { "_ref": "image-distillery-exterior" } },
    { "_type": "image", "asset": { "_ref": "image-bottle-hero" } }
  ]
}
```

---

### **4.2.4 `glossaryPanel`**

**Family:** Narrative
**Intent:** Term + short definition.

- **allowedTypes:** `guide`, `topic`
- **allowedSlots:** `right`, `below`, `inline` (as a small inline object)
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `term` (string)
  - `definition` (PT, concise)

**Validation**

- `definition` must be short, accessible.
- No CTAs, no commerce content.

**Example**

```json
{
  "_type": "glossaryPanel",
  "term": "Rectification",
  "definition": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "A refining step that further purifies the distilled spirit."
        }
      ]
    }
  ]
}
```

---

### **4.2.5 `citationModule`**

**Family:** Narrative
**Intent:** Citations and sources.

- **allowedTypes:** `guide`, `topic`, `resource`
- **allowedSlots:** `below`, `right`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `citations[]`:
    - `label` (string)
    - `url` (string)

**Validation**

- `citations.length >= 1`.
- `url` must be a valid URL.

**Example**

```json
{
  "_type": "citationModule",
  "citations": [
    {
      "label": "EU Spirit Regulations",
      "url": "https://example.com/eu-spirits-regulations"
    }
  ]
}
```

---

## **4.3 Commerce Modules**

---

### **4.3.1 `siblingSkus`**

**Family:** Commerce
**Intent:** Navigate related SKUs in same brand/portfolio.

- **allowedTypes:** `sku`
- **allowedSlots:** `below`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** Cannot coexist with `siblingVariants` on the same document.

**Fields**

- **Required**
  - `skus[]` (references to `sku`)

**Validation**

- `skus.length >= 1`.

**Example**

```json
{
  "_type": "siblingSkus",
  "skus": [
    { "_type": "reference", "_ref": "sku-northern-column" },
    { "_type": "reference", "_ref": "sku-northern-column-reserve" }
  ]
}
```

---

### **4.3.2 `siblingVariants`**

**Family:** Commerce
**Intent:** Navigate variants of the same SKU.

- **allowedTypes:** `marketVariant`
- **allowedSlots:** `below`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** Cannot coexist with `siblingSkus`.

**Fields**

- **Required**
  - `variants[]` (references to `marketVariant`)

**Validation**

- `variants.length >= 1`.

**Example**

```json
{
  "_type": "siblingVariants",
  "variants": [
    { "_type": "reference", "_ref": "mv-nc-750-us" },
    { "_type": "reference", "_ref": "mv-nc-1000-eu" }
  ]
}
```

---

### **4.3.3 `buyCtaCompact`**

**Family:** Commerce
**Intent:** Single, simple purchase CTA hooked to affiliate targets.

- **allowedTypes:** `sku`, `marketVariant`
- **allowedSlots:** `right`
- **priority:** P1
- **context:** canonical-context
- **exclusivity:** At most one `buyCtaCompact` per document.

**Fields**

- **Required**
  - `label` (string)
  - `affiliateTargets[]` (array of affiliate source IDs/codes)

- **Optional**
  - `subLabel` (string)

**Validation**

- `affiliateTargets.length >= 1`.
- Only one instance allowed per document.

**Example**

```json
{
  "_type": "buyCtaCompact",
  "label": "Buy now",
  "subLabel": "Opens partner retailer",
  "affiliateTargets": ["recAff123", "recAff456"]
}
```

---

### **4.3.4 `whereToBuyGuide`**

**Family:** Commerce
**Intent:** Editorial guidance on where/how to purchase.

- **allowedTypes:** `sku`
- **allowedSlots:** `below`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `body` (PT)

**Example**

```json
{
  "_type": "whereToBuyGuide",
  "body": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "Look for this vodka at independent spirits shops and specialty online retailers."
        }
      ]
    }
  ]
}
```

---

## **4.4 Tasting Modules**

(Uses Anchor H semantics routed through Track D; only **public**, editorial tasting, no internal QC.)

---

### **4.4.1 `tastingSummaryPublic`**

**Family:** Tasting
**Intent:** Public-facing flavor overview.

- **allowedTypes:** `sku` (default), `marketVariant` (conditional special cases)
- **allowedSlots:** `right`
- **priority:** P1
- **context:** canonical-context (SKU), conditional-context (Variant)
- **exclusivity:** None.

**Fields**

- **Required**
  - `aroma` (string)
  - `palate` (string)
  - `finish` (string)

- **Optional**
  - `mood` (string)

**Validation**

- No ABV, pack, or price.
- Variant usage only when editorially flagged as flavor-distinct.

**Example**

```json
{
  "_type": "tastingSummaryPublic",
  "aroma": "Soft grain sweetness with a hint of citrus",
  "palate": "Clean, silky mouthfeel with subtle mineral notes",
  "finish": "Crisp, dry finish with light pepper spice",
  "mood": "Built for martinis and highballs"
}
```

---

### **4.4.2 `aromaPalateFinishBreakdown`**

**Family:** Tasting
**Intent:** Slightly more structured flavor breakdown.

- **allowedTypes:** `sku`
- **allowedSlots:** `below`
- **priority:** P2
- **context:** conditional-context
- **exclusivity:** None.

**Fields**

- **Required** – at least one of:
  - `aroma` (string)
  - `palate` (string)
  - `finish` (string)

- **Optional**
  - `intensity` (string/enum)
  - `length` (string/enum)

**Example**

```json
{
  "_type": "aromaPalateFinishBreakdown",
  "aroma": "Fresh grain, light vanilla",
  "palate": "Neutral to lightly sweet",
  "finish": "Short to medium, very clean",
  "intensity": "Medium",
  "length": "Medium"
}
```

---

### **4.4.3 `servingSuggestions`**

**Family:** Tasting
**Intent:** How to enjoy the product (serves/cocktails).

- **allowedTypes:** `sku` (default), `marketVariant` (conditional release cases)
- **allowedSlots:** `below`
- **priority:** P2
- **context:** conditional-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `body` (PT)

**Example**

```json
{
  "_type": "servingSuggestions",
  "body": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "Ideal in a dry martini or stirred with tonic over ice."
        }
      ]
    }
  ]
}
```

---

## **4.5 Process Modules**

---

### **4.5.1 `producerProcessOverview`**

**Family:** Process
**Intent:** Narrative summary of a producer’s process.

- **allowedTypes:** `producer`
- **allowedSlots:** `below`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** Should not share the same slot with `producerProcessMatrixSummary`.

**Fields**

- **Required**
  - `body` (PT)
  - `steps[]`:
    - `stageTitle` (string)
    - `summary` (string)

**Validation**

- `steps.length >= 1`.
- Stage titles should align with processStage taxonomy.

**Example**

```json
{
  "_type": "producerProcessOverview",
  "body": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "This producer handles fermentation and distillation on site, then sends spirit off-site for bottling."
        }
      ]
    }
  ],
  "steps": [
    {
      "stageTitle": "Fermentation",
      "summary": "Winter wheat fermented in temperature-controlled stainless steel tanks."
    },
    {
      "stageTitle": "Column distillation",
      "summary": "Multi-column distillation for high purity neutral spirit."
    }
  ]
}
```

---

### **4.5.2 `stageInfobox`**

**Family:** Process
**Intent:** Stage definition box, inline or small card.

- **allowedTypes:** `producer`, `guide`, `topic`, `brand`, `sku`
- **allowedSlots:** `inline`, `right`, `below`
- **priority:** P3
- **context:** conditional-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `title` (string)
  - `body` (PT; short)

- **Optional**
  - `stageCode` (string)

**Validation**

- `body` is concise and explanatory.
- No commerce or tasting content.

**Example**

```json
{
  "_type": "stageInfobox",
  "title": "Column Distillation",
  "stageCode": "DIST_COLUMN",
  "body": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "A continuous distillation method using stacked plates to refine the spirit."
        }
      ]
    }
  ]
}
```

---

## **4.6 Utility / Navigation Modules**

---

### **4.6.1 `relatedBrands`**

**Family:** Utility
**Intent:** Brand cross-links.

- **allowedTypes:** `producer`, `sku`
- **allowedSlots:** `right`, `below`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `brands[]` (references to `brand`)

**Example**

```json
{
  "_type": "relatedBrands",
  "brands": [
    { "_type": "reference", "_ref": "brand-northern-column" },
    { "_type": "reference", "_ref": "brand-northern-reserve" }
  ]
}
```

---

### **4.6.2 `relatedGuides`**

**Family:** Utility
**Intent:** Educational guide cross-links.

- **allowedTypes:** `guide`, `topic`, `brand`, `sku`
- **allowedSlots:** `below`, `right`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `guides[]` (references to `guide`)

**Example**

```json
{
  "_type": "relatedGuides",
  "guides": [
    { "_type": "reference", "_ref": "guide-how-vodka-is-made" },
    { "_type": "reference", "_ref": "guide-vodka-vs-gin" }
  ]
}
```

---

### **4.6.3 `relatedTopics`**

**Family:** Utility
**Intent:** Topic cross-links.

- **allowedTypes:** `guide`, `topic`, `brand`, `sku`, `resource`
- **allowedSlots:** `below`, `right`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `topics[]` (references to `topic`)

**Example**

```json
{
  "_type": "relatedTopics",
  "topics": [
    { "_type": "reference", "_ref": "topic-column-distillation" },
    { "_type": "reference", "_ref": "topic-neutral-grain-spirit" }
  ]
}
```

---

### **4.6.4 `relatedResources`**

**Family:** Utility
**Intent:** External/internal resource links.

- **allowedTypes:** `producer`, `brand`, `guide`, `topic`, `resource`, `sku`
- **allowedSlots:** `below`, `right`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `resources[]` (references to `resource`)

**Example**

```json
{
  "_type": "relatedResources",
  "resources": [{ "_type": "reference", "_ref": "resource-eu-regulation-pdf" }]
}
```

---

### **4.6.5 `authorCard`**

**Family:** Utility
**Intent:** Author identity preview.

- **allowedTypes:** `guide`, `topic`, `resource`, `author`
- **allowedSlots:** `right`
- **priority:** P1 (on author pages), P2 elsewhere
- **context:** canonical-context for `author`, supporting-context otherwise
- **exclusivity:** None.

**Fields**

- **Required**
  - `author` (reference to `author`)

- **Optional**
  - `overrideBio` (string)
  - `roleLabel` (string)

**Example**

```json
{
  "_type": "authorCard",
  "author": { "_type": "reference", "_ref": "author-hunter-leaman" },
  "roleLabel": "Editor-in-chief",
  "overrideBio": "Hunter writes about vodka, data architecture, and digital infrastructure."
}
```

---

### **4.6.6 `socialLinksCard`**

**Family:** Utility
**Intent:** Social/contact links for brand or author.

- **allowedTypes:** `author`, `brand`
- **allowedSlots:** `right`, `below`
- **priority:** P2
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `links[]`:
    - `label` (string)
    - `platform` (string)
    - `url` (string)

**Example**

```json
{
  "_type": "socialLinksCard",
  "links": [
    {
      "label": "Website",
      "platform": "site",
      "url": "https://example-vodka.com"
    },
    {
      "label": "Instagram",
      "platform": "instagram",
      "url": "https://instagram.com/examplevodka"
    }
  ]
}
```

---

### **4.6.7 `inlineInfobox`**

**Family:** Utility
**Intent:** General-purpose editorial infobox, usually inline.

- **allowedTypes:** Any PT-enabled type
- **allowedSlots:** `inline`, `below`
- **priority:** P3
- **context:** supporting-context
- **exclusivity:** None.

**Fields**

- **Required**
  - `title` (string)
  - `body` (PT)

- **Optional**
  - `tone` (string/enum: `info` | `warning` | `tip`)

**Validation**

- No explicit CTAs (`embedCTA` disallowed).
- No `embedProduct`.

**Example**

```json
{
  "_type": "inlineInfobox",
  "title": "Editor note",
  "tone": "info",
  "body": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "This vodka is produced in small annual batches, so distribution may fluctuate."
        }
      ]
    }
  ]
}
```

---

# **5. Slot-Level Rules**

## **5.1 `right` Slot**

**Purpose:** Compact, prime real estate for high-signal modules.

**Allowed modules**

- `factSheetBasic` (P1)
- `factSheetExtended` (P2; SKU only, and not with Basic in same slot)
- `availabilitySummary` (P1)
- `tastingSummaryPublic` (P1, SKU; Variant conditional)
- `buyCtaCompact` (P1)
- `regulatoryFlags` (P2)
- `storyHighlight` (P2)
- `glossaryPanel` (P2; Guide/Topic)
- `citationModule` (P2; compact variant)
- `relatedBrands` (P2)
- `relatedGuides` (P2)
- `relatedTopics` (P2)
- `relatedResources` (P2)
- `authorCard` (P1 on author pages)
- `socialLinksCard` (P2)
- `stageInfobox` (P3; small card variant)

**Validation**

- Only one `buyCtaCompact` per page.
- `factSheetBasic` and `factSheetExtended` cannot both render in `right`.
- Priority-based ordering recommended (P1 → P2 → P3).

---

## **5.2 `below` Slot**

**Purpose:** Deeper, multi-block modules.

**Allowed modules**

- `factSheetExtended`
- `producerProcessMatrixSummary`
- `producerProcessOverview`
- `timelineModule`
- `galleryModule`
- `siblingSkus`
- `siblingVariants`
- `whereToBuyGuide`
- `citationModule`
- `glossaryPanel`
- `relatedBrands`
- `relatedGuides`
- `relatedTopics`
- `relatedResources`
- `aromaPalateFinishBreakdown`
- `servingSuggestions`
- `stageInfobox` (larger card variant)
- `inlineInfobox` (card variant)

**Validation**

- `siblingSkus` and `siblingVariants` may not appear on the same document.
- Process modules only allowed on Producer.
- Tasting modules only allowed on SKU (or Variant if conditional).

---

## **5.3 `inline` Slot**

**Purpose:** Local, semantic additions inside PT narratives.

**Allowed modules**

- `inlineInfobox`
- `stageInfobox`
- `glossaryPanel` (inline variant)

**Validation**

- No direct commerce (`buyCtaCompact`, `availabilitySummary`) inline.
- No heavy fact sheets inline.
- Inline modules must not be required for comprehension of core facts (body stays primary).

---

# **6. Type-Level Placement Rules**

## **6.1 Producer**

- **Allowed families:** Fact, Narrative, Process, Utility.
- **Disallowed families:** Commerce, Tasting.

**Typical loadout:**

- `right`: `factSheetBasic` (P1), `relatedBrands`, `storyHighlight`.
- `below`: `producerProcessOverview` and/or `producerProcessMatrixSummary`, `timelineModule`, `galleryModule`, `relatedResources`.

---

## **6.2 Brand**

- **Allowed families:** Fact, Narrative, Utility.
- **Disallowed:** Tasting, Commerce (no SKU/Variant commerce modules), Process overview.

**Key rules:**

- `factSheetBasic` may only use brand-level facts (no ABV, pack, price).
- No `tastingSummaryPublic`, `availabilitySummary`, `buyCtaCompact`, `siblingSkus`, `siblingVariants`.

---

## **6.3 SKU**

- **Allowed families:** Fact, Narrative, Commerce, Tasting, Utility.
- **Disallowed:** Process modules (process is Producer-scoped).

**Canonical modules:**

- `factSheetBasic` (P1)
- `availabilitySummary` (P1)
- `tastingSummaryPublic` (P1)
- `buyCtaCompact` (P1)

**Supporting modules:**

- `factSheetExtended`, `siblingSkus`, `whereToBuyGuide`, `galleryModule`, `timelineModule`, tasting extras, related guides/resources/topics.

---

## **6.4 MarketVariant**

- **Allowed families:** Fact, Commerce, Utility (limited), conditional Tasting.
- **Disallowed:** Process modules, extended fact modules, educational narrative modules.

**Key rules:**

- `factSheetBasic`, `availabilitySummary`, `buyCtaCompact` allowed.
- `siblingVariants` allowed (not `siblingSkus`).
- `tastingSummaryPublic` only if variant flavor is truly distinct from parent SKU (conditional-context).
- No `factSheetExtended`.

---

## **6.5 Guide**

- **Allowed families:** Narrative, Utility, minimal Fact (if needed as a summary card).
- **Disallowed:** Commerce, Tasting, Process overview, SKU/Variant facts.

**Common modules:**

- `storyHighlight`, `glossaryPanel`, `citationModule`, `relatedGuides`, `relatedTopics`, `relatedResources`, `authorCard`.

---

## **6.6 Topic**

- Similar to Guide but more concise.

**Modules:**

- `glossaryPanel` (canonical contextual definition), `relatedGuides`, `relatedResources`, `relatedTopics`, `citationModule`.

---

## **6.7 Resource**

- **Allowed:** `storyHighlight`, `citationModule`, `relatedGuides`, `relatedTopics`, `relatedResources`.
- **Disallowed:** Commerce, Tasting, Process, SKU facts.

---

## **6.8 Author**

- **Allowed:** `authorCard` (canonical), `socialLinksCard`, `inlineInfobox`.
- **Disallowed:** All commerce, tasting, process, fact sheets.

---

## **6.9 Track D Types**

- `labNoteInternal`: **no modules** (private, internal).
- `tastingNotePublic`: may use `inlineInfobox` inline only; no side modules.
- `processStage`, `producerStage`: taxonomy/join docs, no modules.

---

# **7. Validation Summary (Track E)**

### **7.1 Per-module**

- Fields must follow each module’s specification (Section 4).
- PT fields must respect Anchor B PT constraints.

### **7.2 Per-slot**

- `right`: compact only; no heavy narrative modules (for example, no large galleries).
- `below`: extended modules; may host multiple P2/P3 modules.
- `inline`: only lightweight infobox/stage/glossary style modules.

### **7.3 Per-type**

- Producer: no commerce or tasting modules.
- Brand: no tasting or availability modules, no SKU fact sheets.
- SKU: full module set except process overview.
- Variant: constrained subset (no `factSheetExtended`, no heavy tasting extras by default).
- Guide/Topic/Resource/Author: no commerce or tasting modules.

### **7.4 Exclusivity**

- `siblingSkus` and `siblingVariants` cannot coexist.
- Only one `buyCtaCompact` per doc.
- `factSheetBasic` and `factSheetExtended` cannot share the same slot.
- `producerProcessOverview` and `producerProcessMatrixSummary` should not appear in the same slot.

---

# **8. Parking Lot (Track E)**

Out-of-scope ideas for future Tracks or Decision Ledger:

1. **Personalization / behavioral layouts**
   - Intent-based module loadouts based on user history or referrer.

2. **Interactive experience modules**
   - Comparisons, sliders, flavor wheels, guided quizzes.

3. **UGC / social proof modules**
   - Review snippets, external ratings, aggregated scores.

4. **Automated module ordering rules**
   - Runtime heuristics that leverage priority/context flags.

5. **Campaign-specific module variants**
   - Modules tailored for promo landing pages or time-limited campaigns.

These concepts must be handled in **future tracks** or decision entries before any schema or implementation changes.
