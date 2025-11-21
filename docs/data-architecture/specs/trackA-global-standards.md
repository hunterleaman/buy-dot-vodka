# **Track A — Global Standards**

BUY.VODKA Data Architecture
**Frozen Anchors: A, B, C**

---

# **1. ANCHOR A — Field Taxonomy & Naming**

## Required Fields

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

## Optional Fields

- `hero`
- `images`
- `relations`
- `metrics`
- `system.createdAt`
- `system.updatedAt`

## Naming Rules

- lowerCamelCase
- semantic, not UI-driven
- objects always nouns (`seo`, `status`, `notes`, `metrics`)
- plural arrays (`images`)
- “body” is the only long-form field used across types

## Semantics

- `title`: canonical name
- `slug`: current route
- `slugHistory`: all prior slugs
- `description`: 120–160 chars (max 240)
- `body`: long-form PT
- `notes`: annotation system
- `seo`: search + social metadata
- `status`: editorial + visibility state
- `relations`: linked entities
- `metrics`: engagement (future)
- `system`: Airtable provenance

## Ownership

- **Airtable**: system.source, system.recId, business logic fields
- **Sanity**: all narrative + editorial fields

---

# **2. ANCHOR B — Portable Text Specification**

## Block Styles

- normal
- h2
- h3
- h4
- bullet
- numbered
- blockquote
- codeBlock

## Marks

- strong
- em
- underline
- code
- link
- internalLink

## Inline Objects

- inlineBadge { label, color? }
- simpleTag { text }
- statPair { label, value }

## Block Objects

- imageFigure { asset, caption }
- callout { tone, body }
- infobox { title?, body }
- gallery { images[] }
- timeline { items[] }
- tableObject { rows[] }
- embedProduct { ref }
- embedCTA { label, url }

## Validation

- no H1
- no empty blocks
- alt text required for images
- link rules enforced globally
- external links require `rel`
- embedProduct cannot nest
- table width capped (≤10 columns)

## Global PT Philosophy

Narrative is PT.
Facts are structured fields.
Consistent, section-first layout: h2 → narrative → images/objects → h3 subsections.

---

# **3. ANCHOR C — Notes System**

## Semantics

- `public`: short PT clarifications; user-visible
- `private`: internal PT; research, editor reasoning
- both are PT; neither may contain UGC
- notes annotate, never replace narrative

## Restrictions

- `private` may use full PT **except**:
  - no `embedCTA`
  - no `embedProduct`

## Usage Guidelines

Use notes for clarifications, provenance, editor intent, errata.
Never use notes to store facts required for frontend logic.

---

# **4. Global `seo` Object**

```
seo:
  metaTitle: string?
  metaDescription: string?
  ogImage: image?
  canonicalUrl: string?
  noIndex: boolean (default: false)
  structuredData: object?
```

Ownership: Sanity.

---

# **5. Global `status` Object**

```
status:
  published: boolean
  archived: boolean
  visibility: "public" | "private" | "embargo"
  lastReviewedAt: datetime?
  dataConfidence: "low" | "medium" | "high"
```

Ownership: Sanity.

---

# **6. Global Validation Rules**

- description ≤240 chars
- hero required for all public-facing types
- body required
- slug unique per type
- notes cannot be empty objects
- internalLink must reference a valid Sanity document
- externalLink must include `rel`
- system.recId must be authoritative Airtable ID

---

# **7. Example Minimal Document**

```
{
  "_type": "brand",
  "title": "Example Brand",
  "slug": { "current": "example-brand" },
  "slugHistory": ["examplebrand"],
  "description": "A crisp, modern vodka brand.",
  "hero": { "_type": "image", "asset": { "_ref": "..."} },
  "images": [],
  "body": [
    { "_type": "block", "style": "normal", "children": [{ "text": "Lorem ipsum..." }] }
  ],
  "notes": {
    "public": [],
    "private": [
      { "_type": "block", "style": "normal", "children": [{ "text": "Internal research note." }] }
    ]
  },
  "seo": {
    "metaTitle": "Example Brand",
    "metaDescription": "A crisp, modern vodka brand.",
    "ogImage": { "_ref": "..." },
    "noIndex": false
  },
  "status": {
    "published": true,
    "archived": false,
    "visibility": "public",
    "dataConfidence": "high"
  },
  "relations": {},
  "metrics": {},
  "system": {
    "source": "airtable",
    "recId": "recXXXX",
    "createdAt": "2024-01-01",
    "updatedAt": "2024-01-02"
  }
}
```

---

# **Parking Lot**

- Sensory diagram PT objects
- Auto-generated TOC block
- Translation fields for future i18n
