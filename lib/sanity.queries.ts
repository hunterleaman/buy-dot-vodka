// lib/sanity.queries.ts
import { groq } from "next-sanity";

/**
 * Reusable field fragments
 * Keep these generic and safe across your 16 schema types.
 * Extend as your schemas evolve.
 */

// Common identity fields
export const idFields = `
  _id,
  _type,
  _createdAt,
  _updatedAt
`;

// Slug helper to return a string
export const slugField = `"slug": slug.current`;

// Simple image projection
export const imageFields = `
  ...,
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "palette": asset->metadata.palette.dominant.background
`;

// Basic SEO fragment (guard each field with coalesce so missing fields do not break)
export const seoFields = `
  "seo": {
    "title": coalesce(seo.title, title, name),
    "description": coalesce(seo.description, excerpt, description, ""),
    "image": select(
      defined(seo.image)=> seo.image{ ${imageFields} },
      defined(ogImage)=> ogImage{ ${imageFields} }
    )
  }
`;

/**
 * Document-specific field sets
 * Adjust to your schema names and fields. These are minimal to start.
 */

// Producer projection
export const producerFields = `
  ${idFields},
  name,
  ${slugField},
  country,
  website,
  notes,
  ${seoFields}
`;

// Brand projection
export const brandFields = `
  ${idFields},
  name,
  ${slugField},
  "producer": producer->{
    _id,
    name,
    ${slugField},
    country
  },
  description,
  website,
  ${seoFields}
`;

// SKU projection (keep lean for lists; expand later for PDP)
export const skuFields = `
  ${idFields},
  title,
  ${slugField},
  "brand": brand->{
    _id,
    name,
    ${slugField}
  },
  abv,
  volume,
  distillateBase,
  upc,
  tastingNotes
`;

export const topicFields = groq`
  _id,
  _type,
  "slug": slug.current,
  title,
  description,
  coverImage{
    ...,
    "url": coalesce(asset->url, url)
  },
  seo{
    title,
    description,
    image{ "url": coalesce(image.asset->url, image.url) }
  }
`;

export const authorMiniFields = groq`
  _id,
  _type,
  name,
  "slug": slug.current,
  avatar{
    ...,
    "url": coalesce(asset->url, url)
  }
`;

export const guideCardFields = groq`
  _id,
  _type,
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  mainImage{
    ...,
    "url": coalesce(asset->url, url)
  },
  author->{ ${authorMiniFields} },
  "topics": topics[]->{
    _id,
    title,
    "slug": slug.current
  },
  seo{
    title,
    description,
    image{ "url": coalesce(image.asset->url, image.url) }
  }
`;

export const guideFullFields = groq`
  ${guideCardFields},
  body
`;

/**
 * List queries
 * Sort by a stable field for deterministic ISR.
 */

// All Producers
export const PRODUCER_LIST = groq`
  *[_type == "producer"] | order(name asc){
    ${producerFields}
  }
`;

// All Brands
export const BRAND_LIST = groq`
  *[_type == "brand"] | order(name asc){
    ${brandFields}
  }
`;

// Paginated Brands (example with $start and $end bindings)
export const BRAND_LIST_PAGINATED = groq`
  *[_type == "brand"] | order(name asc)[$start...$end]{
    ${brandFields}
  }
`;

// All SKUs for simple listing pages or sitemaps
export const SKU_LIST = groq`
  *[_type == "sku"] | order(title asc){
    ${skuFields}
  }
`;

export const TOPIC_LIST = groq`
  *[_type == "topic" && defined(slug.current)] | order(title asc) {
    ${topicFields}
  }
`;

export const GUIDE_LIST = groq`
  *[_type == "guide"] | order(coalesce(publishedAt, _createdAt) desc) [$offset...$end]{
    ${guideCardFields}
  }
`;

export const GUIDES_BY_TOPIC_SLUG = groq`
  *[_type == "guide" && $slug in topics[]->slug.current]
  | order(coalesce(publishedAt, _createdAt) desc) [$offset...$end]{
    ${guideCardFields}
  }
`;

/**
 * By slug queries
 * Use these in dynamic routes. Ensure slugs are unique per type.
 */

export const PRODUCER_BY_SLUG = groq`
  *[_type == "producer" && slug.current == $slug][0]{
    ${producerFields}
  }
`;

export const BRAND_BY_SLUG = groq`
  *[_type == "brand" && slug.current == $slug][0]{
    ${brandFields}
  }
`;

export const SKU_BY_SLUG = groq`
  *[_type == "sku" && slug.current == $slug][0]{
    ${skuFields}
  }
`;

export const TOPIC_BY_SLUG = groq`
  *[_type == "topic" && slug.current == $slug][0]{
    ${topicFields}
  }
`;

export const GUIDE_BY_SLUG = groq`
  *[_type == "guide" && slug.current == $slug][0]{
    ${guideFullFields}
  }
`;

/**
 * Slugs for static generation
 * Use for generateStaticParams and sitemaps.
 */

export const ALL_PRODUCER_SLUGS = groq`
  *[_type == "producer" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const ALL_BRAND_SLUGS = groq`
  *[_type == "brand" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const ALL_SKU_SLUGS = groq`
  *[_type == "sku" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const ALL_TOPIC_SLUGS = groq`
  *[_type == "topic" && defined(slug.current)]{ "slug": slug.current }
`;

export const ALL_GUIDE_SLUGS = groq`
  *[_type == "guide" && defined(slug.current)]{ "slug": slug.current }
`;

/**
 * Site-level settings
 * If you have a singleton for settings, keep a single query here.
 */

export const SITE_SETTINGS = groq`
  *[_type == "siteSettings"][0]{
    ${idFields},
    title,
    description,
    ogImage{ ${imageFields} },
    ${seoFields}
  }
`;
