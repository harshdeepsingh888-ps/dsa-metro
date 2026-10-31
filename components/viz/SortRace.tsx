'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cx, shuffle } from '@/lib/format';

const N = 24;
type Step = { hi: number[]; c: number };
type Racer = { name: string; big: string; a: number[]; it: Generator<Step, Step>; c: number; hi: number[]; done: boolean };

function* bubble(a: number[]): Generator<Step, Step> {
  let c = 0;
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      c++;
      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swapped = true; }
      yield { hi: [j, j + 1], c };
    }
    if (!swapped) break;
  }
  return { hi: [], c };
}

function* merge(a: number[]): Generator<Step, Step> {
  let c = 0;
  const n = a.length;
  for (let w = 1; w < n; w *= 2) {
    for (let lo = 0; lo < n - w; lo += 2 * w) {
      const mid = lo + w, hi = Math.min(lo + 2 * w, n);
      const L = a.slice(lo, mid), R = a.slice(mid, hi);
      let i = 0, j = 0, k = lo;
      while (i < L.length && j < R.length) { c++; a[k++] = L[i] <= R[j] ? L[i++] : R[j++]; yield { hi: [k - 1], c }; }
      while (i < L.length) a[k++] = L[i++];
      while (j < R.length) a[k++] = R[j++];
    }
  }
  return { hi: [], c };
}

function makeRacers(): Racer[] {
  const base = shuffle(Array.from({ length: N }, (_, i) => i + 1));
  return ([['Bubble sort', 'O(n²)', bubble], ['Merge sort', 'O(n log n)', merge]] as const).map(([name, big, gen]) => {
    const a = base.slice();
    return { name, big, a, it: gen(a), c: 0, hi: [], done: false };
  });
}

export default function SortRace() {
  // the generators mutate their arrays in place, so racers live in a ref and `tick` triggers renders
  const racers = useRef<Racer[]>(makeRacers());
  const [, setTick] = useState(0);
  const [running, setRunning] = useState(false);
  const finished = racers.current.every(r => r.done);

  const step = useCallback(() => {
    for (const r of racers.current) {
      if (r.done) continue;
      const s = r.it.next();
      r.c = s.value.c; r.hi = s.done ? [] : s.value.hi;
      if (s.done) r.done = true;
    }
    setTick(t => t + 1);
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(step, 40);
    return () => clearInterval(t);
  }, [running, step]);
  useEffect(() => { if (finished) setRunning(false); }, [finished]);

  function reshuffle() { setRunning(false); racers.current = makeRacers(); setTick(t => t + 1); }
  function startOrPause() {
    if (finished) { racers.current = makeRacers(); setRunning(true); return; }
    setRunning(r => !r);
  }
  const started = racers.current.some(r => r.c > 0);
  const [bub, mer] = racers.current;

  return (
    <>
      <p className="viz-note">Both sort the same 24 numbers. Each tick is one comparison. Dark bars are the ones being compared or written.</p>
      <div className="race">
        {racers.current.map(r => (
          <div className="racer" key={r.name}>
            <h3>{r.name} · {r.big}<span>{r.c} comparisons</span></h3>
            <div className={cx('bars', r.done && 'done')}>
              {r.a.map((v, i) => <i key={i} className={cx(r.hi.includes(i) && 'hi')} style={{ height: (v / N * 100) + '%' }} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="controls">
        <button type="button" className="btn small primary" onClick={startOrPause}>{finished ? 'Race again' : running ? 'Pause' : started ? 'Resume' : 'Start race'}</button>
        <button type="button" className="btn small ghost" onClick={reshuffle}>Shuffle</button>
      </div>
      <p className={cx('msg', finished && 'good')}>
        {finished ? `Bubble sort: ${bub.c} comparisons. Merge sort: ${mer.c}. With 10⁵ numbers the gap becomes about 5 × 10⁹ against 1.7 million.` : ''}
      </p>
    </>
  );
}
