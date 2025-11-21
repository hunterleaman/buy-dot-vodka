# **/docs/data-architecture/specs/trackB-narrative-types.md**

# **Track B — Narrative Types Specification**

BUY.VODKA Data Architecture
Anchored to Master Document and Track A Global Standards

---

# **0. Scope**

Narrative-first document types:

- `producer`
- `brand`
- `guide`
- `topic`
- `resource`
- `author`

These types define all long-form editorial content, SEO-critical content, and narrative relationships for BUY.VODKA.

They _exclude_ all commerce-specific types (SKU, MarketVariant, Certification, Award, AffiliateSource), which are handled in Track C.

All global field, PT, notes, SEO, status, and system semantics come from Track A.

---

# **1. Global Principles**

1. **Narrative lives in Portable Text** (PT) using the unified object set.
2. **Facts live in structured fields**.
3. **Notes are annotations** (`public` and `private`) and never hold facts or UGC.
4. **Modules follow global Anchor E taxonomy** with per-type slot constraints.
5. **Relations follow Anchor D** and must be explicit.
6. **Metrics optional**; populated via analytics pipeline; never required for publishing.
7. **Airtable is never authoritative for narrative types** (except Resources if externally sourced).
8. **Sanity owns editorial content, SEO metadata, images, modules, relations, and narrative structure** for all narrative types.

---

# **2. Producer**

## **Intent**

Canonical origin-entity for brands and production lineage.
Explains who makes vodka, how, and why.

## **Fields**

**Required global fields**
`title`, `slug`, `slugHistory`, `description`, `hero`, `body`,
`notes.public`, `notes.private`, `seo`, `status`, `system.source`, `system.recId`.

**Optional global fields**
`images[]`, `relations`, `metrics`, `system.createdAt`, `system.updatedAt`.

**Per-type narrative fields**

- `originSummary` – structured founding details.
- `productionOverview` – high-level production narrative.
- `region` – editorial geography tag.

## **Relations**

- `brands[]` – required unless non-public.
- `processStages[]` – many to many.
- `resources[]`
- `authors[]`

## **Modules**

- right: fact sheet, location map, related brands
- below: gallery, timeline, process overview
- inline: infobox, callout

## **PT Guidance**

Allowed: full PT object union (imageFigure, gallery, timeline, tableObject, infobox, callout).
Disallowed: embedProduct.
Expected structure: h2-led multi section narrative.

## **Notes**

public = factual clarifications; private = editorial sources.

## **Validation**

- hero required
- at least one h2
- at least one brand unless dormant
- region required if productionOverview exists

## **Ownership**

Airtable: system.recId and all production facts.
Sanity: narrative, images, notes, seo, modules, relations, metrics.

---

# **3. Brand**

## **Intent**

Consumer-facing narrative container.
Identity, story, posture, and brand ecosystem.

## **Fields**

**Required global fields**
`title`, `slug`, `slugHistory`, `description`, `hero`, `body`, `notes.public`, `notes.private`, `seo`, `status`, `system.source`, `system.recId`.

**Optional global fields**
`images[]`, `relations`, `metrics`.

**Per-type narrative fields**

- `positioning` – category, vibe, audience.
- `founderNote` – optional narrative sidebar.

## **Relations**

- `producer` – required (single).
- `skus[]` – narrative references only (no SKU facts).
- `topics[]`
- `guides[]`
- `authors[]`

## **Modules**

- right: related producer, related SKUs, fact sheet
- below: gallery, brand timeline
- inline: infobox, callout, embedCTA

## **PT Guidance**

Allowed: full PT object union.
`embedProduct` allowed only for narrative SKU references.

## **Notes**

public = name clarifications; private = internal brand history.

## **Validation**

- hero required
- exactly one producer (unless exceptional override)
- body ≥3 blocks
- SKU references must resolve

## **Ownership**

Airtable: system.recId, brand-level catalog facts.
Sanity: narrative, imagery, modules, relations, metrics.

---

# **4. Guide**

## **Intent**

Deep educational explainers.
Primary long-form learning content.

## **Fields**

**Required global fields**
`title`, `slug`, `slugHistory`, `description`, `hero`, `body`, `notes.public`, `notes.private`, `seo`, `status`.

**Optional global fields**
`images[]`, `relations`, `metrics`, `system` (optional).

**Per-type narrative fields**

- `difficulty` – beginner/intermediate/advanced.
- `estimatedReadMinutes`.

## **Relations**

- `topics[]` – required.
- `resources[]`.
- `producers[]`, `brands[]` optional.
- `authors[]` – required.

## **Modules**

- below: glossary panels, related guides, related topics
- inline: infobox, tableObject, callout, embedCTA
- right: summary box

## **PT Guidance**

Full PT object union allowed.
Educational structure: multiple h2, h3 sections.

## **Notes**

public = errata; private = research and editorial reasoning.

## **Validation**

- at least one topic
- at least one author
- at least two h2 headings
- hero required

## **Ownership**

Sanity only.

---

# **5. Topic**

## **Intent**

Abstract concept nodes.
Definitions, explanations, and SEO hubs.

## **Fields**

**Required global fields**
`title`, `slug`, `slugHistory`, `description`, `body`, `notes.public`, `notes.private`, `seo`, `status`.

**Optional global fields**
`hero`, `images[]`, `relations`, `metrics`, `system`.

**Per-type narrative fields**

- `topicType` – ingredient, technique, classification, science (expandable).
- `shortDefinition`.

## **Relations**

- `guides[]` – often required.
- `resources[]`.
- `authors[]`.
- optional producers/brands.

## **Modules**

- right: related guides, related resources
- inline: infobox definitions

## **PT Guidance**

Concise PT, small object use.
Allowed: imageFigure, tableObject, infobox.
Avoid galleries and timelines.

## **Notes**

public = term clarifications; private = lexicon notes.

## **Validation**

- shortDefinition required
- topicType required
- at least one guide (relaxable for new topics)

## **Ownership**

Sanity only.

---

# **6. Resource**

## **Intent**

Citation layer for regulations, papers, datasets, maps, external material.

## **Fields**

**Required global fields**
`title`, `slug`, `slugHistory`, `description`, `body`, `seo`, `status`, `system.source`, `system.recId`.

**Optional global fields**
`hero`, `images[]`, `notes`, `relations`, `metrics`, `system.createdAt`, `system.updatedAt`.

**Per-type narrative fields**

- `resourceType` – regulation, paper, dataset, map, externalArticle (expandable).
- `sourceUrl`.
- `citation` – structured.

## **Relations**

- `guides[]`
- `topics[]`
- `producers[]`, `brands[]` (if relevant)
- `authors[]` optional

## **Modules**

- inline only: citation box, link lists, download CTA

## **PT Guidance**

Short PT.
Allowed: imageFigure, infobox, callout.
No galleries or timelines.

## **Notes**

public = clarifications; private = reliability notes.

## **Validation**

- sourceUrl required (except internal docs)
- citation required for academic resources

## **Ownership**

If sourced from Airtable or external import, system.\* required.
Narrative is always Sanity-owned.

---

# **7. Author**

## **Intent**

Editorial identity.
Attribution, expertise, and extended bio.

## **Fields**

**Required global fields**
`title`, `slug`, `slugHistory`, `description`, `body`, `seo`, `status`.

**Optional global fields**
`hero`, `images[]`, `notes`, `relations`, `metrics`, `system`.

**Per-type narrative fields**

- `credentials[]`.
- `expertise[]`.
- `socialLinks[]`.

## **Relations**

- `guides[]`
- `topics[]`
- `resources[]`
- optional brands/producers

## **Modules**

- right: authored content, social links
- no below modules

## **PT Guidance**

Medium depth PT.
Allowed: imageFigure, infobox.

## **Notes**

public = visibility clarifications; private = editorial commentary.

## **Validation**

- at least one expertise tag
- at least one authored relationship (except staff profiles)

## **Ownership**

Sanity only.

---

# **8. Cross-Type Narrative Rules**

1. **Hierarchy**
   Producer → Brand → SKU → MarketVariant (SKU and Variant defined in Track C).

2. **Brand ↔ SKU**
   Brands may reference SKUs narratively; SKU facts resolved from commerce types.

3. **Guide ↔ Topic**
   Topics define concepts; Guides explain them. Every Guide must attach to at least one Topic.

4. **Resource as citation layer**
   Resources can be referenced across all narrative types.

5. **Author attribution**
   Guides and Topics require Authors. Others may include Authors optionally.

6. **Modules**
   All narrative types share a single module library but enforce per-type validation rules.

7. **Metrics**
   Optional for all narrative types and populated by external analytics pipelines.

---

# **9. Parking Lot**

- Potential future `brandKit` object.
- Additional `resourceType` and `topicType` enums.
- SKU narrative patterns to be defined in Track C.
- Standardizing how metrics fields are rolled up (Track F or G).

---

# **End of Track B**
