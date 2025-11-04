"use client";

import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { PortableTextComponents } from "@portabletext/react";

type PortableImage =
  | {
      _type: "image";
      alt?: string;
      // When GROQ expands the asset with a direct URL
      url?: string;
      asset?:
        | { _type: "reference"; _ref: string } // common case without URL
        | { url?: string }; // projected asset with url
    }
  | undefined;

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const img = value as PortableImage;
      const url =
        img?.url ||
        (typeof img?.asset === "object" && "url" in (img.asset ?? {})
          ? (img?.asset as { url?: string }).url
          : undefined);

      if (!url) return null;

      // Basic responsive image until we add a Sanity image builder
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={url} alt={img?.alt ?? ""} className="my-4 rounded-lg" />;
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      if (!href) return <>{children}</>;
      const isExternal = /^https?:\/\//i.test(href);

      return isExternal ? (
        <a href={href} target="_blank" rel="noreferrer" className="underline">
          {children}
        </a>
      ) : (
        <Link href={href} className="underline">
          {children}
        </Link>
      );
    },
  },
};

export function PT({ value }: { value?: PortableTextBlock[] }) {
  if (!value || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}
