'use client';

import { useEffect, useMemo, useState } from 'react';
import { cx } from '@/lib/format';

const RAW = [
  '...............',
  '.....#.........',
  '.###.#.#####...',
  '...#.#.....#...',
  '.#.#.###.#.#.##',
  '.#...#...#.#...',
  '.#####.###.###.',
  '.......#.......',
  '..#....#...#...',
];
const R = RAW.length, C = RAW[0].length, SR = 0, SC = 0, GR = R - 1, GC = C - 1;
const initialWalls = () => RAW.map(r => [...r].map(c => c === '#'));
type Cell = [number, number];
type Kind = 'bfs' | 'dfs';
type Run = { kind: Kind; order: Cell[]; path: Cell[]; found: boolean; k: number; pk: number };

function search(walls: boolean[][], kind: Kind) {
  const ok = (r: number, c: number) => r >= 0 && c >= 0 && r < R && c < C && !walls[r][c];
  const seen = walls.map(r => r.map(() => false));
  const par: (Cell | null)[][] = walls.map(r => r.map(() => null));
  const order: Cell[] = [];
  let found = false;
  if (kind === 'bfs') {
    const q: Cell[] = [[SR, SC]];
    let head = 0;
    seen[SR][SC] = true;
    while (head < q.length) {
      const [r, c] = q[head++];
      order.push([r, c]);
      if (r === GR && c === GC) { found = true; break; }
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nr = r + dr, nc = c + dc;
        if (ok(nr, nc) && !seen[nr][nc]) { seen[nr][nc] = true; par[nr][nc] = [r, c]; q.push([nr, nc]); }
      }
    }
  } else {
    const st: [number, number, Cell | null][] = [[SR, SC, null]];
    while (st.length) {
      const [r, c, p] = st.pop()!;
      if (seen[r][c]) continue;
      seen[r][c] = true; par[r][c] = p; order.push([r, c]);
      if (r === GR && c === GC) { found = true; break; }
      for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        const nr = r + dr, nc = c + dc;
        if (ok(nr, nc) && !seen[nr][nc]) st.push([nr, nc, [r, c]]);
      }
    }
  }
  const path: Cell[] = [];
  if (found) { let cur: Cell | null = [GR, GC]; while (cur) { path.push(cur); cur = par[cur[0]][cur[1]]; } path.reverse(); }
  return { order, path, found };
}

export default function Maze() {
  const [walls, setWalls] = useState(initialWalls);
  const [run, setRun] = useState<Run | null>(null);
  const running = !!run && (run.k < run.order.length || run.pk < run.path.length);

  // reveal two visited cells per tick, then the path one cell per tick
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setRun(r => r && (r.k < r.order.length ? { ...r, k: Math.min(r.order.length, r.k + 2) } : { ...r, pk: r.pk + 1 })), 22);
    return () => clearTimeout(t);
  }, [run, running]);

  const shown = useMemo(() => {
    const seen = new Set<string>(), path = new Set<string>();
    if (run) {
      run.order.slice(0, run.k).forEach(([r, c]) => seen.add(r + ',' + c));
      run.path.slice(0, run.pk).forEach(([r, c]) => path.add(r + ',' + c));
    }
    return { seen, path };
  }, [run]);

  function toggle(r: number, c: number) {
    if (running || (r === SR && c === SC) || (r === GR && c === GC)) return;
    setRun(null);
    setWalls(w => w.map((row, i) => row.map((v, j) => (i === r && j === c ? !v : v))));
  }

  let msg = '', tone = '';
  if (run && running) msg = run.kind === 'bfs' ? 'BFS spreads out in rings, nearest cells first…' : 'DFS dives down one corridor as far as it can…';
  else if (run && !run.found) { msg = 'No way through. Remove a wall and try again.'; tone = 'bad'; }
  else if (run) {
    tone = 'good';
    msg = `${run.kind === 'bfs' ? 'BFS' : 'DFS'} visited ${run.order.length} cells. Its path takes ${run.path.length - 1} steps` + (run.kind === 'bfs' ? ', the shortest possible.' : '. Run BFS on the same maze and compare.');
  }

  return (
    <>
      <p className="viz-note">Find a way from the green cell to the yellow one. Click cells to add or remove walls, then race the two searches.</p>
      <div className="controls">
        <button type="button" className="btn small primary" disabled={running} onClick={() => setRun({ kind: 'bfs', ...search(walls, 'bfs'), k: 0, pk: 0 })}>Run BFS</button>
        <button type="button" className="btn small" disabled={running} onClick={() => setRun({ kind: 'dfs', ...search(walls, 'dfs'), k: 0, pk: 0 })}>Run DFS</button>
        <button type="button" className="btn small ghost" onClick={() => { setRun(null); setWalls(initialWalls().map(r => r.map(() => false))); }}>Clear walls</button>
        <button type="button" className="btn small ghost" onClick={() => { setRun(null); setWalls(initialWalls()); }}>Reset maze</button>
      </div>
      <div className="maze" style={{ gridTemplateColumns: `repeat(${C}, minmax(0, 1fr))` }} aria-label="Maze. Click a cell to add or remove a wall.">
        {walls.map((row, r) => row.map((wall, c) => {
          const k = r + ',' + c;
          const cls = r === SR && c === SC ? 'start' : r === GR && c === GC ? 'goal' : shown.path.has(k) ? 'path' : shown.seen.has(k) ? 'seen' : wall ? 'wall' : '';
          return <div key={k} className={cls} onClick={() => toggle(r, c)} />;
        }))}
      </div>
      <div className="maze-legend">
        <span><i style={{ background: 'var(--ink)' }} />wall</span>
        <span className="l-red"><i style={{ background: 'color-mix(in srgb, var(--line) 30%, var(--surface))' }} />visited</span>
        <span className="l-red"><i style={{ background: 'var(--line)' }} />path found</span>
      </div>
      <p className={cx('msg', tone)}>{msg}</p>
    </>
  );
}
