'use client';

import { cx } from '@/lib/format';
import { DrillPanel, useDrill, XP_NOTE, type DrillPlan, type DrillStep } from './useDrill';

const A = [1, 3, 4, 6, 8, 11, 14, 17];
const TARGETS = [19, 12, 26, 22, 28];
const OPTS = ['Move L right', 'Move R left', 'Found the pair', 'Stop: no pair'];
type F = { L: number; R: number; found?: boolean };

let round = 0;
function plan(): DrillPlan<F> {
  const target = TARGETS[round++ % TARGETS.length];
  const steps: DrillStep<F>[] = [];
  const prompt = (L: number, R: number) => <>Target is <b>{target}</b>. L points at <b>{A[L]}</b>, R points at <b>{A[R]}</b>. What do you do?</>;
  let L = 0, R = A.length - 1;
  while (L < R) {
    const s = A[L] + A[R];
    if (s === target) {
      steps.push({ frame: { L, R }, prompt: prompt(L, R), options: OPTS, answer: 2, why: `${A[L]} + ${A[R]} = ${target}. That's the pair.` });
      return { steps, end: { L, R, found: true } };
    }
    const less = s < target;
    steps.push({ frame: { L, R }, prompt: prompt(L, R), options: OPTS, answer: less ? 0 : 1,
      why: `${A[L]} + ${A[R]} = ${s}, ${less ? 'too small, so move L right to get a bigger number' : 'too big, so move R left to get a smaller number'}.`,
      hint: 'Add the two numbers first, then compare the sum with the target.' });
    if (less) L++; else R--;
  }
  steps.push({ frame: { L, R }, prompt: <>Target is <b>{target}</b>. L and R now point at the same element. What do you do?</>, options: OPTS, answer: 3,
    why: `The pointers met without finding a pair, so no two prices add up to ${target}.` });
  return { steps, end: { L, R } };
}

export default function TwoPointersDrill({ stationId }: { stationId: string }) {
  const d = useDrill(stationId, plan);
  const f = d.frame;
  return (
    <>
      <p className="viz-note">You are the algorithm now. Prices are sorted: {A.join(', ')}. Work out each sum yourself. {XP_NOTE}</p>
      <div className="arr">
        {A.map((v, k) => (
          <div key={k} className={cx('cell', (k < f.L || k > f.R) && 'gone', (k === f.L || k === f.R) && (f.found ? 'hit' : 'on'))}>
            <div className="box">{v}</div><div className="ix">{k}</div>
            <div className="ptr">{[k === f.L && 'L', k === f.R && 'R'].filter(Boolean).join(' ')}</div>
          </div>
        ))}
      </div>
      <DrillPanel d={d} doneText="Round done." againLabel="Next target" />
    </>
  );
}
