# **Track F — Ownership Contracts & Authority Model**
BUY.VODKA Data Architecture
Anchored to Master Document and Tracks A–E + H

---

# **0. Scope**

Track F defines the **complete authority, inheritance, sync, lifecycle, and module-ownership contracts** between **Airtable** (facts) and **Sanity** (editorial) for every type and field across:

- Producer → Brand → SKU → MarketVariant
- Guide → Topic → Resource → Author
- ProcessStage → ProducerStage
- labNoteInternal → tastingNotePublic

Track F **never** introduces new fields, modifies schemas, changes module taxonomy, or redefines identity hierarchy.
Track G implements these contracts in schema code.

---

# **1. Global Ownership Model**

## **1.1 Sanity-Owned Fields (Editorial)**

Sanity has full, exclusive authority over:

- `title`, `slug`, `slugHistory`
- `description`, `body` (PT)
- `hero`, `images[]`
- `notes.public`, `notes.private`
- `seo.*`
- `status.*`
- `relations.*`
- `metrics.*`
- `modules[]` (via `relations.modules`)

These fields are never overwritten by Airtable.

---

## **1.2 Airtable-Owned Fields (Factual)**

Airtable owns all structured catalog, commerce, process, and identity-matrix facts:

### **Commerce (SKU + Variant)**
- `skuCode`, `variantCode`
- `abv`, `proof`
- `country`, `region`, `bottlingLocation`
- `primarySizeMl`, `sizeMl`, `packType`, `casePack`, `containerType`
- `cost`, `wholesalePrice`, `msrp`
- `availability`, `isDiscontinued`
- `distributorFlags[]`
- `affiliateSourceRecIds[]`
- `producerRecId`, `brandRecId`

### **Process**
- `stageCode`, `stageCategory`, `stageSubcategory`
- `isCoreStage`, `stageOrder`, `parentStage`
- `taxonomyTags[]`, `technicalShortNotes`
- `isDeprecated`

### **Process Matrix (ProducerStage)**
- `producerRecId`, `processStageRecId`
- `isPrimaryStage`, `isOutsourced`, `hasOnsiteCapacity`
- `percentageOfProduction`, `stageSequence`, `capabilityNotes`

Airtable values always win on conflict.

---

## **1.3 System Fields (Mixed)**

| Field                          | Owner                                | Notes |
|--------------------------------|---------------------------------------|-------|
| `system.source`                | Mixed                                 | `"airtable"` for Airtable-first docs, `"sanity"` for Sanity-native. |
| `system.recId`                 | Airtable for Airtable docs; Sanity for native docs | Determines sync direction. |
| `system.createdAt`, `updatedAt`| Airtable for Airtable docs; Sanity for native docs | No cross-system overwrites. |

---

# **2. Authority Maps Per Type**

## **2.1 Producer / Brand**

**Airtable:** recId + optional catalog fields.
**Sanity:** narrative, PT, SEO, slugs, images, modules, status, notes.

Identity graph (Producer→Brand) always mirrors Airtable’s FK structure.

---

## **2.2 SKU (Canonical Commerce Identity)**

**Airtable owns:**
All commerce facts: codes, ABV, pack, size, pricing, availability, distributor flags, affiliate relationships.

**Sanity owns:**
All narrative/editorial: title, slug, description, body, tasting notes, images, SEO, modules, notes.

**Override:**
Variant may override SKU if field exists in variant schema.

---

## **2.3 MarketVariant (Commerce Leaf)**

**Airtable:**
All variant-specific fields (sizeMl, packType, market, variant ABV, variant pricing).

**Sanity:**
Variant editorial layer.

**Inheritance:**
If a variant field is empty → read-time fallback to SKU; no write-time inheritance.

---

## **2.4 Guide / Topic / Author**

All Sanity-native.
No Airtable tables.
All fields owned by Sanity.

---

## **2.5 Resource**

Two modes:

- **Airtable-backed Resource**:
  - Airtable owns `system.recId`, `resourceType`, `sourceUrl`, citation meta.
  - Sanity owns narrative, SEO, modules.

- **Sanity-native Resource**:
  - `system.source = "sanity"`
  - All fields Sanity-owned.

---

## **2.6 ProcessStage / ProducerStage**

**ProcessStage**
- Airtable: taxonomy facts (codes, categories, ordering).
- Sanity: title, slug, description, optional PT, imagery, SEO, status.

**ProducerStage**
- Airtable: entire matrix row (Producer × ProcessStage).
- Sanity: minimal wrapper (slug, title, recId, status.private, seo.noIndex = true).
No narrative, no PT, no modules.

---

## **2.7 labNoteInternal / tastingNotePublic**

**labNoteInternal**
- Sanity-native (no Airtable table).
- All sensory + PT content Sanity-owned.
- Always private, noIndex.

**tastingNotePublic**
- Usually Sanity-native.
- Editorial tasting narrative only; no commerce facts.

---

# **3. Inheritance Rules**

## **3.1 Allowed Inheritance (Read-Time Only)**

- **Variant → SKU**
  - description, body
  - hero, images
  - awards/certifications (if variant has none)
- **SKU → Brand/Producer**
  - conceptual narrative fallback only (UI-level)

No write-time inheritance ever occurs.

---

## **3.2 Override Rules**

- Variant overrides SKU **only** for Airtable-defined variant fields.
- Sanity narrative overrides upstream narrative per field.
- Tasting docs override previous tasting docs via status or editorial selection.

---

## **3.3 Forbidden Inheritance**

- Facts must not inherit upward or sideways.
- Sensory never inherits.
- Process never inherits.
- Modules never inherit.

---

# **4. Sync Semantics & Conflict Resolution**

## **4.1 Airtable → Sanity**

Airtable updates are **authoritative:**

- Overwrite Airtable-owned fields in Sanity.
- Clear Sanity field if Airtable sends null.
- Update Sanity relations to match Airtable FKs.

---

## **4.2 Sanity → Sanity**

All Sanity-owned fields are fully writable.
No outbound sync.

---

## **4.3 Sanity → Airtable**

Not permitted (except `system.source` or metadata logging).
Attempts to modify Airtable fields are blocked.

---

## **4.4 Conflict Matrix**

| Conflict Type                        | Winner    | Behavior |
|--------------------------------------|-----------|----------|
| Fact vs Narrative                    | Airtable  | Narrative must yield; facts overwrite. |
| Variant fact vs SKU fact             | Variant   | If field part of variant schema. |
| Sanity edits Airtable fact           | Blocked   | Studio read-only; sync reverts if mutated via API. |
| Airtable edits Sanity field          | Blocked   | Field omitted from payload; no write surface. |

---

# **5. Lifecycle Rules**

## **5.1 Creation**

### **Airtable-First Docs**
(Producer, Brand, SKU, MarketVariant, Certifications, Awards, AffiliateSources, ProcessStage, ProducerStage, Airtable-backed Resources)

Shell doc auto-initializes in Sanity:

```json
title: "Untitled {Type}"
description: "Editorial description coming soon."
body: [ { _type: "block", style: "normal", children: [{ text: "" }] } ]
seo: { noIndex: true }
status: { published: false, visibility: "private", dataConfidence: "low" }
notes: { public: [], private: [] }
relations: {}
hero: null
images: []
```

### **Sanity-First Docs**
(Guides, Topics, Authors, labNoteInternal, tastingNotePublic, Sanity-native Resources, modules)
No placeholders; editors supply required fields manually.

---

## **5.2 Updates**

- Airtable updates modify Airtable-owned fields only.
- Sanity updates editorial fields.
- Slug changes append to slugHistory; Airtable uninvolved.
- Identity graph changes propagate from Airtable.

---

## **5.3 Deprecation**

- Airtable `availability="discontinued"` sets product-level deprecation.
- Sanity may archive editorially.
- buy/CTA modules may auto-hide based on fact-level availability.

---

## **5.4 Deletion**

- Airtable deletion → Sanity doc becomes orphaned (never auto-deleted).
- Sanity deletion → Airtable row unaffected; Track G defines recreation vs respect.

---

## **5.5 Redirects**

Slug changes always handled in Sanity via slugHistory per Track C.

---

# **6. Module Ownership Contract**

Modules = **100% Sanity-owned**, always.

- Airtable cannot create, reorder, or delete modules.
- Modules must **display** Airtable’s authoritative facts without storing them.
- Commerce modules reflect variant→SKU fact override logic.
- Process modules reflect Airtable’s ProducerStage graph.
- Tasting modules reflect Sanity tasting docs.

Modules never inherit across documents.

---

# **7. Validation & Enforcement**

## **7.1 Hard Validation**

- Sanity cannot edit Airtable-owned fields.
- No commerce facts in PT/notes.
- No sensory fields in commerce types.
- No process fields in narrative types.
- Variant schemas cannot include SKU-only fields.

---

## **7.2 Linting**

- FK mismatches between Airtable and Sanity relations.
- Orphaned Airtable-first docs flagged.
- Modules violating slot/type/exclusivity rules.
- Missing required fields based on type.

---

## **7.3 Render-Time Validation**

- Variant fallback to SKU is display-only.
- Modules must pull authoritative fact values at render-time.

---

# **8. Risk Mitigation & Operational Safeguards**

## **8.1 Prevention**
- Airtable-owned fields are readOnly/hidden in Studio.
- Single canonical mapping layer for sync.
- Idempotent, upsert-only sync (no auto-deletes).
- Airtable can write only whitelisted fields.

## **8.2 Detection**
- Staging → preview dry-run diffs before production sync.
- Threshold alerts on large or identity-critical changes.
- Structured per-field logging and anomaly detection.

## **8.3 Recovery**
- Sanity version-history rollback (single or bulk).
- Nightly Airtable + Sanity dataset snapshots.
- Sync kill switch (`SYNC_ENABLED=false`) for immediate freeze.

---

# **9. GATE (All Cleared)**

1. No incorrect or surprising ownership mappings.
2. No unused fields or overfitted rules.
3. Fully future-proof for additional categories.

Track F is frozen.

---

# **10. Parking Lot (For Track G / Later)**

- Schema code implementation (Track G).
- Mapping layer implementation.
- Orphan-handling strategy.
- External QC ingestion (future LabNotes table).
- Structured sensory expansions.
- UGC/review ingestion.
- Module-auto-ordering heuristics.
- Multi-lingual editorial layer.
- Regional content gating.
- Behavioral module loadouts.
