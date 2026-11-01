'use client';

import { buildListFrames, ListView, type ListFrame } from '../viz/LinkedReverse';
import { DrillPanel, useDrill, XP_NOTE, type DrillPlan, type DrillStep } from './useDrill';

const LINES = ['nxt = curr.next', 'curr.next = prev', 'prev = curr; curr = nxt'];
const WHY = [
  'Save the rest of the list first, before any arrow changes.',
  'Now it is safe to flip the arrow back to prev.',
  'Step both pointers forward. curr moves to the node you saved.',
];

function plan(): DrillPlan<ListFrame> {
  const fr = buildListFrames([1, 2, 3, 4]), N = 4;
  const steps: DrillStep<ListFrame>[] = [];
  for (let m = 0; m < N; m++) {
    for (let op = 0; op < 3; op++) {
      steps.push({ frame: fr[3 * m + op], prompt: <>Inside the loop, curr is <b>{fr[3 * m + op].vals[m]}</b>. Which line runs next?</>,
        options: LINES, answer: op, why: WHY[op], hint: 'The order is: save, flip, move.' });
    }
  }
  steps.push({ frame: fr[3 * N], prompt: 'curr is null, so the loop ends. What do you return?', options: ['prev', 'curr', 'head'], answer: 0,
    why: 'prev points at the old tail, which is now the head of the reversed list.' });
  return { steps, end: fr[fr.length - 1] };
}

export default function LinkedDrill({ stationId }: { stationId: string }) {
  const d = useDrill(stationId, plan);
  return (
    <>
      <p className="viz-note">Write the reversal from memory, one line at a time. After a couple of nodes the pattern sticks. {XP_NOTE}</p>
      <ListView f={d.frame} />
      <DrillPanel d={d} doneText="List reversed." againLabel="Do it again" />
    </>
  );
}
