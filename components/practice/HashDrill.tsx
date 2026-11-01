'use client';

import { cx } from '@/lib/format';
import { DrillPanel, useDrill, XP_NOTE, type DrillPlan, type DrillStep } from './useDrill';

const PRESETS: [number[], number][] = [[[5, 1, 8, 3, 6], 9], [[2, 9, 4, 12, 7], 16], [[3, 8, 5, 10], 4], [[4, 11, 7, 3, 9, 2], 13]];
type F = { nums: number[]; target: number; i: number; map: [number, number][]; hit?: number; needShown: boolean };

let round = 0;
function plan(): DrillPlan<F> {
  const [nums, target] = PRESETS[round++ % PRESETS.length];
  const steps: DrillStep<F>[] = [], map: [number, number][] = [];
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i], need = target - x;
    const opts = [...new Set([need, target + x, x - target])].sort((a, b) => a - b);
    steps.push({ frame: { nums, target, i, map: map.slice(), needShown: false }, prompt: <>x = <b>{x}</b>. Which number do you need to look for?</>,
      options: opts.map(String), answer: opts.indexOf(need), why: `need = target − x = ${target} − ${x} = ${need}.`, hint: 'You want x + need = target.' });
    const seen = map.find(([v]) => v === need);
    steps.push({ frame: { nums, target, i, map: map.slice(), needShown: true }, prompt: <>Is <b>{need}</b> in the map?</>,
      options: ['Yes: the pair is found', `No: store ${x} → ${i} and move on`], answer: seen ? 0 : 1,
      why: seen ? `${need} was stored at index ${seen[1]}, so the answer is [${seen[1]}, ${i}].` : `${need} isn't stored yet. Remember ${x} at index ${i} for later.`,
      hint: 'Check the value column of the map.' });
    if (seen) return { steps, end: { nums, target, i, map: map.slice(), hit: seen[1], needShown: true } };
    map.push([x, i]);
  }
  steps.push({ frame: { nums, target, i: nums.length, map: map.slice(), needShown: false }, prompt: 'You reached the end of the array. What do you return?',
    options: ['No pair: an empty result', 'The last two indexes', 'The first two indexes'], answer: 0, why: `No two numbers add up to ${target}.` });
  return { steps, end: { nums, target, i: nums.length, map: map.slice(), needShown: false } };
}

export default function HashDrill({ stationId }: { stationId: string }) {
  const d = useDrill(stationId, plan);
  const f = d.frame, x = f.nums[f.i];
  return (
    <>
      <p className="viz-note">Run Two Sum with a hash map yourself. Target: <b>{f.target}</b>. {XP_NOTE}</p>
      <div className="hash-wrap">
        <div>
          <div className="arr">
            {f.nums.map((v, k) => (
              <div key={k} className={cx('cell', k === f.i && (f.hit != null ? 'hit' : 'on'), k === f.hit && 'hit', k > f.i && 'gone')}>
                <div className="box">{v}</div><div className="ix">{k}</div><div className="ptr">{k === f.i ? 'i' : ''}</div>
              </div>
            ))}
          </div>
          <p className="need">{f.needShown && x != null ? `x = ${x}, need = ${f.target - x}` : ''}</p>
        </div>
        <div>
          <p className="stack-label">Hash map: seen</p>
          <table className="maptbl">
            <thead><tr><th>value</th><th>index</th></tr></thead>
            <tbody>
              {!f.map.length && <tr><td colSpan={2}><em>empty</em></td></tr>}
              {f.map.map(([v, k]) => <tr key={k} className={cx(k === f.hit && 'hit')}><td>{v}</td><td>{k}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <DrillPanel d={d} doneText="Done." againLabel="Next array" />
    </>
  );
}
