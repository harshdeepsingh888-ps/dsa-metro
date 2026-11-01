'use client';

import { cx, shuffle } from '@/lib/format';
import { DrillPanel, useDrill, XP_NOTE, type DrillPlan, type DrillStep } from './useDrill';

type F = { L: number[]; R: number[]; i: number; j: number; out: number[] };

function plan(): DrillPlan<F> {
  const picked = shuffle(Array.from({ length: 40 }, (_, k) => k + 1)).slice(0, 9);
  const L = picked.slice(0, 5).sort((a, b) => a - b), R = picked.slice(5).sort((a, b) => a - b);
  const steps: DrillStep<F>[] = [];
  let i = 0, j = 0;
  const out: number[] = [];
  while (i < L.length && j < R.length) {
    const takeLeft = L[i] <= R[j];
    steps.push({ frame: { L, R, i, j, out: out.slice() }, prompt: 'Which number goes next into the merged list?',
      options: [`${L[i]} (front of left)`, `${R[j]} (front of right)`], answer: takeLeft ? 0 : 1,
      why: `${Math.min(L[i], R[j])} is the smaller front, so it goes next.`, hint: 'Only the two front numbers can be next. Take the smaller one.' });
    out.push(takeLeft ? L[i++] : R[j++]);
  }
  const rest = i < L.length ? L.slice(i) : R.slice(j), side = i < L.length ? 'left' : 'right', empty = i < L.length ? 'right' : 'left';
  steps.push({ frame: { L, R, i, j, out: out.slice() }, prompt: `The ${empty} half is used up. What happens to ${rest.join(', ')}?`,
    options: ['Copy them to the end as they are', 'Merge them again', 'Sort them first'], answer: 0,
    why: `They are already sorted and bigger than everything merged so far, so the rest of the ${side} half is copied straight across.` });
  return { steps, end: { L, R, i: L.length, j: R.length, out: [...out, ...rest] } };
}

function Row({ label, vals, from }: { label: string; vals: number[]; from: number }) {
  return (
    <div className="mrow">
      <span className="lab">{label}</span>
      <div className="arr">
        {vals.map((v, k) => <div key={k} className={cx('cell', k < from && 'gone', k === from && 'on')}><div className="box">{v}</div></div>)}
      </div>
    </div>
  );
}

export default function MergeDrill({ stationId }: { stationId: string }) {
  const d = useDrill(stationId, plan);
  const f = d.frame;
  return (
    <>
      <p className="viz-note">The heart of merge sort: two sorted halves become one sorted list. You pick each next number. {XP_NOTE}</p>
      <Row label="Left" vals={f.L} from={f.i} />
      <Row label="Right" vals={f.R} from={f.j} />
      <div className="mrow">
        <span className="lab">Merged</span>
        <div className="arr">
          {f.out.map((v, k) => <div key={k} className={cx('cell', d.done && 'hit')}><div className="box">{v}</div></div>)}
          {!f.out.length && <span className="viz-note">empty so far</span>}
        </div>
      </div>
      <DrillPanel d={d} doneText="Merged." againLabel="New halves" />
    </>
  );
}
