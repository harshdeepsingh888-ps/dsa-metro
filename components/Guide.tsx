'use client';

import { useEffect, useRef, useState } from 'react';
import { COMPANIES, DISCLAIM, HABITS, LEVELS, PLAN, RESOURCES, RHYTHM } from '@/lib/guide';
import { levelKeys } from '@/lib/problems';
import type { Level } from '@/lib/types';
import { ProblemGroup, ReviseBox } from './Problems';
import { useProgress } from './ProgressProvider';

function Fact({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return <div className={wide ? 'wide' : undefined}><h4 className="sub-h">{title}</h4>{typeof children === 'string' ? <p>{children}</p> : children}</div>;
}

function Milestones({ L }: { L: Level }) {
  const { p, gain, update } = useProgress();
  return (
    <ul className="milestones">
      {L.milestones.map((m, i) => {
        const key = `ms:${L.id}:${i}`, id = `ms-${L.id}-${i}`;
        return (
          <li key={key}>
            <label htmlFor={id}>
              <input type="checkbox" id={id} checked={!!p.solved[key]} onChange={e => e.target.checked
                ? gain(d => { d.solved[key] = Date.now(); }, '+15 XP · Milestone reached')
                : update(d => { delete d.solved[key]; })} />
              <span>{m}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function LevelPanel({ L }: { L: Level }) {
  return (
    <>
      <div className="facts">
        <Fact title="Who it is for">{L.forWho}</Fact>
        <Fact title="Goal">{L.goal}</Fact>
        <Fact title="Ready for the next level when">{L.ready}</Fact>
      </div>
      <div><h4 className="sub-h">Topics to cover</h4><div className="tchips">{L.topics.map(t => <span key={t}>{t}</span>)}</div></div>
      <div>
        <h3 className="panel-h" style={{ marginBottom: 12 }}>Core LeetCode problems</h3>
        {L.groups.map(([g, list]) => <ProblemGroup key={g} title={g} problems={list} />)}
      </div>
      <div>
        <h3 className="panel-h" style={{ marginBottom: 12 }}>Sharpen on Codeforces, CSES and AtCoder</h3>
        {L.extra.map(([g, list]) => <ProblemGroup key={g} title={g} problems={list} />)}
      </div>
      <div><h3 className="panel-h" style={{ marginBottom: 12 }}>Milestones</h3><Milestones L={L} /></div>
    </>
  );
}

export function GuideView() {
  const { p, ready } = useProgress();
  const [level, setLevel] = useState('l1');
  const [company, setCompany] = useState('google');
  const levelsRef = useRef<HTMLElement>(null);

  // the home page links to /guide/?level=l2 and so on
  useEffect(() => {
    const want = new URLSearchParams(location.search).get('level');
    if (want && LEVELS.some(L => L.id === want)) setLevel(want);
  }, []);

  const L = LEVELS.find(x => x.id === level)!;
  const c = COMPANIES.find(x => x.id === company)!;
  const ci = LEVELS.findIndex(x => x.id === c.level), cL = LEVELS[ci];

  function jumpToLevel(id: string) {
    setLevel(id);
    levelsRef.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  return (
    <div className="wrap">
      <section className="guide-hero">
        <p className="eyebrow">Study guide · beyond the metro</p>
        <h1>From your first Easy to Google-level Hard</h1>
        <p className="lede">Three levels, the patterns each one needs, problems to practise them on LeetCode, Codeforces, CSES and AtCoder, and what different companies test in their rounds. Every tick here counts toward your XP and streak, same as on the metro.</p>
      </section>

      {ready && <section className="block"><ReviseBox limit={6} /></section>}

      <section className="block" id="levels" ref={levelsRef}>
        <div className="block-head"><h2>Pick your level</h2><p className="viz-note" style={{ margin: 0 }}>Start at the first level whose goal you can&apos;t meet yet.</p></div>
        <div className="levels" role="tablist" aria-label="Levels">
          {LEVELS.map((x, i) => {
            const keys = levelKeys(x), n = keys.filter(k => p.solved[k]).length;
            return (
              <button key={x.id} type="button" role="tab" id={`tab-${x.id}`} aria-controls="level-panel" aria-selected={x.id === level}
                className={`lvl l-${x.line}`} onClick={() => setLevel(x.id)}>
                <span className="lv-k"><i />Level {i + 1}</span><span className="lv-n">{x.name}</span><span className="lv-t">{x.target}</span>
                <span className="lv-bar"><span style={{ width: Math.round(n / keys.length * 100) + '%' }} /></span>
                <span className="lv-p">{n} / {keys.length} solved · {x.time}</span>
              </button>
            );
          })}
        </div>
        <div role="tabpanel" id="level-panel" aria-labelledby={`tab-${L.id}`} className={`panel l-${L.line}`}><LevelPanel L={L} /></div>
      </section>

      <section className="block">
        <div className="block-head"><h2>Company question sets</h2></div>
        <p className="viz-note" style={{ maxWidth: '70ch', margin: '0 0 14px' }}>What each kind of company tends to test, and real problems in the style of its rounds. Pick the companies you are targeting and finish their sets after their level.</p>
        <div className="ctabs" role="tablist" aria-label="Company types">
          {COMPANIES.map(x => (
            <button key={x.id} type="button" role="tab" id={`ctab-${x.id}`} aria-controls="company-panel" aria-selected={x.id === company} onClick={() => setCompany(x.id)}>{x.name}</button>
          ))}
        </div>
        <div role="tabpanel" id="company-panel" aria-labelledby={`ctab-${c.id}`} className={`panel l-${cL.line}`}>
          <div><h3 className="panel-h">{c.name}</h3>{c.sub && <p className="viz-note" style={{ margin: '4px 0 0' }}>{c.sub}</p>}</div>
          <div className="facts">
            <Fact title="How the rounds usually go" wide>{c.rounds}</Fact>
            <Fact title="Aim for"><p>{c.diff}. Prepare through <button type="button" className="linkbtn" onClick={() => jumpToLevel(c.level)}>Level {ci + 1}: {cL.name}</button>.</p></Fact>
          </div>
          <div><h4 className="sub-h">What they focus on</h4><div className="tchips">{c.focus.map(f => <span key={f}>{f}</span>)}</div></div>
          <ProblemGroup title={c.listTitle || 'Commonly reported problems to practise'} problems={c.probs} />
          <p className="disclaim">{DISCLAIM}</p>
        </div>
      </section>

      <section className="block">
        <div className="block-head"><h2>Season plan to placements</h2></div>
        <p className="viz-note" style={{ maxWidth: '70ch', margin: '0 0 18px' }}>Campus placements in India usually start around July or August of final year. Check your college&apos;s calendar and pull this plan earlier if your drives start sooner.</p>
        <ol className="timeline">
          {PLAN.map(s => <li key={s.title} className={`l-${s.line}`}><span className="when">{s.when}</span><b>{s.title}</b><p>{s.text}</p></li>)}
        </ol>
        <h3 className="panel-h" style={{ margin: '8px 0 4px' }}>A normal week</h3>
        <div className="rules three">{RHYTHM.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>
      </section>

      <section className="block">
        <div className="block-head"><h2>How to practise</h2></div>
        <div className="rules three">{HABITS.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>
      </section>

      <section className="block">
        <div className="block-head"><h2>Where to practise</h2></div>
        <div className="tbl-scroll">
          <table className="tbl res">
            <thead><tr><th>Site</th><th>Use it for</th><th>Level</th></tr></thead>
            <tbody>
              {RESOURCES.map(([name, url, use, lvl]) => (
                <tr key={name}><td><a href={url} target="_blank" rel="noopener">{name}</a></td><td>{use}</td><td style={{ whiteSpace: 'nowrap' }}>{lvl}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
