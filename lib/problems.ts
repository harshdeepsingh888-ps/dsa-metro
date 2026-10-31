// Every problem the site links to, keyed the way progress stores it.
import { COMPANIES, LEVELS, lc } from './guide';
import { STATIONS } from './stations';
import type { Level, Problem } from './types';

export const PROB: Record<string, Problem> = {};
const add = (p: Problem) => { if (!PROB[p.key]) PROB[p.key] = p; };
STATIONS.forEach(st => st.practice.forEach(x => add(lc(x.t, x.s, x.d))));
LEVELS.forEach(L => [...L.groups, ...L.extra].forEach(([, list]) => list.forEach(add)));
COMPANIES.forEach(c => c.probs.forEach(add));

export const levelKeys = (L: Level) => [...new Set([...L.groups, ...L.extra].flatMap(([, list]) => list.map(p => p.key)))];

export function diffClass(d: string) {
  const x = d.toLowerCase();
  return x === 'easy' ? 'd-easy' : x === 'medium' ? 'd-medium' : x === 'hard' ? 'd-hard' : 'd-other';
}
