'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { VizKey } from '@/lib/types';

export type VizProps = { stationId: string };

// Demos run only in the browser (they animate and use randomness), and each station loads just its own.
const loading = () => <p className="viz-note">Loading the demo…</p>;
const VIZ: Record<VizKey, ComponentType<VizProps>> = {
  bigO: dynamic(() => import('./BigO'), { ssr: false, loading }),
  twoPointers: dynamic(() => import('./TwoPointers'), { ssr: false, loading }),
  recursion: dynamic(() => import('./Recursion'), { ssr: false, loading }),
  guess: dynamic(() => import('./Guess'), { ssr: false, loading }),
  sortRace: dynamic(() => import('./SortRace'), { ssr: false, loading }),
  brackets: dynamic(() => import('./Brackets'), { ssr: false, loading }),
  hash: dynamic(() => import('./HashTwoSum'), { ssr: false, loading }),
  linked: dynamic(() => import('./LinkedReverse'), { ssr: false, loading }),
  tree: dynamic(() => import('./TreeTraversal'), { ssr: false, loading }),
  maze: dynamic(() => import('./Maze'), { ssr: false, loading }),
  fib: dynamic(() => import('./FibTree'), { ssr: false, loading }),
  stairs: dynamic(() => import('./dp/Stairs'), { ssr: false, loading }),
  robber: dynamic(() => import('./dp/Robber'), { ssr: false, loading }),
  coins: dynamic(() => import('./dp/Coins'), { ssr: false, loading }),
  gridPaths: dynamic(() => import('./dp/GridPaths'), { ssr: false, loading }),
  lcs: dynamic(() => import('./dp/LCS'), { ssr: false, loading }),
  knapsack: dynamic(() => import('./dp/Knapsack'), { ssr: false, loading }),
  patterns: dynamic(() => import('./Patterns'), { ssr: false, loading }),
};

export function Viz({ kind, stationId }: { kind: VizKey; stationId: string }) {
  const Demo = VIZ[kind];
  return <div className="viz"><Demo stationId={stationId} /></div>;
}
