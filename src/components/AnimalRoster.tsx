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
  return (
    <section aria-label="Animal roster" className="grid shrink-0 grid-cols-3 gap-1.5">
      {ANIMAL_KINDS.map((animal) => {
        const meta = SPECIES[animal];
        const left = remaining[animal];
        const isSelected = selectedKind === animal;

        return (
          <button
            key={animal}
            type="button"
            aria-pressed={isSelected}
            aria-label={`${meta.name}. ${left} of ${totals[animal]} remaining. ${isSelected ? "Selected for placement." : "Select to place."}`}
            onClick={() => onSelect(animal)}
            className={cn(
              "relative flex min-w-0 items-center gap-1.5 rounded-2xl border px-2 py-1.5 text-left transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 active:scale-[0.97]",
              isSelected
                ? meta.selected
                : "border-white/90 bg-white/65 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm",
            )}
          >
            <span className="text-xl leading-none" aria-hidden="true">{meta.emoji}</span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[11px] font-extrabold text-forest">{meta.name}</span>
              <span
                className={cn(
                  "block text-[9px] font-extrabold uppercase tracking-[0.08em]",
                  left === 0 ? "text-emerald-700" : "text-forest/45",
                )}
              >
                {left === 0 ? "all in" : `${left} left`}
              </span>
            </span>
          </button>
        );
      })}
    </section>
  );
}
