import { sanityWriteClient } from "./sanity.writeClient";
import crypto from "crypto";

/** Build a stable Sanity _id from Airtable record id */
export function docId(type: string, airtableId: string) {
  return `${type}.${airtableId}`;
}

/** Add deterministic _key to each reference item */
export function withKeys<T extends { _type: "reference"; _ref: string }>(
  refs: ReadonlyArray<T> | undefined
): Array<T & { _key: string }> | undefined {
  if (!refs) return undefined;
  if (refs.length === 0) return [];

  const seen = new Set<string>();
  return refs.map((r, i) => {
    let k = crypto.createHash("sha1").update(r._ref).digest("hex").slice(0, 12);
    while (seen.has(k))
      k = crypto
        .createHash("sha1")
        .update(`${r._ref}-${i}`)
        .digest("hex")
        .slice(0, 12);
    seen.add(k);
    return { ...r, _key: k };
  });
}

/** Merge: createIfNotExists + set provided fields, set slug only if missing */
export async function mergeDoc(
  id: string,
  type: string,
  fields: Record<string, unknown>,
  opts?: { slugSeed?: string }
) {
  await sanityWriteClient.createIfNotExists({ _id: id, _type: type });

  const setFields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined && k !== "_id" && k !== "_type") setFields[k] = v;
  }

  let p = sanityWriteClient.patch(id);
  if (Object.keys(setFields).length) p = p.set(setFields);

  if (opts?.slugSeed) {
    p = p.setIfMissing({
      slug: { _type: "slug", current: opts.slugSeed },
    });
  }

  // ✅ “Nicety” – Sanity will auto-generate keys for any arrays missing _key
  await p.commit({ autoGenerateArrayKeys: true });
}
