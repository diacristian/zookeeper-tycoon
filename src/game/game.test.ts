import { describe, expect, it } from "vitest";
import {
  createGame,
  evaluateGame,
  findHint,
  placeAnimal,
  removeAnimal,
  undoMove,
} from "./engine";
import { SAVANNA_LEVEL } from "./level";
import type { AnimalKind, GameState } from "./types";

const WINNING_LAYOUT: ReadonlyArray<readonly [number, AnimalKind]> = [
  [1, "lion"],
  [2, "lion"],
  [3, "lion"],
  [4, "monkey"],
  [5, "monkey"],
  [6, "monkey"],
  [7, "gazelle"],
  [8, "gazelle"],
  [10, "gazelle"],
];

const STUCK_LAYOUT: ReadonlyArray<readonly [number, AnimalKind]> = [
  [1, "lion"],
  [5, "monkey"],
  [9, "lion"],
  [11, "gazelle"],
  [13, "gazelle"],
  [17, "lion"],
  [18, "monkey"],
  [19, "gazelle"],
  [20, "monkey"],
];

function play(game: GameState, layout: ReadonlyArray<readonly [number, AnimalKind]>) {
  return layout.reduce((state, [cell, animal]) => placeAnimal(state, cell, animal), game);
}

describe("Zookeeper Tycoon rules", () => {
  it("recognises a layout where every animal satisfies one literal", () => {
    const game = play(createGame(SAVANNA_LEVEL), WINNING_LAYOUT);
    const evaluation = evaluateGame(game);

    expect(evaluation.placedCount).toBe(9);
    expect(evaluation.unhappyCount).toBe(0);
    expect(evaluation.isSolved).toBe(true);
    expect(evaluation.animals).toHaveLength(9);
    expect(evaluation.animals.every((animal) => animal.literals.length === 3)).toBe(true);
  });

  it("marks an animal unhappy when all three literals are false", () => {
    const game = play(createGame(SAVANNA_LEVEL), [
      [6, "lion"],
      [5, "monkey"],
    ]);
    const lion = evaluateGame(game).animals.find((animal) => animal.cell === 6);

    expect(lion?.happy).toBe(false);
    expect(lion?.literals.map((literal) => literal.satisfied)).toEqual([false, false, false]);
  });

  it("refuses water tiles and placements beyond the roster", () => {
    let game = createGame(SAVANNA_LEVEL);

    game = placeAnimal(game, 0, "lion");
    expect(game.board[0]).toBeNull();
    expect(game.moves).toBe(0);

    game = placeAnimal(game, 1, "lion");
    game = placeAnimal(game, 2, "lion");
    game = placeAnimal(game, 3, "lion");
    game = placeAnimal(game, 4, "lion");

    expect(evaluateGame(game).placedCount).toBe(3);
    expect(evaluateGame(game).remaining.lion).toBe(0);
  });

  it("returns an animal to the roster when it is removed", () => {
    let game = createGame(SAVANNA_LEVEL);
    game = placeAnimal(game, 1, "lion");
    game = removeAnimal(game, 1);

    expect(game.board[1]).toBeNull();
    expect(evaluateGame(game).remaining.lion).toBe(3);
  });

  it("undoes the most recent action", () => {
    let game = createGame(SAVANNA_LEVEL);
    game = placeAnimal(game, 1, "lion");
    game = placeAnimal(game, 2, "gazelle");
    game = undoMove(game);

    expect(game.board[1]).toBe("lion");
    expect(game.board[2]).toBeNull();
    expect(game.moves).toBe(1);
  });

  it("finds a placement when a completion is possible", () => {
    const hint = findHint(createGame(SAVANNA_LEVEL));

    expect(hint.status).toBe("placement");
    if (hint.status === "placement") {
      expect(SAVANNA_LEVEL.terrain[hint.cell]).not.toBe("water");
    }
  });

  it("can be completed by following the ranger's hints", () => {
    let game = createGame(SAVANNA_LEVEL);

    for (let step = 0; step < 9; step += 1) {
      const hint = findHint(game);
      expect(hint.status).toBe("placement");
      if (hint.status !== "placement") break;
      game = placeAnimal(game, hint.cell, hint.kind);
    }

    expect(evaluateGame(game).isSolved).toBe(true);
  });

  it("reports a full layout that cannot be rescued", () => {
    const game = play(createGame(SAVANNA_LEVEL), STUCK_LAYOUT);
    const evaluation = evaluateGame(game);

    expect(evaluation.placedCount).toBe(9);
    expect(evaluation.isSolved).toBe(false);
    expect(findHint(game).status).toBe("stuck");
  });
});
