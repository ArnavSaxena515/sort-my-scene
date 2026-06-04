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

  const transmit = () => {
    setStatus("saving");
    startTransition(async () => {
      try {
        await onSave(translations);
        setStatus("sent");
        setTimeout(() => setStatus("idle"), 3000);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    });
  };

  const buttonLabel =
    status === "saving" ? "TRANSMITTING…" :
    status === "sent"   ? "✓ TRANSMISSION SENT" :
    status === "error"  ? "⚠ TRANSMISSION FAILED" :
                          "⚡ TRANSMIT WORLDWIDE";

  const buttonStyle =
    status === "error" ? "bg-red-900 border-red-700 text-red-300" :
    status === "sent"  ? "bg-emerald-950 border-emerald-700 text-emerald-300" :
                         "bg-amber-500 border-amber-400 text-black hover:bg-amber-400";

  const visibleCount = Object.values(translations).filter((t) => t.enabled).length;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* ── Console top bar ── */}
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 tracking-[0.2em]">▌</span>
            <span className="text-xs font-mono text-zinc-300 font-semibold tracking-[0.2em]">
              BROADCAST CONSOLE
            </span>
            <span className="text-xs font-mono text-zinc-700">·</span>
            <span className="text-xs font-mono text-zinc-600 tracking-widest">
              SORT MY SCENE MISSION CONTROL
            </span>
          </div>
          <button
            onClick={transmit}
            disabled={status === "saving"}
            className={`ml-auto text-xs font-mono font-bold px-4 py-1.5 rounded border tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0 ${buttonStyle}`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="border-b border-zinc-800/60 px-4 py-1.5 flex items-center gap-4 text-[10px] font-mono text-zinc-600 tracking-wider">
        <span>TERRITORIES SELECTED: <span className="text-zinc-400">{visibleCount}</span></span>
        <span>·</span>
        <span>STANDING BY FOR TRANSMISSION</span>
        <span className="ml-auto hidden sm:block">CLASSIFICATION: EXTREMELY IMPORTANT</span>
      </div>

      {/* ── Language cards ── */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">

          <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em] mb-6 text-center">
            ── Configure territories and compose transmission ──
          </p>

          <div className="space-y-3">
            {LANGUAGES.map((lang) => {
              const entry = translations[lang.code];
              return (
                <div
                  key={lang.code}
                  className={`rounded-lg border transition-colors duration-150 ${
                    entry.enabled
                      ? "border-zinc-700/80 bg-zinc-900"
                      : "border-zinc-800/40 bg-zinc-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span className={`text-xs font-mono font-semibold tracking-wider transition-colors ${entry.enabled ? "text-zinc-200" : "text-zinc-600"}`}>
                        {lang.name.toUpperCase()}
                      </span>
                      <span className={`text-xs font-mono transition-colors ${entry.enabled ? "text-zinc-500" : "text-zinc-700"}`}>
                        {lang.nativeName}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleEnabled(lang.code)}
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded border tracking-widest transition-all cursor-pointer ${
                        entry.enabled
                          ? "border-emerald-700 text-emerald-400 bg-emerald-950/60"
                          : "border-zinc-700 text-zinc-600 bg-zinc-800/40 hover:border-zinc-600"
                      }`}
                    >
                      {entry.enabled ? "● LIVE" : "○ OFF"}
                    </button>
                  </div>
                  <div className="px-3 py-2">
                    <textarea
                      value={entry.text}
                      onChange={(e) => updateText(lang.code, e.target.value)}
                      placeholder={entry.enabled ? `${lang.name} transmission…` : "Disabled"}
                      rows={2}
                      disabled={!entry.enabled}
                      dir={RTL_CODES.has(lang.code) ? "rtl" : "ltr"}
                      className={`w-full rounded px-3 py-2 text-sm font-light resize-none focus:outline-none transition-colors ${
                        entry.enabled
                          ? "bg-zinc-800 text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-zinc-600"
                          : "bg-transparent text-zinc-700 placeholder-zinc-800 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom transmit */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={transmit}
              disabled={status === "saving"}
              className={`text-sm font-mono font-bold px-8 py-3 rounded border tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${buttonStyle}`}
            >
              {buttonLabel}
            </button>
            <p className="text-[10px] font-mono text-zinc-800 tracking-wider">
              This action will broadcast your message to {visibleCount} territories worldwide.
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <div className="border-t border-zinc-800/60 px-4 py-2 text-[10px] font-mono text-zinc-800 tracking-wider text-center">
        SORT MY SCENE GLOBAL COMMUNICATIONS DIVISION · ALL RIGHTS RESERVED · PROBABLY
      </div>
    </div>
  );
}
