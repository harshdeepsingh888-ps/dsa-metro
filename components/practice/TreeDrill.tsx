'use client';

import { useState } from 'react';
import { cx } from '@/lib/format';
import { Seg } from '../Seg';
import { frames, T, type Kind } from '../viz/TreeTraversal';
import { DrillPanel, useDrill, XP_NOTE, type DrillPlan } from './useDrill';

const NAMES: Record<Kind, string> = { pre: 'Preorder', in: 'Inorder', post: 'Postorder', level: 'Level order' };
const HINTS: Record<Kind, string> = {
  pre: 'Preorder visits a node before anything below it, then goes left before right.',
  in: 'Inorder finishes the whole left subtree before visiting the node.',
  post: 'Postorder visits a node only after both of its subtrees are done.',
  level: 'Level order goes row by row, left to right.',
};
type F = number[]; // nodes visited so far

function Round({ kind, stationId }: { kind: Kind; stationId: string }) {
  const plan = (): DrillPlan<F> => {
    const fr = frames(kind).slice(1);
    return {
      steps: fr.map((f, i) => ({
        frame: fr.slice(0, i).map(x => x.cur), prompt: <>{NAMES[kind]}: which node comes next? Click it in the tree or pick it below.</>,
        options: T.map(n => String(n.v)), answer: f.cur, why: f.msg.replace(/ Done:.*$/, ''), hint: HINTS[kind],
      })),
      end: fr.map(x => x.cur),
    };
  };
  const d = useDrill(stationId, plan);
  const seen = d.frame;
  return (
    <>
      <div className="svg-scroll">
        <svg viewBox="0 0 420 204" width={420} style={{ maxWidth: '100%', height: 'auto' }} role="img" aria-label="Binary search tree. Click nodes in traversal order.">
          {T.map((nd, i) => nd.l != null && nd.r != null && [nd.l, nd.r].map(c => <line key={i + '-' + c} x1={nd.x} y1={nd.y} x2={T[c].x} y2={T[c].y} className="tedge" />))}
          {T.map((nd, i) => (
            <g key={i} className={cx('tnode', 'pick', seen.includes(i) && 'seen', d.wrong.includes(i) && 'miss')} onClick={() => d.choose(i)}>
              <circle cx={nd.x} cy={nd.y} r={20} /><text x={nd.x} y={nd.y}>{nd.v}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="stack-label">Your order so far</p>
      <div className="trav-out">{seen.length ? seen.map(i => <span key={i}>{T[i].v}</span>) : <em>nothing yet</em>}</div>
      <DrillPanel d={d} doneText={`${NAMES[kind]} complete.`} againLabel="Again" />
    </>
  );
}

export default function TreeDrill({ stationId }: { stationId: string }) {
  const [kind, setKind] = useState<Kind>('pre');
  return (
    <>
      <p className="viz-note">Walk the tree yourself. Pick a traversal, then visit the nodes in its order. {XP_NOTE}</p>
      <div className="setup">
        <Seg options={[['pre', 'Preorder'], ['in', 'Inorder'], ['post', 'Postorder'], ['level', 'Level order']]} value={kind} onChange={setKind} label="Traversal" />
      </div>
      <Round key={kind} kind={kind} stationId={stationId} />
    </>
  );
}
