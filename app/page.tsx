import { list } from "@vercel/blob";
import { LANGUAGES, RTL_CODES } from "@/lib/languages";
import { MessageData } from "@/lib/types";

export const dynamic = "force-dynamic";

function txnId(date: string) {
  return "TXN-" + new Date(date).getTime().toString(16).toUpperCase().slice(-8);
}

function utcString(date: string) {
  return new Date(date).toUTCString().toUpperCase();
}

export default async function HomePage() {
  let data: MessageData | null = null;

  try {
    const { blobs } = await list({ prefix: "message.json" });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      data = await res.json();
    }
  } catch {
    // Blob not configured
  }

  const enabled = LANGUAGES.filter(
    (lang) =>
      data?.translations[lang.code]?.enabled &&
      data?.translations[lang.code]?.text?.trim()
  );

  if (!data || enabled.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-xs font-mono text-zinc-700 uppercase tracking-[0.25em]">
          SORT MY SCENE · GLOBAL COMMUNICATIONS DIVISION
        </div>
        <div className="text-xs font-mono text-zinc-800 tracking-widest">
          ── NO ACTIVE TRANSMISSIONS ──
        </div>
      </main>
    );
  }

  const id = txnId(data.updatedAt);
  const sentAt = utcString(data.updatedAt);

  // ticker text: repeat enough to fill a seamless loop
  const tickerItems = [
    `⚡ TRANSMISSION ACTIVE`,
    `·`,
    `${enabled.length} TERRITORIES RECEIVING`,
    `·`,
    id,
    `·`,
    `DISPATCHED ${sentAt}`,
    `·`,
    `SORT MY SCENE GLOBAL COMMUNICATIONS DIVISION`,
    `·`,
    `CLASSIFIED: EXTREMELY IMPORTANT`,
    `·`,
  ];
  const tickerText = [...tickerItems, ...tickerItems].join("  ");

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2.5 text-xs font-mono">
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-live-blink" />
            <span className="text-red-400 font-bold tracking-widest">LIVE</span>
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-300 font-semibold tracking-[0.2em] shrink-0">
            SORT MY SCENE
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500 tracking-widest shrink-0">
            WORLDWIDE BROADCAST
          </span>
          <span className="ml-auto text-zinc-700 shrink-0 hidden sm:block">
            {id}
          </span>
        </div>
      </div>

      {/* ── Ticker ── */}
      <div className="border-b border-amber-500/15 bg-amber-500/5 py-1.5 overflow-hidden">
        <div className="animate-ticker whitespace-nowrap text-xs font-mono text-amber-500/60 tracking-wider">
          {tickerText}
        </div>
      </div>

      {/* ── Body ── */}
      <main className="flex-1 py-16 px-6">
        <div className="max-w-xl mx-auto">

          {/* Official header */}
          <div className="text-center mb-14">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.35em]">
              ── The following message has been officially transmitted ──
            </p>
          </div>

          {/* Language entries */}
          {enabled.map((lang, i) => (
            <div
              key={lang.code}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-base">{lang.flag}</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
                  {lang.nativeName}
                </span>
              </div>
              <p
                className="text-[1.6rem] font-light leading-snug text-zinc-100"
                dir={RTL_CODES.has(lang.code) ? "rtl" : "ltr"}
              >
                {data.translations[lang.code].text}
              </p>
              {i < enabled.length - 1 && (
                <div className="mt-10 mb-10 border-b border-zinc-800/50" />
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="mt-20 text-center space-y-2">
            <div className="text-[10px] font-mono text-zinc-700 tracking-[0.3em] uppercase">
              ── End of Transmission ──
            </div>
            <div className="text-[10px] font-mono text-zinc-800 tracking-wider">
              Sort My Scene Global Communications · &ldquo;Because someone had to say it&rdquo;
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
