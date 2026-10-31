'use client';

import { useMemo, useState } from 'react';
import { fmtDP } from '@/lib/format';
import type { VizProps } from '..';
import { Seg } from '../../Seg';
import { DPTable, type DPConfig } from './DPTable';

const PRESETS = [{ coins: [1, 3, 4], amt: 6 }, { coins: [1, 5, 6], amt: 10 }, { coins: [2, 5], amt: 8 }];

/** Biggest coin first: how many coins greedy uses, or null when it gets stuck. */
function greedy(coins: number[], amt: number) {
  let rem = amt, cnt = 0;
  for (const c of [...coins].sort((a, b) => b - a)) while (rem >= c) { rem -= c; cnt++; }
  return rem === 0 ? cnt : null;
}

export default function Coins({ stationId }: VizProps) {
  const [preset, setPreset] = useState('0');
  const { coins, amt } = PRESETS[Number(preset)];
  const cfg = useMemo<DPConfig>(() => ({
    rows: 1, cols: amt + 1, corner: 'amount', rowHead: () => 'coins', colHead: a => '₹' + a,
    base: (_, a) => a === 0, baseVal: () => 0,
    calc: (_, a, g) => {
      const fits = coins.filter(c => c <= a);
      const opts = fits.map(c => ({ c, v: g(0, a - c) + 1 }));
      const v = opts.length ? Math.min(...opts.map(o => o.v)) : Infinity;
      return {
        v, deps: fits.map(c => [0, a - c] as [number, number]),
        why: opts.length
          ? opts.map(o => `last coin ₹${o.c}: ${fmtDP(g(0, a - o.c))} + 1 = ${fmtDP(o.v)}`).join(' · ') + `. Smallest: ${fmtDP(v)}.`
          : `No coin fits in ₹${a}, so it is ∞.`,
      };
    },
    name: (_, a) => `dp[₹${a}]`,
    hint: () => 'For each coin, look back that many cells (highlighted) and add 1. Take the smallest. Type inf if nothing works.',
    doneMsg: g => {
      const v = g(0, amt), gr = greedy(coins, amt);
      const base = v === Infinity ? `₹${amt} can't be made with these coins.` : `₹${amt} needs ${v} coin${v === 1 ? '' : 's'}.`;
      return base + (gr === v ? ' Greedy happens to agree this time.' : gr == null ? ' Greedy (biggest coin first) gets stuck and finds no answer at all.' : ` Greedy (biggest coin first) would use ${gr}.`);
    },
  }), [coins, amt]);

  return (
    <>
      <div className="setup">
        <span>Coins and amount</span>
        <Seg options={PRESETS.map((x, i) => [String(i), x.coins.map(c => '₹' + c).join(' ') + ' → ₹' + x.amt] as [string, string])} value={preset} onChange={setPreset} label="Coin set" />
      </div>
      <DPTable key={preset} stationId={stationId} cfg={cfg} side={() => (
        <div className="coins">{coins.map(c => <div key={c} className="coin">₹{c}</div>)}</div>
      )} />
    </>
  );
}
