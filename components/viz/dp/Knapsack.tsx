'use client';

import { useMemo, useState } from 'react';
import { cx } from '@/lib/format';
import type { VizProps } from '..';
import { DPTable, type Cell, type DPConfig } from './DPTable';

const ITEMS = [{ n: 'Tent', w: 3, v: 5 }, { n: 'Stove', w: 2, v: 3 }, { n: 'Camera', w: 1, v: 4 }, { n: 'Snacks', w: 2, v: 2 }];

export default function Knapsack({ stationId }: VizProps) {
  const [W, setW] = useState(6);
  const cfg = useMemo<DPConfig>(() => ({
    rows: ITEMS.length + 1, cols: W + 1, wideRows: true,
    rowHead: i => (i === 0 ? 'no items' : `+ ${ITEMS[i - 1].n} (${ITEMS[i - 1].w}kg, ${ITEMS[i - 1].v})`),
    colHead: w => w + 'kg',
    base: i => i === 0, baseVal: () => 0,
    calc: (i, w, g) => {
      const it = ITEMS[i - 1], skip = g(i - 1, w);
      if (it.w > w) return { v: skip, deps: [[i - 1, w]], why: `${it.n} (${it.w} kg) doesn't fit in ${w} kg. Skip it: ${skip}.` };
      const rest = g(i - 1, w - it.w), take = it.v + rest, v = Math.max(skip, take);
      return { v, deps: [[i - 1, w], [i - 1, w - it.w]], why: `Skip ${it.n}: ${skip}. Take it: ${it.v} + best for ${w - it.w} kg without it (${rest}) = ${take}. Best = ${v}.` };
    },
    name: (i, w) => `dp[${ITEMS[i - 1].n}][${w}kg]`,
    hint: (i, w) => (ITEMS[i - 1].w > w ? 'This item is too heavy for this column. Copy the cell above.' : 'Compare the cell above (skip) with this item\'s points plus the highlighted cell further left in the row above (take).'),
    trace: g => {
      let i = ITEMS.length, w = W;
      const cells: Cell[] = [], taken: number[] = [];
      while (i > 0) { if (g(i, w) !== g(i - 1, w)) { taken.push(i - 1); cells.push([i, w]); w -= ITEMS[i - 1].w; } i--; }
      taken.reverse();
      const kg = taken.reduce((a, k) => a + ITEMS[k].w, 0);
      return { cells, taken, msg: `Pack ${taken.map(k => ITEMS[k].n).join(' + ')}: ${kg} kg, ${g(ITEMS.length, W)} points. Highlighted cells are where taking the item won.` };
    },
  }), [W]);

  return (
    <>
      <div className="setup">
        <span>Bag capacity</span>
        <button type="button" className="btn small" onClick={() => setW(x => Math.max(3, x - 1))}>−</button>
        <strong className="big-num" style={{ fontSize: 22, minWidth: '2.6em', textAlign: 'center' }}>{W} kg</strong>
        <button type="button" className="btn small" onClick={() => setW(x => Math.min(8, x + 1))}>+</button>
      </div>
      <DPTable key={W} stationId={stationId} cfg={cfg} side={({ cur, trace }) => (
        <div className="items">
          {ITEMS.map((it, k) => (
            <div key={it.n} className={cx('item', cur?.[0] === k + 1 && 'cur', trace?.taken?.includes(k) && 'taken')}>
              <b>{it.n}</b><span>{it.w} kg · {it.v} pts</span>
            </div>
          ))}
        </div>
      )} />
    </>
  );
}
