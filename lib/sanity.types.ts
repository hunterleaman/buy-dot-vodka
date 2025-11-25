// lib/sanity.types.ts

export type SanityDocBase = {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  slug?: string;
};

export type Producer = SanityDocBase & {
  name: string;
  country?: string;
  website?: string;
  notes?: string;
  seo?: {
    title?: string;
    description?: string;
    image?: { url?: string; lqip?: string | null };
  };
};

export type Brand = SanityDocBase & {
  name: string;
  producer?: {
    _id: string;
    name: string;
    slug?: string;
    country?: string;
  } | null;
  description?: string;
  website?: string;
  seo?: Producer["seo"];
};

export type Slug = { _type: "slug"; current: string };

export type ImageAsset = {
  _type: "image";
  alt?: string;
  caption?: string;
  asset?: { _ref?: string; _type?: "reference"; url?: string };
  url?: string; // convenience when projected
};

export type SeoFields = {
  title?: string;
  description?: string;
  image?: { url?: string };
};

export type Author = {
  _id: string;
  _type: "author";
  name: string;
  slug: string;
  avatar?: ImageAsset | null;
  bio?: string | null;
};

export type Topic = {
  _id: string;
  _type: "topic";
  title: string;
  slug: string;
  description?: string | null;
  seo?: SeoFields;
  coverImage?: ImageAsset | null;
};

export type Guide = {
  _id: string;
  _type: "guide";
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null; // <-- allow string now; migrate to block later
  mainImage?: ImageAsset | null;
  topics?: Pick<Topic, "_id" | "title" | "slug">[];
  author?:
    | (Pick<Author, "_id" | "name" | "slug"> & { avatar?: ImageAsset | null })
    | null;
  publishedAt?: string | null;
  seo?: SeoFields;
};
