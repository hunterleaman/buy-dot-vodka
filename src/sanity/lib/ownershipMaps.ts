// src/sanity/lib/ownershipMaps.ts

export type Owner = "airtable" | "sanity" | "mixed";

export type OwnershipMap = Record<string, Owner>;

/**
 * Canonical ownership map.
 *
 * Keys follow the pattern:
 *   `${typeName}.${fieldPath}`
 *
 * Nested / array paths are normalized via `normalizePath` before lookup, so
 * callers can safely pass e.g. `sku.alternateCodes[0]` and still hit
 * `sku.alternateCodes`.
 */
export const ownershipMap: OwnershipMap = {
  //
  // Producer (Track B + Anchor A/F)
  // Airtable-backed narrative type: Airtable owns provenance + any catalog facts.
  //
  "producer.system.source": "airtable",
  "producer.system.recId": "airtable",
  "producer.system.createdAt": "airtable",
  "producer.system.updatedAt": "airtable",

  //
  // Brand (Track B)
  // Airtable-backed brand-level catalog node.
  //
  "brand.system.source": "airtable",
  "brand.system.recId": "airtable",
  "brand.system.createdAt": "airtable",
  "brand.system.updatedAt": "airtable",

  //
  // SKU (Track C 4.2.3 + 4.3 + Anchor A/F)
  // Canonical commerce identity; Airtable owns all commerce facts + system provenance.
  //
  // System provenance
  "sku.system.source": "airtable",
  "sku.system.recId": "airtable",
  "sku.system.createdAt": "airtable",
  "sku.system.updatedAt": "airtable",

  // Identity & catalog
  "sku.skuCode": "airtable",
  "sku.upc": "airtable",
  "sku.gtin": "airtable",
  "sku.alternateCodes": "airtable",
  "sku.isDiscontinued": "airtable",

  // Liquid specs
  "sku.abv": "airtable",
  "sku.proof": "airtable",
  "sku.distillateBase": "airtable",
  "sku.distillationMethod": "airtable",
  "sku.filtrationMethod": "airtable",
  "sku.flavored": "airtable",
  "sku.additivesPresent": "airtable",

  // Production & origin
  "sku.country": "airtable",
  "sku.region": "airtable",
  "sku.bottlingLocation": "airtable",
  "sku.producerRecId": "airtable",
  "sku.brandRecId": "airtable",

  // Packaging
  "sku.primarySizeMl": "airtable",
  "sku.casePack": "airtable",
  "sku.containerType": "airtable",
  "sku.closureType": "airtable",

  // Commerce
  "sku.cost": "airtable",
  "sku.wholesalePrice": "airtable",
  "sku.msrp": "airtable",
  "sku.availability": "airtable",
  "sku.distributorFlags": "airtable",
  "sku.affiliateSourceRecIds": "airtable",

  // Explicit narrative ownership examples (most other narrative fields default to Sanity)
  "sku.title": "sanity",
  "sku.slug": "sanity",
  "sku.slugHistory": "sanity",
  "sku.description": "sanity",
  "sku.body": "sanity",

  //
  // MarketVariant (Track C 5.2.3 + 5.3)
  // Commerce leaf node; variant-specific facts are Airtable-owned.
  //
  // System provenance
  "marketVariant.system.source": "airtable",
  "marketVariant.system.recId": "airtable",
  "marketVariant.system.createdAt": "airtable",
  "marketVariant.system.updatedAt": "airtable",

  // Identity & market
  "marketVariant.variantCode": "airtable",
  "marketVariant.upc": "airtable",
  "marketVariant.gtin": "airtable",
  "marketVariant.market": "airtable",
  "marketVariant.isLimitedRelease": "airtable",

  // Packaging & format
  "marketVariant.sizeMl": "airtable",
  "marketVariant.packType": "airtable",
  "marketVariant.casePack": "airtable",
  "marketVariant.bottleShape": "airtable",
  "marketVariant.labelColorway": "airtable",

  // Liquid differences vs SKU
  "marketVariant.abv": "airtable",
  "marketVariant.proof": "airtable",
  "marketVariant.distillateBase": "airtable",
  "marketVariant.flavored": "airtable",
  "marketVariant.batchName": "airtable",
  "marketVariant.batchNumber": "airtable",

  // Variant commerce
  "marketVariant.cost": "airtable",
  "marketVariant.wholesalePrice": "airtable",
  "marketVariant.msrp": "airtable",
  "marketVariant.availability": "airtable",
  "marketVariant.distributorFlags": "airtable",
  "marketVariant.affiliateSourceRecIds": "airtable",

  // Narrative examples (rest default to Sanity)
  "marketVariant.body": "sanity",
  "marketVariant.variantIntro": "sanity",
  "marketVariant.variantNotes": "sanity",
  "marketVariant.limitedReleaseStory": "sanity",

  //
  // ProcessStage / ProducerStage (Track D 2.1–2.2, Track F 2.6)
  //

  // ProcessStage: Airtable taxonomy facts; Sanity owns narrative shell.
  "processStage.system.source": "airtable",
  "processStage.system.recId": "airtable",
  "processStage.system.createdAt": "airtable",
  "processStage.system.updatedAt": "airtable",

  // ProducerStage: Airtable matrix row (Producer × ProcessStage); Sanity wrapper only.
  "producerStage.system.source": "airtable",
  "producerStage.system.recId": "airtable",
  "producerStage.system.createdAt": "airtable",
  "producerStage.system.updatedAt": "airtable",
  "producerStage.producerRecId": "airtable",
  // Name inferred from join semantics; see notes.
  "producerStage.processStageRecId": "airtable",

  //
  // Awards / Certifications (Track F shell docs)
  // Airtable-backed shells: Airtable owns provenance; Sanity owns narrative wrapper.
  //
  "award.system.source": "airtable",
  "award.system.recId": "airtable",
  "award.system.createdAt": "airtable",
  "award.system.updatedAt": "airtable",

  "certification.system.source": "airtable",
  "certification.system.recId": "airtable",
  "certification.system.createdAt": "airtable",
  "certification.system.updatedAt": "airtable",

  //
  // Resource (Track B 6, Track F 2.5)
  // Two modes; map encodes the Airtable-backed subset. Callers must also check system.source.
  //
  "resource.system.source": "airtable",
  "resource.system.recId": "airtable",
  "resource.system.createdAt": "airtable",
  "resource.system.updatedAt": "airtable",
  "resource.resourceType": "airtable",
  "resource.sourceUrl": "airtable",
  "resource.citation": "airtable",

  //
  // Sensory docs (Track D 2.3–2.4, Track F 2.7)
  // Sanity-native; no Airtable tables. All fields Sanity-owned.
  //
  "labNoteInternal.body": "sanity",
  "tastingNotePublic.body": "sanity",

  //
  // Default narrative/system examples for Sanity-native narrative docs
  // (Guide / Topic / Author and Sanity-native Resource).
  //
  "guide.system.source": "sanity",
  "guide.system.recId": "sanity",
  "guide.system.createdAt": "sanity",
  "guide.system.updatedAt": "sanity",

  "topic.system.source": "sanity",
  "topic.system.recId": "sanity",
  "topic.system.createdAt": "sanity",
  "topic.system.updatedAt": "sanity",

  "author.system.source": "sanity",
  "author.system.recId": "sanity",
  "author.system.createdAt": "sanity",
  "author.system.updatedAt": "sanity",

  // Sanity-native resources (identified at runtime via system.source === "sanity")
  "resource.system.source:sanity": "sanity",
};

/**
 * Normalize a dotted field path into the canonical form used in `ownershipMap`.
 *
 * - Strips leading dots.
 * - Strips array indices: `foo.bar[0].baz` → `foo.bar.baz`.
 */
export function normalizePath(path: string): string {
  const stripped = path.replace(/^\.+/, "");
  return stripped.replace(/\[\d+]/g, "");
}

/**
 * Low-level lookup: returns the configured owner for a normalized path,
 * or falls back to `"sanity"` if the path is not explicitly mapped.
 */
export function getOwner(path: string): Owner {
  const normalized = normalizePath(path);
  const owner = ownershipMap[normalized];

  // Unmapped fields are treated as Sanity-owned editorial fields.
  return owner ?? "sanity";
}

export function isAirtableOwned(path: string): boolean {
  return getOwner(path) === "airtable";
}

export function isSanityOwned(path: string): boolean {
  return getOwner(path) === "sanity";
}

export function isMixedOwned(path: string): boolean {
  return getOwner(path) === "mixed";
}

/**
 * Convenience helper when you have the type name and field path separately.
 *
 * Example:
 *   getOwnerForField("sku", "abv") === "airtable"
 *   getOwnerForField("sku", "title") === "sanity"
 */
export function getOwnerForField(typeName: string, fieldPath: string): Owner {
  const key = `${typeName}.${fieldPath}`;
  return getOwner(key);
}
