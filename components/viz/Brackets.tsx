'use client';

import { useMemo, useState } from 'react';
import { cx } from '@/lib/format';
import { useStepper } from './useStepper';

type Frame = { i: number; st: string[]; msg: string; bad?: boolean; good?: boolean; topBad?: boolean };
const PAIRS: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
const EXAMPLES = ['{[()()]}', '([)]', '((())', '()[]{}'];

function frames(str: string): Frame[] {
  const fr: Frame[] = [{ i: -1, st: [], msg: 'Start with an empty stack. Press Step or Play.' }];
  const st: string[] = [];
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if ('([{'.includes(c)) { st.push(c); fr.push({ i, st: st.slice(), msg: `"${c}" opens. Push it on the stack.` }); }
    else if (PAIRS[c]) {
      if (!st.length) { fr.push({ i, st: [], bad: true, msg: `"${c}" closes, but the stack is empty. Invalid.` }); return fr; }
      const top = st[st.length - 1];
      if (top !== PAIRS[c]) { fr.push({ i, st: st.slice(), bad: true, topBad: true, msg: `"${c}" closes, but the top of the stack is "${top}". Wrong pair. Invalid.` }); return fr; }
      st.pop(); fr.push({ i, st: st.slice(), msg: `"${c}" matches the top "${top}". Pop it.` });
    } else fr.push({ i, st: st.slice(), msg: `"${c}" is not a bracket. Skip it.` });
  }
  fr.push({ i: str.length, st: st.slice(), bad: !!st.length, good: !st.length,
    msg: st.length ? `End of the string, but ${st.length} bracket${st.length === 1 ? ' is' : 's are'} still open. Invalid.` : 'End of the string and the stack is empty. Valid!' });
  return fr;
}

export default function Brackets() {
  const [input, setInput] = useState(EXAMPLES[0]);
  const [str, setStr] = useState(EXAMPLES[0]);
  const fr = useMemo(() => frames(str), [str]);
  const { frame: f, controls } = useStepper(fr, 900);
  const use = (s: string) => { setInput(s); setStr(s.slice(0, 16)); };
  return (
    <>
      <div className="setup">
        <label htmlFor="br-in">String</label>
        <input type="text" id="br-in" maxLength={16} value={input} style={{ textTransform: 'none', width: '12em' }}
          onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') use(input); }} />
        <button type="button" className="btn small primary" onClick={() => use(input)}>Check</button>
        {EXAMPLES.map(x => <button key={x} type="button" className="btn small ghost" onClick={() => use(x)}>{x}</button>)}
      </div>
      <div className="chars">{[...str].map((c, i) => <span key={i} className={cx(i < f.i && 'past', i === f.i && 'now')}>{c}</span>)}</div>
      <p className="stack-label">Stack (bottom on the left, top on the right)</p>
      <div className="hstack">
        {!f.st.length && <em>empty</em>}
        {f.st.map((c, i) => <span key={i} className={cx(i === f.st.length - 1 && 'top', f.topBad && i === f.st.length - 1 && 'bad')}>{c}</span>)}
      </div>
      <p className={cx('msg', f.bad && 'bad', f.good && 'good')}>{f.msg}</p>
      {controls}
    </>
  );
}
