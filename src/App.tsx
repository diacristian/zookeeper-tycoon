import {
  CircleHelp,
  Droplets,
  Flower2,
  Leaf,
  RotateCcw,
  TreePine,
  Undo2,
} from "lucide-react";
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
import { cellShortName } from "./lib/board";
import { cn } from "./lib/cn";
import { SPECIES, TERRAIN_META } from "./ui/species";

function MiniStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-2.5 py-2 text-center",
        accent ? "border-forest bg-forest text-cream" : "border-forest/8 bg-white/55 text-forest",
      )}
    >
      <p className="font-display text-lg font-semibold leading-none sm:text-xl">{value}</p>
      <p
        className={cn(
          "mt-1 text-[8px] font-extrabold uppercase tracking-[0.14em]",
          accent ? "text-cream/55" : "text-forest/40",
        )}
      >
        {label}
      </p>
    </div>
  );
}

function TerrainLegendItem({ icon, label, note }: { icon: React.ReactNode; label: string; note: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/8 bg-white/50 px-2 py-1 text-[10px] font-bold text-forest/60">
      {icon}
      <span>{label}</span>
      <span className="hidden text-forest/35 sm:inline">· {note}</span>
    </span>
  );
}

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
  const happyStatValue = evaluation.placedCount === 0
    ? "—"
    : `${evaluation.happyCount}/${evaluation.placedCount}`;

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
    notify(
      `Ranger AI suggests a ${SPECIES[result.kind].name.toLowerCase()} at ${cellShortName(result.cell)}.`,
      "success",
    );
  }

  const statusMessage = evaluation.isSolved
    ? "All nine clauses are true."
    : evaluation.unhappyCount > 0
      ? `${evaluation.unhappyCount} ${evaluation.unhappyCount === 1 ? "animal needs" : "animals need"} attention.`
      : evaluation.placedCount === 0
        ? "Pick a resident and start placing."
        : "Every placed animal is happy.";

  return (
    <div className="app-shell relative flex min-h-dvh flex-col text-forest">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-28 top-16 h-80 w-80 rounded-full bg-amber-200/25 blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-3 sm:px-5 lg:px-8">
        <header className="flex items-center justify-between gap-3 py-4 sm:py-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[1.15rem] bg-forest text-cream shadow-[0_10px_22px_rgba(23,53,42,0.24)]">
              <span className="text-xl" aria-hidden="true">🦁</span>
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-amber-300 text-forest ring-2 ring-[#f7f1e3]">
                <Leaf className="h-2.5 w-2.5" aria-hidden="true" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.27em] text-forest/40">Habitat logic</p>
              <h1 className="truncate font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                Zookeeper Tycoon
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-white/80 bg-white/60 px-3 py-2 text-[11px] font-extrabold text-forest/65 shadow-sm backdrop-blur md:flex">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  evaluation.unhappyCount > 0 ? "bg-red-500" : evaluation.isSolved ? "bg-emerald-600" : "bg-amber-400",
                )}
              />
              3-SAT · {totalAnimals} clauses
            </div>
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              aria-label="How to play"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3 text-[11px] font-extrabold text-forest/70 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest sm:px-3.5"
            >
              <CircleHelp className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">How to play</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset habitat"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3 text-[11px] font-extrabold text-forest/70 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest sm:px-3.5"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 items-start gap-3.5 pb-6 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-6 lg:pb-8">
          <aside className="order-1 lg:order-2 lg:sticky lg:top-4 lg:space-y-3">
            <AnimalRoster
              remaining={evaluation.remaining}
              totals={game.level.totalAnimals}
              selectedKind={selectedKind}
              onSelect={handleSelectKind}
            />
            <div className="hidden lg:block lg:space-y-3">
              <RuleCard
                animal={ruleAnimal}
                inspection={selectedInspection}
                placed={rulePlaced}
                onRemove={handleRemove}
              />
              <RangerHint hint={hint} onHint={handleHint} />
            </div>
          </aside>

          <section className="order-2 mx-auto w-full max-w-[680px] lg:order-1">
            <div className="rounded-[2.25rem] border border-white/85 bg-[#fbf7ed]/90 p-2.5 shadow-[0_26px_60px_rgba(38,67,49,0.13)] backdrop-blur-sm sm:p-3.5">
              <div className="flex items-start justify-between gap-3 px-1 pb-3 pt-1 sm:px-1.5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-forest/[0.075] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.15em] text-forest/55">
                      Level 01
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-forest/30">5 × 5</span>
                  </div>
                  <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-forest sm:text-[2rem]">
                    {game.level.name}
                  </h2>
                  <p className="mt-0.5 hidden max-w-md text-xs font-medium leading-snug text-forest/50 sm:block">
                    {game.level.subtitle}
                  </p>
                </div>
                <div className="shrink-0 rounded-2xl bg-forest px-3 py-2 text-center text-cream shadow-sm">
                  <p className="font-display text-xl font-semibold leading-none sm:text-2xl">
                    {evaluation.placedCount}
                    <span className="text-[11px] font-sans text-cream/55">/{totalAnimals}</span>
                  </p>
                  <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.16em] text-cream/55">placed</p>
                </div>
              </div>

              <HabitatBoard
                level={game.level}
                board={game.board}
                animals={evaluation.animals}
                selectedCell={selectedCell}
                selectedKind={selectedKind}
                hint={hint}
                onCellClick={handleCellClick}
              />

              <div className="px-1 pt-3 sm:px-1.5">
                <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em]">
                  <span className="text-forest/38">Habitat progress</span>
                  <span className={cn(evaluation.unhappyCount > 0 ? "text-red-600" : "text-emerald-700")}>
                    {statusMessage}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-forest/10" role="progressbar" aria-valuemin={0} aria-valuemax={totalAnimals} aria-valuenow={evaluation.placedCount} aria-label="Animals placed">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 transition-[width] duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <MiniStat label="placed" value={`${evaluation.placedCount}/${totalAnimals}`} accent />
                  <MiniStat label="happy" value={happyStatValue} />
                  <MiniStat label="actions" value={String(game.moves)} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-forest/8 pt-3">
                  <TerrainLegendItem
                    icon={<Droplets className="h-3 w-3 text-sky-600" aria-hidden="true" />}
                    label="Water"
                    note={TERRAIN_META.water.note}
                  />
                  <TerrainLegendItem
                    icon={<TreePine className="h-3 w-3 text-emerald-700" aria-hidden="true" />}
                    label="Tree"
                    note={TERRAIN_META.tree.note}
                  />
                  <TerrainLegendItem
                    icon={<Flower2 className="h-3 w-3 text-amber-600" aria-hidden="true" />}
                    label="Meadow"
                    note={TERRAIN_META.meadow.note}
                  />
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={game.history.length === 0}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-forest/10 bg-white/65 px-3 py-1.5 text-[10px] font-extrabold text-forest/60 transition hover:bg-white hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Undo
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="order-3 space-y-3 lg:hidden">
            <RuleCard
              animal={ruleAnimal}
              inspection={selectedInspection}
              placed={rulePlaced}
              onRemove={handleRemove}
            />
            <RangerHint hint={hint} onHint={handleHint} />
          </div>
        </main>

        <footer className="mt-auto flex flex-col items-center gap-1 pb-4 pt-1 text-center text-[10px] font-semibold leading-relaxed text-forest/35">
          <p>Every animal is one 3-literal clause. The whole zoo is the AND of all nine.</p>
          <p>Ranger AI uses a small exact solver over the remaining placements.</p>
        </footer>
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
