import { ANIMAL_KINDS, type AnimalKind, type Board, type GameState, type Terrain } from "./types";
import { ANIMAL_RULES, isAnimalHappy, neighboursOf } from "./rules";

const NODE_LIMIT = 200_000;

function hashBoard(board: Board): number {
  let hash = 2_166_136_261;

  for (const cell of board) {
    const code = cell === null ? 0 : cell.charCodeAt(0) + cell.length;
    hash ^= code;
    hash = Math.imul(hash, 16_777_619);
  }

  return hash >>> 0;
}

function createRandom(seed: number): () => number {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function remainingAnimals(state: GameState): Record<AnimalKind, number> {
  const remaining = { ...state.level.totalAnimals };

  for (const animal of state.board) {
    if (animal) remaining[animal] -= 1;
  }

  return remaining;
}

function canStillBecomeHappy(
  animal: AnimalKind,
  cell: number,
  board: Board,
  terrain: readonly Terrain[],
  remaining: Record<AnimalKind, number>,
): boolean {
  if (isAnimalHappy(animal, cell, board, terrain)) return true;

  return ANIMAL_RULES[animal].some((literal) => {
    if (literal.kind !== "nearAnimal" || remaining[literal.animal] <= 0) return false;

    return neighboursOf(cell).some((neighbour) => {
      return board[neighbour] === null && terrain[neighbour] !== "water";
    });
  });
}

function canStillWork(
  board: Board,
  terrain: readonly Terrain[],
  remaining: Record<AnimalKind, number>,
): boolean {
  for (let cell = 0; cell < board.length; cell += 1) {
    const animal = board[cell];
    if (animal && !canStillBecomeHappy(animal, cell, board, terrain, remaining)) {
      return false;
    }
  }

  return true;
}

export function findCompletion(state: GameState): Board | null {
  const board = state.board.slice();
  const remaining = remainingAnimals(state);

  if (ANIMAL_KINDS.some((animal) => remaining[animal] < 0)) return null;

  const unplaced = ANIMAL_KINDS.reduce((total, animal) => total + remaining[animal], 0);
  if (unplaced === 0) {
    return board.every((animal, cell) => {
      return animal === null || isAnimalHappy(animal, cell, board, state.level.terrain);
    })
      ? board
      : null;
  }

  const emptyCells = state.level.terrain
    .map((terrain, cell) => ({ terrain, cell }))
    .filter(({ terrain, cell }) => terrain !== "water" && board[cell] === null)
    .map(({ cell }) => cell);

  if (emptyCells.length < unplaced) return null;

  const random = createRandom(hashBoard(board) ^ state.level.id.length);
  const cellOrder = shuffled(emptyCells, random);
  const animalOrder = shuffled(ANIMAL_KINDS, random);
  let nodes = 0;

  function search(index: number): Board | null {
    nodes += 1;
    if (nodes > NODE_LIMIT) return null;

    const left = ANIMAL_KINDS.reduce((total, animal) => total + remaining[animal], 0);
    if (left > cellOrder.length - index) return null;
    if (!canStillWork(board, state.level.terrain, remaining)) return null;
    if (left === 0) {
      const solved = board.every((animal, cell) => {
        return animal === null || isAnimalHappy(animal, cell, board, state.level.terrain);
      });
      return solved ? board.slice() : null;
    }
    if (index >= cellOrder.length) return null;

    const cell = cellOrder[index];

    for (const animal of animalOrder) {
      if (remaining[animal] <= 0) continue;

      board[cell] = animal;
      remaining[animal] -= 1;
      const result = search(index + 1);
      remaining[animal] += 1;
      board[cell] = null;
      if (result) return result;
    }

    return search(index + 1);
  }

  return search(0);
}
