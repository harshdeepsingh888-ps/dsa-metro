'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cx } from '@/lib/format';
import { LEVELS } from '@/lib/guide';
import { levelKeys } from '@/lib/problems';
import { dayKey, doneCount, eta, inr, nextRank, nextStation, rankOf, streak, todayKey, xp, type Progress } from '@/lib/progress';
import { INTERCHANGES, LINES, MAPPOS, STATIONS, stationCode } from '@/lib/stations';
import type { LineId } from '@/lib/types';
import { ReviseBox } from './Problems';
import { useProgress } from './ProgressProvider';

const TRACKS: Record<LineId, string> = { yellow: 'M90 90 H330', blue: 'M330 90 L430 190 H890', red: 'M890 190 V390', magenta: 'M890 390 L820 460 H90' };

function MetroMap({ p }: { p: Progress }) {
  const nx = nextStation(p);
  return (
    <svg viewBox="0 0 1000 520" className="metro-map" role="img" aria-label="Route map with 18 stations on 4 lines">
      <path d="M330 106 V 440" className="lane" />
      <text x="344" y="332" className="lane-label">recursion + memory = DP</text>
      {(Object.keys(TRACKS) as LineId[]).map(l => <path key={l} d={TRACKS[l]} className={`track l-${l}`} />)}
      {STATIONS.map(st => {
        const [x, y, pos] = MAPPOS[st.id];
        const inter = INTERCHANGES.includes(st.id), term = st.id === 'dp-recipe', done = !!p.stations[st.id], isNext = nx?.id === st.id;
        let tx = x, ty = y - 24, anchor: 'middle' | 'end' = 'middle';
        if (pos === 'b') ty = y + 36;
        if (pos === 'l') { tx = x - 24; ty = y + 6; anchor = 'end'; }
        if (term) ty = y + 42;
        return (
          <Link key={st.id} href={`/stations/${st.id}/`} className={cx('stn', `l-${st.line}`, done && 'done')}
            aria-label={st.name + (done ? ', done' : isNext ? ', next station' : '')}>
            {isNext && <circle cx={x} cy={y} r={22} className="pulse" />}
            <circle cx={x} cy={y} r={term ? 17 : inter ? 13 : 11} className={cx('dot', inter && 'inter')} style={term ? { strokeWidth: 6 } : undefined} />
            {done && <path d={`M${x - 5} ${y} l3.5 3.5 l6.5 -7`} className="tick" />}
            <text x={tx} y={ty} textAnchor={anchor} className={term ? 'term' : undefined}>{st.short}</text>
          </Link>
        );
      })}
    </svg>
  );
}

function MetroCard({ p, ready }: { p: Progress; ready: boolean }) {
  const x = xp(p), r = rankOf(x), nr = nextRank(x), st = streak(p), solved = Object.keys(p.solved).length;
  const pct = nr ? Math.round((x - r.min) / (nr.min - r.min) * 100) : 100;
  const days = ready ? Array.from({ length: 14 }, (_, k) => { const d = new Date(); d.setDate(d.getDate() - (13 - k)); return d; }) : [];
  const arrive = ready ? eta(p) : null;
  return (
    <div className="mcard">
      <div className="mstripes">{(['yellow', 'blue', 'red', 'magenta'] as const).map(l => <span key={l} className={`l-${l}`} />)}</div>
      <div className="mc-top"><span className="mc-brand">DSA Metro card</span><span className="mc-rank">{r.name}</span></div>
      <div className="mc-bal"><span className="mc-num">{ready ? inr(x) : '–'}</span><span className="mc-unit">XP</span></div>
      <div className="mc-next">{nr ? `${nr.min - x} XP to ${nr.name}` : 'Top rank reached'}</div>
      <div className="mc-bar"><span style={{ width: pct + '%' }} /></div>
      <dl className="mc-stats">
        <div><dt>Stations</dt><dd>{doneCount(p)}/{STATIONS.length}</dd></div>
        <div><dt>Streak</dt><dd>{st} {st === 1 ? 'day' : 'days'}</dd></div>
        <div><dt>Solved</dt><dd>{solved}</dd></div>
      </dl>
      <div className="mc-punch-label">Last 14 days</div>
      <div className="punch" aria-label="Active days in the last two weeks">
        {days.map((d, k) => {
          const key = dayKey(d);
          return <i key={key} className={cx(p.days[key] && 'on', k === 13 && 'today')} title={d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + (p.days[key] ? ': rode' : '')} />;
        })}
      </div>
      {ready && (arrive
        ? <p className="mc-eta">One station a day gets you to DP Terminus on <b>{arrive}</b>.</p>
        : <p className="mc-eta"><b>You reached DP Terminus.</b> Keep solving problems to stay sharp.</p>)}
      {ready && <p className="mc-today">{p.days[todayKey()] ? 'Today\'s ride: done. Your streak is safe.' : 'No ride yet today. One quiz answer or one solved problem keeps the streak alive.'}</p>}
    </div>
  );
}

export function HomeView() {
  const { p, ready } = useProgress();
  const router = useRouter();
  const nx = nextStation(p);

  // links to the old single-page site used #station-id
  useEffect(() => {
    const id = location.hash.slice(1);
    if (id === 'guide') router.replace('/guide/');
    else if (STATIONS.some(s => s.id === id)) router.replace(`/stations/${id}/`);
  }, [router]);

  return (
    <>
      <section className="hero wrap">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Platform 1 · Towards DP Terminus</p>
            <h1>Board at Big-O.<br />Get off at <span className="dp">Dynamic Programming.</span></h1>
            <p className="lede">18 stations on 4 lines, from zero DSA to solving DP problems. Each station takes 20 to 40 minutes: a short story, something to play with, the code in C++ or Python, a quick check, and LeetCode problems to practise on.</p>
            <div className="cta-row">
              {nx
                ? <Link className={`cta l-${nx.line}`} href={`/stations/${nx.id}/`}><span className="sub">{doneCount(p) ? `Continue · station ${STATIONS.indexOf(nx) + 1} of 18` : 'Start here · station 1 of 18'}</span>{nx.name} →</Link>
                : <Link className="cta l-magenta" href="/stations/dp-recipe/"><span className="sub">All 18 stations done</span>Revisit DP Terminus →</Link>}
              <span className="cta-note">Earn XP for every quiz answer, solved problem and DP cell you fill in correctly.</span>
            </div>
          </div>
          <MetroCard p={p} ready={ready} />
        </div>
      </section>

      {ready && <section className="block wrap"><ReviseBox limit={4} /></section>}

      <section className="block wrap">
        <div className="block-head">
          <h2>Route map</h2>
          <div className="legend">{(Object.keys(LINES) as LineId[]).map(k => <span key={k} className={`l-${k}`}><i />{LINES[k].name}: {LINES[k].about}</span>)}</div>
        </div>
        <div className="map-box"><MetroMap p={p} /></div>
      </section>

      <section className="block wrap">
        <div className="block-head"><h2>After the metro</h2><Link className="btn" href="/guide/">Open the study guide →</Link></div>
        <div className="guide-promo">
          {LEVELS.map((L, i) => {
            const keys = levelKeys(L), n = keys.filter(k => p.solved[k]).length;
            return (
              <Link key={L.id} className={`lvl l-${L.line}`} href={`/guide/?level=${L.id}`}>
                <span className="lv-k"><i />Level {i + 1}</span><span className="lv-n">{L.name}</span><span className="lv-t">{L.target}</span>
                <span className="lv-bar"><span style={{ width: Math.round(n / keys.length * 100) + '%' }} /></span>
                <span className="lv-p">{n} / {keys.length} solved</span>
              </Link>
            );
          })}
        </div>
        <p className="viz-note" style={{ marginTop: 12 }}>Plus question sets in the style of Google, Amazon, Microsoft, Meta, product companies in India, quant firms and service companies, a season plan to placements, and the best practice sites.</p>
      </section>

      <section className="block wrap">
        <div className="block-head"><h2>How not to drop it halfway</h2></div>
        <div className="rules">
          <div><h3>One station a day</h3><p>About 30 minutes. Small enough to do even on a lab-heavy day.</p></div>
          <div><h3>Leave with one solve</h3><p>Reading feels like progress. Solving is progress. Tick at least one problem before you close the tab.</p></div>
          <div><h3>Never miss two days</h3><p>Missing one day happens. Missing two is how streaks die. Your card shows the last 14 days.</p></div>
          <div><h3>Revise on a schedule</h3><p>Solved problems come back after 3, 7 and 30 days. Re-solve them from scratch.</p></div>
        </div>
      </section>

      <section className="block wrap">
        <div className="block-head"><h2>Lines and stations</h2></div>
        <div className="lines">
          {(Object.keys(LINES) as LineId[]).map(l => (
            <section key={l} className={`linecard l-${l}`}>
              <header><span className="roundel-sm">{LINES[l].code}</span><div><h3>{LINES[l].name}</h3><p>{LINES[l].about}</p></div></header>
              <ol className="vstrip">
                {STATIONS.filter(x => x.line === l).map(x => (
                  <li key={x.id} className={cx(p.stations[x.id] && 'done', nx?.id === x.id && 'next')}>
                    <Link href={`/stations/${x.id}/`}><span className="code">{stationCode(x)}</span><span className="nm">{x.name}</span><span className="mins">{x.mins} min</span></Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
