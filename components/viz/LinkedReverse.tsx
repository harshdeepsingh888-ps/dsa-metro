'use client';

import { Fragment } from 'react';
import { cx } from '@/lib/format';
import { useStepper } from './useStepper';

const VALS = [1, 2, 3, 4, 5], N = VALS.length;
// pointers are node indexes; -1 is the null on the left, N is the null on the right
type Frame = { next: number[]; prev: number; curr: number; nxt: number | null; msg: string; end?: boolean };
const name = (k: number) => (k < 0 || k >= N ? 'null' : String(VALS[k]));

function buildFrames(): Frame[] {
  const fr: Frame[] = [], next = VALS.map((_, i) => i + 1);
  let prev = -1, curr = 0, nxt: number | null = null;
  const snap = (msg: string, end?: boolean) => fr.push({ next: next.slice(), prev, curr, nxt, msg, end });
  snap('Start: prev = null, curr = head (1). Every arrow points right.');
  while (curr !== N) {
    nxt = next[curr];
    snap(`Save next = ${name(nxt)}, so the rest of the list isn't lost.`);
    next[curr] = prev;
    snap(`Flip the arrow: ${VALS[curr]} now points back to ${name(prev)}.`);
    prev = curr; curr = nxt; nxt = null;
    snap(`Move forward: prev = ${name(prev)}, curr = ${name(curr)}.`);
  }
  snap(`curr is null, so stop. prev (${VALS[prev]}) is the new head: 5 → 4 → 3 → 2 → 1.`, true);
  return fr;
}
const FRAMES = buildFrames();

export default function LinkedReverse() {
  const { frame: f, controls } = useStepper(FRAMES, 1300);
  const labels = (k: number) => (
    <div className="lab">
      {f.prev === k && <span>prev</span>}
      {f.curr === k && <span>curr</span>}
      {f.nxt === k && <span>next</span>}
    </div>
  );
  // the link between position p and p + 1 points right, left, or is broken
  const arrow = (p: number) => (p >= 0 && f.next[p] === p + 1 ? '→' : p + 1 < N && f.next[p + 1] === p ? '←' : '');
  return (
    <>
      <div className="svg-scroll">
        <div className="ll">
          <div className="node"><div className="nbox null">null</div>{labels(-1)}</div>
          {VALS.map((v, k) => (
            <Fragment key={k}>
              <div className={cx('lnk', arrow(k - 1) === '←' && 'back')}>{arrow(k - 1)}</div>
              <div className="node"><div className="nbox">{v}</div>{labels(k)}</div>
            </Fragment>
          ))}
          <div className={cx('lnk', arrow(N - 1) === '←' && 'back')}>{arrow(N - 1)}</div>
          <div className="node"><div className="nbox null">null</div>{labels(N)}</div>
        </div>
      </div>
      <p className={cx('msg', f.end && 'good')}>{f.msg}</p>
      {controls}
    </>
  );
}
