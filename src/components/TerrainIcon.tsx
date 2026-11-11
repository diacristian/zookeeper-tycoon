import { Droplets, Flower2, Sprout, TreePine } from "lucide-react";
import type { Terrain } from "../game/types";
import { cn } from "../lib/cn";

interface TerrainIconProps {
  terrain: Terrain;
  className?: string;
}

export function TerrainIcon({ terrain, className }: TerrainIconProps) {
  const classes = cn("shrink-0", className);

  switch (terrain) {
    case "water":
      return <Droplets className={classes} aria-hidden="true" />;
    case "tree":
      return <TreePine className={classes} aria-hidden="true" />;
    case "meadow":
      return <Flower2 className={classes} aria-hidden="true" />;
    case "grass":
      return <Sprout className={classes} aria-hidden="true" />;
  }
}
