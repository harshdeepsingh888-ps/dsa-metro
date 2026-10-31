export type LineId = 'yellow' | 'blue' | 'red' | 'magenta';
export type Lang = 'cpp' | 'py';

export type VizKey =
  | 'bigO' | 'twoPointers' | 'recursion'
  | 'guess' | 'sortRace' | 'brackets' | 'hash' | 'linked'
  | 'tree' | 'maze'
  | 'fib' | 'stairs' | 'robber' | 'coins' | 'gridPaths' | 'lcs' | 'knapsack' | 'patterns';

export type QuizQuestion = { q: string; opts: string[]; a: number; why: string };

export type Station = {
  id: string;
  line: LineId;
  name: string;
  short: string;
  mins: number;
  story: string;
  /** Trusted HTML written for this site. */
  idea: string;
  vizTitle: string;
  viz: VizKey;
  code: Record<Lang, string>;
  quiz: QuizQuestion[];
  practice: { t: string; s: string; d: string }[];
};

/** [x, y, label position]: a = above, b = below, l = left */
export type MapPos = [number, number, 'a' | 'b' | 'l'];

/** One practice problem on any judge. `key` is how progress remembers it. */
export type Problem = { key: string; t: string; d: string; src: string; url: string };

export type Level = {
  id: string;
  line: LineId;
  name: string;
  target: string;
  time: string;
  forWho: string;
  goal: string;
  ready: string;
  topics: string[];
  groups: [string, Problem[]][];
  extra: [string, Problem[]][];
  milestones: string[];
};

export type Company = {
  id: string;
  name: string;
  sub?: string;
  level: string;
  diff: string;
  listTitle?: string;
  rounds: string;
  focus: string[];
  probs: Problem[];
};

export type PlanStep = { line: LineId; when: string; title: string; text: string };
