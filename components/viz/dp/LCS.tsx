'use client';

import { useMemo, useState } from 'react';
import type { VizProps } from '..';
import { DPTable, type Cell, type DPConfig } from './DPTable';

const PRESETS: [string, string][] = [['STONE', 'LONGEST'], ['CHAI', 'CHAAT'], ['ABCD', 'ACBD']];
const clean = (t: string) => t.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8);

export default function LCS({ stationId }: VizProps) {
  const [[A, B], setPair] = useState<[string, string]>(PRESETS[0]);
  const [ia, setIa] = useState(A), [ib, setIb] = useState(B);
  const [error, setError] = useState('');

  function use(a: string, b: string) {
    a = clean(a); b = clean(b);
    if (!a || !b) { setError('Type at least one letter in each string.'); return; }
    setError(''); setIa(a); setIb(b); setPair([a, b]);
  }

  const cfg = useMemo<DPConfig>(() => {
    const n = A.length, m = B.length;
    return {
      rows: n + 1, cols: m + 1, rowHead: i => (i === 0 ? '∅' : A[i - 1]), colHead: j => (j === 0 ? '∅' : B[j - 1]),
      base: (i, j) => i === 0 || j === 0, baseVal: () => 0,
      calc: (i, j, g) => {
        if (A[i - 1] === B[j - 1]) { const d = g(i - 1, j - 1); return { v: d + 1, deps: [[i - 1, j - 1]], why: `${A[i - 1]} matches ${B[j - 1]}: diagonal ${d} + 1 = ${d + 1}.` }; }
        const u = g(i - 1, j), l = g(i, j - 1);
        return { v: Math.max(u, l), deps: [[i - 1, j], [i, j - 1]], why: `${A[i - 1]} ≠ ${B[j - 1]}: max(above ${u}, left ${l}) = ${Math.max(u, l)}.` };
      },
      name: (i, j) => `dp[${i}][${j}] (${A[i - 1]} vs ${B[j - 1]})`,
      hint: (i, j) => (A[i - 1] === B[j - 1] ? 'The letters match. Add 1 to the diagonal cell (up-left).' : 'The letters differ. Take the bigger of the cell above and the cell to the left.'),
      trace: g => {
        let i = n, j = m;
        const cells: Cell[] = [], chars: string[] = [];
        while (i > 0 && j > 0) {
          if (A[i - 1] === B[j - 1]) { cells.push([i, j]); chars.push(A[i - 1]); i--; j--; }
          else if (g(i - 1, j) >= g(i, j - 1)) i--; else j--;
        }
        const word = chars.reverse().join('');
        return { cells, msg: word ? `LCS = "${word}", length ${g(n, m)}. The highlighted cells are the matches found by walking back from the corner.` : 'No letters in common, so the LCS is empty.' };
      },
    };
  }, [A, B]);

  return (
    <>
      <div className="setup">
        <label htmlFor="lcs-a">A</label>
        <input type="text" id="lcs-a" maxLength={8} value={ia} onChange={e => setIa(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') use(ia, ib); }} />
        <label htmlFor="lcs-b">B</label>
        <input type="text" id="lcs-b" maxLength={8} value={ib} onChange={e => setIb(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') use(ia, ib); }} />
        <button type="button" className="btn small primary" onClick={() => use(ia, ib)}>Build table</button>
        {PRESETS.map(([a, b]) => <button key={a} type="button" className="btn small ghost" onClick={() => use(a, b)}>{a} / {b}</button>)}
      </div>
      {error && <p className="msg bad">{error}</p>}
      <DPTable key={A + '|' + B} stationId={stationId} cfg={cfg} />
    </>
  );
}
