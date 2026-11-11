import { Leaf, RotateCcw, Trophy } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "../lib/cn";
import { Modal } from "./Modal";

interface WinOverlayProps {
  open: boolean;
  moves: number;
  parMoves: number;
  onRestart: () => void;
  onClose: () => void;
}

const CONFETTI = Array.from({ length: 28 }, (_, index) => {
  const colors = ["#e7b54a", "#5d8c68", "#d97746", "#54a7a0", "#f1d28c"];
  return {
    left: (index * 37 + 11) % 100,
    delay: (index % 9) * 0.17,
    duration: 2.8 + (index % 5) * 0.32,
    color: colors[index % colors.length],
    size: 5 + (index % 3) * 2,
  };
});

export function WinOverlay({ open, moves, parMoves, onRestart, onClose }: WinOverlayProps) {
  const leaves = moves <= parMoves ? 3 : moves <= parMoves + 4 ? 2 : 1;

  return (
    <Modal open={open} onClose={onClose} labelId="win-title" panelClassName="max-w-xl border-amber-200/80">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {CONFETTI.map((piece, index) => (
            <span
              key={index}
              className="confetti-piece absolute top-0 rounded-[2px]"
              style={
                {
                  left: `${piece.left}%`,
                  width: piece.size,
                  height: piece.size * 1.6,
                  backgroundColor: piece.color,
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}s`,
                } satisfies CSSProperties
              }
            />
          ))}
        </div>

        <div className="relative px-5 pb-6 pt-8 text-center sm:px-9 sm:pb-8 sm:pt-10">
          <div className="mx-auto mb-4 flex w-fit items-center justify-center gap-1 rounded-full bg-amber-100 px-4 py-2 shadow-inner">
            <span className="text-2xl sm:text-3xl" aria-hidden="true">🦁</span>
            <span className="text-2xl sm:text-3xl" aria-hidden="true">🐒</span>
            <span className="text-2xl sm:text-3xl" aria-hidden="true">🦌</span>
          </div>

          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-amber-700">Formula satisfied</p>
          <h2 id="win-title" className="mt-1 font-display text-4xl font-semibold tracking-tight text-forest sm:text-5xl">
            Habitat happy!
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-relaxed text-forest/60">
            All nine animals found a true wish. The rangers are already planning the gift shop.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { value: "9", label: "animals" },
              { value: "9", label: "clauses true" },
              { value: String(moves), label: moves === 1 ? "action" : "actions" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-forest/8 bg-white/65 px-2 py-3">
                <p className="font-display text-2xl font-semibold text-forest">{stat.value}</p>
                <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-forest/40">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-extrabold text-amber-900">
            <Trophy className="h-4 w-4" aria-hidden="true" />
            {leaves === 3 ? "Three-leaf ranger" : leaves === 2 ? "Two-leaf keeper" : "Ranger approved"}
            <span className="ml-1 flex gap-0.5" aria-label={`${leaves} of 3 leaves`}>
              {[0, 1, 2].map((leaf) => (
                <Leaf
                  key={leaf}
                  className={cn("h-3.5 w-3.5", leaf < leaves ? "fill-emerald-600 text-emerald-700" : "text-amber-300")}
                  aria-hidden="true"
                />
              ))}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-forest px-4 py-3.5 text-sm font-extrabold text-cream transition hover:-translate-y-0.5 hover:bg-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Design another
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-forest/10 bg-white/70 px-4 py-3.5 text-sm font-extrabold text-forest/70 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
            >
              View habitat
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
