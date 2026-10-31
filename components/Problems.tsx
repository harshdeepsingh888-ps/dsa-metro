'use client';

import { useId } from 'react';
import { diffClass, PROB } from '@/lib/problems';
import { dueList } from '@/lib/progress';
import type { Problem } from '@/lib/types';
import { cx } from '@/lib/format';
import { useProgress } from './ProgressProvider';

/** One practice problem with a solved tick. The same problem can appear in several lists; they all read one store. */
export function ProblemRow({ p }: { p: Problem }) {
  const { p: prog, gain, update } = useProgress();
  const solved = !!prog.solved[p.key];
  const id = useId();
  function toggle(on: boolean) {
    if (on) gain(d => { d.solved[p.key] = Date.now(); }, '+15 XP · ' + p.t + ' solved');
    else update(d => { delete d.solved[p.key]; delete d.rev[p.key]; });
  }
  return (
    <li>
      <div className="prow">
        <input type="checkbox" id={id} checked={solved} onChange={e => toggle(e.target.checked)} aria-label={'Mark ' + p.t + ' as solved'} />
        <a className={cx('pt', solved && 'solved')} href={p.url} target="_blank" rel="noopener">{p.t}</a>
        <span className={'diff ' + diffClass(p.d)}>{p.d}</span>
        {p.src !== 'LeetCode' && <span className="src">{p.src}</span>}
        <span className="grow"><span className="xp-tag">+15 XP</span></span>
      </div>
    </li>
  );
}

export function ProblemList({ problems }: { problems: Problem[] }) {
  return <ul className="probs">{problems.map(p => <ProblemRow key={p.key} p={p} />)}</ul>;
}

export function ProblemGroup({ title, problems }: { title: string; problems: Problem[] }) {
  return (
    <div className="pgroup">
      <h4 className="sub-h">{title}</h4>
      <ProblemList problems={problems} />
    </div>
  );
}

/** Problems due for re-solving after 3, 7 and 30 days. Renders nothing when none are due. */
export function ReviseBox({ limit }: { limit: number }) {
  const { p, ready, gain } = useProgress();
  if (!ready) return null;
  const due = dueList(p);
  if (!due.length) return null;
  return (
    <div className="revise">
      <p className="eyebrow">Due for revision · {due.length}</p>
      <p className="viz-note">Re-solve these from scratch without looking at your old code. +5 XP each.</p>
      {due.slice(0, limit).map(d => {
        const pr = PROB[d.k];
        const ago = d.last ? Math.floor((Date.now() - d.last) / 864e5) : null;
        return (
          <div className="rev-row" key={d.k}>
            <a className="pt" href={pr.url} target="_blank" rel="noopener">{pr.t}</a>
            <span className={'diff ' + diffClass(pr.d)}>{pr.d}</span>
            <span className="when">{(d.n ? 'Last revised ' : 'Solved ') + (ago == null ? 'a while ago' : ago + ' days ago') + ' · revision ' + (d.n + 1) + ' of 3'}</span>
            <span className="grow">
              <button type="button" className="btn small primary" onClick={() => gain(x => { x.rev[d.k] = { n: d.n + 1, t: Date.now() }; }, '+5 XP · revision done')}>Re-solved it</button>
            </span>
          </div>
        );
      })}
      {due.length > limit && <p className="viz-note">{due.length - limit} more after these.</p>}
    </div>
  );
}
