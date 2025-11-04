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
