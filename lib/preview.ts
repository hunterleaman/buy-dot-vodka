// lib/preview.ts
import { draftMode } from "next/headers";

export async function isPreviewEnabled() {
  try {
    const dm = await draftMode(); // wait for the promise
    return dm.isEnabled;
  } catch {
    return false;
  }
}
