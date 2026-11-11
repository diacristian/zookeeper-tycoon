import type { AnimalKind, Terrain } from "../game/types";

export interface SpeciesMeta {
  kind: AnimalKind;
  name: string;
  plural: string;
  emoji: string;
  tagline: string;
  accent: string;
  soft: string;
  border: string;
  text: string;
  token: string;
  selected: string;
}

export const SPECIES: Record<AnimalKind, SpeciesMeta> = {
  lion: {
    kind: "lion",
    name: "Lion",
    plural: "Lions",
    emoji: "🦁",
    tagline: "Sun-warmed royalty",
    accent: "bg-amber-500",
    soft: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-950",
    token: "bg-amber-100/95 ring-amber-300/80",
    selected: "border-amber-400 bg-amber-50 ring-2 ring-amber-300/80",
  },
  monkey: {
    kind: "monkey",
    name: "Monkey",
    plural: "Monkeys",
    emoji: "🐒",
    tagline: "Tree-top troublemakers",
    accent: "bg-rose-500",
    soft: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-950",
    token: "bg-rose-100/95 ring-rose-300/80",
    selected: "border-rose-400 bg-rose-50 ring-2 ring-rose-300/80",
  },
  gazelle: {
    kind: "gazelle",
    name: "Gazelle",
    plural: "Gazelles",
    emoji: "🦌",
    tagline: "Meadow-minded movers",
    accent: "bg-teal-600",
    soft: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-950",
    token: "bg-teal-100/95 ring-teal-300/80",
    selected: "border-teal-500 bg-teal-50 ring-2 ring-teal-300/80",
  },
};

export const TERRAIN_META: Record<Terrain, { label: string; note: string }> = {
  grass: { label: "Grass", note: "Open pen" },
  water: { label: "Water", note: "Scenery only" },
  tree: { label: "Tree", note: "A monkey favourite" },
  meadow: { label: "Meadow", note: "A gazelle favourite" },
};
