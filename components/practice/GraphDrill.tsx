'use client';

import { useState } from 'react';
import { cx } from '@/lib/format';
import { Seg } from '../Seg';
import { DrillPanel, useDrill, XP_NOTE, type DrillPlan, type DrillStep } from './useDrill';

const NODES = [
  { id: 'A', x: 50, y: 130 }, { id: 'B', x: 160, y: 50 }, { id: 'C', x: 280, y: 150 }, { id: 'D', x: 160, y: 210 },
  { id: 'E', x: 280, y: 50 }, { id: 'F', x: 390, y: 100 }, { id: 'G', x: 280, y: 232 },
];
const EDGES: [string, string][] = [['A', 'B'], ['A', 'D'], ['B', 'E'], ['D', 'C'], ['D', 'G'], ['C', 'F'], ['E', 'F']];
const ADJ: Record<string, string[]> = {};
for (const n of NODES) ADJ[n.id] = [];
for (const [a, b] of EDGES) { ADJ[a].push(b); ADJ[b].push(a); }
for (const k in ADJ) ADJ[k].sort();
const at = (id: string) => NODES.findIndex(n => n.id === id);

type Kind = 'bfs' | 'dfs';
/** visited = order so far; helper = the queue (BFS) or the call path (DFS) at that moment */
type F = { visited: string[]; helper: string[] };

/**
 * Visit order from A, taking neighbours in alphabetical order. helpers[i] is the queue just before
 * seq[i] comes out of it (BFS), or the call path that reaches seq[i] (DFS).
 */
function walk(kind: Kind) {
  const seq: string[] = [], helpers: string[][] = [], seen = new Set(['A']);
  if (kind === 'bfs') {
    const q = ['A'];
    while (q.length) {
      helpers.push([...q]);
      const v = q.shift()!;
      seq.push(v);
      for (const w of ADJ[v]) if (!seen.has(w)) { seen.add(w); q.push(w); }
    }
  } else {
    const go = (v: string, path: string[]) => {
      helpers.push(path); seq.push(v);
      for (const w of ADJ[v]) if (!seen.has(w)) { seen.add(w); go(w, [...path, w]); }
    };
    go('A', ['A']);
  }
  return { seq, helpers };
}

function Round({ kind, stationId }: { kind: Kind; stationId: string }) {
  const plan = (): DrillPlan<F> => {
    const { seq, helpers } = walk(kind);
    // A is the given start; you pick every node after it
    const steps: DrillStep<F>[] = seq.slice(1).map((next, k) => ({
      // the BFS queue as it stands, or the DFS path to the node you just visited
      frame: { visited: seq.slice(0, k + 1), helper: kind === 'bfs' ? helpers[k + 1] : helpers[k] },
      prompt: <>{kind === 'bfs' ? 'BFS' : 'DFS'} from A. Which node is visited next?</>,
      options: NODES.map(n => n.id), answer: at(next),
      why: kind === 'bfs'
        ? `${next} is at the front of the queue. BFS finishes every node at one distance before going further.`
        : `${next} is the first unvisited neighbour (alphabetically) of the deepest node that still has one.`,
      hint: kind === 'bfs' ? 'The queue is shown now: the front comes out next.' : 'Go deeper from the last node you visited. Only back up when it has no unvisited neighbours.',
    }));
    return { steps, end: { visited: seq, helper: [] } };
  };
  const d = useDrill(stationId, plan);
  const f = d.frame;
  // the front of the BFS queue is the answer, so it stays hidden until you ask for help by missing once
  const showHelper = kind === 'dfs' || d.wrong.length > 0 || d.done;
  return (
    <>
      <div className="svg-scroll">
        <svg viewBox="0 0 440 260" width={440} style={{ maxWidth: '100%', height: 'auto' }} role="img" aria-label="Graph with nodes A to G. Click nodes in visit order.">
          {EDGES.map(([a, b]) => { const p = NODES[at(a)], q = NODES[at(b)]; return <line key={a + b} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className="tedge" />; })}
          {NODES.map((n, i) => {
            const ord = f.visited.indexOf(n.id);
            return (
              <g key={n.id} className={cx('tnode', 'pick', ord >= 0 && 'seen', d.wrong.includes(i) && 'miss')} onClick={() => d.choose(i)}>
                <circle cx={n.x} cy={n.y} r={20} /><text x={n.x} y={n.y}>{n.id}</text>
                {ord >= 0 && <text x={n.x + 22} y={n.y - 20} className="ord">{ord + 1}</text>}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="q-row">
        <em>{kind === 'bfs' ? 'Queue (front first):' : 'Call path (deepest last):'}</em>
        {!showHelper ? <em>work it out yourself; it appears after a wrong pick</em>
          : f.helper.length ? f.helper.map((x, i) => <span key={i}>{x}</span>) : <em>empty</em>}
      </div>
      <p className="stack-label">Visited so far</p>
      <div className="trav-out">{f.visited.map(x => <span key={x}>{x}</span>)}</div>
      <DrillPanel d={d} doneText={`${kind === 'bfs' ? 'BFS' : 'DFS'} order complete: ${f.visited.join(' → ')}.`} againLabel="Again" />
    </>
  );
}

export default function GraphDrill({ stationId }: { stationId: string }) {
  const [kind, setKind] = useState<Kind>('bfs');
  return (
    <>
      <p className="viz-note">Start at A and always take neighbours in alphabetical order. Click the nodes in the order the search visits them. {XP_NOTE}</p>
      <div className="setup">
        <Seg options={[['bfs', 'BFS'], ['dfs', 'DFS']]} value={kind} onChange={setKind} label="Search" />
      </div>
      <Round key={kind} kind={kind} stationId={stationId} />
    </>
  );
}
