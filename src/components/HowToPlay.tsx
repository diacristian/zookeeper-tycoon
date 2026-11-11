import { Check, MapPin, MousePointer2, Sparkles } from "lucide-react";
import { Modal } from "./Modal";

interface HowToPlayProps {
  open: boolean;
  onClose: () => void;
}

export function HowToPlay({ open, onClose }: HowToPlayProps) {
  return (
    <Modal open={open} onClose={onClose} labelId="how-to-play-title">
      <div className="p-5 pr-14 sm:p-7 sm:pr-16">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-forest/40">Zookeeper field guide</p>
        <h2 id="how-to-play-title" className="mt-1 font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
          Three wishes. One happy home.
        </h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-forest/60">
          Every animal has a three-literal wish list. Make at least one wish come true for every resident, and fill all nine pens.
        </p>
      </div>

      <div className="space-y-3 px-5 pb-5 sm:px-7 sm:pb-7">
        <div className="grid gap-2.5">
          {[
            {
              icon: MousePointer2,
              title: "Pick a resident",
              body: "Choose a lion, monkey, or gazelle from the roster.",
            },
            {
              icon: MapPin,
              title: "Tap a land tile",
              body: "Grass, trees, and meadows can hold an animal. Water is scenery only.",
            },
            {
              icon: Check,
              title: "Satisfy one wish",
              body: "A green check means the animal's OR-clause is true. A red ! means all three wishes are false.",
            },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex gap-3 rounded-2xl border border-forest/8 bg-white/55 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest text-cream">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-forest">
                    {index + 1}. {step.title}
                  </p>
                  <p className="mt-0.5 text-xs font-medium leading-relaxed text-forest/55">{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-extrabold text-amber-950">
            <span className="text-xl" aria-hidden="true">🦁</span>
            <span>Water</span>
            <span className="text-[10px] tracking-[0.16em] text-amber-700/55">OR</span>
            <span>Gazelle</span>
            <span className="text-[10px] tracking-[0.16em] text-amber-700/55">OR</span>
            <span>No monkey next door</span>
          </div>
          <p className="mt-1.5 text-xs font-medium leading-relaxed text-amber-950/60">
            This is one clause. The whole zoo is an AND of nine clauses, which is exactly the shape of a 3-SAT formula.
          </p>
        </div>

        <div className="flex gap-3 rounded-2xl border border-emerald-900/10 bg-forest/[0.055] p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-300 text-forest">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-forest">Stuck? Ask Ranger AI.</p>
            <p className="mt-0.5 text-xs font-medium leading-relaxed text-forest/55">
              It runs a small exact solver over the remaining placements and highlights one legal next move.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-1 w-full rounded-2xl bg-forest px-4 py-3.5 text-sm font-extrabold text-cream shadow-sm transition hover:-translate-y-0.5 hover:bg-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
        >
          Start building
        </button>
      </div>
    </Modal>
  );
}
