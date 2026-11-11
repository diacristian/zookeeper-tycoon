import { ANIMAL_KINDS, type AnimalKind, type Board, type Literal, type Terrain } from "./types";

const SIZE = 5;

export const CARDINAL_NEIGHBORS: readonly (readonly number[])[] = Array.from(
  { length: SIZE * SIZE },
  (_, cell) => {
    const row = Math.floor(cell / SIZE);
    const column = cell % SIZE;
    return [
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ]
      .filter(([nextRow, nextColumn]) => {
        return nextRow >= 0 && nextRow < SIZE && nextColumn >= 0 && nextColumn < SIZE;
      })
      .map(([nextRow, nextColumn]) => nextRow * SIZE + nextColumn);
  },
);

export const ANIMAL_RULES: Record<AnimalKind, readonly Literal[]> = {
  lion: [
    {
      kind: "nearTerrain",
      terrain: "water",
      text: "Beside water",
      shortText: "Water",
    },
    {
      kind: "nearAnimal",
      animal: "gazelle",
      text: "Beside a gazelle",
      shortText: "Gazelle",
    },
    {
      kind: "notNearAnimal",
      animal: "monkey",
      text: "No monkeys next door",
      shortText: "No monkey",
    },
  ],
  monkey: [
    {
      kind: "nearTerrain",
      terrain: "tree",
      text: "Beside a tree",
      shortText: "Tree",
    },
    {
      kind: "nearAnimal",
      animal: "monkey",
      text: "Beside another monkey",
      shortText: "Monkey",
    },
    {
      kind: "notNearAnimal",
      animal: "lion",
      text: "No lions next door",
      shortText: "No lion",
    },
  ],
  gazelle: [
    {
      kind: "nearTerrain",
      terrain: "meadow",
      text: "Beside a meadow",
      shortText: "Meadow",
    },
    {
      kind: "nearAnimal",
      animal: "lion",
      text: "Beside a lion",
      shortText: "Lion",
    },
    {
      kind: "notNearTerrain",
      terrain: "water",
      text: "No water next door",
      shortText: "No water",
    },
  ],
};

export function neighboursOf(cell: number): readonly number[] {
  return CARDINAL_NEIGHBORS[cell] ?? [];
}

export function isAnimalKind(value: unknown): value is AnimalKind {
  return ANIMAL_KINDS.includes(value as AnimalKind);
}

export function isLiteralSatisfied(
  literal: Literal,
  cell: number,
  board: Board,
  terrain: readonly Terrain[],
): boolean {
  const neighbours = neighboursOf(cell);

  switch (literal.kind) {
    case "nearTerrain":
      return neighbours.some((neighbour) => terrain[neighbour] === literal.terrain);
    case "notNearTerrain":
      return neighbours.every((neighbour) => terrain[neighbour] !== literal.terrain);
    case "nearAnimal":
      return neighbours.some((neighbour) => board[neighbour] === literal.animal);
    case "notNearAnimal":
      return neighbours.every((neighbour) => board[neighbour] !== literal.animal);
  }
}

export function isAnimalHappy(
  animal: AnimalKind,
  cell: number,
  board: Board,
  terrain: readonly Terrain[],
): boolean {
  return ANIMAL_RULES[animal].some((literal) => {
    return isLiteralSatisfied(literal, cell, board, terrain);
  });
}
