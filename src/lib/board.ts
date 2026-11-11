export function cellName(cell: number): string {
  const row = Math.floor(cell / 5) + 1;
  const column = (cell % 5) + 1;
  return `row ${row}, column ${column}`;
}

export function cellShortName(cell: number): string {
  return `R${Math.floor(cell / 5) + 1} · C${(cell % 5) + 1}`;
}
