import { cellShortName } from "../lib/board";
import { ANIMAL_RULES, isAnimalHappy, isLiteralSatisfied } from "./rules";
import type {
  AffectedAnimal,
  AnimalKind,
  GameState,
  Literal,
  PlacementHint,
} from "./types";

const WITH_ARTICLE: Record<string, string> = {
  lion: "a lion",
  monkey: "a monkey",
  gazelle: "a gazelle",
  tree: "a tree",
  meadow: "a meadow",
  water: "water",
};

function literalPhrase(literal: Literal): string {
  switch (literal.kind) {
    case "nearTerrain":
      return `it has ${WITH_ARTICLE[literal.terrain]} next door`;
    case "notNearTerrain":
      return `no ${literal.terrain} is next door`;
    case "nearAnimal":
      return `${WITH_ARTICLE[literal.animal]} is next door`;
    case "notNearAnimal":
      return `no ${literal.animal} is next door`;
  }
}

function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function describeAnimal(animal: AffectedAnimal): string {
  return `the ${animal.animal} at ${cellShortName(animal.cell)}`;
}

export function explainPlacement(
  state: GameState,
  cell: number,
  kind: AnimalKind,
): Omit<PlacementHint, "cell" | "kind"> {
  const terrain = state.level.terrain;
  const nextBoard = state.board.slice();
  nextBoard[cell] = kind;

  const satisfied = ANIMAL_RULES[kind].filter((literal) => {
    return isLiteralSatisfied(literal, cell, nextBoard, terrain);
  });

  const rescued: AffectedAnimal[] = [];
  const unsettled: AffectedAnimal[] = [];

  for (let otherCell = 0; otherCell < state.board.length; otherCell += 1) {
    const other = state.board[otherCell];
    if (!other || otherCell === cell) continue;

    const wasHappy = isAnimalHappy(other, otherCell, state.board, terrain);
    const isHappyNow = isAnimalHappy(other, otherCell, nextBoard, terrain);

    if (!wasHappy && isHappyNow) rescued.push({ cell: otherCell, animal: other });
    if (wasHappy && !isHappyNow) unsettled.push({ cell: otherCell, animal: other });
  }

  const parts: string[] = [];

  if (satisfied.length > 0) {
    const clause = joinList(satisfied.slice(0, 2).map(literalPhrase));
    const extra = satisfied.length > 2 ? ", plus its third condition" : "";
    parts.push(`This ${kind} is happy right away because ${clause}${extra}.`);
  } else {
    parts.push(
      `This ${kind} is not happy yet, so treat it as a setup move that keeps the rest of the zoo solvable.`,
    );
  }

  if (rescued.length > 0) {
    parts.push(`It also fixes ${joinList(rescued.map(describeAnimal))}.`);
  }

  if (unsettled.length > 0) {
    parts.push(
      `Heads up: ${joinList(unsettled.map(describeAnimal))} loses a condition until the next move.`,
    );
  }

  return { reason: parts.join(" "), rescued, unsettled };
}
