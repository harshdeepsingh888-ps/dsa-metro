'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { blank, loadProgress, rankOf, saveProgress, STORAGE_KEY, todayKey, xp, type Progress } from '@/lib/progress';

type Mutator = (draft: Progress) => void;
type ProgressApi = {
  /** Progress as stored. Blank until `ready`, because it lives in localStorage. */
  p: Progress;
  ready: boolean;
  /** Change progress and count today as active; shows the XP gained. */
  gain: (mutate: Mutator, label?: string) => void;
  /** Change progress without earning anything (unticking, switching language). */
  update: (mutate: Mutator) => void;
  toast: (msg: string) => void;
  xpPop: { n: number; id: number } | null;
};

const Ctx = createContext<ProgressApi | null>(null);

export function useProgress() {
  const api = useContext(Ctx);
  if (!api) throw new Error('useProgress must be used inside <ProgressProvider>');
  return api;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Progress>(blank);
  const [ready, setReady] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ msg: string; id: number } | null>(null);
  const [xpPop, setXpPop] = useState<{ n: number; id: number } | null>(null);
  // the latest progress, so several updates in one event build on each other
  const ref = useRef(p);

  useEffect(() => {
    const loaded = loadProgress();
    ref.current = loaded; setP(loaded); setReady(true);
    // keep other open tabs in step
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = loadProgress();
      ref.current = next; setP(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const commit = useCallback((next: Progress) => { ref.current = next; setP(next); saveProgress(next); }, []);
  const toast = useCallback((msg: string) => setToastMsg({ msg, id: Date.now() }), []);

  const update = useCallback((mutate: Mutator) => {
    const next = structuredClone(ref.current);
    mutate(next);
    commit(next);
  }, [commit]);

  const gain = useCallback((mutate: Mutator, label?: string) => {
    const before = xp(ref.current), rankBefore = rankOf(before).name;
    const next = structuredClone(ref.current);
    mutate(next);
    next.days[todayKey()] = 1;
    commit(next);
    const after = xp(next);
    if (after > before) setXpPop({ n: after - before, id: Date.now() });
    const rankAfter = rankOf(after).name;
    if (rankAfter !== rankBefore) toast('New rank: ' + rankAfter);
    else if (label && after > before) toast(label);
  }, [commit, toast]);

  return (
    <Ctx.Provider value={{ p, ready, gain, update, toast, xpPop }}>
      {children}
      {toastMsg && <div key={toastMsg.id} className="toast show" role="status">{toastMsg.msg}</div>}
    </Ctx.Provider>
  );
}
