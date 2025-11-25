import { type SchemaTypeDefinition } from "sanity";

import affiliateSource from "./affiliateSource";
import author from "./author";
import award from "./award";
import blockContent from "./blockContent";
import brand from "./brand";
import certification from "./certification";
import guide from "./guide";
import labNoteInternal from "./labNoteInternal";
import marketVariant from "./marketVariant";
import metrics from "./metrics";
import notes from "./notes";
import processStage from "./processStage";
import producerStage from "./producerStage";
import producer from "./producer";
import relations from "./relations";
import resource from "./resource";
import seo from "./seo";
import sku from "./sku";
import status from "./status";
import system from "./system";
import topic from "./topic";
import tastingNotePublic from "./tastingNotePublic";

import siteSettings from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  affiliateSource,
  author,
  award,
  blockContent,
  brand,
  certification,
  guide,
  labNoteInternal,
  marketVariant,
  metrics,
  notes,
  processStage,
  producerStage,
  producer,
  relations,
  resource,
  seo,
  sku,
  siteSettings,
  status,
  system,
  tastingNotePublic,
  topic,
];
