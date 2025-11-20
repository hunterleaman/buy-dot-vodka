# BUY.VODKA—Data Architecture Master Document

/docs/data-architecture/master.md

## 0. Purpose

This document defines the long-term data and content architecture for BUY.VODKA across Airtable, Sanity, and Next.js.

The goal is to create a scalable, editor-friendly, SEO-safe, non-breaking, and migration-aware system that cleanly models:

- Vodka producers, brands, SKUs, variants
- Certifications, awards, affiliate sources
- Process stages and production matrices
- Guides, topics, resources, authors
- Lab/tasting notes (internal vs public)
- Rich long-form content and structured sidebar modules
- Airtable <> Sanity field authority
- ISR + revalidation and rendering pipelines

  This is the umbrella document for all Track 5 work.

---

## 1. Core Invariants (Frozen Rules)

These rules apply globally and may only be changed via explicit Decision Ledger entries.

### 1.1 Field Semantics

1. description
   - Short summary only
   - Target 120--160 chars; hard cap 240 chars
   - Used for meta, cards, and previews

2. body
   - Full long-form editorial
   - Portable Text only
   - No HTML strings, no markdown strings

3. notes
   - Universal across all major types
   - Shape: { public, private }
   - public: PT (short clarifications, errata)
   - private: PT (internal commentary)
   - Hard rule: no UGC may live in notes

4. Narrative vs Facts
   - Narrative lives in PT blocks
   - Facts always live in dedicated fields or structured objects

### 1.2 Ownership

Airtable owns:

- Immutable record IDs (type.rec\*)
- Business logic fields (ABV, size, pricing, pack, UPCs, distribution flags)
- Certifications, award codes, affiliate link targets
- "Producer of record" links
- Availability states
- Any semi-structured field used for catalog logic

Sanity owns:

- title, slug, slugHistory
- All imagery
- All editorial (body, notes.public, relations, modules)
- SEO metadata
- Rich narrative
- Tasting/Lab narrative (public or internal)
- Sidebar/Info modules
- Author profiles
- Guide/Topic/Resource content

### 1.3 Slug Rules

- Canonical slug lives in Sanity
- slugHistory must preserve all previous slugs
- No global slug format changes in Track 5
- Redirects are handled centrally

### 1.4 Sync Semantics

- Merge semantics preserved
- No destructive field renames
- Staging dataset required before applying migrations

---

## 2. Anchors (Reusable Decision Bundles)

Anchors are stable decision groups referenced across Tracks so we never re-paste huge specs.

### ANCHOR A—Field Taxonomy & Naming

Standard names for all documents:

- title
- slug, slugHistory
- description
- body
- notes { public, private }
- images, hero
- seo
- relations
- status
- metrics
- system (source, immutable IDs, timestamps)

### ANCHOR B—Portable Text Specification

Unified PT block, mark, and custom object set, including:

- Blocks: normal, h2, h3, h4, bullet, numbered, blockquote, code block
- Marks: strong, em, underline, code, link, internalLink
- Objects: imageFigure, callout, infobox, gallery, timeline, tableObject, embedProduct, embedCTA
- Validation: no H1, no empty paragraphs, table constraints, link rules

### ANCHOR C—Notes System

- Universal notes field for all types
- public = PT, user-visible
- private = PT, internal only
- No UGC allowed in notes

### ANCHOR D—Relationships & Inheritance

- Producer → Brand → SKU → MarketVariant hierarchy
- MarketVariant as the commercial leaf
- Producer <> ProcessStage many-to-many via join doc
- Topic/Guide/Author/Resource relationships
- Cross-content linking rules
- Inheritance resolution rules for front-end

### ANCHOR E—Sidebar & Modules Layout

- Module taxonomy
- Slot system: { right, below, inline }
- Attach via relations.modules with ordering
- Module object shapes (facts, links, tasting sets, CTA, availability, etc.)

### ANCHOR F—Ownership Maps (Airtable vs Sanity)

Per-type authoritative field map.

Track C + F will finalize this contract.

### ANCHOR G—Migration & Testing Strategy

- Two-phase Track G:
  - G1: schema generation
  - G2: migration scripts + backfills
- Staging dataset mandatory
- Migration logging required
- No destructive schema changes

### ANCHOR H—Sensory & Evaluation Data

- Defines sensory attribute enums
- Rating scales
- Tasting note structures
- Separation between internal R&D vs public tasting reviews
- Future UGC reserved but not implemented in Track 5

---

## 3. Track Breakdown

Each Track is a standalone chat with its own initiation prompt, scope, outputs, and GATE.
All final outputs go into:
/docs/data-architecture/specs/trackX-<name>.md

### Track A—Global Standards

Locks Anchors A, B, C.

Specifies global field taxonomy, PT objects, notes system, SEO object, status object, and base validations.

### Track B—Narrative Types

Types: Producer, Brand, Guide, Topic, Resource, Author.

- Editorial intent
- Narrative structure patterns
- Relations + modules behavior
- Per-type field maps
- Begin extending Anchors D and E

### Track C—Commerce Types

Types: SKU, MarketVariant, Certification, Award, AffiliateSource.

- MarketVariant as leaf
- Description vs body per type
- Detailed ownership for SKU/Variant
- Finalize most of Anchor F

### Track D—Specialized Types

Types: ProcessStage, ProducerStage join, LabNoteInternal, TastingNotePublic.

- Many-to-many stage matrix
- Sensory modeling
- Internal vs public tasting intent
- Extend Anchors D and H

### Track E—Sidebar Modules

- Module taxonomy, schema, slots
- Rendering layout and required fields
- Finalize Anchor E

### Track F—Ownership & Sync Contract

- Per-type ownership tables
- Airtable-sync reserved fields
- Merge semantics
- Full Anchor F freeze

### Track G—Implementation & Migration

Phases:

- G1—Schema generation (documents & objects)
- G2—Migration scripts, backfills, staging tests
  Lock Anchor G.

---

## 4. Standard Workflow Per Track

Each Track chat must follow this flow:

1. Rehydrate Anchors

- Relevant Anchors listed by name, not pasted.

2. Declare Scope & Goals

- Types, questions, and success conditions.

3. Design Phase

- Editorial intent, relational modeling, structured vs PT decisions.

4. Spec Phase

- Field lists
- Ownership
- PT object usage
- Validations
- Example document instance
- Example front-end GROQ query (for key types)

5. GATE
   - 3 approval questions:
     1. Any naming you dislike?
     2. Any field you know you'll never use?
     3. Anything overfitted to v2?
   - Yes/No approval
   - If Yes: freeze + add Decision Ledger entries
   - If No: diff-based revision

6. Parking Lot
   Any out-of-scope idea logged without derailing track.

---

## 5. Decision Ledger

Separate file:
/docs/data-architecture/decision-ledger.md

Each entry:

- ID (e.g., D-PT-01)
- Anchor or Track
- Decision (1 line)
- Rationale (short phrase)
- Impact (where it matters)

Example entry:
D-PT-01—Anchor B
Decision: All long-form content must use the unified PT object set.
Rationale: Consistency + renderer simplicity.
Impact: Brand, Producer, Guide, Topic, Resource, SKU, Tasting.

---

## 6. Parking Lot Rules

- Every Track maintains its own small Parking Lot
- Parking Lot items may become future Track H/I/J but never derail current scope
- Items that turn into real decisions must be promoted into the Decision Ledger

---

## 7. Implementation Order

Frozen order:

1. Track A—Global Standards
2. Track B—Narrative Types
3. Track C—Commerce Types
4. Track D—Specialized Types
5. Track E—Sidebar Modules
6. Track F—Ownership Contract
7. Track G—Schemas + Migrations

No Track may override previous Anchors without a Decision Ledger entry.

---

## 8. Repo File Layout

    /docs/data-architecture/master.md
    /docs/data-architecture/decision-ledger.md

    /docs/data-architecture/specs/
        trackA-global-standards.md
        trackB-narrative-types.md
        trackC-commerce-types.md
        trackD-specialized-types.md
        trackE-sidebar-modules.md
        trackF-ownership-contract.md
        trackG-migration-and-schemas.md

---

# End of Master Data Architecture Document

This file will be maintained across Tracks and updated only after major decisions are made.
