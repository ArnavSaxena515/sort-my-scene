import { list } from "@vercel/blob";
import { LANGUAGES, RTL_CODES } from "@/lib/languages";
import { MessageData } from "@/lib/types";

export const dynamic = "force-dynamic";

function txnId(date: string) {
  return "SMSCD-" + new Date(date).getTime().toString(16).toUpperCase().slice(-8) + "-OMEGA";
}

export default async function HomePage() {
  let data: MessageData | null = null;
  try {
    const { blobs } = await list({ prefix: "message.json" });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      data = await res.json();
    }
  } catch { /* blob not configured */ }

  const enabled = LANGUAGES.filter(
    (lang) =>
      data?.translations[lang.code]?.enabled &&
      data?.translations[lang.code]?.text?.trim()
  );

  if (!data || enabled.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="warning-stripes w-full h-3 absolute top-0" />
        <div className="text-center space-y-3">
          <p className="text-5xl">📡</p>
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-[0.3em]">
            NO ACTIVE TRANSMISSIONS
          </p>
          <p className="text-xs font-mono text-zinc-800">
            The world is currently uninformed. This is fine.
          </p>
        </div>
      </main>
    );
  }

  const id = txnId(data.updatedAt);
  const sentAt = new Date(data.updatedAt).toUTCString().toUpperCase();

  const tickerParts = [
    "⚡ TRANSMISSION ACTIVE",
    "·",
    `${enabled.length} TERRITORIES HAVE NO CHOICE BUT TO RECEIVE THIS`,
    "·",
    id,
    "·",
    `DISPATCHED: ${sentAt}`,
    "·",
    "GLOBAL IMPORTANCE: EXTREMELY YES",
    "·",
    "AUTHORIZED BY: ONE (1) PERSON",
    "·",
    "DISCLAIMER: RESULTS MAY VARY",
    "·",
    "THIS IS NOT A TEST (IT MIGHT BE A TEST)",
    "·",
    "SORT MY SCENE GLOBAL COMMUNICATIONS DIVISION™",
    "·",
    "IF RECEIVED IN ERROR PLEASE CONTINUE READING ANYWAY",
    "·",
  ];
  const ticker = [...tickerParts, ...tickerParts].join("   ");

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Top warning stripe ── */}
      <div className="warning-stripes h-3 w-full shrink-0" />

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/98 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2.5 text-xs font-mono">
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-live-blink" />
            <span className="text-red-400 font-bold tracking-widest">LIVE</span>
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-300 font-bold tracking-[0.2em] shrink-0">SORT MY SCENE</span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500 tracking-widest shrink-0 hidden sm:block">WORLDWIDE BROADCAST SYSTEM</span>
          <span className="ml-auto text-zinc-700 font-mono text-[10px] hidden sm:block shrink-0">{id}</span>
        </div>
      </div>

      {/* ── Ticker ── */}
      <div className="border-b border-amber-500/20 bg-amber-500/5 py-1.5 overflow-hidden shrink-0">
        <div className="animate-ticker whitespace-nowrap text-[10px] font-mono text-amber-400/70 tracking-wider">
          {ticker}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 py-14 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Giant title */}
          <div className="text-center mb-10">
            <div className="inline-block">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white animate-glitch mb-1">
                SORT MY SCENE
              </h1>
            </div>
            <p className="text-sm font-mono text-red-400/80 tracking-[0.25em] uppercase mt-2">
              ⚠ WORLDWIDE COMMUNICATIONS EMERGENCY ⚠
            </p>
            <p className="text-[10px] font-mono text-zinc-600 mt-1 tracking-widest">
              {sentAt} · {enabled.length} TERRITORIES
            </p>
          </div>

          {/* Badge row */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { label: "PRIORITY: OMEGA",       color: "border-red-800    text-red-400    bg-red-950/50"     },
              { label: "URGENCY: EXTREMELY YES", color: "border-amber-700  text-amber-400  bg-amber-950/50"   },
              { label: "SCOPE: ALL HUMANS",      color: "border-purple-800 text-purple-400 bg-purple-950/50"  },
              { label: "AUTHORIZED BY: SOMEONE", color: "border-zinc-700   text-zinc-400   bg-zinc-900"        },
            ].map(({ label, color }) => (
              <span
                key={label}
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded border tracking-widest ${color}`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Importance meter */}
          <div className="mb-8 bg-zinc-900/60 border border-zinc-800 rounded-lg px-5 py-4">
            <div className="flex justify-between items-center mb-2 text-[10px] font-mono text-zinc-500 tracking-widest">
              <span>GLOBAL IMPORTANCE ASSESSMENT</span>
              <span className="text-amber-400 font-bold">94%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full animate-importance bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 rounded-full" />
            </div>
            <p className="text-[9px] font-mono text-zinc-700 mt-2 tracking-wider">
              * based on internal metrics. methodology classified.
            </p>
          </div>

          {/* Disclaimer box */}
          <div className="mb-12 border border-red-900/50 bg-red-950/20 rounded-lg p-4">
            <p className="text-[10px] font-mono text-red-400/70 tracking-wider leading-5 uppercase">
              ⚠ ATTENTION: The following message was deemed{" "}
              <span className="text-red-400 font-bold">ABSOLUTELY NECESSARY</span>{" "}
              by one (1) individual. Sort My Scene Global Communications Division accepts no
              responsibility for any feelings this message may cause. Reading is mandatory
              (it is not). Please read in the language of your territory.
            </p>
          </div>

          {/* Language entries */}
          <div className="space-y-0">
            {enabled.map((lang, i) => (
              <div
                key={lang.code}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Territory header */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono text-zinc-700 tracking-[0.3em] uppercase">
                    TERRITORY:
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
                    {lang.name}
                  </span>
                  <span className="text-base ml-0.5">{lang.flag}</span>
                  <span className="ml-auto text-[9px] font-mono text-emerald-600 tracking-widest">
                    ✓ DELIVERED
                  </span>
                </div>

                {/* Native label */}
                <div className="mb-3">
                  <span className="text-[10px] font-mono text-zinc-600 tracking-[0.2em]">
                    {lang.nativeName}
                  </span>
                </div>

                {/* Message */}
                <p
                  className="text-[1.65rem] font-light leading-snug text-zinc-100 mb-2"
                  dir={RTL_CODES.has(lang.code) ? "rtl" : "ltr"}
                >
                  {data.translations[lang.code].text}
                </p>

                {i < enabled.length - 1 && (
                  <div className="my-10 border-b border-zinc-800/50" />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-20 space-y-3 text-center">
            <div className="text-[10px] font-mono text-zinc-700 tracking-[0.3em] uppercase">
              ── End of Transmission ──
            </div>
            <p className="text-[10px] font-mono text-zinc-800 leading-5 max-w-md mx-auto">
              Sort My Scene Global Communications Division™ hereby disclaims all responsibility
              for the above. Not liable for: confusion, strong feelings, forwarding to group chats,
              or existential crises. Void where prohibited by decency.
            </p>
            <p className="text-[9px] font-mono text-zinc-900">
              * This message has been translated by humans. (Not verified.)
            </p>
          </div>
        </div>
      </main>

      {/* ── Bottom warning stripe ── */}
      <div className="warning-stripes h-3 w-full shrink-0" />
    </div>
  );
}
