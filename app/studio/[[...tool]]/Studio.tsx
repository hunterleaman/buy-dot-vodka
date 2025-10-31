"use client";

import { NextStudio } from "next-sanity/studio";
// file depth: app/studio/[[...tool]]/Studio.tsx → repo root
import config from "../../../sanity.config";

export default function Studio() {
  return <NextStudio config={config} />;
}
