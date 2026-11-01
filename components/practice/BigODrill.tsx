'use client';

import { shuffle } from '@/lib/format';
import type { Lang } from '@/lib/types';
import { useProgress } from '../ProgressProvider';
import { DrillPanel, Snippet, useDrill, XP_NOTE, type DrillPlan } from './useDrill';

const OPTS = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'];
const SNIPS: (Record<Lang, string> & { a: number; why: string })[] = [
  { a: 0, cpp: 'int x = a[0] + a[n - 1];\nint y = x * 2;', py: 'x = a[0] + a[n - 1]\ny = x * 2',
    why: 'A fixed number of steps and no loop. It takes the same time for any n.' },
  { a: 4, cpp: 'for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        cnt += a[i] * a[j];', py: 'for i in range(n):\n    for j in range(n):\n        cnt += a[i] * a[j]',
    why: 'The outer loop runs n times, and each time the inner loop runs n times: n × n.' },
  { a: 1, cpp: 'int steps = 0;\nfor (int i = n; i > 1; i /= 2)\n    steps++;', py: 'steps, i = 0, n\nwhile i > 1:\n    i //= 2\n    steps += 1',
    why: 'i halves every time, so the loop runs about log₂ n times.' },
  { a: 3, cpp: 'sort(a.begin(), a.end());\nfor (int i = 0; i < n; i++)\n    total += a[i];', py: 'a.sort()\nfor x in a:\n    total += x',
    why: 'Sorting costs O(n log n). The loop adds O(n), which is smaller, so the total is O(n log n).' },
  { a: 2, cpp: 'for (int i = 0; i < n; i++)\n    for (int j = 0; j < 5; j++)\n        cnt++;', py: 'for i in range(n):\n    for j in range(5):\n        cnt += 1',
    why: 'The inner loop always runs 5 times, a constant. 5 × n is still O(n).' },
  { a: 5, cpp: 'int f(int n) {\n    if (n == 0) return 1;\n    return f(n - 1) + f(n - 1);\n}', py: 'def f(n):\n    if n == 0:\n        return 1\n    return f(n - 1) + f(n - 1)',
    why: 'Every call makes two more calls, so the number of calls doubles at each level: about 2ⁿ.' },
  { a: 3, cpp: 'for (int i = 1; i < n; i *= 2)\n    for (int j = 0; j < n; j++)\n        cnt++;', py: 'i = 1\nwhile i < n:\n    for j in range(n):\n        cnt += 1\n    i *= 2',
    why: 'The outer loop doubles i, so it runs log n times, and each time the inner loop runs n times.' },
  { a: 4, cpp: 'for (int i = 0; i < n; i++)\n    for (int j = i + 1; j < n; j++)\n        if (a[i] == a[j]) dup = true;', py: 'for i in range(n):\n    for j in range(i + 1, n):\n        if a[i] == a[j]:\n            dup = True',
    why: 'j starts at i + 1, so it checks about n²/2 pairs. Dropping the constant ½ leaves O(n²).' },
  { a: 2, cpp: 'unordered_set<int> seen;\nfor (int x : a) {\n    if (seen.count(x)) dup = true;\n    seen.insert(x);\n}', py: 'seen = set()\nfor x in a:\n    if x in seen:\n        dup = True\n    seen.add(x)',
    why: 'One pass over the array, and each hash set lookup or insert is O(1) on average.' },
  { a: 1, cpp: 'int lo = 0, hi = n - 1;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] == t) break;\n    if (a[mid] < t) lo = mid + 1;\n    else hi = mid - 1;\n}', py: 'lo, hi = 0, n - 1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if a[mid] == t:\n        break\n    if a[mid] < t:\n        lo = mid + 1\n    else:\n        hi = mid - 1',
    why: 'Each pass halves the range between lo and hi. This is binary search: O(log n).' },
];

const plan = (): DrillPlan<number> => ({
  steps: shuffle(SNIPS.map((_, i) => i)).map(i => ({
    frame: i, prompt: 'What is the time complexity of this code?', options: OPTS, answer: SNIPS[i].a, why: SNIPS[i].why,
    hint: 'Count how many times the innermost line runs as n grows. Ignore constants.',
  })),
  end: -1,
});

export default function BigODrill({ stationId }: { stationId: string }) {
  const { p } = useProgress();
  const d = useDrill(stationId, plan);
  return (
    <>
      <p className="viz-note">Read each snippet and pick its time complexity. n is the size of the input. {XP_NOTE}</p>
      {!d.done && <Snippet code={SNIPS[d.frame][p.lang]} lang={p.lang} />}
      <DrillPanel d={d} doneText="That was all 10 snippets." />
    </>
  );
}
