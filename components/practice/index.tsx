'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

type DrillProps = { stationId: string };
const loading = () => <p className="viz-note">Loading the drill…</p>;

// keyed by station id; each drill loads only where it is shown
const DRILLS: Record<string, ComponentType<DrillProps>> = {
  'big-o': dynamic(() => import('./BigODrill'), { ssr: false, loading }),
  'two-pointers': dynamic(() => import('./TwoPointersDrill'), { ssr: false, loading }),
  'recursion': dynamic(() => import('./RecursionDrill'), { ssr: false, loading }),
  'binary-search': dynamic(() => import('./BinarySearchDrill'), { ssr: false, loading }),
  'sorting': dynamic(() => import('./MergeDrill'), { ssr: false, loading }),
  'stacks-queues': dynamic(() => import('./BracketsDrill'), { ssr: false, loading }),
  'hashing': dynamic(() => import('./HashDrill'), { ssr: false, loading }),
  'linked-lists': dynamic(() => import('./LinkedDrill'), { ssr: false, loading }),
  'trees': dynamic(() => import('./TreeDrill'), { ssr: false, loading }),
  'graphs': dynamic(() => import('./GraphDrill'), { ssr: false, loading }),
  'fibonacci': dynamic(() => import('./FibDrill'), { ssr: false, loading }),
};

export const hasDrill = (stationId: string) => stationId in DRILLS;

export function Drill({ stationId }: DrillProps) {
  const C = DRILLS[stationId];
  return C ? <div className="viz"><C stationId={stationId} /></div> : null;
}
