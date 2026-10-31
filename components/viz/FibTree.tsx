'use client';

import { useEffect, useMemo, useState } from 'react';
import { cx, fibv } from '@/lib/format';
import { inr } from '@/lib/progress';

type TNode = { id: number; k: number; depth: number; parent: TNode | null; kids: TNode[]; hit: boolean; x: number; y: number };
type Ev = { t: 'call' | 'ret'; nd: TNode };

/** Every call fib(n) makes, in order, laid out as a tree. With memo, repeat calls return at once. */
function buildTree(n: number, memo: boolean) {
  const nodes: TNode[] = [], ev: Ev[] = [], seen = new Set<number>();
  const go = (k: number, depth: number, parent: TNode | null): number => {
    const nd: TNode = { id: nodes.length, k, depth, parent, kids: [], hit: false, x: 0, y: 0 };
    nodes.push(nd);
    if (parent) parent.kids.push(nd);
    ev.push({ t: 'call', nd });
    let v: number;
    if (memo && k > 1 && seen.has(k)) { nd.hit = true; v = fibv(k); }
    else if (k <= 1) v = k;
    else { v = go(k - 1, depth + 1, nd) + go(k - 2, depth + 1, nd); if (memo) seen.add(k); }
    ev.push({ t: 'ret', nd });
    return v;
  };
  go(n, 0, null);
  const GAP = 34, LV = 58, PAD = 22;
  let leaf = 0, maxD = 0;
  const place = (nd: TNode) => {
    maxD = Math.max(maxD, nd.depth);
    if (!nd.kids.length) { nd.x = PAD + 16 + leaf * GAP; leaf++; }
    else { nd.kids.forEach(place); nd.x = (nd.kids[0].x + nd.kids[nd.kids.length - 1].x) / 2; }
    nd.y = PAD + 16 + nd.depth * LV;
  };
  place(nodes[0]);
  return { nodes, ev, W: PAD * 2 + 32 + (leaf - 1) * GAP, H: PAD * 2 + 32 + maxD * LV };
}

export default function FibTree() {
  const [n, setN] = useState(5);
  const [memo, setMemo] = useState(false);
  const [ptr, setPtr] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tree = useMemo(() => buildTree(n, memo), [n, memo]);
  const done = ptr >= tree.ev.length;

  useEffect(() => { setPtr(0); setPlaying(false); }, [tree]);
  useEffect(() => {
    if (!playing) return;
    if (done) { setPlaying(false); return; }
    const t = setTimeout(() => setPtr(x => x + 1), memo ? 320 : 170);
    return () => clearTimeout(t);
  }, [playing, ptr, done, memo]);

  // replay the first `ptr` events to get each node's state and the running counts
  const view = useMemo(() => {
    const state: string[] = tree.nodes.map(() => '');
    const computed: Record<number, number> = {};
    let calls = 0, repeats = 0;
    for (const e of tree.ev.slice(0, ptr)) {
      if (e.t === 'call') { calls++; state[e.nd.id] = 'shown active'; continue; }
      if (e.nd.hit) state[e.nd.id] = 'shown hit';
      else {
        if (computed[e.nd.k]) { state[e.nd.id] = 'shown waste'; repeats++; } else state[e.nd.id] = 'shown fresh';
        computed[e.nd.k] = (computed[e.nd.k] || 0) + 1;
      }
    }
    return { state, computed, calls, repeats };
  }, [tree, ptr]);

  const maxCount = Math.max(1, ...Object.values(view.computed));
  return (
    <>
      <div className="setup">
        <label htmlFor="fib-n">Compute</label>
        <select id="fib-n" value={n} onChange={e => setN(Number(e.target.value))}>
          {[3, 4, 5, 6, 7].map(k => <option key={k} value={k}>fib({k})</option>)}
        </select>
        <label className="switch" htmlFor="fib-memo">
          <input type="checkbox" id="fib-memo" checked={memo} onChange={e => setMemo(e.target.checked)} />
          <span className="sw" />Memo
        </label>
      </div>
      <p className="viz-note">Each circle is one call, labelled with its k in fib(k). Turn memo on and watch the tree collapse.</p>
      <div className="svg-scroll">
        <svg viewBox={`0 0 ${tree.W} ${tree.H}`} width={tree.W} height={tree.H} role="img" aria-label={`Recursion tree for fib(${n})`}>
          {tree.nodes.map(nd => nd.parent && (
            <line key={'e' + nd.id} x1={nd.parent.x} y1={nd.parent.y} x2={nd.x} y2={nd.y} className={cx('fe', view.state[nd.id] && 'shown')} />
          ))}
          {tree.nodes.map(nd => (
            <g key={nd.id} className={cx('fn', view.state[nd.id])}>
              <title>{`fib(${nd.k}) = ${fibv(nd.k)}${nd.hit ? ', from memo' : ''}`}</title>
              <circle cx={nd.x} cy={nd.y} r={14} /><text x={nd.x} y={nd.y}>{nd.k}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="key">
        <span><i className="k-fresh" />computed for the first time</span>
        <span><i className="k-waste" />repeated work</span>
        <span><i className="k-hit" />answered from memo</span>
      </div>
      <div className="fib-stats">
        <div><b>{view.calls}</b>calls</div>
        <div><b>{view.repeats}</b>repeated</div>
        <div><b>{done ? fibv(n) : '…'}</b>fib({n})</div>
      </div>
      <div className="controls">
        <button type="button" className="btn small primary" onClick={() => { if (done) setPtr(0); setPlaying(!playing); }}>{playing ? 'Pause' : 'Play'}</button>
        <button type="button" className="btn small" disabled={done} onClick={() => { setPlaying(false); setPtr(x => x + 1); }}>Step →</button>
        <button type="button" className="btn small" disabled={done} onClick={() => { setPlaying(false); setPtr(tree.ev.length); }}>Finish</button>
        <button type="button" className="btn small ghost" onClick={() => { setPlaying(false); setPtr(0); }}>Reset</button>
      </div>
      <p className={cx('msg', done && 'good')}>
        {!done ? 'Press Play to watch the calls happen in order.'
          : memo ? `With memo: ${view.calls} calls, and every value was computed exactly once.`
            : `Without memo: ${view.calls} calls, ${view.repeats} of them repeated work. Now switch memo on.`}
      </p>
      <p className="stack-label">How many times each value was computed</p>
      <div className="tally">
        {Array.from({ length: n + 1 }, (_, i) => n - i).map(k => {
          const c = view.computed[k] || 0;
          return <div key={k}><span>fib({k})</span><span><i className={cx(c <= 1 && 'once')} style={{ width: (c / maxCount * 100) + '%' }} /></span><span>{c} {c === 1 ? 'time' : 'times'}</span></div>;
        })}
      </div>
      <p className="stack-label">At bigger n</p>
      <div className="tbl-scroll">
        <table className="tbl">
          <thead><tr><th>n</th><th>Calls, plain recursion</th><th>Calls, with memo</th></tr></thead>
          <tbody>{[10, 20, 30, 40].map(k => <tr key={k}><td className="num">{k}</td><td className="num">{inr(2 * fibv(k + 1) - 1)}</td><td className="num">{2 * k - 1}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}
