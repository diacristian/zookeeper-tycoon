import type { LevelDefinition, Terrain } from "./types";

const SAVANNA_TERRAIN: readonly Terrain[] = [
  "water",
  "grass",
  "grass",
  "tree",
  "grass",
  "grass",
  "grass",
  "grass",
  "grass",
  "grass",
  "grass",
  "tree",
  "grass",
  "grass",
  "water",
  "grass",
  "grass",
  "grass",
  "meadow",
  "grass",
  "grass",
  "water",
  "grass",
  "grass",
  "tree",
];

export const SAVANNA_LEVEL: LevelDefinition = {
  id: "golden-savanna",
  name: "Golden Savanna",
  subtitle: "A fresh habitat needs nine very particular residents.",
  terrain: SAVANNA_TERRAIN,
  totalAnimals: {
    lion: 3,
    monkey: 3,
    gazelle: 3,
  },
  parMoves: 12,
};
