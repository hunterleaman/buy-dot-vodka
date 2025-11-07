// lib/revalidate.ts
export type RevalidateInput = {
  type: string;
  action: string;
  slug: string | null;
  payload: Record<string, unknown> | null;
};

export type RevalidateResult = {
  tags: string[];
  paths: string[];
};

const uniq = <T>(arr: T[]) => Array.from(new Set(arr));
const truthy = <T>(x: T | null | undefined): x is T => Boolean(x);

export function mapRevalidateTargets(input: RevalidateInput): RevalidateResult {
  const { type, slug } = input;

  let tags: string[] = [];
  let paths: string[] = [];

  switch (type) {
    case "topic": {
      tags = [
        "topic:list",
        slug ? `topic:doc:${slug}` : null,
        "guide:list",
      ].filter(truthy);
      paths = ["/learn/topics", slug ? `/learn/topics/${slug}` : null].filter(
        truthy
      );
      break;
    }
    case "guide": {
      tags = [
        "guide:list",
        slug ? `guide:doc:${slug}` : null,
        "topic:list",
      ].filter(truthy);
      paths = ["/learn", slug ? `/learn/guides/${slug}` : null].filter(truthy);
      break;
    }
    case "brand": {
      tags = ["brand:list", slug ? `brand:doc:${slug}` : null].filter(truthy);
      paths = ["/brands", slug ? `/brands/${slug}` : null].filter(truthy);
      break;
    }
    case "sku": {
      // Minimal: brand lists usually surface SKUs
      tags = ["brand:list"];
      paths = ["/brands"];
      break;
    }
    case "producer": {
      // No-op until producer routes exist
      tags = [];
      paths = [];
      break;
    }
    default: {
      tags = [];
      paths = [];
    }
  }

  return { tags: uniq(tags), paths: uniq(paths) };
}
