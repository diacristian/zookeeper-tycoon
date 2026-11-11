import { Check, MapPin, Trash2, X } from "lucide-react";
import { ANIMAL_RULES } from "../game/rules";
import type { AnimalEvaluation, AnimalKind, Literal } from "../game/types";
import { cellShortName } from "../lib/board";
import { cn } from "../lib/cn";
import { SPECIES } from "../ui/species";
import { TerrainIcon } from "./TerrainIcon";

interface RuleCardProps {
  animal: AnimalKind;
  inspection: AnimalEvaluation | null;
  placed: number;
  onRemove: () => void;
}

function LiteralMark({ literal }: { literal: Literal }) {
  if (literal.kind === "nearTerrain" || literal.kind === "notNearTerrain") {
    return (
      <span className="relative">
        <TerrainIcon terrain={literal.terrain} className="h-4 w-4" />
        {literal.kind === "notNearTerrain" && (
          <X className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-white text-red-500" strokeWidth={3} />
        )}
      </span>
    );
  }

  return (
    <span className="relative text-base leading-none">
      {SPECIES[literal.animal].emoji}
      {literal.kind === "notNearAnimal" && (
        <X className="absolute -right-2 -top-1.5 h-2.5 w-2.5 rounded-full bg-white text-red-500" strokeWidth={3} />
      )}
    </span>
  );
}

export function RuleCard({ animal, inspection, placed, onRemove }: RuleCardProps) {
  const meta = SPECIES[animal];
  const isInspecting = inspection !== null;
  const happy = inspection?.happy ?? false;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_16px_36px_rgba(38,67,49,0.10)] backdrop-blur-md">
      <div className={cn("border-b px-4 pb-3.5 pt-4", meta.soft, meta.border)}>
        <div className="flex items-start gap-3">
          <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl border bg-white/80 text-2xl shadow-sm", meta.border)} aria-hidden="true">
            {meta.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-forest/45">
              {isInspecting ? "Live clause" : "Clause card"}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 className={cn("text-lg font-extrabold tracking-tight", meta.text)}>{meta.name} wishes</h2>
              <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-extrabold text-forest/55">
                {placed}/3 placed
              </span>
            </div>
            {isInspecting ? (
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-forest/55">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {cellShortName(inspection.cell)}
              </p>
            ) : (
              <p className="mt-0.5 text-[11px] font-medium text-forest/55">One true wish is enough.</p>
            )}
          </div>
          {isInspecting && (
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold",
                happy ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700",
              )}
            >
              {happy ? "Happy" : "Needs help"}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-1">
        <ol aria-label={`${meta.name} clause`}>
          {ANIMAL_RULES[animal].map((literal, index) => {
            const result = inspection?.literals[index];
            const satisfied = result?.satisfied;

            return (
              <li key={literal.text} className="list-none">
                <div className="flex items-center gap-3 py-3">
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors",
                      satisfied === true && "bg-emerald-100 text-emerald-700",
                      satisfied === false && "bg-red-50 text-red-500",
                      satisfied === undefined && "bg-forest/[0.06] text-forest/65",
                    )}
                  >
                    <LiteralMark literal={literal} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-tight text-forest">{literal.text}</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-forest/35">
                      Literal {index + 1}
                    </p>
                  </div>
                  {satisfied !== undefined && (
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full text-white",
                        satisfied ? "bg-emerald-600" : "bg-red-500",
                      )}
                      aria-label={satisfied ? "Literal true" : "Literal false"}
                    >
                      {satisfied ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <X className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  )}
                </div>
                {index < ANIMAL_RULES[animal].length - 1 && (
                  <div className="flex items-center gap-2 pl-11">
                    <span className="h-px flex-1 bg-forest/10" />
                    <span className="rounded-full bg-forest/[0.055] px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.16em] text-forest/40">
                      OR
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="border-t border-forest/8 bg-white/45 px-4 py-3">
        {isInspecting ? (
          <div className="flex items-center justify-between gap-3">
            <p className={cn("text-xs font-semibold leading-snug", happy ? "text-emerald-800" : "text-red-700")}>
              {happy
                ? "At least one literal is true. This clause is satisfied."
                : "All three literals are false. Move a neighbour or send this animal back."}
            </p>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-forest/10 bg-white px-3 py-2 text-[11px] font-extrabold text-forest/65 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Send back
            </button>
          </div>
        ) : (
          <p className="text-xs font-semibold leading-snug text-forest/45">
            Tap any placed animal to inspect its live clause. Green means true.
          </p>
        )}
      </div>
    </section>
  );
}
