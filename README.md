# BUY.VODKA v2

Next.js + Sanity + Airtable + Vercel app for BUY.VODKA.

## Stack

- Next.js App Router (`/app`)
- Sanity Studio at `/app/studio/[[...tool]]/Studio.tsx`
- Sanity Content Lake
- Airtable as upstream data source
- Vercel for hosting

## Prereqs

- Node 22+
- pnpm 9+
- Sanity project and dataset created
- Airtable base with the canonical tables and fields
- `.env.local` in repo root

## Environment

Local development uses `.env.local` (git-ignored). A template is provided in `.env.local.example`.

**Required keys (public)**

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_ENV` (`preview` locally; `production` in Vercel Production)
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (set only in Production)
- `NEXT_PUBLIC_AFFILIATE_HOSTS` (comma-separated list, optional)

**Server-only**

- `SANITY_API_VERSION`
- `SANITY_READ_TOKEN`
- `SANITY_WRITE_TOKEN`
- `SANITY_PREVIEW_SECRET`
- `REVALIDATE_SECRET`
- `NEXT_REVALIDATION_SECRET`
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `SKIMLINKS_SITE_ID`

**Vercel**
Use Vercel’s Environment Variables:

- **Production**: set `NEXT_PUBLIC_APP_ENV=production` and GA4 ID (others as needed).
- **Preview**: set `NEXT_PUBLIC_APP_ENV=preview` and leave GA4 unset to disable analytics.

## Install

```bash
pnpm install
```

## Dev

```bash
pnpm dev
# open http://localhost:3000
```

Sanity Studio runs inside the Next.js app at:

```
/studio
```

## Airtable → Sanity Sync

Deterministic, idempotent sync that:

- Imports only rows where `Ready to Publish = true`
- Upserts by stable `_id` format `type.slugifiedName`
- Maps Airtable fields exactly to Sanity schemas
- Maintains references using Sanity reference objects
- Safe to rerun using `createOrReplace`

**Script location**

```
scripts/airtable-sync.ts
```

**Run commands**
Full sync:

```bash
pnpm sync:airtable
```

Dry run:

```bash
pnpm sync:airtable:dry
```

Prune orphaned docs in Sanity that are no longer present in Airtable Ready set:

```bash
pnpm sync:airtable:prune
```

Single table only:

```bash
pnpm tsx scripts/airtable-sync.ts --table=Brands
# or add a script entry to package.json if you prefer
```

**Flags**

- `--dry` prints would-be writes and deletes. No mutations.
- `--prune` deletes Sanity docs with ids in the namespace for that type that do not appear in the current Airtable Ready set.
- `--table=Brands` runs a single table. Use the Airtable table names from RUN_ORDER.

**Idempotency rules**

- Stable `_id` = `type.slugifiedName`. For `marketVariant` it uses `skuTitle-airtableRecordId` to ensure uniqueness across markets.
- `createOrReplace` ensures safe reruns. Running twice should not create history churn.

**Deletion policy**

- No deletes by default.
- `--prune` mode compares current Sanity ids for each type against the Airtable Ready set and deletes the difference.

**Reference resolution**

- Linked fields in Airtable are arrays. Singular links use the first id.
- Reference objects are `{ _type: "reference", _ref: "<stable-id>" }`.

## CI: Manual Sync Workflow

A GitHub Actions workflow is included to run the sync on demand with repository secrets. File:

```
.github/workflows/manual-airtable-sync.yml
```

Run it from the Actions tab and supply optional inputs:

- `dry` = true to do a dry run
- `prune` = true to prune
- `table` = optional single table, for example `Brands`

The workflow requires these repository secrets:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_READ_TOKEN`
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`

## Troubleshooting

- **Missing required env var**
  Ensure `.env.local` exists in repo root and values are set. The loader lives in `lib/env.ts` and is imported by `sanityClient` and the sync script.
- **Nothing syncs**
  Confirm Airtable rows are marked `Ready to Publish = true`. The sync filters on this flag.
- **Reference missing**
  Parents must sync first. The script runs parents before children. If a child row references an unpublished parent, the child will upsert with an empty reference.
- **Test changes without writing**
  Use `pnpm sync:airtable:dry`.

## Project Structure

```
app/                       # Next.js App Router
  studio/[[...tool]]/      # Embedded Sanity Studio
lib/
  env.ts                   # dotenv loader and reqEnv helper
  sanityClient.ts          # Sanity JS client
scripts/
  airtable-sync.ts         # Airtable → Sanity sync
sanity/                    # Schemas (from Step 4)
```

## License

Private project. All rights reserved.
