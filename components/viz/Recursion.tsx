'use client';

import { useMemo, useState } from 'react';
import { cx } from '@/lib/format';
import { useStepper } from './useStepper';

type Call = { text: string; base?: boolean; ret?: boolean };
type Frame = { stack: Call[]; msg: string; end?: boolean };

function frames(n: number): Frame[] {
  const fr: Frame[] = [], st: Call[] = [];
  const snap = (msg: string, end?: boolean) => fr.push({ stack: st.map(x => ({ ...x })), msg, end });
  for (let k = n; k >= 1; k--) {
    if (k > 1) { st.push({ text: `fact(${k}) = ${k} × fact(${k - 1})` }); snap(`fact(${k}) can't answer yet. It calls fact(${k - 1}) and waits on the stack.`); }
    else { st.push({ text: 'fact(1) = 1', base: true }); snap('fact(1) hits the base case. It returns 1 without calling anything.'); }
  }
  let val = 1;
  for (let k = 2; k <= n; k++) {
    st.pop();
    const top = st[st.length - 1];
    top.ret = true; top.text = `fact(${k}) = ${k} × ${val} = ${val * k}`;
    snap(`fact(${k - 1}) returned ${val}. Now fact(${k}) can finish: ${k} × ${val} = ${val * k}.`);
    val *= k;
  }
  st.length = 0;
  snap(`Answer: fact(${n}) = ${val}. ${n} calls in total, and the stack was ${n} frames deep at its peak.`, true);
  return fr;
}

export default function Recursion() {
  const [n, setN] = useState(4);
  const fr = useMemo(() => frames(n), [n]);
  const { frame: f, controls } = useStepper(fr, 1200);
  return (
    <>
      <div className="setup">
        <label htmlFor="rec-n">Compute</label>
        <select id="rec-n" value={n} onChange={e => setN(Number(e.target.value))}>
          {[2, 3, 4, 5, 6].map(k => <option key={k} value={k}>fact({k})</option>)}
        </select>
      </div>
      <p className="stack-label">Call stack (top of the stack first)</p>
      <div className="stack">
        {!f.stack.length && <div className="frame"><span>(empty)</span><span className="tag">done</span></div>}
        {[...f.stack].reverse().map((c, i) => (
          <div key={c.text + i} className={cx('frame', i === 0 && 'top', c.ret && 'ret')}>
            <span>{c.text}</span><span className="tag">{c.ret ? 'returning' : c.base ? 'base case' : 'waiting'}</span>
          </div>
        ))}
      </div>
      <p className={cx('msg', f.end && 'good')}>{f.msg}</p>
      {controls}
    </>
  );
}
