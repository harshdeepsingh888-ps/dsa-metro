'use client';

import { useMemo, useState } from 'react';
import { cx } from '@/lib/format';
import type { VizProps } from '..';
import { DPTable, type DPConfig } from './DPTable';

export default function Robber({ stationId }: VizProps) {
  const [cash, setCash] = useState([6, 2, 9, 5, 1, 8]);
  const n = cash.length;
  const cfg = useMemo<DPConfig>(() => ({
    rows: 1, cols: n + 1, corner: 'houses', rowHead: () => 'best', colHead: k => (k === 0 ? '0' : 'H' + k),
    base: (_, k) => k === 0, baseVal: () => 0,
    calc: (_, k, g) => {
      const skip = g(0, k - 1), back = k >= 2 ? g(0, k - 2) : 0, take = cash[k - 1] + back, v = Math.max(skip, take);
      return { v, deps: k >= 2 ? [[0, k - 1], [0, k - 2]] : [[0, k - 1]], why: `Skip H${k}: ${skip}. Rob H${k}: ${cash[k - 1]} + ${back} = ${take}. Best = ${v}.` };
    },
    name: (_, k) => `dp[${k}]`,
    hint: (_, k) => `Compare skipping H${k} (the cell just before) with robbing it (₹${cash[k - 1]} plus the cell two back).`,
    trace: g => {
      let k = n;
      const taken: number[] = [];
      while (k >= 1) { if (g(0, k) === g(0, k - 1)) k--; else { taken.push(k); k -= 2; } }
      taken.reverse();
      return { cells: taken.map(x => [0, x] as [number, number]), taken, msg: `Rob ${taken.map(x => 'H' + x).join(', ')} for ₹${g(0, n)} thousand. The highlighted cells are where robbing won.` };
    },
  }), [cash, n]);

  return (
    <>
      <div className="setup">
        <span>Cash in each house (₹ thousand)</span>
        <button type="button" className="btn small ghost" onClick={() => setCash(Array.from({ length: 6 }, () => 1 + Math.floor(Math.random() * 9)))}>New street</button>
      </div>
      <DPTable key={cash.join(',')} stationId={stationId} cfg={cfg} side={({ cur, trace }) => (
        <div className="street">
          {cash.map((c, i) => (
            <div key={i} className={cx('house', cur?.[1] === i + 1 && 'cur', trace?.taken?.includes(i + 1) && 'robbed')}>
              <div className="roof" /><div className="body">₹{c}</div><div className="hl">H{i + 1}</div>
            </div>
          ))}
        </div>
      )} />
    </>
  );
}
