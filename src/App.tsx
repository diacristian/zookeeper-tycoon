import { CircleHelp, Leaf, RotateCcw, Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimalRoster } from "./components/AnimalRoster";
import { HabitatBoard } from "./components/HabitatBoard";
import { HowToPlay } from "./components/HowToPlay";
import { Notice, type NoticeMessage, type NoticeTone } from "./components/Notice";
import { RangerHint } from "./components/RangerHint";
import { RuleCard } from "./components/RuleCard";
import { WinOverlay } from "./components/WinOverlay";
import {
  createGame,
  evaluateGame,
  findHint,
  placeAnimal,
  removeAnimal,
  undoMove,
} from "./game/engine";
import { SAVANNA_LEVEL } from "./game/level";
import { ANIMAL_KINDS, type AnimalKind, type HintResult } from "./game/types";
import { cn } from "./lib/cn";
import { SPECIES } from "./ui/species";

const ICON_BUTTON =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/65 text-forest/70 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9";

export default function App() {
  const [game, setGame] = useState(() => createGame(SAVANNA_LEVEL));
  const [selectedKind, setSelectedKind] = useState<AnimalKind>("lion");
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [hint, setHint] = useState<Extract<HintResult, { status: "placement" }> | null>(null);
  const [notice, setNotice] = useState<NoticeMessage | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const noticeId = useRef(0);

  const evaluation = useMemo(() => evaluateGame(game), [game]);
  const selectedInspection = selectedCell === null
    ? null
    : evaluation.animals.find((animal) => animal.cell === selectedCell) ?? null;
  const ruleAnimal = selectedInspection?.animal ?? selectedKind;
  const rulePlaced = game.level.totalAnimals[ruleAnimal] - evaluation.remaining[ruleAnimal];
  const totalAnimals = ANIMAL_KINDS.reduce((total, animal) => total + game.level.totalAnimals[animal], 0);
  const progress = totalAnimals === 0 ? 0 : (evaluation.placedCount / totalAnimals) * 100;

  function notify(message: string, tone: NoticeTone = "info") {
    noticeId.current += 1;
    setNotice({ id: noticeId.current, message, tone });
  }

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!evaluation.isSolved) {
      setShowWin(false);
      return;
    }

    const timer = window.setTimeout(() => setShowWin(true), 700);
    return () => window.clearTimeout(timer);
  }, [evaluation.isSolved]);

  function handleCellClick(cell: number) {
    const animal = game.board[cell];

    if (animal) {
      setSelectedKind(animal);
      setSelectedCell((current) => (current === cell ? null : cell));
      return;
    }

    if (game.level.terrain[cell] === "water") {
      notify("Water is scenery. Pop animals onto grass, trees, or meadows.", "info");
      return;
    }

    const hintedKind = hint?.cell === cell ? hint.kind : null;
    const kind = hintedKind ?? selectedKind;

    if (evaluation.remaining[kind] <= 0) {
      notify(`All ${SPECIES[kind].plural.toLowerCase()} are already in the habitat.`, "info");
      return;
    }

    const next = placeAnimal(game, cell, kind);
    if (next === game) {
      notify("That pen is not available.", "error");
      return;
    }

    setGame(next);
    setSelectedKind(kind);
    setSelectedCell(cell);
    setHint(null);
  }

  function handleSelectKind(animal: AnimalKind) {
    setSelectedKind(animal);
    setHint(null);
  }

  function handleRemove() {
    if (selectedCell === null) return;
    const next = removeAnimal(game, selectedCell);
    if (next === game) return;

    setGame(next);
    setSelectedCell(null);
    setHint(null);
  }

  function handleUndo() {
    if (game.history.length === 0) {
      notify("Nothing to undo yet.", "info");
      return;
    }

    setGame(undoMove(game));
    setSelectedCell(null);
    setHint(null);
  }

  function handleReset() {
    setGame(createGame(SAVANNA_LEVEL));
    setSelectedKind("lion");
    setSelectedCell(null);
    setHint(null);
    setShowWin(false);
  }

  function handleHint() {
    const result = findHint(game);

    if (result.status === "solved") {
      notify("Every clause is already true. Beautiful work.", "success");
      return;
    }

    if (result.status === "stuck") {
      notify("This layout cannot be completed. Undo a move or send an animal home.", "error");
      return;
    }

    setHint(result);
    setSelectedCell(null);
  }

  const statusMessage = evaluation.isSolved
    ? "All nine clauses are true."
    : evaluation.unhappyCount > 0
      ? `${evaluation.unhappyCount} ${evaluation.unhappyCount === 1 ? "animal needs" : "animals need"} attention.`
      : evaluation.placedCount === 0
        ? "Pick an animal and start placing."
        : "Every placed animal is happy.";

  return (
    <div className="app-shell relative flex h-dvh flex-col overflow-hidden text-forest">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-28 top-16 h-80 w-80 rounded-full bg-amber-200/25 blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col gap-1.5 px-2 py-2 sm:gap-2 sm:px-4 sm:py-3">
        <header className="flex shrink-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-forest text-cream shadow-sm sm:h-9 sm:w-9">
              <span className="text-sm sm:text-base" aria-hidden="true">🦁</span>
              <span className="absolute -right-1 -top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-amber-300 text-forest ring-2 ring-[#f7f1e3]">
                <Leaf className="h-2 w-2" aria-hidden="true" />
              </span>
            </div>
            <div className="min-w-0 leading-tight">
              <h1 className="truncate font-display text-base font-semibold tracking-tight sm:text-xl">
                Zookeeper Tycoon
              </h1>
              <p className="hidden truncate text-[10px] font-semibold text-forest/45 sm:block">
                {game.level.name} · {totalAnimals} animals · one true wish each
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className="hidden items-center gap-1.5 rounded-full border border-white/80 bg-white/60 px-2.5 py-1 text-[10px] font-extrabold text-forest/65 shadow-sm md:flex">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  evaluation.unhappyCount > 0
                    ? "bg-red-500"
                    : evaluation.isSolved
                      ? "bg-emerald-600"
                      : "bg-amber-400",
                )}
              />
              {evaluation.placedCount}/{totalAnimals} placed · {evaluation.happyCount} happy
            </span>
            <button
              type="button"
              onClick={handleUndo}
              disabled={game.history.length === 0}
              aria-label="Undo last action"
              title="Undo"
              className={ICON_BUTTON}
            >
              <Undo2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              aria-label="How to play"
              title="How to play"
              className={ICON_BUTTON}
            >
              <CircleHelp className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset habitat"
              title="Reset"
              className={ICON_BUTTON}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="shrink-0">
          <div className="flex items-center justify-between gap-2 text-[9px] font-extrabold uppercase tracking-[0.12em]">
            <span className="shrink-0 text-forest/35">{evaluation.placedCount} of {totalAnimals} placed</span>
            <span className={cn("truncate text-right", evaluation.unhappyCount > 0 ? "text-red-600" : "text-emerald-700")}>
              {statusMessage}
            </span>
          </div>
          <div
            className="mt-1 h-1.5 overflow-hidden rounded-full bg-forest/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalAnimals}
            aria-valuenow={evaluation.placedCount}
            aria-label="Animals placed"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <main className="grid min-h-0 flex-1 gap-1.5 sm:gap-2 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-4">
          <section className="flex min-h-0 min-w-0 flex-col gap-1.5 sm:gap-2">
            <div className="lg:hidden">
              <AnimalRoster
                remaining={evaluation.remaining}
                totals={game.level.totalAnimals}
                selectedKind={selectedKind}
                onSelect={handleSelectKind}
              />
            </div>

            <div className="relative grid min-h-0 flex-1 place-items-center" style={{ containerType: "size" }}>
              <HabitatBoard
                className="w-[min(100%,100cqh)]"
                level={game.level}
                board={game.board}
                animals={evaluation.animals}
                selectedCell={selectedCell}
                selectedKind={selectedKind}
                hint={hint}
                onCellClick={handleCellClick}
              />
            </div>

            <div className="lg:hidden">
              <RuleCard
                compact
                animal={ruleAnimal}
                inspection={selectedInspection}
                placed={rulePlaced}
                onRemove={handleRemove}
              />
            </div>

            <div className="lg:hidden">
              <RangerHint compact hint={hint} onHint={handleHint} />
            </div>
          </section>

          <aside className="hidden min-h-0 flex-col gap-3 overflow-y-auto overscroll-contain lg:flex">
            <AnimalRoster
              remaining={evaluation.remaining}
              totals={game.level.totalAnimals}
              selectedKind={selectedKind}
              onSelect={handleSelectKind}
            />
            <RuleCard
              animal={ruleAnimal}
              inspection={selectedInspection}
              placed={rulePlaced}
              onRemove={handleRemove}
            />
            <RangerHint hint={hint} onHint={handleHint} />
            <p className="px-1 text-[10px] font-semibold leading-relaxed text-forest/35">
              Every animal is one 3-literal clause. The whole zoo is the AND of all nine.
            </p>
          </aside>
        </main>
      </div>

      <HowToPlay open={showHelp} onClose={() => setShowHelp(false)} />
      <WinOverlay
        open={showWin}
        moves={game.moves}
        parMoves={game.level.parMoves}
        onRestart={handleReset}
        onClose={() => setShowWin(false)}
      />
      <Notice notice={notice} />
    </div>
  );
}
