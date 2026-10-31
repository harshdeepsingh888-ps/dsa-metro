'use client';

import { useState } from 'react';
import { cx, sup } from '@/lib/format';
import { inr } from '@/lib/progress';

const NS = [10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e9];
const FN: [string, (n: number) => number, string][] = [
  ['O(1)', () => 1, 'Read a[i]'],
  ['O(log n)', n => Math.max(1, Math.log2(n)), 'Binary search'],
  ['O(n)', n => n, 'One loop'],
  ['O(n log n)', n => n * Math.log2(n), 'Sort'],
  ['O(n²)', n => n * n, 'Loop in a loop'],
  ['O(2ⁿ)', n => Math.pow(2, n), 'Every subset'],
];
const OPS_PER_SEC = 1e8;

function fmtOps(v: number) {
  if (!isFinite(v)) return 'more than 10³⁰⁸';
  if (v < 1e5) return inr(v);
  const e = Math.floor(Math.log10(v)), m = v / Math.pow(10, e);
  return '≈ ' + (m >= 9.95 ? '10' : m.toFixed(1)) + ' × 10' + sup(e);
}
function fmtTime(sec: number) {
  if (!isFinite(sec) || sec > 4.35e17) return 'longer than the universe has existed';
  if (sec < 1e-3) return 'under 1 ms';
  if (sec < 1) return Math.round(sec * 1000) + ' ms';
  if (sec < 60) return sec.toFixed(sec < 10 ? 1 : 0) + ' seconds';
  if (sec < 3600) return Math.round(sec / 60) + ' minutes';
  if (sec < 86400) return (sec / 3600).toFixed(1) + ' hours';
  if (sec < 3.15e7) return Math.round(sec / 86400) + ' days';
  const y = sec / 3.15e7;
  return (y < 1e5 ? inr(y) : fmtOps(y).replace('≈ ', '')) + ' years';
}

export default function BigO() {
  const [idx, setIdx] = useState(4);
  const n = NS[idx];
  return (
    <>
      <p className="viz-note">Assumes about 10⁸ simple operations per second and a 1-second time limit. The dashed line marks 1 second.</p>
      <div className="bo-head">
        <span className="bo-n">n = {n < 1e4 ? inr(n) : '10' + sup(Math.round(Math.log10(n)))}</span>
        <input type="range" id="bigo-n" aria-label="Input size n" min={0} max={NS.length - 1} step={1} value={idx} onChange={e => setIdx(Number(e.target.value))} />
      </div>
      <div className="bo-rows">
        {FN.map(([name, f, ex]) => {
          const v = f(n), secs = v / OPS_PER_SEC, ok = secs <= 1;
          const w = isFinite(v) ? Math.max(1.5, Math.min(100, Math.log10(Math.max(v, 1)) / 18 * 100)) : 100;
          return (
            <div className="bo-row" key={name}>
              <div className="bo-name">{name}<small>{ex}</small></div>
              <div className="bo-track">
                <div className={cx('bo-fill', !ok && 'slow')} style={{ width: w + '%' }} />
                <div className="bo-limit" style={{ left: (8 / 18 * 100) + '%' }} title="10⁸ operations ≈ 1 second" />
              </div>
              <span className="bo-ops">{fmtOps(v)} ops</span>
              <div className="bo-time"><span className={cx('pill', ok ? 'ok' : 'no')}>{ok ? 'Accepted' : 'Time limit exceeded'}</span><span>{fmtTime(secs)}</span></div>
            </div>
          );
        })}
      </div>
    </>
  );
}
