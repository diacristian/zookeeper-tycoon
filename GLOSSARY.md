# Glossary

**Cell** - One square in the 5 by 5 habitat grid.

**Terrain** - The fixed scenery on a cell: grass, water, tree, or meadow. Water
cannot hold an animal.

**Resident** - An animal placed on a cell. A resident is an instance of a species
and has one live clause.

**Species** - The animal type: Lion, Monkey, or Gazelle.

**Wish** - The player-facing name for a literal in an animal's clause.

**Clause** - The three-wish OR expression attached to a resident. The rule card
is the species template; the live clause is the evaluated instance at a cell.

**Literal** - One condition inside a clause, such as "beside water" or "no
monkeys next door." A literal is either true or false in a given board state.

**Happy** - A resident whose clause has at least one true literal.

**Complete** - All nine residents have been placed.

**Solved** - The habitat is complete and every resident is happy, so every
clause is true.

**Stuck** - A board state from which no sequence of remaining placements can
make every clause true.

**Ranger hint** - One legal next placement returned by the exact completion
solver.
