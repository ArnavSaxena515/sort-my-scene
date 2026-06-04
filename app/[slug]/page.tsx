import { notFound } from "next/navigation";
import { kv } from "@vercel/kv";
import { LANGUAGES } from "@/lib/languages";
import { MessageData, TranslationEntry } from "@/lib/types";
import AdminClient from "./AdminClient";
import { saveMessage } from "./actions";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const adminPath = process.env.ADMIN_PATH;

  if (!adminPath || slug !== adminPath) {
    notFound();
  }

  let existing: MessageData | null = null;
  try {
    existing = await kv.get<MessageData>("message");
  } catch {
    // KV not yet configured — start fresh
  }

  const initialTranslations: Record<string, TranslationEntry> =
    existing?.translations ??
    Object.fromEntries(
      LANGUAGES.map((l) => [l.code, { text: "", enabled: true }])
    );

  const boundSave = saveMessage.bind(null, adminPath);

  return (
    <AdminClient
      initialTranslations={initialTranslations}
      onSave={boundSave}
    />
  );
}
