'use client';

import { cx } from '@/lib/format';
import { DrillPanel, useDrill, XP_NOTE, type DrillPlan, type DrillStep } from './useDrill';

const A = [3, 7, 9, 12, 15, 18, 21, 24, 27, 30, 34, 38, 41, 45, 50];
const TARGETS = [38, 9, 33, 45, 21, 4];
const DIR = ['Found it at mid', 'Search the left half', 'Search the right half'];
type F = { lo: number; hi: number; mid: number | null; found?: boolean };

let round = 0;
function plan(): DrillPlan<F> {
  const t = TARGETS[round++ % TARGETS.length];
  const steps: DrillStep<F>[] = [];
  let lo = 0, hi = A.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const idx = [...new Set([mid - 1, mid, mid + 1].filter(x => x >= lo && x <= hi))];
    steps.push({ frame: { lo, hi, mid: null }, prompt: <>Target <b>{t}</b>. lo = {lo}, hi = {hi}. Which index is mid?</>,
      options: idx.map(String), answer: idx.indexOf(mid),
      why: `mid = (${lo} + ${hi}) / 2 = ${mid}, rounded down.`, hint: 'Add lo and hi, halve it, and round down.' });
    const v = A[mid], ans = v === t ? 0 : v > t ? 1 : 2;
    steps.push({ frame: { lo, hi, mid }, prompt: <>a[{mid}] = <b>{v}</b>, target <b>{t}</b>. What next?</>, options: DIR, answer: ans,
      why: ans === 0 ? `a[${mid}] is ${t}. Found it.` : ans === 1 ? `${v} > ${t}, so the target can only be on the left: hi = mid − 1 = ${mid - 1}.` : `${v} < ${t}, so the target can only be on the right: lo = mid + 1 = ${mid + 1}.`,
      hint: 'Compare a[mid] with the target. The array is sorted.' });
    if (ans === 0) return { steps, end: { lo, hi, mid, found: true } };
    if (ans === 1) hi = mid - 1; else lo = mid + 1;
  }
  steps.push({ frame: { lo, hi, mid: null }, prompt: <>Now lo = {lo} is past hi = {hi}. What does that mean?</>,
    options: [`${t} is not in the array`, 'Start again from the middle', `${t} is at index lo`], answer: 0,
    why: `The range is empty, so ${t} isn't in the array. Binary search returns -1 here.` });
  return { steps, end: { lo, hi, mid: null } };
}

export default function BinarySearchDrill({ stationId }: { stationId: string }) {
  const d = useDrill(stationId, plan);
  const f = d.frame;
  return (
    <>
      <p className="viz-note">Run binary search by hand on this sorted array: pick mid, then pick the half. {XP_NOTE}</p>
      <div className="arr">
        {A.map((v, k) => (
          <div key={k} className={cx('cell', (k < f.lo || k > f.hi) && 'gone', k === f.mid && (f.found ? 'hit' : 'on'))}>
            <div className="box">{v}</div><div className="ix">{k}</div>
            <div className="ptr">{[k === f.lo && 'lo', k === f.mid && 'mid', k === f.hi && 'hi'].filter(Boolean).join(' ')}</div>
          </div>
        ))}
      </div>
      <DrillPanel d={d} doneText="Search done." againLabel="Next target" />
    </>
  );
}
