'use client';

import { cx } from '@/lib/format';
import { DrillPanel, useDrill, XP_NOTE, type DrillPlan, type DrillStep } from './useDrill';

const STRINGS = ['{[()]}', '([)]', '(()', '[{}](())', '())(', '{()[]}', '((]'];
const PAIRS: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
const OPTS = ['Push it', 'Pop: it matches the top', 'Invalid: stop here'];
type F = { s: string; i: number; st: string[]; bad?: boolean; good?: boolean };

let round = 0;
function plan(): DrillPlan<F> {
  const s = STRINGS[round++ % STRINGS.length];
  const steps: DrillStep<F>[] = [], st: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i], frame = { s, i, st: st.slice() };
    const prompt = <>Next character: <b>{c}</b>. What do you do?</>;
    if ('([{'.includes(c)) {
      steps.push({ frame, prompt, options: OPTS, answer: 0, why: `"${c}" opens a bracket, so push it.`, hint: 'Is it an opening or a closing bracket?' });
      st.push(c);
      continue;
    }
    const top = st[st.length - 1];
    if (top === PAIRS[c]) {
      steps.push({ frame, prompt, options: OPTS, answer: 1, why: `"${c}" closes the "${top}" on top of the stack, so pop it.`, hint: 'Compare it with the top of the stack.' });
      st.pop();
      continue;
    }
    steps.push({ frame, prompt, options: OPTS, answer: 2, hint: 'Compare it with the top of the stack.',
      why: top ? `"${c}" can't close "${top}", the bracket on top. The string is invalid.` : `"${c}" closes a bracket, but the stack is empty. The string is invalid.` });
    return { steps, end: { s, i, st: st.slice(), bad: true } };
  }
  steps.push({ frame: { s, i: s.length, st: st.slice() }, prompt: 'End of the string. Is it valid?',
    options: ['Valid', 'Invalid: something is still open'], answer: st.length ? 1 : 0,
    why: st.length ? `${st.join('')} is still on the stack, so a bracket was never closed.` : 'The stack is empty, so every bracket was closed in the right order.' });
  return { steps, end: { s, i: s.length, st: st.slice(), good: !st.length, bad: !!st.length } };
}

export default function BracketsDrill({ stationId }: { stationId: string }) {
  const d = useDrill(stationId, plan);
  const f = d.frame;
  return (
    <>
      <p className="viz-note">You are the bracket checker. Push openers, pop when a closer matches the top, and stop when something is wrong. {XP_NOTE}</p>
      <div className="chars">{[...f.s].map((c, i) => <span key={i} className={cx(i < f.i && 'past', i === f.i && 'now')}>{c}</span>)}</div>
      <p className="stack-label">Stack (top on the right)</p>
      <div className="hstack">
        {!f.st.length && <em>empty</em>}
        {f.st.map((c, i) => <span key={i} className={cx(i === f.st.length - 1 && 'top', d.done && f.bad && i === f.st.length - 1 && 'bad')}>{c}</span>)}
      </div>
      <DrillPanel d={d} doneText={f.good ? 'Valid string, checked.' : 'Invalid string, caught.'} againLabel="Next string" />
    </>
  );
}
