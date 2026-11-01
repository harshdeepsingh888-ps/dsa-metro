'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cx } from '@/lib/format';
import { DRILL_TITLES } from '@/lib/practice';
import { LINES, STATIONS, stationById } from '@/lib/stations';
import type { LineId } from '@/lib/types';
import { Drill } from './practice';
import { SpotTechnique } from './practice/SpotTechnique';
import { useProgress } from './ProgressProvider';
import { Viz } from './viz';

export function PracticeHub() {
  const { p, ready } = useProgress();
  const [topic, setTopic] = useState('two-pointers');
  const st = stationById(topic)!;
  const title = DRILL_TITLES[st.id] || st.vizTitle;
  return (
    <div className="wrap">
      <section className="guide-hero">
        <p className="eyebrow">Practice</p>
        <h1>Run the algorithm yourself</h1>
        <p className="lede">Watching an algorithm is not the same as running it. Here you make every decision it makes: which pointer moves, which half to search, what goes on the stack, which node comes next. Right answers on the first try earn XP.</p>
      </section>

      <section className="block">
        <div className="block-head"><h2>Spot the technique</h2></div>
        <p className="viz-note" style={{ maxWidth: '70ch', margin: '0 0 14px' }}>The first skill an interview tests: read a problem and name the technique. Ten problems a round from twenty, across every topic. +5 XP for each one you get right the first time.</p>
        <SpotTechnique />
      </section>

      <section className="block">
        <div className="block-head"><h2>Practise by topic</h2></div>
        <div className="topics" role="tablist" aria-label="Topics">
          {(Object.keys(LINES) as LineId[]).map(l => (
            <div key={l} className={`topic-line l-${l}`}>
              <span className="topic-lab">{LINES[l].name}</span>
              {STATIONS.filter(x => x.line === l).map(x => (
                <button key={x.id} type="button" role="tab" aria-selected={x.id === topic} aria-controls="topic-panel"
                  className={cx('topic', ready && p.predict[x.id] && 'played')} onClick={() => setTopic(x.id)}>
                  <i />{x.short}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div id="topic-panel" role="tabpanel" className={`topic-panel l-${st.line}`}>
          <div className="block-head" style={{ marginBottom: 12 }}>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>{st.name}</p>
              <h3 className="panel-h">{title}</h3>
            </div>
            <Link className="btn small" href={`/stations/${st.id}/`}>Open the station →</Link>
          </div>
          {DRILL_TITLES[st.id] ? <Drill key={st.id} stationId={st.id} /> : <Viz key={st.id} kind={st.viz} stationId={st.id} />}
        </div>
      </section>
    </div>
  );
}
