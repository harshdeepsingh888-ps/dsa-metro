'use client';

import { useMemo, useState } from 'react';
import type { VizProps } from '..';
import { DPTable, type Cell, type DPConfig } from './DPTable';

const R = 4, C = 6;
const DEFAULT_BLOCKS = ['1,1', '1,4', '2,2'];
const isEnd = (i: number, j: number) => (i === 0 && j === 0) || (i === R - 1 && j === C - 1);

function randomBlocks() {
  const out = new Set<string>();
  while (out.size < 4) {
    const r = Math.floor(Math.random() * R), c = Math.floor(Math.random() * C);
    if (!isEnd(r, c)) out.add(r + ',' + c);
  }
  return [...out];
}

export default function GridPaths({ stationId }: VizProps) {
  const [blocks, setBlocks] = useState<string[]>(DEFAULT_BLOCKS);
  const cfg = useMemo<DPConfig>(() => {
    const B = (i: number, j: number) => blocks.includes(i + ',' + j);
    return {
      rows: R, cols: C, rowHead: i => 'r' + i, colHead: j => 'c' + j,
      base: (i, j) => B(i, j) || (i === 0 && j === 0), baseVal: (i, j) => (B(i, j) ? 0 : 1),
      calc: (i, j, g) => {
        const up = i > 0 ? g(i - 1, j) : 0, left = j > 0 ? g(i, j - 1) : 0, v = up + left;
        const deps: Cell[] = [];
        if (i > 0) deps.push([i - 1, j]);
        if (j > 0) deps.push([i, j - 1]);
        return { v, deps, why: i === 0 ? `Top row: only from the left, ${left}.` : j === 0 ? `Left column: only from above, ${up}.` : `From above ${up} + from the left ${left} = ${v}.` };
      },
      cellClass: (i, j) => (B(i, j) ? 'blocked' : i === 0 && j === 0 ? 'start' : i === R - 1 && j === C - 1 ? 'goal' : ''),
      clickable: (i, j) => !isEnd(i, j),
      onCellClick: (i, j) => { const k = i + ',' + j; setBlocks(b => (b.includes(k) ? b.filter(x => x !== k) : [...b, k])); },
      name: (i, j) => `paths[${i}][${j}]`,
      hint: () => 'Add the cell above and the cell to the left. A blocked cell counts as 0.',
      doneMsg: g => `${g(R - 1, C - 1)} routes reach the canteen. Move the blocks around and fill it again.`,
    };
  }, [blocks]);

  return (
    <>
      <div className="setup">
        <span className="viz-note">Click any cell to add or remove a block before you fill in the first value.</span>
        <button type="button" className="btn small ghost" onClick={() => setBlocks([])}>Clear blocks</button>
        <button type="button" className="btn small ghost" onClick={() => setBlocks(randomBlocks())}>Random blocks</button>
      </div>
      <DPTable key={[...blocks].sort().join('|')} stationId={stationId} cfg={cfg} />
    </>
  );
}
