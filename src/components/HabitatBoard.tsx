import { Check, Sparkles } from "lucide-react";
import type {
  AnimalEvaluation,
  AnimalKind,
  Board,
  HintResult,
  LevelDefinition,
  Terrain,
} from "../game/types";
import { cellName } from "../lib/board";
import { cn } from "../lib/cn";
import { SPECIES, TERRAIN_META } from "../ui/species";
import { TerrainIcon } from "./TerrainIcon";

interface HabitatBoardProps {
  level: LevelDefinition;
  board: Board;
  animals: AnimalEvaluation[];
  selectedCell: number | null;
  selectedKind: AnimalKind;
  hint: Extract<HintResult, { status: "placement" }> | null;
  onCellClick: (cell: number) => void;
  className?: string;
}

function terrainClass(terrain: Terrain): string {
  if (terrain === "water") return "water-tile cursor-not-allowed";
  if (terrain === "tree") return "grass-tile tree-tile";
  if (terrain === "meadow") return "grass-tile meadow-tile";
  return "grass-tile";
}

export function HabitatBoard({
  level,
  board,
  animals,
  selectedCell,
  selectedKind,
  hint,
  onCellClick,
  className,
}: HabitatBoardProps) {
  const evaluationByCell = new Map(animals.map((animal) => [animal.cell, animal]));
  const selectedMeta = SPECIES[selectedKind];

  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-white/80 bg-emerald-950/[0.06] p-1 shadow-[inset_0_2px_12px_rgba(23,53,42,0.10)] sm:p-1.5",
        className,
      )}
    >
      <div
        className="grid grid-cols-5 gap-1.5 rounded-[1.5rem] bg-emerald-950/[0.08] p-1.5 sm:gap-2 sm:p-2"
        role="group"
        aria-label="5 by 5 animal habitat"
      >
        {level.terrain.map((terrain, cell) => {
          const animal = board[cell];
          const evaluation = evaluationByCell.get(cell);
          const isHint = hint?.cell === cell;
          const hintedKind = isHint ? hint.kind : null;
          const isSelected = selectedCell === cell;
          const isWater = terrain === "water";
          const isHappy = evaluation?.happy ?? false;
          const terrainCode = terrain === "water"
            ? "W"
            : terrain === "tree"
              ? "T"
              : terrain === "meadow"
                ? "M"
                : null;
          const label = animal
            ? `${SPECIES[animal].name} at ${cellName(cell)}. ${isHappy ? "Clause happy." : "Clause needs attention."} Tap to inspect.`
            : isWater
              ? `Water at ${cellName(cell)}. Animals cannot be placed here.`
              : `${TERRAIN_META[terrain].label} at ${cellName(cell)}. Empty pen.${hintedKind ? ` Ranger suggests a ${SPECIES[hintedKind].name}.` : ""}`;

          return (
            <button
              key={cell}
              type="button"
              data-cell={cell}
              data-animal={animal ?? undefined}
              data-terrain={terrain}
              aria-label={label}
              aria-disabled={isWater || undefined}
              aria-current={isSelected ? "true" : undefined}
              onClick={() => onCellClick(cell)}
              className={cn(
                "group relative aspect-square min-w-0 overflow-hidden rounded-[22%] border border-white/50 text-left shadow-[0_2px_0_rgba(23,53,42,0.10),inset_0_1px_0_rgba(255,255,255,0.40)] transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 active:scale-[0.97]",
                terrainClass(terrain),
                isSelected && "z-10 ring-2 ring-forest ring-offset-2 ring-offset-white/70",
                isHint && "z-10 ring-2 ring-amber-400 ring-offset-2 ring-offset-white/70",
              )}
            >
              {terrain === "water" && <span className="water-shimmer absolute inset-0" />}

              {terrainCode && (
                <span
                  className="forced-only terrain-badge absolute left-1 top-1 z-10"
                  aria-hidden="true"
                >
                  {terrainCode}
                </span>
              )}

              {terrain !== "grass" && terrain !== "water" && (
                <TerrainIcon
                  terrain={terrain}
                  className={cn(
                    "absolute bottom-1 left-1 h-3.5 w-3.5 sm:h-5 sm:w-5",
                    terrain === "tree" ? "text-emerald-950/35" : "text-amber-700/45",
                  )}
                />
              )}

              {!animal && !isWater && !isHint && (
                <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-150 group-hover:opacity-25 group-focus-visible:opacity-25">
                  <span className="text-[clamp(1.2rem,5vw,2rem)]" aria-hidden="true">
                    {selectedMeta.emoji}
                  </span>
                </span>
              )}

              {animal && (
                <span className="absolute inset-0 grid place-items-center p-1.5 sm:p-2">
                  <span
                    className={cn(
                      "relative grid h-[78%] w-[78%] place-items-center rounded-full bg-white/75 shadow-[0_4px_10px_rgba(23,53,42,0.16)] ring-2 backdrop-blur-[2px] animate-pop",
                      SPECIES[animal].token,
                      !isHappy && "ring-red-400/90",
                    )}
                  >
                    <span
                      className="translate-y-[2%] text-[clamp(1.28rem,5.4vw,2.2rem)] leading-none drop-shadow-sm"
                      aria-hidden="true"
                    >
                      {SPECIES[animal].emoji}
                    </span>
                    <span
                      className="forced-only species-badge absolute bottom-1 left-1/2 -translate-x-1/2"
                      aria-hidden="true"
                    >
                      {SPECIES[animal].name.charAt(0)}
                    </span>
                    <span
                      className={cn(
                        "absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full text-white shadow-md sm:h-6 sm:w-6",
                        isHappy ? "bg-emerald-600" : "bg-red-500",
                      )}
                      aria-hidden="true"
                    >
                      {isHappy ? (
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3.2} />
                      ) : (
                        <span className="text-[11px] font-black leading-none sm:text-xs">!</span>
                      )}
                    </span>
                  </span>
                </span>
              )}

              {hintedKind && !animal && (
                <span className="absolute inset-0 grid place-items-center bg-amber-100/25">
                  <span className="text-[clamp(1.25rem,5vw,2rem)] opacity-45" aria-hidden="true">
                    {SPECIES[hintedKind].emoji}
                  </span>
                  <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/90 text-amber-600 shadow-sm">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
