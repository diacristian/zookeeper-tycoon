# Zookeeper Tycoon

A mobile-first React puzzle that turns a 3-SAT instance into a tiny zoo layout.
Place every animal, make at least one of its three OR-wishes true, and keep the
whole set of nine clauses satisfied.

## Run it

```bash
pnpm install
pnpm dev
```

Vite prints the local URL. For a production check:

```bash
pnpm test
pnpm build
```

The game is published for phones at
[diacristian.github.io/zookeeper-tycoon](https://diacristian.github.io/zookeeper-tycoon/).
The Pages workflow runs tests and builds on every push to `main`.

## How to play

1. Pick Lions, Monkeys, or Gazelles from the roster.
2. Tap any grass, tree, or meadow tile. Water is scenery and cannot hold an animal.
3. Tap a placed animal to inspect its live clause.
4. A green check means at least one literal is true. A red `!` means all three are false.
5. Fill all nine pens with every clause satisfied to win.

Extras: **Ranger AI** finds one legal next move with an exact solver and explains
which condition it satisfies or which neighbour it fixes, **Undo** rewinds the
last action, and **Reset** starts a fresh habitat.

## 3-SAT mapping

| Game concept | Logic concept |
| --- | --- |
| Animal placed on a cell | A variable assignment for that position |
| One animal's rule card | A three-literal clause |
| Each wish in the card | One literal |
| Green check / happy animal | The clause evaluates to true |
| Red `!` / unhappy animal | All three literals evaluate to false |
| All nine animals happy | The conjunction of all nine clauses is true |
| Ranger AI | Backtracking search over the remaining placements, plus a clause-level reason |

Adjacency is cardinal only: up, down, left, and right. The level is handcrafted,
so the solver is deliberately small and exact. It is a teaching toy for the shape
of 3-SAT, not an implementation of a general-purpose SAT algorithm or a claim about
recent AI research.

## Source map

- `src/game/rules.ts` - literals and clause evaluation
- `src/game/engine.ts` - game actions, evaluation, and hints
- `src/game/solver.ts` - exact completion search
- `src/game/level.ts` - terrain and animal counts
- `src/game/game.test.ts` - behavior tests
- `src/App.tsx` - state and responsive layout
- `src/components/` - board, roster, clause card, modals, and notices
- `.github/workflows/deploy-pages.yml` - free GitHub Pages deployment

## Workflow note

The implementation follows the composable workflow from
[mattpocock/skills](https://github.com/mattpocock/skills): the domain vocabulary
was fixed before the engine, behavior was exercised through the public game
interface with focused tests, and the final pass used the build plus interaction
checks. The small, explicit `engine.ts` seam keeps the UI independent from the
rule evaluator and backtracking solver.
