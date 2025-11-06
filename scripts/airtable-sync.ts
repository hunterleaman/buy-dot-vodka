// scripts/airtable-sync.ts
import Airtable, { FieldSet, Records } from "airtable";
import { reqEnv } from "../lib/env";
import { sanityWriteClient as sanityClient } from "../lib/sanity.writeClient";
import { docId, mergeDoc, withKeys } from "../lib/sanity.writeHelpers";

// ---------- CLI flags ----------
const ARGV = process.argv.slice(2);
const DRY = ARGV.includes("--dry");
const PRUNE = ARGV.includes("--prune");
const ONLY_TABLE = (() => {
  const t = ARGV.find((a) => a.startsWith("--table="));
  return t ? (t.split("=", 2)[1] as keyof typeof mappers) : undefined;
})();

// ---------- Env ----------
const AIRTABLE_API_KEY = reqEnv("AIRTABLE_API_KEY");
const AIRTABLE_BASE_ID = reqEnv("AIRTABLE_BASE_ID");

// ---------- Airtable base ----------
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// ---------- Types ----------
type Rec<F extends FieldSet = FieldSet> = Airtable.Record<F>;
type Index<T = { nameOrTitle: string }> = Map<string, T>; // key = Airtable record id

// ---------- Slug helper (for slug seeds) ----------
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/buy[.\-]vodka/g, "buy-dot-vodka")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

// ---------- Sanity helpers ----------
async function upsert<T extends { _id: string; _type: string }>(
  doc: T,
  opts?: { slugSeed?: string }
): Promise<T> {
  if (DRY) {
    console.log(
      `[dry] merge ${doc._type} -> ${doc._id}`,
      opts?.slugSeed ? "(slug setIfMissing)" : ""
    );
    return doc;
  }
  // Merge-only behavior, preserves editorial fields
  await mergeDoc(
    doc._id,
    doc._type,
    doc as unknown as Record<string, unknown>,
    opts
  );
  return doc;
}

async function deleteById(id: string): Promise<void> {
  if (DRY) {
    console.log(`[dry] delete ${id}`);
    return;
  }
  await sanityClient.delete(id);
}

async function fetchIdsForType(sanityType: string): Promise<string[]> {
  // Namespaced ids remain "<type>.<something>"
  const q = `*[_type == $t && _id match $prefix][]._id`;
  const ids: string[] = await sanityClient.fetch(q, {
    t: sanityType,
    prefix: `${sanityType}.*`,
  });
  return ids;
}

// ---------- Airtable fetch ----------
const READY_FILTER = "{Ready to Publish} = 1";
async function fetchAll<F extends FieldSet = FieldSet>(
  tableName: string
): Promise<ReadonlyArray<Rec<F>>> {
  const table = base.table<F>(tableName);
  const query = table.select({ filterByFormula: READY_FILTER, pageSize: 100 });
  const rows: Records<F> = await query.all();
  return rows;
}

// ---------- Primary field indices for links ----------
const PRIMARY_FIELD: Record<
  | "Producers"
  | "Brands"
  | "SKUs"
  | "Certifications"
  | "Awards"
  | "AffiliateSources"
  | "Authors"
  | "Topics"
  | "Guides"
  | "ProcessStages"
  | "LabNotes"
  | "GlossaryTerms"
  | "Resources",
  "Name" | "Title" | "Term"
> = {
  Producers: "Name",
  Brands: "Name",
  SKUs: "Title",
  Certifications: "Title",
  Awards: "Title",
  AffiliateSources: "Name",
  Authors: "Name",
  Topics: "Title",
  Guides: "Title",
  ProcessStages: "Title",
  LabNotes: "Title",
  GlossaryTerms: "Term",
  Resources: "Title",
};

type Nameish = { nameOrTitle: string };

async function buildIndexFor(
  table: keyof typeof PRIMARY_FIELD
): Promise<Index<Nameish>> {
  const rows = await fetchAll(table);
  const idx: Index<Nameish> = new Map();
  const primary = PRIMARY_FIELD[table];

  for (const r of rows) {
    let nameOrTitle = "";
    if (primary === "Name") nameOrTitle = (r.get("Name") as string) ?? "";
    else if (primary === "Title")
      nameOrTitle = (r.get("Title") as string) ?? "";
    else if (primary === "Term") nameOrTitle = (r.get("Term") as string) ?? "";
    if (nameOrTitle) idx.set(r.id, { nameOrTitle });
  }
  return idx;
}

type Indices = {
  producers: Index<Nameish>;
  brands: Index<Nameish>;
  skus: Index<Nameish>;
  authors: Index<Nameish>;
  topics: Index<Nameish>;
  processStages: Index<Nameish>;
};

async function buildAllIndices(): Promise<Indices> {
  const [producers, brands, skus, authors, topics, processStages] =
    await Promise.all([
      buildIndexFor("Producers"),
      buildIndexFor("Brands"),
      buildIndexFor("SKUs"),
      buildIndexFor("Authors"),
      buildIndexFor("Topics"),
      buildIndexFor("ProcessStages"),
    ]);
  return { producers, brands, skus, authors, topics, processStages };
}

// ---------- Reference builders (use Airtable record ids) ----------
function ref(type: string, airtableId: string) {
  return { _type: "reference" as const, _ref: docId(type, airtableId) };
}

function refFromIndex(idx: Index<Nameish>, airtableId: string, type: string) {
  // Confirm the linked record exists in our filtered set
  if (!idx.has(airtableId)) return undefined;
  return ref(type, airtableId);
}

function refsFromIndex(
  idx: Index<Nameish>,
  airtableIds: ReadonlyArray<string> | undefined,
  type: string
) {
  if (!airtableIds || airtableIds.length === 0) return [];
  return airtableIds
    .map((id) => refFromIndex(idx, id, type))
    .filter(Boolean) as Array<{ _type: "reference"; _ref: string }>;
}

// ---------- small value helpers ----------
function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}
function num(v: unknown): number | undefined {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}
function idFirst(v: unknown): string | undefined {
  return Array.isArray(v) && typeof v[0] === "string" ? v[0] : undefined;
}
function idList(v: unknown): string[] {
  return Array.isArray(v)
    ? (v.filter((x) => typeof x === "string") as string[])
    : [];
}

// ---------- Mappers ----------
const mappers = {
  // Producers → producer
  Producers: (row: Rec) => {
    const name = str(row.get("Name"));
    if (!name) return null;
    return {
      _id: docId("producer", row.id),
      _type: "producer",
      name,
      country: str(row.get("Country")),
      website: str(row.get("Website")),
      notes: str(row.get("Notes")),
    };
  },

  // Brands → brand (Producer link)
  Brands: (row: Rec, ctx: { indices: Indices }) => {
    const name = str(row.get("Name"));
    if (!name) return null;
    const producerId = idFirst(row.get("Producer"));
    const producerRef = producerId
      ? refFromIndex(ctx.indices.producers, producerId, "producer")
      : undefined;

    return {
      _id: docId("brand", row.id),
      _type: "brand",
      name,
      producer: producerRef,
      description: str(row.get("Description")),
      website: str(row.get("Website")),
    };
  },

  // SKUs → sku (Brand link)
  SKUs: (row: Rec, ctx: { indices: Indices }) => {
    const title = str(row.get("Title"));
    if (!title) return null;

    const brandId = idFirst(row.get("Brand"));
    const brandRef = brandId
      ? refFromIndex(ctx.indices.brands, brandId, "brand")
      : undefined;

    return {
      _id: docId("sku", row.id),
      _type: "sku",
      title,
      brand: brandRef,
      abv: num(row.get("ABV")),
      volumeML: num(row.get("Volume (mL)")),
      distillateBase: str(row.get("Distillate Base")),
      upc: str(row.get("UPC")),
      tastingNotes: str(row.get("Tasting Notes")),
    };
  },

  // MarketVariants → marketVariant (SKU link)
  MarketVariants: (row: Rec, ctx: { indices: Indices }) => {
    const skuId = idFirst(row.get("SKU"));
    if (!skuId) return null;

    const skuExists = ctx.indices.skus.has(skuId);
    if (!skuExists) return null;

    return {
      _id: docId("marketVariant", row.id),
      _type: "marketVariant",
      sku: ref("sku", skuId),
      marketCountry: str(row.get("Market Country")),
      distributor: str(row.get("Distributor")),
      currency: str(row.get("Currency")),
      msrp: num(row.get("MSRP")),
      availability: str(row.get("Availability")),
      affiliateUrl: str(row.get("Affiliate URL")),
    };
  },

  // Certifications → certification (Producers/SKUs links)
  Certifications: (row: Rec, ctx: { indices: Indices }) => {
    const title = str(row.get("Title"));
    if (!title) return null;
    const producersRefs = refsFromIndex(
      ctx.indices.producers,
      idList(row.get("Producers")),
      "producer"
    );
    const skusRefs = refsFromIndex(
      ctx.indices.skus,
      idList(row.get("SKUs")),
      "sku"
    );

    return {
      _id: docId("certification", row.id),
      _type: "certification",
      title,
      organization: str(row.get("Organization")),
      url: str(row.get("URL")),
      description: str(row.get("Description")),
      producers: withKeys(producersRefs),
      skus: withKeys(skusRefs),
    };
  },

  // Awards → award (SKUs/Brands links)
  Awards: (row: Rec, ctx: { indices: Indices }) => {
    const title = str(row.get("Title"));
    if (!title) return null;

    const skusRefs = refsFromIndex(
      ctx.indices.skus,
      idList(row.get("SKUs")),
      "sku"
    );
    const brandsRefs = refsFromIndex(
      ctx.indices.brands,
      idList(row.get("Brands")),
      "brand"
    );

    return {
      _id: docId("award", row.id),
      _type: "award",
      title,
      competition: str(row.get("Competition")),
      year: num(row.get("Year")),
      medal: str(row.get("Medal")),
      url: str(row.get("URL")),
      skus: withKeys(skusRefs),
      brands: withKeys(brandsRefs),
    };
  },

  // AffiliateSources → affiliateSource
  AffiliateSources: (row: Rec) => {
    const name = str(row.get("Name"));
    if (!name) return null;
    return {
      _id: docId("affiliateSource", row.id),
      _type: "affiliateSource",
      name,
      network: str(row.get("Network")),
      affiliateId: str(row.get("Affiliate Id")),
      url: str(row.get("URL")),
      trackingUrl: str(row.get("Tracking URL")),
      notes: str(row.get("Notes")),
    };
  },

  // Authors → author
  Authors: (row: Rec) => {
    const name = str(row.get("Name"));
    if (!name) return null;
    return {
      _id: docId("author", row.id),
      _type: "author",
      name,
      bio: str(row.get("Bio")),
    };
  },

  // Topics → topic
  Topics: (row: Rec) => {
    const title = str(row.get("Title"));
    if (!title) return null;
    return {
      _id: docId("topic", row.id),
      _type: "topic",
      title,
      description: str(row.get("Description")),
    };
  },

  // ProcessStages → processStage
  ProcessStages: (row: Rec) => {
    const title = str(row.get("Title"));
    if (!title) return null;
    return {
      _id: docId("processStage", row.id),
      _type: "processStage",
      title,
      order: num(row.get("Order")),
      summary: str(row.get("Summary")),
      body: str(row.get("Body")),
    };
  },

  // Guides → guide (Authors/Topics/ProcessStages links)
  Guides: (row: Rec, ctx: { indices: Indices }) => {
    const title = str(row.get("Title"));
    if (!title) return null;

    const authorsRefs = refsFromIndex(
      ctx.indices.authors,
      idList(row.get("Authors")),
      "author"
    );
    const topicsRefs = refsFromIndex(
      ctx.indices.topics,
      idList(row.get("Topics")),
      "topic"
    );
    const stagesRefs = refsFromIndex(
      ctx.indices.processStages,
      idList(row.get("ProcessStages")),
      "processStage"
    );

    return {
      _id: docId("guide", row.id),
      _type: "guide",
      title,
      excerpt: str(row.get("Excerpt")),
      body: str(row.get("Body")),
      authors: withKeys(authorsRefs),
      topics: withKeys(topicsRefs),
      processStages: withKeys(stagesRefs),
    };
  },

  // LabNotes → labNote (Topics/Authors links)
  LabNotes: (row: Rec, ctx: { indices: Indices }) => {
    const title = str(row.get("Title"));
    if (!title) return null;

    const topicsRefs = refsFromIndex(
      ctx.indices.topics,
      idList(row.get("Topics")),
      "topic"
    );
    const authorsRefs = refsFromIndex(
      ctx.indices.authors,
      idList(row.get("Authors")),
      "author"
    );

    return {
      _id: docId("labNote", row.id),
      _type: "labNote",
      title,
      date: str(row.get("Date")),
      summary: str(row.get("Summary")),
      body: str(row.get("Body")),
      topics: withKeys(topicsRefs),
      authors: withKeys(authorsRefs),
    };
  },

  // GlossaryTerms → glossaryTerm
  GlossaryTerms: (row: Rec) => {
    const term = str(row.get("Term"));
    if (!term) return null;
    return {
      _id: docId("glossaryTerm", row.id),
      _type: "glossaryTerm",
      term,
      definition: str(row.get("Definition")),
    };
  },

  // Resources → resource (Authors/Topics links)
  Resources: (row: Rec, ctx: { indices: Indices }) => {
    const title = str(row.get("Title"));
    if (!title) return null;

    const authorsRefs = refsFromIndex(
      ctx.indices.authors,
      idList(row.get("Authors")),
      "author"
    );
    const topicsRefs = refsFromIndex(
      ctx.indices.topics,
      idList(row.get("Topics")),
      "topic"
    );

    return {
      _id: docId("resource", row.id),
      _type: "resource",
      title,
      url: str(row.get("URL")),
      type: str(row.get("Type")),
      description: str(row.get("Description")),
      authors: withKeys(authorsRefs),
      topics: withKeys(topicsRefs),
    };
  },
};

// ---------- Table ordering ----------
const RUN_ORDER: Array<keyof typeof mappers> = [
  "Producers",
  "Brands",
  "SKUs",
  "Authors",
  "Topics",
  "ProcessStages",
  "AffiliateSources",
  "GlossaryTerms",
  "Resources",
  "Guides",
  "LabNotes",
  "MarketVariants",
  "Certifications",
  "Awards",
];

// Map table name to Sanity type string
const TABLE_TO_TYPE: Record<keyof typeof mappers, string> = {
  Producers: "producer",
  Brands: "brand",
  SKUs: "sku",
  MarketVariants: "marketVariant",
  Certifications: "certification",
  Awards: "award",
  AffiliateSources: "affiliateSource",
  Authors: "author",
  Topics: "topic",
  Guides: "guide",
  ProcessStages: "processStage",
  LabNotes: "labNote",
  GlossaryTerms: "glossaryTerm",
  Resources: "resource",
};

// ---------- sync runner with logging, error isolation, prune ----------
type MapperCtx = { indices: Indices };
type Mapper = (
  row: Rec,
  ctx: MapperCtx
) => { _id: string; _type: string } | null;

async function syncTable(
  tableName: keyof typeof mappers,
  mapper: Mapper,
  ctx: MapperCtx
): Promise<{ ok: number; skipped: number; errors: number; ids: Set<string> }> {
  let ok = 0;
  let skipped = 0;
  let errors = 0;
  const touchedIds = new Set<string>();

  try {
    const rows = await fetchAll(tableName);
    for (const row of rows) {
      try {
        const doc = mapper(row, ctx);
        if (!doc) {
          skipped++;
          continue;
        }

        // Derive a slug seed once from name/title if present
        const slugSeed =
          ("name" in doc && typeof doc.name === "string" && doc.name) ||
          ("title" in doc && typeof doc.title === "string" && doc.title) ||
          undefined;

        await upsert(doc, {
          slugSeed: slugSeed ? slugify(slugSeed) : undefined,
        });
        touchedIds.add(doc._id);
        ok++;
      } catch (e) {
        errors++;
        console.error(`[${tableName}] row ${row.id} failed:`, e);
      }
    }
  } catch (e) {
    // Fatal table error
    console.error(`[${tableName}] table fetch failed:`, e);
  }

  return { ok, skipped, errors, ids: touchedIds };
}

async function maybePrune(
  tableName: keyof typeof mappers,
  expectedIds: Set<string>
): Promise<{ deleted: number }> {
  if (!PRUNE) return { deleted: 0 };
  const sanityType = TABLE_TO_TYPE[tableName];
  const existing = await fetchIdsForType(sanityType);
  let deleted = 0;

  for (const id of existing) {
    if (!expectedIds.has(id)) {
      await deleteById(id);
      deleted++;
    }
  }
  return { deleted };
}

async function main() {
  const indices = await buildAllIndices();
  const ctx: MapperCtx = { indices };

  const tables = ONLY_TABLE ? [ONLY_TABLE] : RUN_ORDER;

  let totalOk = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let totalDeleted = 0;

  for (const table of tables) {
    const mapFn = mappers[table];
    const { ok, skipped, errors, ids } = await syncTable(
      table,
      mapFn as Mapper,
      ctx
    );
    const { deleted } = await maybePrune(table, ids);
    totalOk += ok;
    totalSkipped += skipped;
    totalErrors += errors;
    totalDeleted += deleted;

    console.log(
      `Synced ${table} | upserted: ${ok} skipped: ${skipped} errors: ${errors}` +
        (PRUNE ? ` deleted: ${deleted}` : "")
    );
  }

  console.log(
    `Airtable → Sanity sync complete. upserted: ${totalOk} skipped: ${totalSkipped} errors: ${totalErrors}` +
      (PRUNE ? ` deleted: ${totalDeleted}` : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
