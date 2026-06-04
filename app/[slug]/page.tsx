import { notFound } from "next/navigation";
import { list } from "@vercel/blob";
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
    const { blobs } = await list({ prefix: "message.json" });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      existing = await res.json();
    }
  } catch {
    // Blob not yet configured — start fresh
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
