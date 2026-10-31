'use client';

import { useMemo, useState } from 'react';
import { cx } from '@/lib/format';
import { Seg } from '../Seg';
import { useStepper } from './useStepper';

type Node = { v: number; x: number; y: number; l?: number; r?: number };
const T: Node[] = [
  { v: 8, x: 210, y: 32, l: 1, r: 2 }, { v: 4, x: 110, y: 102, l: 3, r: 4 }, { v: 12, x: 310, y: 102, l: 5, r: 6 },
  { v: 2, x: 60, y: 172 }, { v: 6, x: 160, y: 172 }, { v: 10, x: 260, y: 172 }, { v: 14, x: 360, y: 172 },
];
type Kind = 'pre' | 'in' | 'post' | 'level';
type Frame = { cur: number; out: number[]; msg: string; queue?: number[]; end?: boolean };

function frames(kind: Kind): Frame[] {
  const fr: Frame[] = [{ cur: -1, out: [], msg: 'Press Step or Play.', queue: kind === 'level' ? [0] : undefined }];
  const out: number[] = [];
  const visit = (i: number, msg: string) => { out.push(i); fr.push({ cur: i, out: out.slice(), msg }); };
  const walk = (i: number | undefined) => {
    if (i == null) return;
    const nd = T[i];
    if (kind === 'pre') visit(i, `Visit ${nd.v} first, then its left subtree, then its right.`);
    walk(nd.l);
    if (kind === 'in') visit(i, (nd.l != null ? `Left subtree of ${nd.v} is done. ` : `${nd.v} has no left child. `) + `Visit ${nd.v}, then go right.`);
    walk(nd.r);
    if (kind === 'post') visit(i, (nd.l != null ? `Both subtrees of ${nd.v} are done. ` : `${nd.v} is a leaf. `) + `Visit ${nd.v}.`);
  };
  if (kind === 'level') {
    const q = [0];
    while (q.length) {
      const i = q.shift()!, nd = T[i];
      if (nd.l != null && nd.r != null) q.push(nd.l, nd.r);
      out.push(i);
      fr.push({ cur: i, out: out.slice(), queue: q.slice(),
        msg: `Take ${nd.v} from the front of the queue` + (nd.l != null && nd.r != null ? `, add its children ${T[nd.l].v} and ${T[nd.r].v} to the back.` : '. It has no children.') });
    }
  } else walk(0);
  const last = fr[fr.length - 1];
  last.end = true;
  last.msg += ` Done: ${out.map(i => T[i].v).join(', ')}` + (kind === 'in' ? '. Sorted, because this is a BST.' : '.');
  return fr;
}

export default function TreeTraversal() {
  const [kind, setKind] = useState<Kind>('in');
  const fr = useMemo(() => frames(kind), [kind]);
  const { frame: f, controls } = useStepper(fr, 1000);
  return (
    <>
      <div className="setup">
        <Seg options={[['pre', 'Preorder'], ['in', 'Inorder'], ['post', 'Postorder'], ['level', 'Level order']]} value={kind} onChange={setKind} label="Traversal" />
      </div>
      <div className="svg-scroll">
        <svg viewBox="0 0 420 204" width={420} style={{ maxWidth: '100%', height: 'auto' }} role="img" aria-label="Binary search tree with values 2 to 14">
          {T.map((nd, i) => nd.l != null && nd.r != null && [nd.l, nd.r].map(c => <line key={i + '-' + c} x1={nd.x} y1={nd.y} x2={T[c].x} y2={T[c].y} className="tedge" />))}
          {T.map((nd, i) => (
            <g key={i} className={cx('tnode', f.out.includes(i) && 'seen', f.cur === i && 'cur')}>
              <circle cx={nd.x} cy={nd.y} r={20} /><text x={nd.x} y={nd.y}>{nd.v}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="stack-label">Output</p>
      <div className="trav-out">
        {!f.out.length && <em>nothing yet</em>}
        {f.out.map(i => <span key={i}>{T[i].v}</span>)}
      </div>
      <div className="q-row">
        {f.queue && <><em>Queue (front first):</em>{!f.queue.length && <em>empty</em>}{f.queue.map(i => <span key={i}>{T[i].v}</span>)}</>}
      </div>
      <p className={cx('msg', f.end && 'good')}>{f.msg}</p>
      {controls}
    </>
  );
}
