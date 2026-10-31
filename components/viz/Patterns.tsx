'use client';

import { useState } from 'react';
import { cx, shuffle } from '@/lib/format';
import type { VizProps } from '.';
import { useProgress } from '../ProgressProvider';

const FAM = ['1D line', 'Unbounded choice', 'Grid', 'Two strings', 'Take or skip'];
const PROBS = [
  { q: 'Minimum cost to climb stairs when each step has a cost to stand on it.', a: 0, why: 'The cost to reach step i depends on steps i−1 and i−2, just like Climbing Stairs.' },
  { q: 'Number of ways to make ₹50 from ₹1, ₹2 and ₹5 coins, using each coin as often as you like.', a: 1, why: 'Coins repeat, so it is Coin Change style: an unbounded choice.' },
  { q: 'Smallest sum along a path from the top-left to the bottom-right of a number grid, moving right or down.', a: 2, why: 'Each cell comes from above or from the left, just like Grid Paths.' },
  { q: 'Fewest edits (insert, delete, replace) to turn "horse" into "ros".', a: 3, why: 'Two strings, one along each side of a 2D table. This is Edit Distance.' },
  { q: 'Can [1, 5, 11, 5] be split into two groups with equal sums?', a: 4, why: 'Each number is in the subset or not: take or skip, like knapsack.' },
  { q: 'Most money from houses arranged in a circle, never robbing two neighbours.', a: 0, why: 'House Robber on a line, run twice: once without the first house, once without the last.' },
  { q: 'Fewest perfect squares (1, 4, 9, …) that add up to 12.', a: 1, why: 'Squares can repeat, exactly like coins.' },
  { q: 'Length of the longest palindromic subsequence of a string.', a: 3, why: 'Compare the string with its own reverse: LCS on two strings.' },
  { q: 'Number of routes through a field that avoid rocks, moving right or down.', a: 2, why: 'Grid Paths with blocked cells.' },
  { q: 'Pick tasks, each with hours and a reward, to earn the most within 8 hours. Each task can be done once.', a: 4, why: 'Weights (hours), values (reward), a capacity, each item once: 0/1 knapsack.' },
];

const newOrder = () => shuffle(PROBS.map((_, i) => i));

export default function Patterns({ stationId }: VizProps) {
  const { p, gain } = useProgress();
  const [order, setOrder] = useState(newOrder);
  const [k, setK] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [pick, setPick] = useState<number | null>(null);

  function restart() { setOrder(newOrder()); setK(0); setScore(0); setCombo(0); setPick(null); }

  if (k >= order.length) {
    return (
      <>
        <p className="viz-note">Ten problems you haven&apos;t solved yet. Which DP family is each one?</p>
        <div className="pg-card">
          <div className="pg-top"><span>Result</span><span>{score} / {order.length}</span></div>
          <p className="pg-q">{score >= 8 ? 'You can spot DP patterns. Pick any problem from "Try next" in the table above and solve it with the recipe.'
            : score >= 5 ? 'Good start. Re-read the family table above, then play once more.'
              : 'Read the family table above once more, then try again. It clicks faster than you think.'}</p>
          <div className="controls"><button type="button" className="btn small primary" onClick={restart}>Play again</button></div>
        </div>
      </>
    );
  }

  const pi = order[k], prob = PROBS[pi];
  function answer(fi: number) {
    if (pick !== null) return;
    setPick(fi);
    if (fi === prob.a) {
      setScore(s => s + 1); setCombo(c => c + 1);
      const key = `${stationId}:g${pi}`;
      if (!p.quiz[key]) gain(d => { d.quiz[key] = 1; });
    } else setCombo(0);
  }
  function next() { setK(x => x + 1); setPick(null); }

  return (
    <>
      <p className="viz-note">Ten problems you haven&apos;t solved yet. Which DP family is each one? +5 XP for each first-time correct answer.</p>
      <div className="pg-card">
        <div className="pg-top"><span>Problem {k + 1} of {order.length}</span><span>Score {score}</span></div>
        <p className="pg-q">{prob.q}</p>
        <div className="pg-opts">
          {FAM.map((f, fi) => (
            <button key={f} type="button" disabled={pick !== null} onClick={() => answer(fi)}
              className={cx('opt', pick !== null && fi === prob.a && 'right', pick !== null && fi === pick && fi !== prob.a && 'wrong')}>{f}</button>
          ))}
        </div>
        {pick !== null && (
          <>
            <p className="why">
              <strong>{pick === prob.a ? `Correct${combo >= 3 ? ` · combo ×${combo}` : ''}.` : `It is ${FAM[prob.a]}.`}</strong> {prob.why}
            </p>
            <div className="controls" style={{ marginTop: 12 }}>
              <button type="button" className="btn small primary" onClick={next} autoFocus>{k === order.length - 1 ? 'See result' : 'Next problem →'}</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
