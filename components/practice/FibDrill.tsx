'use client';

import { useMemo } from 'react';
import { fibv } from '@/lib/format';
import { DPTable, type DPConfig } from '../viz/dp/DPTable';

const N = 9;

/** Tabulation by hand: fill fib(2) to fib(9) from the two cells before each one. */
export default function FibDrill({ stationId }: { stationId: string }) {
  const cfg = useMemo<DPConfig>(() => ({
    rows: 1, cols: N + 1, corner: 'i', rowHead: () => 'fib', colHead: j => j,
    base: (_, j) => j <= 1, baseVal: (_, j) => j,
    calc: (_, j, g) => {
      const a = g(0, j - 1), b = g(0, j - 2);
      return { v: a + b, deps: [[0, j - 1], [0, j - 2]], why: `fib(${j}) = fib(${j - 1}) + fib(${j - 2}) = ${a} + ${b} = ${a + b}.` };
    },
    name: (_, j) => `fib(${j})`,
    hint: () => 'Add the two cells just before it.',
    doneMsg: g => `fib(${N}) = ${g(0, N)}, in ${N - 1} additions. The plain recursion needs ${2 * fibv(N + 1) - 1} calls for the same answer.`,
  }), []);
  return (
    <>
      <p className="viz-note">Bottom-up DP: fill the table from small to big, so every cell you need is already there. +2 XP for each cell right on the first try.</p>
      <DPTable stationId={stationId} cfg={cfg} />
    </>
  );
}
