export const ANIMAL_KINDS = ["lion", "monkey", "gazelle"] as const;

export type AnimalKind = (typeof ANIMAL_KINDS)[number];

export const TERRAIN_TYPES = ["grass", "water", "tree", "meadow"] as const;

export type Terrain = (typeof TERRAIN_TYPES)[number];

export type Board = Array<AnimalKind | null>;

export type Literal =
  | {
      kind: "nearTerrain";
      terrain: Terrain;
      text: string;
      shortText: string;
    }
  | {
      kind: "notNearTerrain";
      terrain: Terrain;
      text: string;
      shortText: string;
    }
  | {
      kind: "nearAnimal";
      animal: AnimalKind;
      text: string;
      shortText: string;
    }
  | {
      kind: "notNearAnimal";
      animal: AnimalKind;
      text: string;
      shortText: string;
    };

export interface LevelDefinition {
  id: string;
  name: string;
  subtitle: string;
  terrain: readonly Terrain[];
  totalAnimals: Record<AnimalKind, number>;
  parMoves: number;
}

export interface GameSnapshot {
  board: Board;
  moves: number;
}

export interface GameState {
  level: LevelDefinition;
  board: Board;
  history: GameSnapshot[];
  moves: number;
}

export interface LiteralEvaluation {
  literal: Literal;
  satisfied: boolean;
}

export interface AnimalEvaluation {
  cell: number;
  animal: AnimalKind;
  happy: boolean;
  literals: LiteralEvaluation[];
}

export interface GameEvaluation {
  animals: AnimalEvaluation[];
  placedCount: number;
  totalCount: number;
  happyCount: number;
  unhappyCount: number;
  remaining: Record<AnimalKind, number>;
  isComplete: boolean;
  isSolved: boolean;
}

export interface AffectedAnimal {
  cell: number;
  animal: AnimalKind;
}

export interface PlacementHint {
  cell: number;
  kind: AnimalKind;
  /** Plain-language explanation of what the move buys the zoo. */
  reason: string;
  /** Animals that flip from unhappy to happy because of this move. */
  rescued: AffectedAnimal[];
  /** Animals that were happy and lose a literal because of this move. */
  unsettled: AffectedAnimal[];
}

export type HintResult =
  | ({ status: "placement" } & PlacementHint)
  | { status: "solved" }
  | { status: "stuck" };
