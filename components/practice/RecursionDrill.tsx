'use client';

import { cx } from '@/lib/format';
import { DrillPanel, useDrill, XP_NOTE, type DrillPlan } from './useDrill';

const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));
// frame = the call on top of the stack that is about to return; 0 means the stack has emptied
type F = { n: number; top: number };

let round = 0;
function plan(): DrillPlan<F> {
  const n = [5, 4, 6][round++ % 3];
  const steps = Array.from({ length: n }, (_, idx) => {
    const k = idx + 1, v = fact(k), below = fact(k - 1);
    // the usual mistakes: forgetting to multiply, adding instead, mixing up the factor
    const pool = [v, below, v + below, k * (k - 1), v + k].filter(x => x >= 0);
    const options = [...new Set(pool)].slice(0, 4).sort((a, b) => a - b);
    return {
      frame: { n, top: k },
      prompt: k === 1 ? <>fact(1) is on top of the stack. What does it return?</> : <>fact({k - 1}) just returned <b>{below}</b>. What does fact({k}) return?</>,
      options: options.map(String), answer: options.indexOf(v),
      why: k === 1 ? 'Base case: fact(1) returns 1 without calling anything.' : `fact(${k}) = ${k} × fact(${k - 1}) = ${k} × ${below} = ${v}.`,
      hint: k === 1 ? 'Look at the base case: n ≤ 1.' : `fact(${k}) multiplies ${k} by what fact(${k - 1}) returned.`,
    };
  });
  return { steps, end: { n, top: 0 } };
}

export default function RecursionDrill({ stationId }: { stationId: string }) {
  const d = useDrill(stationId, plan);
  const { n, top } = d.frame;
  const calls = top ? Array.from({ length: n - top + 1 }, (_, i) => top + i) : [];
  return (
    <>
      <p className="viz-note">fact(n) has called itself all the way down to fact(1). Now unwind the stack: predict what each call returns. {XP_NOTE}</p>
      <p className="stack-label">Call stack for fact({n}) (top first)</p>
      <div className="stack">
        {!calls.length && <div className="frame ret"><span>fact({n}) = {fact(n)}</span><span className="tag">answer</span></div>}
        {calls.map((k, i) => (
          <div key={k} className={cx('frame', i === 0 && 'top')}>
            <span>{i === 0 ? (k === 1 ? 'fact(1) = ?' : `fact(${k}) = ${k} × ${fact(k - 1)} = ?`) : `fact(${k}) = ${k} × fact(${k - 1})`}</span>
            <span className="tag">{i === 0 ? (k === 1 ? 'base case' : 'returning') : 'waiting'}</span>
          </div>
        ))}
      </div>
      <DrillPanel d={d} doneText="Stack unwound." againLabel="Try another n" />
    </>
  );
}
