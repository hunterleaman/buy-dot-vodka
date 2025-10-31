import { type SchemaTypeDefinition } from "sanity";

import producer from "./producer";
import brand from "./brand";
import sku from "./sku";
import marketVariant from "./marketVariant";
import certification from "./certification";
import award from "./award";
import affiliateSource from "./affiliateSource";

import author from "./learn/author";
import topic from "./learn/topic";
import guide from "./learn/guide";
import processStage from "./learn/processStage";
import labNote from "./learn/labNote";
import glossaryTerm from "./learn/glossaryTerm";
import resource from "./learn/resource";
import blockContent from "./learn/blockContent";

export const schemaTypes: SchemaTypeDefinition[] = [
  producer,
  brand,
  sku,
  marketVariant,
  certification,
  award,
  affiliateSource,
  author,
  topic,
  guide,
  processStage,
  labNote,
  glossaryTerm,
  resource,
  blockContent,
];
