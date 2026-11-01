'use client';

import { useState } from 'react';
import { cx, shuffle } from '@/lib/format';
import { useProgress } from '../ProgressProvider';

const FAM = ['Two pointers', 'Sliding window', 'Binary search', 'Hash map', 'Stack', 'Heap', 'BFS / DFS', 'Backtracking', 'Dynamic programming'];
const QS = [
  { q: 'Longest substring with no repeating characters.', a: 1, why: 'Grow a window to the right and shrink it from the left whenever a character repeats.' },
  { q: 'In a sorted array, find two numbers that add up to a target, using O(1) extra space.', a: 0, why: 'One pointer at each end; move the one that brings the sum closer.' },
  { q: 'The smallest eating speed that lets Koko finish all the bananas within h hours.', a: 2, why: 'If a speed works, every faster speed works too, so binary search for the first speed that works.' },
  { q: 'Group words that are anagrams of each other.', a: 3, why: 'Key: the sorted letters of a word. Value: the list of words with that key.' },
  { q: 'For each day, how many days until a warmer temperature?', a: 4, why: 'Keep a stack of days still waiting for a warmer one, and pop them when it arrives (a monotonic stack).' },
  { q: 'Return the k most frequent elements.', a: 5, why: 'Count with a hash map, then keep the top k in a min-heap of size k.' },
  { q: 'Fewest moves for a knight to reach a square on a chessboard.', a: 6, why: 'Every move costs 1, so BFS from the start finds the fewest moves.' },
  { q: 'Number of ways to decode a digit string like "226" into letters.', a: 8, why: 'ways(i) depends on ways(i−1) and ways(i−2), just like Climbing Stairs.' },
  { q: 'Maximum sum of any k consecutive elements.', a: 1, why: 'Slide a window of size k: add the new element and drop the old one.' },
  { q: 'Is a string a palindrome if you ignore everything except letters?', a: 0, why: 'Compare from both ends and move inwards, skipping non-letters.' },
  { q: 'First and last position of a target in a sorted array.', a: 2, why: 'Two binary searches: one for the first position, one for the last.' },
  { q: 'Does the array contain any duplicate?', a: 3, why: 'A hash set remembers what you have seen in one pass.' },
  { q: 'Evaluate an expression in Reverse Polish Notation, like 2 1 + 3 *.', a: 4, why: 'Push numbers; on an operator, pop two, apply it, push the result.' },
  { q: 'Merge k sorted linked lists into one sorted list.', a: 5, why: 'Keep the current head of every list in a min-heap and always take the smallest.' },
  { q: 'Count the islands of 1s in a grid.', a: 6, why: 'Each unvisited 1 starts a BFS or DFS that marks its whole island.' },
  { q: 'Fewest coins that make an amount.', a: 8, why: 'dp[a] = 1 + the smallest dp[a − coin]: Coin Change.' },
  { q: 'Container with the most water between two vertical lines.', a: 0, why: 'Start at both ends and always move the shorter line inwards.' },
  { q: 'Generate every subset of a set.', a: 7, why: 'For each element choose "take" or "skip", recurse, then undo the choice.' },
  { q: 'Place N queens on an N×N board so that no two attack each other.', a: 7, why: 'Place one queen per row, recurse, and remove it when a row has no safe square.' },
  { q: 'Find a peak element in an array in O(log n).', a: 2, why: 'Compare mid with its neighbour and move towards the higher side.' },
];
const ROUND = 10;

/** Ten problem statements per round: name the technique for each. */
export function SpotTechnique() {
  const { p, gain } = useProgress();
  const [order, setOrder] = useState(() => shuffle(QS.map((_, i) => i)).slice(0, ROUND));
  const [k, setK] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [pick, setPick] = useState<number | null>(null);

  function restart() { setOrder(shuffle(QS.map((_, i) => i)).slice(0, ROUND)); setK(0); setScore(0); setCombo(0); setPick(null); }

  if (k >= order.length) {
    return (
      <div className="pg-card">
        <div className="pg-top"><span>Result</span><span>{score} / {order.length}</span></div>
        <p className="pg-q">{score >= 8 ? 'Strong pattern sense. This is the skill interviews test first.' : score >= 5 ? 'Getting there. Each wrong answer had a one-line reason; play again and they will stick.' : 'Keep at it. Spotting the technique gets faster with every round.'}</p>
        <div className="controls"><button type="button" className="btn small primary" onClick={restart}>New round</button></div>
      </div>
    );
  }

  const qi = order[k], q = QS[qi];
  function answer(fi: number) {
    if (pick !== null) return;
    setPick(fi);
    if (fi === q.a) {
      setScore(s => s + 1); setCombo(c => c + 1);
      const key = `practice:tech:${qi}`;
      if (!p.quiz[key]) gain(d => { d.quiz[key] = 1; });
    } else setCombo(0);
  }

  return (
    <div className="pg-card">
      <div className="pg-top">
        <span>Problem {k + 1} of {order.length}</span>
        {combo >= 2 && <span key={combo} className="combo bump">Combo ×{combo}</span>}
        <span>Score {score}</span>
      </div>
      <p className="pg-q">{q.q}</p>
      <div className="pg-opts">
        {FAM.map((f, fi) => (
          <button key={f} type="button" disabled={pick !== null} onClick={() => answer(fi)}
            className={cx('opt', pick !== null && fi === q.a && 'right', pick !== null && fi === pick && fi !== q.a && 'wrong')}>{f}</button>
        ))}
      </div>
      {pick !== null && (
        <>
          <p className="why"><strong>{pick === q.a ? 'Correct.' : `It is ${FAM[q.a]}.`}</strong> {q.why}</p>
          <div className="controls" style={{ marginTop: 12 }}>
            <button type="button" className="btn small primary" autoFocus onClick={() => { setK(x => x + 1); setPick(null); }}>{k === order.length - 1 ? 'See result' : 'Next problem →'}</button>
          </div>
        </>
      )}
    </div>
  );
}
