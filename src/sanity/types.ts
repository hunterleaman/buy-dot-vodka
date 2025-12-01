// src/sanity/types.ts

export type DocumentWithSystemSource = {
  system?: {
    source?: "airtable" | "sanity" | "mixed";
  };
};
