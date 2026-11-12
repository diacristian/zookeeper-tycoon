import { SAVANNA_LEVEL } from "./level";
import { explainPlacement } from "./explain";
import { findCompletion } from "./solver";
import { ANIMAL_RULES, isAnimalHappy, isAnimalKind, isLiteralSatisfied } from "./rules";
import {
  ANIMAL_KINDS,
  type AnimalKind,
  type Board,
  type GameEvaluation,
  type GameState,
  type HintResult,
  type LevelDefinition,
  type LiteralEvaluation,
} from "./types";

function snapshot(state: GameState): GameState["history"][number] {
  return {
    board: state.board.slice(),
    moves: state.moves,
  };
}

export function createGame(level: LevelDefinition = SAVANNA_LEVEL): GameState {
  return {
    level,
    board: Array.from({ length: level.terrain.length }, () => null),
    history: [],
    moves: 0,
  };
}

export function remainingAnimals(
  level: LevelDefinition,
  board: Board,
): Record<AnimalKind, number> {
  const remaining = { ...level.totalAnimals };

  for (const animal of board) {
    if (animal) remaining[animal] -= 1;
  }

  return remaining;
}

export function placeAnimal(state: GameState, cell: number, animal: AnimalKind): GameState {
  if (!Number.isInteger(cell) || cell < 0 || cell >= state.board.length) return state;
  if (state.level.terrain[cell] === "water" || state.board[cell] !== null) return state;
  if (!isAnimalKind(animal)) return state;
  if (remainingAnimals(state.level, state.board)[animal] <= 0) return state;

  const board = state.board.slice();
  board[cell] = animal;

  return {
    ...state,
    board,
    history: [...state.history, snapshot(state)],
    moves: state.moves + 1,
  };
}

export function removeAnimal(state: GameState, cell: number): GameState {
  if (state.board[cell] === null) return state;

  const board = state.board.slice();
  board[cell] = null;

  return {
    ...state,
    board,
    history: [...state.history, snapshot(state)],
    moves: state.moves + 1,
  };
}

export function undoMove(state: GameState): GameState {
  const previous = state.history.at(-1);
  if (!previous) return state;

  return {
    ...state,
    board: previous.board.slice(),
    history: state.history.slice(0, -1),
    moves: previous.moves,
  };
}

export function evaluateGame(state: GameState): GameEvaluation {
  const animals = state.board.flatMap((animal, cell) => {
    if (!animal) return [];

    const literals: LiteralEvaluation[] = ANIMAL_RULES[animal].map((literal) => ({
      literal,
      satisfied: isLiteralSatisfied(literal, cell, state.board, state.level.terrain),
    }));

    return [
      {
        cell,
        animal,
        happy: literals.some((literal) => literal.satisfied),
        literals,
      },
    ];
  });

  const placedCount = animals.length;
  const totalCount = ANIMAL_KINDS.reduce(
    (total, animal) => total + state.level.totalAnimals[animal],
    0,
  );
  const happyCount = animals.filter((animal) => animal.happy).length;
  const isComplete = placedCount === totalCount;

  return {
    animals,
    placedCount,
    totalCount,
    happyCount,
    unhappyCount: placedCount - happyCount,
    remaining: remainingAnimals(state.level, state.board),
    isComplete,
    isSolved: isComplete && happyCount === totalCount,
  };
}

export function findHint(state: GameState): HintResult {
  const evaluation = evaluateGame(state);
  if (evaluation.isSolved) return { status: "solved" };

  const completion = findCompletion(state);
  if (!completion) return { status: "stuck" };

  const emptyCells = completion.flatMap((animal, cell) => {
    return animal && state.board[cell] === null ? [cell] : [];
  });

  if (emptyCells.length === 0) return { status: "stuck" };

  const unhappyCells = new Set(
    evaluation.animals.filter((animal) => !animal.happy).map((animal) => animal.cell),
  );
  const helpfulCell = emptyCells
    .map((cell) => {
      const isHelpful = ANIMAL_RULES[completion[cell] as AnimalKind].length > 0
        ? [cell - 5, cell + 5, cell - 1, cell + 1].some((neighbour) => unhappyCells.has(neighbour))
        : false;
      return { cell, isHelpful };
    })
    .sort((left, right) => Number(right.isHelpful) - Number(left.isHelpful))[0];

  const kind = completion[helpfulCell.cell] as AnimalKind;

  return {
    status: "placement",
    cell: helpfulCell.cell,
    kind,
    ...explainPlacement(state, helpfulCell.cell, kind),
  };
}

export function isCellPlaceable(state: GameState, cell: number): boolean {
  return state.level.terrain[cell] !== "water" && state.board[cell] === null;
}

export function isAnimalInHappyHerd(
  animal: AnimalKind,
  cell: number,
  state: GameState,
): boolean {
  return isAnimalHappy(animal, cell, state.board, state.level.terrain);
}
