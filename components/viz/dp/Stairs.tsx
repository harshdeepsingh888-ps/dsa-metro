'use client';

import { useMemo, useState } from 'react';
import { cx } from '@/lib/format';
import type { VizProps } from '..';
import { DPTable, type DPConfig } from './DPTable';

export default function Stairs({ stationId }: VizProps) {
  const [n, setN] = useState(6);
  const cfg = useMemo<DPConfig>(() => ({
    rows: 1, cols: n + 1, corner: 'step', rowHead: () => 'ways', colHead: j => j,
    base: (_, j) => j <= 1, baseVal: () => 1,
    calc: (_, j, g) => {
      const a = g(0, j - 1), b = g(0, j - 2);
      return { v: a + b, deps: [[0, j - 1], [0, j - 2]], why: `ways(${j}) = ways(${j - 1}) + ways(${j - 2}) = ${a} + ${b} = ${a + b}.` };
    },
    name: (_, j) => `ways(${j})`,
    hint: () => 'Add the two highlighted cells: the ways to reach one step below and two steps below.',
    doneMsg: g => `There are ${g(0, n)} ways to climb ${n} stairs. Change the number of stairs and go again.`,
  }), [n]);

  return (
    <>
      <div className="setup">
        <span>Number of stairs</span>
        <button type="button" className="btn small" onClick={() => setN(x => Math.max(3, x - 1))}>−</button>
        <strong className="big-num" style={{ fontSize: 22, minWidth: '1.4em', textAlign: 'center' }}>{n}</strong>
        <button type="button" className="btn small" onClick={() => setN(x => Math.min(10, x + 1))}>+</button>
      </div>
      <DPTable key={n} stationId={stationId} cfg={cfg} side={({ cur, deps }) => (
        <div className="stairs" aria-hidden="true">
          {Array.from({ length: n + 1 }, (_, i) => (
            <div key={i} className={cx('stair', cur?.[1] === i && 'cur', deps.some(d => d[1] === i) && 'dep')} style={{ height: 16 + i * (82 / n) }}>{i}</div>
          ))}
        </div>
      )} />
    </>
  );
}
