"use client";

import { useState, useTransition } from "react";
import { LANGUAGES, RTL_CODES } from "@/lib/languages";
import { TranslationEntry } from "@/lib/types";

interface Props {
  initialTranslations: Record<string, TranslationEntry>;
  onSave: (translations: Record<string, TranslationEntry>) => Promise<void>;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

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

  const save = () => {
    setStatus("saving");
    startTransition(async () => {
      try {
        await onSave(translations);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    });
  };

  const buttonLabel =
    status === "saving"
      ? "Saving…"
      : status === "saved"
        ? "Saved ✓"
        : status === "error"
          ? "Error — retry"
          : "Save";

  const buttonClass =
    status === "error"
      ? "bg-red-600 text-white"
      : status === "saved"
        ? "bg-green-700 text-white"
        : "bg-white text-black hover:bg-zinc-200";

  return (
    <main className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
            Sort My Scene — Admin
          </h1>
          <button
            onClick={save}
            disabled={status === "saving"}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${buttonClass}`}
          >
            {buttonLabel}
          </button>
        </div>

        {/* Language cards */}
        <div className="space-y-4">
          {LANGUAGES.map((lang) => {
            const entry = translations[lang.code];
            return (
              <div
                key={lang.code}
                className="bg-zinc-900 rounded-xl p-4 border border-zinc-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium text-zinc-100 text-sm">
                      {lang.name}
                    </span>
                    <span className="text-zinc-500 text-xs">
                      {lang.nativeName}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleEnabled(lang.code)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                      entry.enabled
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                    }`}
                  >
                    {entry.enabled ? "Visible" : "Hidden"}
                  </button>
                </div>
                <textarea
                  value={entry.text}
                  onChange={(e) => updateText(lang.code, e.target.value)}
                  placeholder={`${lang.name} translation…`}
                  rows={2}
                  dir={RTL_CODES.has(lang.code) ? "rtl" : "ltr"}
                  className="w-full bg-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-zinc-600 placeholder-zinc-600"
                />
              </div>
            );
          })}
        </div>

        {/* Bottom save */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={save}
            disabled={status === "saving"}
            className={`px-8 py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${buttonClass}`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </main>
  );
}
