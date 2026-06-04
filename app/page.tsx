import { list } from "@vercel/blob";
import { LANGUAGES, RTL_CODES } from "@/lib/languages";
import { MessageData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let data: MessageData | null = null;

  try {
    const { blobs } = await list({ prefix: "message.json" });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      data = await res.json();
    }
  } catch {
    // Blob not configured — show empty state
  }

  const enabled = LANGUAGES.filter(
    (lang) =>
      data?.translations[lang.code]?.enabled &&
      data?.translations[lang.code]?.text?.trim()
  );

  if (!data || enabled.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600 text-base tracking-wide">
          Nothing here yet.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-xl mx-auto">
        {enabled.map((lang, i) => (
          <div key={lang.code}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{lang.flag}</span>
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                {lang.nativeName}
              </span>
            </div>
            <p
              className="text-2xl font-light leading-snug text-zinc-100"
              dir={RTL_CODES.has(lang.code) ? "rtl" : "ltr"}
            >
              {data.translations[lang.code].text}
            </p>
            {i < enabled.length - 1 && (
              <div className="mt-10 mb-10 border-b border-zinc-800" />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
