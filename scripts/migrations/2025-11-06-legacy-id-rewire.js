/* scripts/migrate-legacy-ids.js
 *
 * One-time migration to:
 *  - Pair legacy docs (type.slugifiedName) with new docs (type.recXXXXXXXXXXXXXX)
 *  - Merge editorial fields from legacy -> new (setIfMissing)
 *  - Rewire all references from legacy _id -> new _id (preserve _key)
 *  - Delete legacy docs
 *
 * Usage:
 *   node scripts/migrate-legacy-ids.js --dry
 *   node scripts/migrate-legacy-ids.js
 *
 * Requires env:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_VERSION
 *   SANITY_WRITE_TOKEN   (editor scope)
 */

// Load env from repo root explicitly
import { config as loadEnv } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

loadEnv({ path: path.join(repoRoot, ".env.local") });
loadEnv({ path: path.join(repoRoot, ".env") });

import { createClient } from "@sanity/client";
import crypto from "crypto";

const DRY = process.argv.includes("--dry");

const client = createClient({
  projectId: req("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: req("NEXT_PUBLIC_SANITY_DATASET"),
  apiVersion: req("SANITY_API_VERSION"),
  token: req("SANITY_WRITE_TOKEN"),
  useCdn: false,
  perspective: "published",
});

// Types you want to migrate (extend if needed)
const TYPES = [
  "producer",
  "brand",
  "sku",
  "topic",
  "guide",
  "certification",
  "award",
  "affiliateSource",
  "author",
  "processStage",
  "labNote",
  "glossaryTerm",
  "resource",
];

// Editorial fields you want to copy setIfMissing from legacy -> new.
// Keep conservative. You can add per-type overrides below if needed.
const EDITORIAL_FIELD_ALLOWLIST = [
  "slug", // { _type: "slug", current: "..." }
  "seo", // object
  "mainImage", // object
  "coverImage", // object
  "ogImage", // object
  "body", // string / block content
  "description", // string (only setIfMissing)
  "excerpt", // string
  "notes", // string
];

// Optional per-type extras (leave empty by default)
const PER_TYPE_EDITORIAL_EXTRAS = {
  // guide: ["somethingSpecific"],
};

function req(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return v;
}

// Slugify approximating your earlier behavior.
// Includes your normalization for "buy-dot-vodka".
function slugify(input) {
  return String(input || "")
    .replace(/buy[.\-]vodka/gi, "buy-dot-vodka")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

// Build legacy _id from doc name/title (previous scheme)
function legacyIdFor(type, nameOrTitle) {
  return `${type}.${slugify(nameOrTitle)}`;
}

// Given a doc, return its display name/title
function nameOrTitle(doc) {
  return doc.name || doc.title || "";
}

function hash12(s) {
  return crypto.createHash("sha1").update(String(s)).digest("hex").slice(0, 12);
}

// Deep clone
function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

// Traverse a value and replace any reference {_type:"reference", _ref: oldId}
// with {_ref: newId}, preserving _key. Returns {value, changed, changedPaths}
function replaceRefs(value, oldId, newId, path = []) {
  let changed = false;
  const changedPaths = new Set();

  function markChanged(p) {
    changed = true;
    changedPaths.add(JSON.stringify(p));
  }

  function walk(v, pth) {
    if (Array.isArray(v)) {
      let anyChildChanged = false;
      const next = v.map((item, idx) => {
        const r = walk(item, pth.concat(idx));
        if (r.changed) anyChildChanged = true;
        return r.value;
      });
      if (anyChildChanged) {
        markChanged(pth);
        return { value: next, changed: true };
      }
      return { value: v, changed: false };
    }

    if (v && typeof v === "object") {
      // Reference replacement
      if (v._type === "reference" && v._ref === oldId) {
        const next = { ...v, _ref: newId };
        // preserve _key if exists; if missing, add deterministic key
        if (!next._key) next._key = hash12(newId);
        markChanged(pth);
        return { value: next, changed: true };
      }

      // Recurse object
      let anyChildChanged = false;
      const nextObj = {};
      for (const [k, val] of Object.entries(v)) {
        const r = walk(val, pth.concat(k));
        nextObj[k] = r.value;
        if (r.changed) anyChildChanged = true;
      }
      if (anyChildChanged) {
        markChanged(pth);
        return { value: nextObj, changed: true };
      }
      return { value: v, changed: false };
    }

    // primitive
    return { value: v, changed: false };
  }

  const res = walk(value, path);
  return {
    value: res.value,
    changed,
    changedPaths: Array.from(changedPaths).map(JSON.parse),
  };
}

// Fetch all new docs of a type (rec-based ids) with name/title and slug
async function fetchNewDocs(type) {
  const q = `*[_type == $t && _id match $prefix]{_id,_type,name,title,slug}`;
  return client.fetch(q, { t: type, prefix: `${type}.rec*` });
}

// Fetch legacy doc by computed id
async function fetchLegacyDocById(id) {
  const q = `*[_id == $id][0]`;
  return client.fetch(q, { id });
}

// Fetch all docs referencing a given _id
async function fetchReferencingDocs(oldId) {
  const q = `*[
    references($oldId)
  ]`;
  return client.fetch(q, { oldId });
}

// Merge editorial fields from legacy -> new using setIfMissing
async function mergeEditorialFields(newId, type, legacyDoc) {
  if (!legacyDoc) return;

  const allow = new Set(
    EDITORIAL_FIELD_ALLOWLIST.concat(PER_TYPE_EDITORIAL_EXTRAS[type] || [])
  );
  const toSetIfMissing = {};
  for (const k of allow) {
    if (legacyDoc[k] !== undefined) {
      toSetIfMissing[k] = legacyDoc[k];
    }
  }

  if (Object.keys(toSetIfMissing).length === 0) return;

  if (DRY) {
    console.log(
      ` [dry] setIfMissing editorial on ${newId}`,
      Object.keys(toSetIfMissing)
    );
    return;
  }

  await client
    .patch(newId)
    .setIfMissing(toSetIfMissing)
    .commit({ autoGenerateArrayKeys: true });
}

// Rewire references oldId -> newId across all docs
async function rewireReferences(oldId, newId) {
  const docs = await fetchReferencingDocs(oldId);
  if (!docs || docs.length === 0) return;

  for (const d of docs) {
    // Always fetch full doc to compute precise patches
    const full = await client.getDocument(d._id);
    if (!full) continue;

    const {
      value: nextDoc,
      changed,
      changedPaths,
    } = replaceRefs(full, oldId, newId);
    if (!changed) continue;

    // Build a patch with .set() for each changed top-level path
    // We only set the first segment paths to avoid excessive patch complexity
    const setPayload = {};
    const topLevelPaths = new Set(changedPaths.map((p) => p[0]));
    for (const key of topLevelPaths) {
      setPayload[key] = nextDoc[key];
    }

    if (DRY) {
      console.log(
        ` [dry] patch ${d._id} set keys: ${Array.from(topLevelPaths).join(", ")}`
      );
      continue;
    }

    await client
      .patch(d._id)
      .set(setPayload)
      .commit({ autoGenerateArrayKeys: true });
  }
}

// Delete legacy doc if no more references
async function deleteLegacyDoc(oldId) {
  if (DRY) {
    console.log(` [dry] delete ${oldId}`);
    return;
  }
  await client.delete(oldId);
}

async function migrateType(type) {
  console.log(`\n=== Migrating type: ${type} ===`);

  const newDocs = await fetchNewDocs(type);

  for (const nd of newDocs) {
    const label = nameOrTitle(nd);
    if (!label) {
      console.log(` - skip ${nd._id} (no name/title)`);
      continue;
    }

    const legacyId = legacyIdFor(type, label);
    const legacy = await fetchLegacyDocById(legacyId);
    if (!legacy) {
      // nothing to rewire for this new doc
      continue;
    }

    console.log(` - pair: ${legacyId}  ->  ${nd._id}`);

    // 1) Merge editorial fields setIfMissing
    await mergeEditorialFields(nd._id, type, legacy);

    // 2) Rewire references
    await rewireReferences(legacyId, nd._id);

    // 3) Delete legacy doc
    try {
      await deleteLegacyDoc(legacyId);
    } catch (e) {
      // If still referenced, log and continue
      console.warn(`   ! delete failed for ${legacyId}: ${e.message || e}`);
    }
  }
}

async function main() {
  for (const t of TYPES) {
    await migrateType(t);
  }
  console.log("\nMigration complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
