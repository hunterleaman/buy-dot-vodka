# BUY.VODKA Vercel Deploy Record — Initial Preview

**Date:** 2025-11-07
**Environment:** Preview
**Project:** buy-dot-vodka
**Commit:** 35a08e6
**Build ID:** dpl_A7C5BxvYwofmsAdiUkYA4fbmMZrw
**Preview URL:** https://buy-dot-vodka.vercel.app

## Verified routes

- /learn ✅
- /learn/topics ✅
- /learn/topics/[slug] → e.g. /learn/topics/vodka-101 ✅
- /learn/guides/[slug] → e.g. /learn/guides/how-vodka-is-made ✅
- /brands ✅
- /brands/[slug] → e.g. /brands/<some-brand-slug> ✅
- /producers ✅
- /producers/[slug] → e.g. /producers/<some-producer-slug> ✅

## Preview mode

- Entered via `/api/preview?secret=***&redirect=/learn`: ✅
- Drafts rendered: ✅
- Exited via `/api/preview/exit`: ✅

## ISR checks

- Lists (120–180s) observed cache flip: ✅
- Details (~300s) observed cache flip: ✅
- Notes: Behavior matches Step 7 config; headers show MISS→HIT/REVALIDATED as expected.

## Env summary (Preview)

- NEXT_PUBLIC_SANITY_PROJECT_ID: set ✅
- NEXT_PUBLIC_SANITY_DATASET: set ✅
- SANITY_API_VERSION: set ✅
- SANITY_READ_TOKEN: set (server only) ✅
- SANITY_WRITE_TOKEN: N/A to Vercel (Actions-only) ✅
- SANITY_PREVIEW_SECRET: set ✅
- REVALIDATE_SECRET: set (for upcoming step) ✅
- NEXT_PUBLIC_SITE_URL: https://buy-dot-vodka.vercel.app ✅

## Notes / follow-ups

- Attach revalidation API route + Sanity webhook (next step).
- Add GA4 baseline + outbound/affiliate click events.
- Map custom domains (buy.vodka → Prod; preview.buy.vodka → Preview).
- Data architecture deep dive in a new chat.
