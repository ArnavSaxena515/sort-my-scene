"use server";

import { kv } from "@vercel/kv";
import { MessageData, TranslationEntry } from "@/lib/types";

export async function saveMessage(
  adminPath: string,
  translations: Record<string, TranslationEntry>
) {
  if (!process.env.ADMIN_PATH || adminPath !== process.env.ADMIN_PATH) {
    throw new Error("Unauthorized");
  }

  const data: MessageData = {
    translations,
    updatedAt: new Date().toISOString(),
  };

  await kv.set("message", data);
}
