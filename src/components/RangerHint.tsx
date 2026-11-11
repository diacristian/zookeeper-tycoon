import { ArrowRight, ScanSearch, Sparkles } from "lucide-react";

interface RangerHintProps {
  onHint: () => void;
}

export function RangerHint({ onHint }: RangerHintProps) {
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
    </section>
  );
}
