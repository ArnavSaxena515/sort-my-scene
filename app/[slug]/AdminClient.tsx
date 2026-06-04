"use client";

import { useState, useTransition } from "react";
import { LANGUAGES, RTL_CODES } from "@/lib/languages";
import { TranslationEntry } from "@/lib/types";

interface Props {
  initialTranslations: Record<string, TranslationEntry>;
  onSave: (translations: Record<string, TranslationEntry>) => Promise<void>;
}

type SaveStatus = "idle" | "saving" | "sent" | "error";

export default function AdminClient({ initialTranslations, onSave }: Props) {
  const [translations, setTranslations] =
    useState<Record<string, TranslationEntry>>(initialTranslations);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [, startTransition] = useTransition();

  const updateText = (code: string, text: string) =>
    setTranslations((prev) => ({ ...prev, [code]: { ...prev[code], text } }));

  const toggleEnabled = (code: string) =>
    setTranslations((prev) => ({
      ...prev,
      [code]: { ...prev[code], enabled: !prev[code].enabled },
    }));

  const deploy = () => {
    setStatus("saving");
    startTransition(async () => {
      try {
        await onSave(translations);
        setStatus("sent");
        setTimeout(() => setStatus("idle"), 4000);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    });
  };

  const armed = Object.values(translations).filter((t) => t.enabled).length;

  const btnLabel =
    status === "saving" ? "🌍 DEPLOYING TO HUMANITY…" :
    status === "sent"   ? "✅ HUMANITY HAS BEEN NOTIFIED" :
    status === "error"  ? "💀 TRANSMISSION FAILED (SKILL ISSUE)" :
                          "🚨 DEPLOY TO HUMANITY";

  const btnStyle =
    status === "error" ? "bg-red-900 border-red-600 text-red-300 animate-shake" :
    status === "sent"  ? "bg-emerald-950 border-emerald-600 text-emerald-300" :
    status === "saving"? "bg-zinc-800 border-zinc-600 text-zinc-400" :
                         "bg-red-600 border-red-500 text-white hover:bg-red-500 active:scale-95";

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* ── Top warning stripe ── */}
      <div className="warning-stripes h-3 w-full shrink-0" />

      {/* ── Console header ── */}
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/98 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono text-red-400 font-bold tracking-widest shrink-0">▌</span>
            <span className="text-xs font-mono text-zinc-200 font-bold tracking-[0.2em] shrink-0">
              BROADCAST CONSOLE
            </span>
            <span className="text-xs font-mono text-zinc-700 hidden sm:block">·</span>
            <span className="text-xs font-mono text-zinc-600 tracking-wider hidden sm:block">
              SORT MY SCENE GLOBAL DOMINATION INTERFACE v2.0
            </span>
          </div>
          <button
            onClick={deploy}
            disabled={status === "saving"}
            className={`ml-auto text-xs font-mono font-bold px-4 py-1.5 rounded border tracking-wider transition-all duration-150 cursor-pointer disabled:cursor-not-allowed shrink-0 ${btnStyle}`}
          >
            {btnLabel}
          </button>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="border-b border-zinc-800/60 px-4 py-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-zinc-600 tracking-wider">
        <span>
          TERRITORIES ARMED:{" "}
          <span className={armed > 0 ? "text-red-400 font-bold" : "text-zinc-600"}>
            {armed}
          </span>
        </span>
        <span>·</span>
        <span className="text-amber-600/80 animate-blink-cursor">
          STANDING BY FOR YOUR INSTRUCTIONS, COMMANDER
        </span>
        <span className="ml-auto hidden sm:block text-zinc-800">
          THIS IS NOT A DRILL (PROBABLY)
        </span>
      </div>

      {/* ── Briefing box ── */}
      <div className="mx-4 mt-6 max-w-2xl sm:mx-auto w-auto">
        <div className="border border-amber-800/40 bg-amber-950/20 rounded-lg px-4 py-3 text-[10px] font-mono text-amber-600/70 tracking-wider leading-5">
          ⚠ YOU ARE ABOUT TO ADDRESS THE ENTIRE WORLD. OR AT LEAST THE PARTS OF IT THAT
          VISIT THIS WEBSITE. COMPOSE YOUR MESSAGE BELOW. TOGGLE TERRITORIES ON/OFF.
          HIT DEPLOY WHEN READY TO CHANGE EVERYTHING. (NOTHING WILL CHANGE.)
        </div>
      </div>

      {/* ── Language cards ── */}
      <main className="flex-1 py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-3">

          {LANGUAGES.map((lang) => {
            const entry = translations[lang.code];
            return (
              <div
                key={lang.code}
                className={`rounded-lg border transition-all duration-150 ${
                  entry.enabled
                    ? "border-zinc-700 bg-zinc-900"
                    : "border-zinc-800/40 bg-zinc-900/30"
                }`}
              >
                {/* Card header */}
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800/60">
                  <span className="text-[9px] font-mono text-zinc-700 tracking-[0.25em] shrink-0">
                    TARGET:
                  </span>
                  <span className="text-base shrink-0">{lang.flag}</span>
                  <span className={`text-xs font-mono font-bold tracking-wider transition-colors ${entry.enabled ? "text-zinc-200" : "text-zinc-600"}`}>
                    {lang.name.toUpperCase()}
                  </span>
                  <span className={`text-xs font-mono transition-colors ${entry.enabled ? "text-zinc-500" : "text-zinc-700"}`}>
                    {lang.nativeName}
                  </span>
                  <button
                    onClick={() => toggleEnabled(lang.code)}
                    className={`ml-auto text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border tracking-widest transition-all cursor-pointer ${
                      entry.enabled
                        ? "border-red-700 text-red-400 bg-red-950/50 hover:bg-red-950"
                        : "border-zinc-700 text-zinc-600 bg-zinc-800/40 hover:border-zinc-500 hover:text-zinc-500"
                    }`}
                  >
                    {entry.enabled ? "🔴 ARMED" : "○ STAND DOWN"}
                  </button>
                </div>

                {/* Payload editor */}
                <div className="px-3 py-2.5">
                  {entry.enabled && (
                    <div className="text-[9px] font-mono text-zinc-700 mb-1 tracking-widest">
                      PAYLOAD:
                    </div>
                  )}
                  <textarea
                    value={entry.text}
                    onChange={(e) => updateText(lang.code, e.target.value)}
                    placeholder={entry.enabled ? `Enter ${lang.name} payload…` : "TERRITORY DISARMED"}
                    rows={2}
                    disabled={!entry.enabled}
                    dir={RTL_CODES.has(lang.code) ? "rtl" : "ltr"}
                    className={`w-full rounded px-3 py-2 text-sm font-light resize-none focus:outline-none transition-colors ${
                      entry.enabled
                        ? "bg-zinc-800 text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-zinc-500"
                        : "bg-transparent text-zinc-700 placeholder-zinc-800 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            );
          })}

          {/* Big deploy button */}
          <div className="pt-8 pb-4 flex flex-col items-center gap-3">
            <button
              onClick={deploy}
              disabled={status === "saving"}
              className={`text-base font-mono font-black px-10 py-4 rounded-lg border-2 tracking-widest transition-all duration-150 cursor-pointer disabled:cursor-not-allowed ${btnStyle}`}
            >
              {btnLabel}
            </button>
            <p className="text-[10px] font-mono text-zinc-700 tracking-wider">
              {status === "sent"
                ? `${armed} territories have been notified. the deed is done.`
                : `This will broadcast your message to ${armed} territories. This cannot be undone. (It can.)`}
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <div className="border-t border-zinc-800/60 px-4 py-2.5 text-[9px] font-mono text-zinc-800 tracking-wider text-center leading-5">
        SORT MY SCENE GLOBAL COMMUNICATIONS DIVISION™ · USE RESPONSIBLY · WE&apos;RE NOT WATCHING · (WE&apos;RE WATCHING)
      </div>

      {/* ── Bottom warning stripe ── */}
      <div className="warning-stripes h-3 w-full shrink-0" />
    </div>
  );
}
