# **Track C — Commerce Types Specification**

BUY.VODKA Data Architecture
Anchored to Master Document and Tracks A and B

---

## **0. Scope and Goals**

**Types covered**

- `sku`
- `marketVariant`

Track C defines the **commerce layer** for BUY.VODKA:

- Airtable authoritative commercial facts
- Sanity authoritative narrative, SEO, and modules
- SKU as canonical product identity
- MarketVariant as the commercial leaf node
- URL and canonical strategy for product pages

Track C **does not**:

- Redefine any global fields or PT objects
- Modify any narrative types defined in Track B
- Create new global modules or PT objects
- Implement affiliate pricing or availability pipelines in detail

All global invariants, field semantics, PT spec, and notes system come from the Master Document and Track A.

---

## **1. Rehydrated Anchors A–E (Commerce Context)**

### **1.1 Anchor A — Field Taxonomy and Naming**

Global fields and naming rules apply to `sku` and `marketVariant` without change:

- Required globals: `title`, `slug`, `slugHistory`, `description`, `body`, `notes.public`, `notes.private`, `seo`, `status`, `system.source`, `system.recId`
- Optional globals: `hero`, `images`, `relations`, `metrics`, `system.createdAt`, `system.updatedAt`
- lowerCamelCase naming, semantic not UI driven, PT in `body` only, notes as annotation only

Commerce twist:

- All commercial facts (ABV, size, proof, volume, case pack, UPC, GTIN, cost, MSRP, distributor flags) are explicit Airtable fields, not PT or notes.

---

### **1.2 Anchor B — Portable Text Specification**

PT is the unified narrative layer for all types:

- Blocks: normal, h2, h3, h4, bullet, numbered, blockquote, codeBlock
- Marks: strong, em, underline, code, link, internalLink
- Objects: imageFigure, callout, infobox, gallery, timeline, tableObject, embedProduct, embedCTA
- No H1, no empty blocks, facts in structured fields only

Commerce twist:

- SKU uses the **full PT union** for product storytelling and tasting notes.
- MarketVariant uses a **minimal PT subset**, mostly short intros and variant deltas.
- `embedProduct` allowed where needed but cannot carry catalog logic.

---

### **1.3 Anchor C — Notes System**

Global notes semantics apply:

- `notes.public` PT for user-visible clarifications
- `notes.private` PT for internal commentary
- No UGC and no catalog facts in notes

Commerce twist:

- Private notes can capture internal sourcing, compliance, or editorial intent.
- Neither SKU nor MarketVariant may store ABV, pricing, or availability in notes.

---

### **1.4 Anchor D — Relationships and Inheritance**

Global hierarchy:

- `producer` → `brand` → `sku` → `marketVariant`
- MarketVariant is the commerce leaf node

Commerce twist:

- SKU is the canonical product identity node.
- MarketVariants inherit from SKU and override where the commercial reality differs.
- Producer and Brand relations are unambiguous and flow down to SKU and Variant.
- Narrative types reference SKUs, not Variants, for canonical product explanations.

---

### **1.5 Anchor E — Sidebar and Modules Layout**

Global module system:

- Slots: `right`, `below`, `inline`
- Modules attached through `relations.modules` with ordering
- Module taxonomy defined in Track E, referenced here only by usage patterns

Commerce twist:

- SKU pages use richer module sets: fact sheets, availability, tasting sets, related SKUs and brands, CTAs.
- Variant pages use a narrower module set focused on format, availability, and sibling navigation.
- No new module types are introduced in Track C.

---

## **2. Types and Editorial Intent**

### **2.1 `sku` — Canonical Product Identity**

**Purpose**

- Canonical identity document for a product line.
- Blends Airtable structured facts with Sanity narrative and SEO.
- Primary SEO landing page for product queries.

**Audience**

- Consumers researching the vodka.
- Trade and distribution partners validating specs.
- Editors crafting long-form product stories.

**Narrative Depth**

- High.
- Full PT story: origin, production narrative, positioning, tasting notes, brand context.

**SEO Role**

- Primary `Product` node, with Schema.org Product driven by SKU fields.
- URL is canonical for product; MarketVariants attach as Offers.

**PT Expectations**

- Full PT union allowed.
- Structured sections using h2 and h3 for clarity.
- Tasting notes as a clear PT section.

---

### **2.2 `marketVariant` — Commercial Leaf Node**

**Purpose**

- Represents a concrete purchasable variant of a SKU:
  - Bottle size
  - Pack configuration
  - Market or label variant
  - Limited or commemorative releases

**Audience**

- Consumers deciding between formats.
- Retailers, distributors, and affiliates needing variant level identifiers and pricing.

**Narrative Depth**

- Low to medium.
- Short PT describing format, market, or limited release context.
- Variant leans on SKU for full story.

**SEO Role**

- Default non canonical and often `noIndex`.
- May become indexable for materially distinct limited editions or notable gift packs, but SKU remains the canonical product URL.

**PT Expectations**

- Short PT intros and variant delta notes.
- Same global PT object set available, but typical usage is minimal.

---

## **3. Global Fields and Ownership**

### **3.1 Global Fields (All Commerce Types)**

All commerce documents must use global fields defined in Track A:

**Required global fields**

- `title`
- `slug`
- `slugHistory`
- `description`
- `body`
- `notes.public`
- `notes.private`
- `seo`
- `status`
- `system.source`
- `system.recId`

**Optional global fields**

- `hero`
- `images[]`
- `relations`
- `metrics`
- `system.createdAt`
- `system.updatedAt`

Ownership pattern:

- Airtable owns `system.source`, `system.recId`, and business logic fields.
- Sanity owns narrative fields, SEO, modules, metrics.

---

## **4. SKU Spec**

### **4.1 Intent**

**Type:** `sku`

Canonical commerce identity document for a product line, combining:

- Airtable authoritative catalog facts.
- Sanity authoritative narrative, SEO, relations, modules.

---

### **4.2 Fields**

#### **4.2.1 Required global fields**

- `title`
- `slug`
- `slugHistory`
- `description`
- `hero`
- `body`
- `notes.public`
- `notes.private`
- `seo`
- `status`
- `system.source`
- `system.recId`

#### **4.2.2 Optional global fields**

- `images[]`
- `relations`
- `metrics`
- `system.createdAt`
- `system.updatedAt`

#### **4.2.3 Airtable commercial fields (SKU)**

All Airtable authoritative.

**Identity and catalog**

- `skuCode` – canonical SKU identifier, immutable.
- `upc` – primary UPC for base configuration.
- `gtin` – GTIN for base configuration.
- `alternateCodes[]` – additional codes if used in channel systems.
- `isDiscontinued` – boolean.

**Liquid specs**

- `abv` – percent.
- `proof` – numeric.
- `distillateBase` – descriptive string or enum: `grain` | `potato` | `grape` | `sugarcane` | `mixed` | `other`.
- `distillationMethod` – freeform or constrained enum.
- `filtrationMethod` – freeform or constrained enum.
- `flavored` – boolean.
- `additivesPresent` – boolean.

**Production and origin**

- `country` – country name or code.
- `region` – freeform region string.
- `bottlingLocation` – freeform location.
- `producerRecId` – Airtable Producer recId.
- `brandRecId` – Airtable Brand recId.

**Packaging**

- `primarySizeMl` – numeric base size.
- `casePack` – bottles per case.
- `containerType` – `glass` | `PET` | `other`.
- `closureType` – `cork` | `screwcap` | `other`.

**Commerce**

- `cost` – numeric.
- `wholesalePrice` – numeric.
- `msrp` – numeric.
- `availability` – enum: `inProduction` | `seasonal` | `limited` | `discontinued`.
- `distributorFlags[]` – list of codes.
- `affiliateSourceRecIds[]` – Airtable AffiliateSource recIds for this SKU.

#### **4.2.4 Sanity narrative fields (SKU)**

All Sanity authoritative.

- `body` – main product narrative; PT, full object union.
- `tastingNotes` – PT; structured tasting narrative.
- `editorialSummary` – short text for cards or modules.
- `storyHooks[]` – optional short strings feeding UI snippets.

---

### **4.3 Ownership**

Per Master ownership rules: Airtable owns catalog facts, Sanity owns narrative and SEO.

**Airtable**

- All fields in 4.2.3.
- `system.source`, `system.recId`, `system.createdAt`, `system.updatedAt`.

**Sanity**

- Global narrative and editorial fields (`title`, `slug`, `slugHistory`, `description`, `hero`, `images`).
- `body`, `tastingNotes`, `editorialSummary`, `storyHooks`.
- `seo`, `status`, `notes`, `relations`, `metrics`.

No catalog-critical fact is allowed to live only inside PT or notes.

---

### **4.4 Relations**

Relations live in the global `relations` object.

Conceptually:

```ts
relations: {
  brand?: Reference<"brand">                  // required
  producer?: Reference<"producer">            // required
  marketVariants?: Reference<"marketVariant">[]
  topics?: Reference<"topic">[]
  guides?: Reference<"guide">[]
  authors?: Reference<"author">[]
  modules?: Reference<"module">[]
}
```

Rules:

- `relations.brand` and `relations.producer` required and singular.
- `relations.marketVariants[]` holds all variants for this SKU.
- Narrative types reference SKUs through their own `relations`, not the reverse for narrative facts.

---

### **4.5 Modules**

SKU uses the global module library with commerce flavored constraints.

**Slot: `right`**

- Fact sheet module (ABV, size, pack, key specs).
- Availability module (high level).
- Tasting summary module.

**Slot: `below`**

- Related SKUs module.
- Related brands module.
- Gallery or timeline for product evolution.

**Slot: `inline`**

- infobox
- callout
- embedCTA

Actual module schemas are defined in Track E. Track C only constrains allowed module usage.

---

### **4.6 PT guidance (SKU)**

- Use full PT object union from Anchor B.
- At least one `h2` section required.
- Recommended structure:
  - Intro section
  - Production narrative
  - Tasting notes section
  - Brand context or usage suggestions

- `embedProduct` allowed sparingly for cross-sells or portfolios.
- No ABV, pack, or pricing stored exclusively in PT.

---

### **4.7 SEO (SKU)**

- SKU is the canonical `Product` for schema.org representation.
- `seo.metaTitle` and `seo.metaDescription` recommended; default to `title` and `description` if absent.
- `seo.noIndex` default `false` for public, complete SKUs.
- Breadcrumb expectation:
  - `Home > Brand > Product`

- SKU needs enough structured data for valid Product schema:
  - `name` from `title`
  - `brand` from `relations.brand`
  - Key specs from Airtable fields
  - Offers derived from variants

---

### **4.8 Validation (SKU)**

Minimum requirements to publish a **public** SKU:

- `title`, `slug`, `description`, `hero`, `body` present.
- `description` ≤ 240 characters.
- `relations.brand` and `relations.producer` present.
- `system.recId` present and unique.
- `skuCode`, `upc`, `gtin`, `abv`, `primarySizeMl`, `country` present for full product schema.
- At least one `h2` in `body`.
- `notes` cannot be an empty object when present.

---

## **5. MarketVariant Spec**

### **5.1 Intent**

**Type:** `marketVariant`

Represents a **commercially distinct version** of a SKU: size, pack, market, label, or limited release. Variants are leaf nodes for offers and availability.

---

### **5.2 Fields**

#### **5.2.1 Required global fields**

- `title`
- `slug`
- `slugHistory`
- `description`
- `body` (may be minimal, but field exists)
- `notes.public`
- `notes.private`
- `seo`
- `status`
- `system.source`
- `system.recId`

`hero` is optional and falls back to SKU in the front end.

#### **5.2.2 Optional global fields**

- `hero`
- `images[]`
- `relations`
- `metrics`
- `system.createdAt`
- `system.updatedAt`

#### **5.2.3 Airtable commercial fields (MarketVariant)**

All Airtable authoritative.

**Identity and market**

- `variantCode` – canonical variant identifier.
- `upc` – variant UPC.
- `gtin` – variant GTIN.
- `market` – region or market label (for example: `US`, `EU`, `UK`, `JP`).
- `isLimitedRelease` – boolean.

**Packaging and format**

- `sizeMl` – numeric.
- `packType` – `single` | `twoPack` | `sixPack` | `giftSet` | `holidaySet` | other.
- `casePack` – integer.
- `bottleShape` – text or enum label.
- `labelColorway` – text or enum.

**Liquid differences**

- `abv` – numeric override (optional).
- `proof` – numeric override (optional).
- `distillateBase` – optional override.
- `flavored` – optional override.
- `batchName` – optional string.
- `batchNumber` – optional string.

**Commerce**

- `cost` – numeric.
- `wholesalePrice` – numeric.
- `msrp` – numeric.
- `availability` – enum as on SKU.
- `distributorFlags[]` – list of codes.
- `affiliateSourceRecIds[]` – AffiliateSource recIds scoped to this variant.

#### **5.2.4 Sanity narrative fields (MarketVariant)**

All Sanity authoritative.

- `body` – minimal PT; variant level description or even a stub.
- `variantIntro` – PT; short context on format, usage, or market.
- `variantNotes` – PT; any sensory or packaging differences versus SKU.
- `limitedReleaseStory` – PT; deeper narrative for limited releases.

---

### **5.3 Ownership**

**Airtable**

- All fields in 5.2.3.
- `system.source`, `system.recId`, timestamps.

**Sanity**

- All narrative fields, global narrative fields, `seo`, `status`, `notes`, `relations`, `metrics`.

Catalog facts never live exclusively in PT or notes.

---

### **5.4 Relations**

Conceptual shape:

```ts
relations: {
  sku?: Reference<"sku">                         // required
  relatedVariants?: Reference<"marketVariant">[]
  modules?: Reference<"module">[]
}
```

Rules:

- Exactly one parent `sku` required.
- `relatedVariants[]` used only for sibling navigation and marketing groupings.
- Variant does not directly reference brand or producer; those flow from SKU.

---

### **5.5 Modules**

Variant uses a constrained subset of modules.

**Slot: `right`**

- Compact fact sheet for size, pack, ABV, market.
- Compact availability module.

**Slot: `below`**

- Sibling variants module.
- Simple packaging gallery if needed.

**Slot: `inline`**

- infobox
- callout
- embedCTA

Variant should not host heavy editorial modules like deep timelines.

---

### **5.6 PT guidance (MarketVariant)**

- Use PT for short intros and variant differences.
- Avoid long multi section bodies; rely on SKU for the full story.
- Recommended objects: `imageFigure`, `infobox`, `callout`, `tableObject`, `embedCTA`.
- `embedProduct` allowed only for sibling SKU or variant callouts.

---

### **5.7 SEO (Variant)**

- Default `seo.noIndex = true`.
- Only set `seo.noIndex = false` when:
  - Variant is materially distinct as a product that people search for, and
  - You want it indexed in addition to the SKU.

- When indexed:
  - Variant page should emit Schema.org `Offer` or `Product` + `Offer` tied back to SKU identity.

- Default canonical for variants is the parent SKU URL (see Section 7).

---

### **5.8 Validation (Variant)**

Minimum requirements to publish a **public** variant:

- `title`, `slug`, `description`, `system.recId`, and `relations.sku` present.
- `variantCode`, `sizeMl`, `market`, `availability`, `upc` present.
- If `isLimitedRelease = true`, `limitedReleaseStory` strongly recommended.
- Notes may not hold catalog-critical facts.

---

## **6. Inheritance and Cross-type Commerce Rules**

### **6.1 SKU → MarketVariant inheritance**

**Global narrative**

- `title`
  - Variant title usually derived from SKU plus format or market.

- `slug`, `slugHistory`
  - Not inherited; managed per document.

- `description`
  - Variant defaults to SKU description but may override for clarity.

- `hero`, `images`
  - Variant may omit; front end should fall back to SKU hero and images.

- `body`
  - SKU narrative remains primary.
  - Variant `body` and `variantIntro` are considered deltas by the front end.

- `notes`
  - Each document maintains its own notes; they are not auto inherited.

**Commercial fields**

- Where the variant has a value, variant value wins.
- Where the variant field is absent, the front end may fall back to the SKU value.

Examples:

- `abv`, `proof`, `distillateBase`, `flavored`
  - Inherited from SKU unless variant overrides.

- `sizeMl`, `packType`, `casePack`
  - Variant only; SKU uses `primarySizeMl` and generic `casePack`.

- `cost`, `wholesalePrice`, `msrp`, `availability`, `distributorFlags[]`
  - Variant level, used for market specific Offers; SKU fields operate as generic defaults.

### **6.2 Cross type rules with narrative types**

Extends Track B cross type rules.

- Brands may reference SKUs but do not store SKU facts.
- Guides and Topics may reference SKUs, not variants, for canonical explanations.
- Resources and Authors may connect to SKUs where relevant.
- Producer and Brand remain upstream identity holders; SKU and Variant hold the commerce specifics.

---

## **7. URL and Canonical Strategy for Commerce Types**

Global slug and SEO invariants apply:

- Canonical slug lives in Sanity.
- `slugHistory` preserves prior values.
- Redirects are handled centrally.
- `seo.canonicalUrl` available for overrides.

### **7.1 Route patterns**

**Brand**

- Route: `/:brandSlug`
- Source: `brand.slug.current` → `brandSlug`
- Must be globally unique across brands.

**SKU**

- Route (canonical): `/:brandSlug/:skuSlug`
- Sources:
  - `brand.slug.current` → `brandSlug`
  - `sku.slug.current` → `skuSlug`

- Must be globally unique across SKUs.

**MarketVariant**

- Route (non canonical default): `/:brandSlug/:skuSlug/:variantSlug`
- Sources:
  - `brand.slug.current`
  - `sku.slug.current`
  - `marketVariant.slug.current` → `variantSlug`

- `variantSlug` globally unique across variants.

Domain `buy.vodka` already encodes category, so no extra `/vodka/` segment is required.

---

### **7.2 Slug composition rules**

Global rules from Track A apply: lower case, kebab case, descriptive.

**Brand**

- Derived from `title` with minimal normalization.
- Example: “Northern Column” → `northern-column`.

**SKU**

- Derived from `title`.
- Include only distinctive product terms.
- Example: “Northern Column Vodka” → `northern-column-vodka`.

**MarketVariant**

- Short descriptor of format or market.
- Examples:
  - `750ml-us`
  - `1l-eu-duty-free`
  - `holiday-pack-750ml-us`

---

### **7.3 Canonical URL rules**

Leverage `seo.canonicalUrl` only when needed; otherwise inferred.

**Brand**

- Canonical: `https://buy.vodka/:brandSlug`.

**SKU**

- Canonical: `https://buy.vodka/:brandSlug/:skuSlug`.
- This is the canonical Product URL.

**MarketVariant**

- Default canonical: SKU URL.
  - `https://buy.vodka/:brandSlug/:skuSlug`

- Only set canonical to the variant URL for exceptional cases where the variant is a clearly independent SEO target.

---

### **7.4 Indexing and robots behavior**

Use `seo.noIndex` combined with `status.visibility`.

**Brand**

- `seo.noIndex = false` for normal brands.
- `seo.noIndex = true` for legacy or experimental brands.

**SKU**

- `seo.noIndex = false` when:
  - `status.visibility = "public"` and
  - SKU has required fields for Product schema.

- `seo.noIndex = true` for embargoed or internal only SKUs.

**MarketVariant**

- `seo.noIndex = true` by default.
- Flip to `false` only for rare variants that should rank on their own.

---

### **7.5 Breadcrumb versus URL**

Breadcrumbs are derived from relations, not from folder structure:

- Example breadcrumb: `Home > Brand > Product`

Producer appears in content, sidebar modules, and schema (`manufacturer` or `producer`), not in the path.

---

### **7.6 SlugHistory and redirects**

When any `slug.current` changes:

- Append the old value to `slugHistory`.
- Redirect layer maps:
  - Old brand slugs and SKU slugs to current ones.
  - Old variant slugs to current variant slug.

- Combined with `slugHistory` on both Brand and SKU, the redirect system can map:

`/oldBrandSlug/oldSkuSlug` → `/newBrandSlug/newSkuSlug`

This preserves link equity and avoids broken links during rebrands and renames.

---

## **8. Minimal JSON Like Examples**

### **8.1 Example `sku`**

```json
{
  "_type": "sku",
  "title": "Northern Column Vodka",
  "slug": { "current": "northern-column-vodka" },
  "slugHistory": ["northerncolumnvodka"],
  "description": "Clean, modern winter wheat vodka with a crisp, neutral finish.",
  "hero": { "_type": "image", "asset": { "_ref": "image-sku-hero-1" } },
  "images": [],
  "body": [
    {
      "_type": "block",
      "style": "normal",
      "children": [{ "_type": "span", "text": "Full product story..." }]
    }
  ],
  "tastingNotes": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        { "_type": "span", "text": "Soft nose, clean palate, pepper finish." }
      ]
    }
  ],
  "notes": {
    "public": [],
    "private": []
  },
  "seo": {
    "metaTitle": "Northern Column Vodka",
    "metaDescription": "Modern winter wheat vodka with a crisp, neutral finish.",
    "noIndex": false
  },
  "status": {
    "published": true,
    "archived": false,
    "visibility": "public",
    "dataConfidence": "high"
  },
  "relations": {
    "brand": { "_type": "reference", "_ref": "brand-northern" },
    "producer": {
      "_type": "reference",
      "_ref": "producer-northern-distilling"
    },
    "marketVariants": [
      { "_type": "reference", "_ref": "mv-northern-750-us" },
      { "_type": "reference", "_ref": "mv-northern-1000-eu" }
    ],
    "topics": [],
    "guides": [],
    "authors": [],
    "modules": []
  },
  "metrics": {},
  "system": {
    "source": "airtable",
    "recId": "recSku123",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-05T00:00:00.000Z"
  },
  "skuCode": "NCV-001",
  "upc": "012345678901",
  "gtin": "00123456789012",
  "isDiscontinued": false,
  "abv": 40,
  "proof": 80,
  "distillateBase": "grain",
  "distillationMethod": "multi-column",
  "filtrationMethod": "charcoal",
  "flavored": false,
  "additivesPresent": false,
  "country": "United States",
  "region": "Midwest",
  "bottlingLocation": "Minnesota",
  "producerRecId": "recProducer123",
  "brandRecId": "recBrand123",
  "primarySizeMl": 750,
  "casePack": 12,
  "containerType": "glass",
  "closureType": "screwcap",
  "cost": 8.5,
  "wholesalePrice": 14.0,
  "msrp": 24.99,
  "availability": "inProduction",
  "distributorFlags": ["onPremiseFocus"],
  "affiliateSourceRecIds": ["recAff123"]
}
```

---

### **8.2 Example `marketVariant`**

```json
{
  "_type": "marketVariant",
  "title": "Northern Column Vodka 750ml — US",
  "slug": { "current": "northern-column-vodka-750ml-us" },
  "slugHistory": [],
  "description": "750ml bottle of Northern Column Vodka for the US market.",
  "hero": null,
  "images": [],
  "body": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        { "_type": "span", "text": "US 750ml format of Northern Column Vodka." }
      ]
    }
  ],
  "variantIntro": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "Standard 750ml bottle focused on bar use in the US."
        }
      ]
    }
  ],
  "variantNotes": [],
  "limitedReleaseStory": [],
  "notes": {
    "public": [],
    "private": []
  },
  "seo": {
    "metaTitle": "Northern Column Vodka 750ml — US",
    "metaDescription": "US 750ml format of Northern Column Vodka.",
    "noIndex": true
  },
  "status": {
    "published": true,
    "archived": false,
    "visibility": "public",
    "dataConfidence": "high"
  },
  "relations": {
    "sku": { "_type": "reference", "_ref": "sku-northern-column" },
    "relatedVariants": [
      { "_type": "reference", "_ref": "mv-northern-1000-eu" }
    ],
    "modules": []
  },
  "metrics": {},
  "system": {
    "source": "airtable",
    "recId": "recMV750US",
    "createdAt": "2025-01-02T00:00:00.000Z",
    "updatedAt": "2025-01-06T00:00:00.000Z"
  },
  "variantCode": "NCV-001-750-US",
  "upc": "012345678902",
  "gtin": "00123456789029",
  "market": "US",
  "isLimitedRelease": false,
  "sizeMl": 750,
  "packType": "single",
  "casePack": 12,
  "bottleShape": "standard",
  "labelColorway": "blue-silver",
  "abv": 40,
  "proof": 80,
  "distillateBase": "grain",
  "flavored": false,
  "batchName": "",
  "batchNumber": "",
  "cost": 8.5,
  "wholesalePrice": 14.0,
  "msrp": 24.99,
  "availability": "inProduction",
  "distributorFlags": ["onPremiseFocus"],
  "affiliateSourceRecIds": ["recAff123"]
}
```
