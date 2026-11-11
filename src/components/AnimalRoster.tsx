import { PawPrint } from "lucide-react";
import { ANIMAL_KINDS, type AnimalKind } from "../game/types";
import { cn } from "../lib/cn";
import { SPECIES } from "../ui/species";

interface AnimalRosterProps {
  remaining: Record<AnimalKind, number>;
  totals: Record<AnimalKind, number>;
  selectedKind: AnimalKind;
  onSelect: (animal: AnimalKind) => void;
}

export function AnimalRoster({ remaining, totals, selectedKind, onSelect }: AnimalRosterProps) {
  const placed = ANIMAL_KINDS.reduce((total, animal) => total + totals[animal] - remaining[animal], 0);
  const total = ANIMAL_KINDS.reduce((sum, animal) => sum + totals[animal], 0);

  return (
    <section className="rounded-3xl border border-white/80 bg-white/75 p-3.5 shadow-[0_16px_36px_rgba(38,67,49,0.10)] backdrop-blur-md sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-forest text-cream shadow-sm">
            <PawPrint className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight text-forest">Animal roster</h2>
            <p className="text-[11px] font-medium text-forest/55">Tap one, then tap a pen.</p>
          </div>
        </div>
        <span className="rounded-full bg-forest/8 px-2.5 py-1 text-[11px] font-extrabold text-forest/75">
          {placed}/{total} placed
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {ANIMAL_KINDS.map((animal) => {
          const meta = SPECIES[animal];
          const left = remaining[animal];
          const isSelected = selectedKind === animal;

          return (
            <button
              key={animal}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${meta.name}. ${left} remaining. ${isSelected ? "Selected for placement." : "Select to place."}`}
              onClick={() => onSelect(animal)}
              className={cn(
                "relative flex min-w-0 flex-col items-center gap-0.5 rounded-2xl border px-1.5 py-2.5 transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 active:scale-[0.97]",
                isSelected
                  ? meta.selected
                  : "border-white/90 bg-white/65 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm",
              )}
            >
              <span className="text-[clamp(1.55rem,6vw,2rem)] leading-none" aria-hidden="true">
                {meta.emoji}
              </span>
              <span className="max-w-full truncate text-[11px] font-extrabold text-forest sm:text-xs">
                {meta.plural}
              </span>
              <span
                className={cn(
                  "mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                  left === 0 ? "bg-emerald-100 text-emerald-800" : "bg-forest/8 text-forest/65",
                )}
              >
                {left === 0 ? "All in" : `${left} left`}
              </span>
              {isSelected && (
                <span
                  className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-forest shadow-[0_0_0_3px_rgba(255,255,255,0.8)]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
