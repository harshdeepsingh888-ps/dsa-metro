'use client';

import { useState, type ReactNode } from 'react';
import { highlight } from '@/lib/highlight';
import { cx } from '@/lib/format';
import type { Lang } from '@/lib/types';
import { useProgress } from '../ProgressProvider';

/** One decision the learner makes. `frame` is whatever the drill needs to draw the state before it. */
export type DrillStep<F> = { frame: F; prompt: ReactNode; options: string[]; answer: number; why: string; hint?: string };
export type DrillPlan<F> = { steps: DrillStep<F>[]; end: F };
type Msg = { text: string; tone: 'good' | 'bad' | '' };

const MAX_XP_STEPS = 20;

/**
 * Runs a drill the same way the DP table game runs: a right answer moves on, a wrong first answer
 * gets a hint and one more try, a second wrong answer shows the answer and moves on.
 * First-try answers earn +2 XP each, up to 20 per station (shared with that station's table game).
 */
export function useDrill<F>(stationId: string, plan: () => DrillPlan<F>) {
  const { p, gain } = useProgress();
  const [run, setRun] = useState(plan);
  const [k, setK] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [combo, setCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [msg, setMsg] = useState<Msg | null>(null);

  const total = run.steps.length;
  const done = k >= total;
  const step = run.steps[Math.min(k, total - 1)];

  function award(n: number) {
    const best = p.predict[stationId] || 0;
    if (n > best && best < MAX_XP_STEPS) gain(d => { d.predict[stationId] = Math.min(MAX_XP_STEPS, n); });
  }

  function choose(i: number) {
    if (done || wrong.includes(i)) return;
    if (i === step.answer) {
      const first = wrong.length === 0, n = first ? correct + 1 : correct;
      setCorrect(n); setCombo(first ? combo + 1 : 0);
      if (first) award(n);
      setMsg({ text: (first ? 'Correct. ' : 'Right. ') + step.why, tone: 'good' });
    } else if (wrong.length === 0) {
      setWrong([i]); setCombo(0);
      setMsg({ text: 'Not quite. ' + (step.hint || 'Look again and try once more.'), tone: 'bad' });
      return;
    } else {
      setCombo(0);
      setMsg({ text: `It is "${step.options[step.answer]}". ${step.why}`, tone: 'bad' });
    }
    setK(k + 1); setWrong([]);
  }

  function restart() { setRun(plan()); setK(0); setWrong([]); setCombo(0); setCorrect(0); setMsg(null); }

  return { k, total, done, step, frame: done ? run.end : step.frame, choose, wrong, combo, correct, msg, restart };
}
export type Drill<F> = ReturnType<typeof useDrill<F>>;

/** Prompt, answer buttons, feedback and score for a drill. Put the drill's own picture above it. */
export function DrillPanel<F>({ d, doneText, buttons = true, againLabel = 'New round' }: { d: Drill<F>; doneText: string; buttons?: boolean; againLabel?: string }) {
  return (
    <div className="drill">
      <div className="drill-meta">
        <span>{d.done ? 'Round complete' : `Step ${d.k + 1} of ${d.total}`}</span>
        {d.combo >= 2 && <span key={d.combo} className="combo bump">Combo ×{d.combo}</span>}
        <span>{d.correct} right first try</span>
      </div>
      {!d.done && <div className="drill-q">{d.step.prompt}</div>}
      {!d.done && buttons && (
        <div className="drill-opts">
          {d.step.options.map((o, i) => (
            <button key={i} type="button" className={cx('opt', d.wrong.includes(i) && 'wrong')} disabled={d.wrong.includes(i)} onClick={() => d.choose(i)}>{o}</button>
          ))}
        </div>
      )}
      <div aria-live="polite">
        {d.msg && <p className={cx('msg', d.msg.tone)}>{d.msg.text}</p>}
        {d.done && <p className="msg good">{doneText} You got {d.correct} of {d.total} right on the first try.</p>}
      </div>
      <div className="controls">
        <button type="button" className="btn small ghost" onClick={d.restart}>{d.done ? againLabel : 'Start over'}</button>
      </div>
    </div>
  );
}

export function Snippet({ code, lang }: { code: string; lang: Lang }) {
  return <div className="codebox"><pre><code dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} /></pre></div>;
}

export const XP_NOTE = '+2 XP for each step you get right on the first try, up to 40 XP per station.';
