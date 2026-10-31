'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cx } from '@/lib/format';
import { STATIONS, stationById } from '@/lib/stations';
import type { Lang, LineId, QuizQuestion } from '@/lib/types';
import { useProgress } from './ProgressProvider';
import { Seg } from './Seg';

/** The stations on one line, as a strip of dots, with the current one marked. */
export function LineStrip({ stationId, line }: { stationId: string; line: LineId }) {
  const { p } = useProgress();
  return (
    <div className="hstrip-box">
      <ol className="hstrip">
        {STATIONS.filter(x => x.line === line).map(x => (
          <li key={x.id} className={cx(p.stations[x.id] && 'done', x.id === stationId && 'here')}>
            <Link href={`/stations/${x.id}/`} aria-current={x.id === stationId ? 'page' : undefined}><span className="d" />{x.short}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

const LANG_NAME: Record<Lang, string> = { cpp: 'C++', py: 'Python' };

/** Highlighted code in the learner's chosen language. The HTML is highlighted at build time. */
export function CodeBox({ html, raw }: { html: Record<Lang, string>; raw: Record<Lang, string> }) {
  const { p, update } = useProgress();
  const [copied, setCopied] = useState('Copy');
  function copy() {
    navigator.clipboard.writeText(raw[p.lang]).then(() => setCopied('Copied'), () => setCopied('Copy failed'));
    setTimeout(() => setCopied('Copy'), 1500);
  }
  return (
    <div className="codebox">
      <div className="codebar">
        <span className="lab">{LANG_NAME[p.lang]}</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Seg options={[['cpp', 'C++'], ['py', 'Python']]} value={p.lang} label="Code language" onChange={l => update(d => { d.lang = l; })} />
          <button type="button" className="btn small ghost" onClick={copy}>{copied}</button>
        </span>
      </div>
      <pre><code dangerouslySetInnerHTML={{ __html: html[p.lang] }} /></pre>
    </div>
  );
}

function Question({ q, qi, stationId }: { q: QuizQuestion; qi: number; stationId: string }) {
  const { p, ready, gain } = useProgress();
  const key = stationId + ':' + qi;
  const [pick, setPick] = useState<number | null>(null);
  // a question you already got right stays answered on later visits
  const shown = pick ?? (ready && p.quiz[key] ? q.a : null);
  function answer(i: number) {
    setPick(i);
    if (i === q.a && !p.quiz[key]) gain(d => { d.quiz[key] = 1; }, '+5 XP');
  }
  return (
    <div className="q">
      <p className="qq"><span className="qn">Q{qi + 1}</span><span>{q.q}</span></p>
      <div className="opts">
        {q.opts.map((o, i) => (
          <button key={i} type="button" disabled={shown !== null} onClick={() => answer(i)}
            className={cx('opt', shown !== null && i === q.a && 'right', shown !== null && i === shown && i !== q.a && 'wrong')}>{o}</button>
        ))}
      </div>
      {shown !== null && <p className="why"><strong>{shown === q.a ? 'Correct.' : 'Not quite.'}</strong> {q.why}</p>}
    </div>
  );
}

export function Quiz({ stationId, quiz }: { stationId: string; quiz: QuizQuestion[] }) {
  return <div className="quiz">{quiz.map((q, i) => <Question key={i} q={q} qi={i} stationId={stationId} />)}</div>;
}

/** Punch-ticket button plus links to the previous and next stations. */
export function FinishBar({ stationId }: { stationId: string }) {
  const { p, ready, gain } = useProgress();
  const st = stationById(stationId)!;
  const idx = STATIONS.indexOf(st), next = STATIONS[idx + 1], prev = STATIONS[idx - 1];
  return (
    <div className="finish">
      {ready && p.stations[st.id]
        ? <p className="done-note">Ticket punched. Station done.</p>
        : <button type="button" className="btn line" disabled={!ready}
            onClick={() => gain(d => { d.stations[st.id] = Date.now(); }, next ? '+30 XP · Ticket punched' : '+30 XP · You reached DP Terminus!')}>
            Punch ticket: station done <span className="sub">+30 XP</span>
          </button>}
      <div className="nav">
        {prev ? <Link className="btn" href={`/stations/${prev.id}/`}>← {prev.short}</Link> : <Link className="btn" href="/">← Route map</Link>}
        {next
          ? <Link className="nextbtn" href={`/stations/${next.id}/`}><span className="sub">Agla station · next stop</span>{next.name} →</Link>
          : <Link className="nextbtn" href="/guide/"><span className="sub">End of the line · what next</span>Study guide →</Link>}
      </div>
    </div>
  );
}
