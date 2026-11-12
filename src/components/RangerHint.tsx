import { ArrowRight, ScanSearch, Sparkles } from "lucide-react";
import { cellShortName } from "../lib/board";
import type { HintResult } from "../game/types";
import { SPECIES } from "../ui/species";

interface RangerHintProps {
  hint: Extract<HintResult, { status: "placement" }> | null;
  onHint: () => void;
  compact?: boolean;
}

export function RangerHint({ hint, onHint, compact = false }: RangerHintProps) {
  if (compact) {
    return (
      <section className="shrink-0 overflow-hidden rounded-2xl border border-emerald-900/25 bg-forest text-cream shadow-sm">
        <button
          type="button"
          onClick={onHint}
          className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-amber-300 text-forest">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block text-[11px] font-extrabold">Ranger AI</span>
            <span className="block truncate text-[9px] font-medium text-cream/55">
              {hint
                ? `${SPECIES[hint.kind].name} at ${cellShortName(hint.cell)} · tap the glowing pen`
                : "Find one legal next move"}
            </span>
          </span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-cream/45" aria-hidden="true" />
        </button>
        {hint && (
          <p
            className="line-clamp-3 border-t border-white/10 px-2.5 py-1.5 text-[10px] font-medium leading-snug text-cream/70"
            aria-live="polite"
            title={hint.reason}
          >
            {hint.reason}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-900/20 bg-forest text-cream shadow-[0_16px_36px_rgba(23,53,42,0.22)]">
      <button
        type="button"
        onClick={onHint}
        className="group relative flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300"
      >
        <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-amber-300/10 blur-xl" />
        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-300 text-forest shadow-sm">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="relative min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold">Ranger AI</span>
            <ScanSearch className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
          </span>
          <span className="mt-0.5 block text-[11px] font-medium leading-snug text-cream/60">
            Search the remaining 3-SAT assignments for one legal move.
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-cream/45 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </button>

      {hint && (
        <div className="border-t border-white/10 bg-black/15 px-4 pb-4 pt-3" aria-live="polite">
          <p className="flex flex-wrap items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-amber-300">
            <span aria-hidden="true">{SPECIES[hint.kind].emoji}</span>
            {SPECIES[hint.kind].name} at {cellShortName(hint.cell)}
          </p>
          <p className="mt-1.5 text-[11.5px] font-medium leading-relaxed text-cream/75">
            {hint.reason}
          </p>
          <p className="mt-2 text-[10px] font-semibold text-cream/40">
            Tap the glowing pen to place it, or pick a different pen.
          </p>
        </div>
      )}
    </section>
  );
}
