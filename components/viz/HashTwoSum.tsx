'use client';

import { useMemo, useState } from 'react';
import { cx } from '@/lib/format';
import { useStepper } from './useStepper';

const NUMS = [4, 11, 7, 3, 9, 2];
type Frame = { i: number; j?: number; map: [number, number][]; msg: string; found?: boolean; none?: boolean };

function frames(target: number): Frame[] {
  const fr: Frame[] = [{ i: -1, map: [], msg: 'Scan left to right. For each x, ask the map: have I seen target − x?' }];
  const map: [number, number][] = [];
  for (let i = 0; i < NUMS.length; i++) {
    const x = NUMS[i], need = target - x;
    const hit = map.find(([v]) => v === need);
    if (hit) { fr.push({ i, j: hit[1], found: true, map: map.slice(), msg: `${need} is in the map at index ${hit[1]}. Answer: [${hit[1]}, ${i}], found in one pass.` }); return fr; }
    map.push([x, i]);
    fr.push({ i, map: map.slice(), msg: `${need} is not in the map yet. Store ${x} → ${i} and move on.` });
  }
  fr.push({ i: NUMS.length, map: map.slice(), none: true, msg: `Reached the end. No two numbers add up to ${target}.` });
  return fr;
}

export default function HashTwoSum() {
  const [target, setTarget] = useState(13);
  const fr = useMemo(() => frames(target), [target]);
  const { frame: f, controls } = useStepper(fr, 1300);
  return (
    <>
      <div className="setup">
        <label htmlFor="hs-target">Target</label>
        <select id="hs-target" value={target} onChange={e => setTarget(Number(e.target.value))}>
          {[13, 10, 20, 100].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className="viz-note">nums = [{NUMS.join(', ')}]</span>
      </div>
      <div className="hash-wrap">
        <div>
          <div className="arr">
            {NUMS.map((v, k) => (
              <div key={k} className={cx('cell', k === f.i && (f.found ? 'hit' : 'on'), f.found && k === f.j && 'hit', f.i >= 0 && k > f.i && 'gone')}>
                <div className="box">{v}</div><div className="ix">{k}</div><div className="ptr">{k === f.i ? 'i' : ''}</div>
              </div>
            ))}
          </div>
          <p className="need">{f.i >= 0 && f.i < NUMS.length ? `x = ${NUMS[f.i]}, need = ${target} − ${NUMS[f.i]} = ${target - NUMS[f.i]}` : ''}</p>
        </div>
        <div>
          <p className="stack-label">Hash map: seen</p>
          <table className="maptbl">
            <thead><tr><th>value</th><th>index</th></tr></thead>
            <tbody>
              {!f.map.length && <tr><td colSpan={2}><em>empty</em></td></tr>}
              {f.map.map(([v, k]) => <tr key={k} className={cx(f.found && k === f.j && 'hit')}><td>{v}</td><td>{k}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <p className={cx('msg', f.found && 'good', f.none && 'bad')}>{f.msg}</p>
      {controls}
    </>
  );
}
