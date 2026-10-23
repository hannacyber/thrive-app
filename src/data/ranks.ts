export type Rank = { name: string; min: number };

export const RANKS: Rank[] = [
  { name: 'Hatchling', min: 0 },
  { name: 'Fledgling', min: 40 },
  { name: 'Night Owl', min: 120 },
  { name: 'Wise Sage', min: 260 },
];

export function rankFor(xp: number) {
  let current = RANKS[0];
  let next: Rank | null = null;
  for (const r of RANKS) {
    if (xp >= r.min) current = r;
  }
  for (const r of RANKS) {
    if (r.min > xp) {
      next = r;
      break;
    }
  }
  return { current, next };
}
