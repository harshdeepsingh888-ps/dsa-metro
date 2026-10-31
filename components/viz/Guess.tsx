'use client';

import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/format';
import { inr } from '@/lib/progress';

const MAX = 1000;
type Entry = { v: number; k: 'lo' | 'hi' | 'ok' };
type Game = { lo: number; hi: number; secret: number; tries: number; over: boolean; log: Entry[]; msg: string; tone: '' | 'good' | 'bad' };

const fresh = (): Game => ({ lo: 1, hi: MAX, secret: 1 + Math.floor(Math.random() * MAX), tries: 0, over: false, log: [], msg: 'Tip: guess the middle of what is left.', tone: '' });

function play(g: Game, raw: string | number): Game {
  if (g.over) return g;
  const v = Math.round(Number(raw));
  if (!Number.isFinite(v) || v < 1 || v > MAX) return { ...g, msg: `Type a whole number from 1 to ${MAX}.`, tone: 'bad' };
  if (v < g.lo || v > g.hi) return { ...g, msg: `You already know it is between ${g.lo} and ${g.hi}. Guessing ${v} wastes a try.`, tone: '' };
  const tries = g.tries + 1;
  if (v === g.secret) {
    return { ...g, tries, over: true, lo: v, hi: v, log: [...g.log, { v, k: 'ok' }], tone: 'good',
      msg: `Found ${v} in ${tries} guess${tries === 1 ? '' : 'es'}. ${tries <= 10 ? 'That is binary search speed.' : 'Always guessing the middle never needs more than 10.'}` };
  }
  return v < g.secret
    ? { ...g, tries, lo: v + 1, log: [...g.log, { v, k: 'lo' }], tone: '', msg: `${v} is too low. Throw away everything up to ${v}.` }
    : { ...g, tries, hi: v - 1, log: [...g.log, { v, k: 'hi' }], tone: '', msg: `${v} is too high. Throw away everything from ${v} up.` };
}

export default function Guess() {
  const [g, setG] = useState(fresh);
  const [val, setVal] = useState('');
  const [auto, setAuto] = useState(false);
  const gRef = useRef(g);
  useEffect(() => { gRef.current = g; }, [g]);

  // "Let binary search play": guess the middle every 750 ms until found
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      const cur = gRef.current;
      if (cur.over) { setAuto(false); return; }
      const mid = Math.floor((cur.lo + cur.hi) / 2);
      setVal(String(mid));
      setG(play(cur, mid));
    }, 750);
    return () => clearInterval(t);
  }, [auto]);

  function guess() { setAuto(false); setG(play(g, val)); }
  function restart() { setAuto(false); setVal(''); setG(fresh()); }

  return (
    <>
      <p className="viz-note">I picked a whole number from 1 to 1000. Each guess tells you higher or lower. Can you find it in 10 guesses?</p>
      <div className="setup">
        <label htmlFor="guess-in">Your guess</label>
        <input type="number" id="guess-in" min={1} max={MAX} inputMode="numeric" placeholder="1–1000" style={{ width: '8em' }}
          value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') guess(); }} />
        <button type="button" className="btn small primary" onClick={guess}>Guess</button>
        <button type="button" className="btn small" onClick={() => { if (g.over) setG(fresh()); setAuto(true); }}>Let binary search play</button>
        <button type="button" className="btn small ghost" onClick={restart}>New number</button>
      </div>
      <div>
        <div className="gtrack">
          <div className="grange" style={{ left: ((g.lo - 1) / MAX * 100) + '%', width: ((g.hi - g.lo + 1) / MAX * 100) + '%' }} />
          {g.log.map(e => <div key={e.v} className="gmark" style={{ left: ((e.v - 0.5) / MAX * 100) + '%' }} />)}
        </div>
        <div className="gscale"><span>1</span><span>500</span><span>1000</span></div>
      </div>
      <div className="setup"><span>Numbers still possible:</span><span className="big-num">{g.over ? '1' : `${inr(g.hi - g.lo + 1)} (${g.lo} to ${g.hi})`}</span></div>
      <p className={cx('msg', g.tone)}>{g.msg}</p>
      <div className="glog">{g.log.map(e => <span key={e.v} className={e.k}>{e.v}</span>)}</div>
    </>
  );
}
