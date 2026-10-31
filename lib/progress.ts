// What a learner has done, and the XP, rank, streak and revision rules built on it.
// Stored in localStorage under the same key the single-file site used, so old progress carries over.
import { PROB } from './problems';
import { STATIONS } from './stations';
import type { Lang } from './types';

export const STORAGE_KEY = 'dsa-metro-progress-v1';

export type Progress = {
  v: 1;
  /** station id -> time it was punched */
  stations: Record<string, number>;
  /** "stationId:questionIndex" -> 1, for first-try correct answers */
  quiz: Record<string, number>;
  /** problem or milestone key -> time it was ticked */
  solved: Record<string, number>;
  /** station id -> best count of DP cells predicted right on the first try */
  predict: Record<string, number>;
  /** "YYYY-MM-DD" -> 1 for every day with activity */
  days: Record<string, number>;
  /** problem key -> how many revisions are done, and when the last one was */
  rev: Record<string, { n: number; t: number }>;
  lang: Lang;
};

export const blank = (): Progress => ({ v: 1, stations: {}, quiz: {}, solved: {}, predict: {}, days: {}, rev: {}, lang: 'cpp' });

/** Union of two progress records: nothing either side earned is lost. */
export function merge(a: Partial<Progress> | null, b: Partial<Progress> | null): Progress {
  const o = blank();
  for (const k of ['stations', 'quiz', 'solved', 'days'] as const) o[k] = { ...(a?.[k] || {}), ...(b?.[k] || {}) };
  o.predict = { ...(a?.predict || {}) };
  for (const [k, v] of Object.entries(b?.predict || {})) o.predict[k] = Math.max(o.predict[k] || 0, Number(v) || 0);
  for (const src of [a, b]) for (const [k, v] of Object.entries(src?.rev || {})) {
    if (!v || typeof v !== 'object') continue;
    const n = Number(v.n) || 0, t = Number(v.t) || 0, cur = o.rev[k];
    if (!cur || n > cur.n || (n === cur.n && t > cur.t)) o.rev[k] = { n, t };
  }
  const lang = b?.lang || a?.lang;
  o.lang = lang === 'py' ? 'py' : 'cpp';
  return o;
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return merge(blank(), JSON.parse(raw));
  } catch { /* storage blocked or corrupt: start fresh */ }
  return blank();
}
export function saveProgress(p: Progress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* storage blocked */ }
}

export const dayKey = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
export const todayKey = () => dayKey(new Date());

export const doneCount = (p: Progress) => STATIONS.filter(x => p.stations[x.id]).length;
export const nextStation = (p: Progress) => STATIONS.find(x => !p.stations[x.id]) || null;

export function streak(p: Progress) {
  const d = new Date();
  if (!p.days[dayKey(d)]) { d.setDate(d.getDate() - 1); if (!p.days[dayKey(d)]) return 0; }
  let n = 0;
  while (p.days[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function xp(p: Progress) {
  const pred = Object.values(p.predict).reduce((a, b) => a + Math.min(20, b), 0);
  const revs = Object.values(p.rev).reduce((a, r) => a + Math.min(3, Number(r?.n) || 0), 0);
  return Object.keys(p.stations).length * 30 + Object.keys(p.quiz).length * 5 + Object.keys(p.solved).length * 15 + pred * 2 + revs * 5;
}

const RANKS: [number, string][] = [[0, 'Ticket holder'], [100, 'Daily commuter'], [250, 'Line regular'], [450, 'Interchange pro'], [700, 'Train driver'], [1000, 'Station master'], [1400, 'DP Terminus legend'], [2200, 'Express pilot'], [3200, 'Metro architect']];
export const rankOf = (x: number) => { let r = RANKS[0]; for (const k of RANKS) if (x >= k[0]) r = k; return { min: r[0], name: r[1] }; };
export const nextRank = (x: number) => { const k = RANKS.find(r => r[0] > x); return k ? { min: k[0], name: k[1] } : null; };

/** Date you reach DP Terminus at one station a day, or null when you are there. */
export function eta(p: Progress) {
  const remaining = STATIONS.length - doneCount(p);
  if (!remaining) return null;
  const d = new Date();
  d.setDate(d.getDate() + (p.days[todayKey()] ? remaining : remaining - 1));
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** Re-solve each problem after 3, 7 and 30 days. */
const REV_GAPS = [3, 7, 30];
export type DueItem = { k: string; last: number; n: number };
export function dueList(p: Progress): DueItem[] {
  const now = Date.now(), out: DueItem[] = [];
  for (const [k, t0] of Object.entries(p.solved)) {
    if (!PROB[k]) continue;
    const r = p.rev[k] || { n: 0, t: 0 };
    if (r.n >= REV_GAPS.length) continue;
    const last = r.n ? r.t : (Number(t0) > 1 ? Number(t0) : 0);
    if (now - last >= REV_GAPS[r.n] * 864e5) out.push({ k, last, n: r.n });
  }
  return out.sort((a, b) => a.last - b.last);
}

export const inr = (n: number) => Math.round(n).toLocaleString('en-IN');
