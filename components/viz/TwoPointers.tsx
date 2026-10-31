'use client';

import { useMemo, useState } from 'react';
import { cx } from '@/lib/format';
import { useStepper } from './useStepper';

const A = [1, 3, 4, 6, 8, 11, 14, 17];
type Frame = { L: number; R: number; msg: string; found?: boolean; none?: boolean };

function frames(target: number): Frame[] {
  const fr: Frame[] = [];
  let L = 0, R = A.length - 1;
  while (L < R) {
    const s = A[L] + A[R];
    if (s === target) { fr.push({ L, R, found: true, msg: `${A[L]} + ${A[R]} = ${s}. Found the pair!` }); return fr; }
    if (s < target) { fr.push({ L, R, msg: `${A[L]} + ${A[R]} = ${s}, less than ${target}. Need bigger, so move L right.` }); L++; }
    else { fr.push({ L, R, msg: `${A[L]} + ${A[R]} = ${s}, more than ${target}. Need smaller, so move R left.` }); R--; }
  }
  fr.push({ L, R, none: true, msg: `The pointers met. No two prices add up to ${target}.` });
  return fr;
}

export default function TwoPointers() {
  const [target, setTarget] = useState(25);
  const fr = useMemo(() => frames(target), [target]);
  const { i, frame: f, controls } = useStepper(fr);
  return (
    <>
      <div className="setup">
        <label htmlFor="tp-target">Gift card value</label>
        <select id="tp-target" value={target} onChange={e => setTarget(Number(e.target.value))}>
          {[10, 21, 25, 30].map(t => <option key={t} value={t}>₹{t}</option>)}
        </select>
        <span className="viz-note">Prices (sorted): {A.join(', ')}</span>
      </div>
      <div className="arr">
        {A.map((v, k) => {
          const on = k === f.L || k === f.R;
          return (
            <div key={k} className={cx('cell', (k < f.L || k > f.R) && 'gone', on && (f.found ? 'hit' : 'on'))}>
              <div className="box">{v}</div><div className="ix">{k}</div>
              <div className="ptr">{[k === f.L && 'L', k === f.R && 'R'].filter(Boolean).join(' ')}</div>
            </div>
          );
        })}
      </div>
      <p className={cx('msg', f.found && 'good', f.none && 'bad')}>
        {f.msg}{i > 0 || f.found ? ` Checks so far: ${i + 1}. Checking every pair could take ${A.length * (A.length - 1) / 2}.` : ''}
      </p>
      {controls}
    </>
  );
}
