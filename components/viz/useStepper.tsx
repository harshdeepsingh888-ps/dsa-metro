'use client';

import { useEffect, useState } from 'react';

/** Step through precomputed frames with Back / Play / Step / Reset. Pass a memoised array. */
export function useStepper<F>(frames: F[], ms = 1100) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = frames.length - 1;

  useEffect(() => { setI(0); setPlaying(false); }, [frames]);
  useEffect(() => {
    if (!playing) return;
    if (i >= last) { setPlaying(false); return; }
    const t = setTimeout(() => setI(x => x + 1), ms);
    return () => clearTimeout(t);
  }, [playing, i, last, ms]);

  const at = Math.min(i, last);
  const controls = (
    <div className="controls">
      <button type="button" className="btn small" disabled={at === 0} onClick={() => { setPlaying(false); setI(Math.max(0, at - 1)); }}>← Back</button>
      <button type="button" className="btn small primary" onClick={() => { if (!playing && at >= last) setI(0); setPlaying(!playing); }}>{playing ? 'Pause' : 'Play'}</button>
      <button type="button" className="btn small" disabled={at >= last} onClick={() => { setPlaying(false); setI(Math.min(last, at + 1)); }}>Step →</button>
      <button type="button" className="btn small ghost" onClick={() => { setPlaying(false); setI(0); }}>Reset</button>
      <span className="step-count">Step {at + 1} of {frames.length}</span>
    </div>
  );
  return { i: at, frame: frames[at], controls };
}
