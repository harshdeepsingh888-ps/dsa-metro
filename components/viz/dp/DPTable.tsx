'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cx, fmtDP } from '@/lib/format';
import { useProgress } from '../../ProgressProvider';
import { Seg } from '../../Seg';

export type Cell = [number, number];
export type Getter = (i: number, j: number) => number;
export type DPTrace = { cells: Cell[]; msg: string; taken?: number[] };
export type DPConfig = {
  rows: number;
  cols: number;
  corner?: string;
  rowHead: (i: number) => ReactNode;
  colHead: (j: number) => ReactNode;
  /** row headers hold long labels (knapsack items) */
  wideRows?: boolean;
  /** cells known up front, shown filled from the start */
  base: (i: number, j: number) => boolean;
  baseVal: (i: number, j: number) => number;
  /** the value of a cell, the cells it reads, and a one-line explanation */
  calc: (i: number, j: number, get: Getter) => { v: number; deps: Cell[]; why: string };
  /** how the status line names a cell, e.g. "ways(4)" */
  name: (i: number, j: number) => string;
  /** shown after a wrong first guess */
  hint?: (i: number, j: number) => string;
  doneMsg?: (get: Getter) => string;
  /** cells to highlight when the table is complete, such as the chosen items */
  trace?: (get: Getter) => DPTrace;
  cellClass?: (i: number, j: number) => string;
  /** before the first cell is filled, cells can be clicked to change the setup */
  clickable?: (i: number, j: number) => boolean;
  onCellClick?: (i: number, j: number) => void;
};
export type SideState = { cur: Cell | null; deps: Cell[]; trace: DPTrace | null };

type Line = { text: string; tone?: 'good' | 'bad' | '' };
type Mode = 'predict' | 'watch';
const MAX_PREDICT_XP_CELLS = 20;
const INTRO: Record<Mode, string> = {
  predict: 'Your turn. Each correct cell on the first try is +2 XP.',
  watch: 'Watch mode. Each step fills one cell and highlights the cells it was built from.',
};

function parse(t: string): number | null {
  const s = t.trim().toLowerCase();
  if (!s) return null;
  if (['inf', '∞', 'infinity', 'i'].includes(s)) return Infinity;
  const v = Number(s);
  return Number.isFinite(v) ? v : NaN;
}

/**
 * The DP table game. In "I'll fill it" mode you type each cell and get it checked; a wrong first
 * guess highlights the cells it depends on. In "Show me" mode the table fills itself step by step.
 * Give it a new `key` whenever the setup changes so it starts fresh.
 */
export function DPTable({ stationId, cfg, side }: { stationId: string; cfg: DPConfig; side?: (s: SideState) => ReactNode }) {
  const { p, gain } = useProgress();

  // solve the whole table once, so every guess can be checked against the truth
  const T = useMemo(() => {
    const truth: number[][] = [], deps: Cell[][][] = [], why: string[][] = [], isBase: boolean[][] = [];
    const get: Getter = (i, j) => truth[i][j];
    for (let i = 0; i < cfg.rows; i++) {
      truth.push([]); deps.push([]); why.push([]); isBase.push([]);
      for (let j = 0; j < cfg.cols; j++) {
        if (cfg.base(i, j)) { isBase[i][j] = true; truth[i][j] = cfg.baseVal(i, j); deps[i][j] = []; why[i][j] = ''; }
        else { isBase[i][j] = false; const r = cfg.calc(i, j, get); truth[i][j] = r.v; deps[i][j] = r.deps; why[i][j] = r.why; }
      }
    }
    const order: Cell[] = [];
    for (let i = 0; i < cfg.rows; i++) for (let j = 0; j < cfg.cols; j++) if (!isBase[i][j]) order.push([i, j]);
    return { truth, deps, why, isBase, order, get };
  }, [cfg]);

  const [filled, setFilled] = useState(() => T.isBase.map(r => r.slice()));
  const [pos, setPos] = useState(0);
  const [mode, setMode] = useState<Mode>('predict');
  const [tries, setTries] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showDeps, setShowDeps] = useState<Cell[]>([]);
  const [trace, setTrace] = useState<DPTrace | null>(null);
  const [finished, setFinished] = useState(false);
  const [lines, setLines] = useState<Line[]>([{ text: INTRO.predict }]);
  const [val, setVal] = useState('');
  const [playing, setPlaying] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const interacted = useRef(false);

  const cur = !finished && pos < T.order.length ? T.order[pos] : null;

  // keep the cursor in the input as you move from cell to cell, but never steal focus on page load
  useEffect(() => { if (interacted.current && mode === 'predict') inputRef.current?.focus({ preventScroll: true }); }, [pos, mode]);
  useEffect(() => { if (!shake) return; const t = setTimeout(() => setShake(null), 360); return () => clearTimeout(t); }, [shake]);

  function finish(last: Line, nCorrect: number, nextFilled: boolean[][]) {
    setPlaying(false); setFinished(true); setShowDeps([]);
    let msg = 'Table complete.';
    const get: Getter = T.get;
    if (cfg.trace) { const tr = cfg.trace(get); setTrace(tr); msg = tr.msg; }
    else if (cfg.doneMsg) msg = cfg.doneMsg(get);
    const out: Line[] = [last, { text: msg, tone: 'good' }];
    if (mode === 'predict' && nCorrect) out.push({ text: `You got ${nCorrect} of ${T.order.length} cells right on the first try.` });
    setLines(out);
    setFilled(nextFilled);
  }

  /** Fill the current cell and move on. */
  function advance(line: Line, nCorrect: number) {
    const [i, j] = T.order[pos];
    const nextFilled = filled.map(r => r.slice());
    nextFilled[i][j] = true;
    setShowDeps(T.deps[i][j]);
    setTries(0); setVal('');
    const np = pos + 1;
    setPos(np);
    if (np >= T.order.length) finish(line, nCorrect, nextFilled);
    else { setFilled(nextFilled); setLines([line]); }
  }

  function award(nCorrect: number) {
    const best = p.predict[stationId] || 0;
    if (nCorrect > best && best < MAX_PREDICT_XP_CELLS) gain(d => { d.predict[stationId] = Math.min(MAX_PREDICT_XP_CELLS, nCorrect); });
  }

  function check() {
    if (!cur) return;
    interacted.current = true;
    const [i, j] = cur, v = parse(val), t = T.truth[i][j];
    if (v === null) { setLines([{ text: 'Type a number in the highlighted cell first.', tone: 'bad' }]); inputRef.current?.focus(); return; }
    if (v === t) {
      const first = tries === 0, nCorrect = first ? correct + 1 : correct;
      setCombo(first ? combo + 1 : 0);
      setCorrect(nCorrect);
      if (first) award(nCorrect);
      advance({ text: 'Correct. ' + T.why[i][j], tone: 'good' }, nCorrect);
      return;
    }
    setCombo(0);
    setShake(i + ',' + j + ':' + Date.now());
    if (tries === 0) {
      setTries(1);
      setShowDeps(T.deps[i][j]);
      setLines([{ text: `Not ${Number.isNaN(v) ? 'that' : fmtDP(v)}. ${cfg.hint ? cfg.hint(i, j) : 'It is built from the highlighted cells.'} One more try.`, tone: 'bad' }]);
      inputRef.current?.select();
    } else {
      advance({ text: `It is ${fmtDP(t)}. ${T.why[i][j]}`, tone: 'bad' }, correct);
    }
  }

  function reveal() {
    if (!cur) return;
    interacted.current = true;
    const [i, j] = cur;
    setCombo(0);
    advance({ text: `${cfg.name(i, j)} is ${fmtDP(T.truth[i][j])}. ${T.why[i][j]}` }, correct);
  }

  function stepWatch() {
    if (!cur) return;
    const [i, j] = cur;
    advance({ text: `${cfg.name(i, j)} = ${fmtDP(T.truth[i][j])}. ${T.why[i][j]}` }, correct);
  }

  // "Play" in watch mode fills one cell a second; each filled cell moves `pos` and schedules the next
  useEffect(() => {
    if (!playing || mode !== 'watch') return;
    if (!cur) { setPlaying(false); return; }
    const t = setTimeout(stepWatch, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, mode, pos]);

  function switchMode(m: Mode) {
    setPlaying(false); setMode(m); setTries(0); setShowDeps([]);
    if (!finished) setLines([{ text: INTRO[m] }]);
  }

  function reset() {
    setPlaying(false); setFinished(false); setPos(0); setTries(0); setCombo(0); setCorrect(0);
    setShowDeps([]); setTrace(null); setVal(''); setFilled(T.isBase.map(r => r.slice()));
    setLines([{ text: INTRO[mode] }]);
  }

  const depKeys = new Set(showDeps.map(([a, b]) => a + ',' + b));
  const pathKeys = new Set((trace?.cells || []).map(([a, b]) => a + ',' + b));
  const editable = !!cfg.onCellClick && pos === 0 && !finished;

  return (
    <>
      {side?.({ cur, deps: showDeps, trace })}
      <div className="dp-top">
        <Seg options={[['predict', 'I\'ll fill it'], ['watch', 'Show me']]} value={mode} onChange={switchMode} label="Mode" />
        <div className="dp-meta">
          {combo >= 2 && <span key={combo} className="combo bump">Combo ×{combo}</span>}
          <span>{pos} / {T.order.length} cells</span>
        </div>
      </div>
      <div className="dp-scroll">
        <table className="dp">
          <thead>
            <tr><th>{cfg.corner || ''}</th>{Array.from({ length: cfg.cols }, (_, j) => <th key={j} scope="col">{cfg.colHead(j)}</th>)}</tr>
          </thead>
          <tbody>
            {Array.from({ length: cfg.rows }, (_, i) => (
              <tr key={i}>
                <th scope="row" className={cx('rowh', cfg.wideRows && 'wide')}>{cfg.rowHead(i)}</th>
                {Array.from({ length: cfg.cols }, (_, j) => {
                  const k = i + ',' + j, isCur = !!cur && cur[0] === i && cur[1] === j;
                  const canClick = editable && !!cfg.clickable?.(i, j);
                  return (
                    <td key={j}
                      className={cx(T.isBase[i][j] ? 'base' : filled[i][j] && 'filled', cfg.cellClass?.(i, j), depKeys.has(k) && 'dep',
                        pathKeys.has(k) && 'path', isCur && 'cur', canClick && 'clickable', shake?.startsWith(k + ':') && 'shake')}
                      onClick={canClick ? () => cfg.onCellClick!(i, j) : undefined}>
                      {isCur && mode === 'predict'
                        ? <input ref={inputRef} type="text" inputMode="numeric" autoComplete="off" aria-label={'Value for ' + cfg.name(i, j)}
                            value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); check(); } }} />
                        : filled[i][j] ? fmtDP(T.truth[i][j]) : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dp-status" aria-live="polite">
        {lines.map((l, k) => <p key={k} className={l.tone || undefined}>{l.text}</p>)}
        {cur && <p className="next">{mode === 'predict' ? `Next: type ${cfg.name(cur[0], cur[1])} and press Enter.` : `Next: ${cfg.name(cur[0], cur[1])}. Press Step, or Play to watch.`}</p>}
      </div>
      <div className="controls">
        {!finished && mode === 'predict' && <>
          <button type="button" className="btn small primary" onClick={check}>Check</button>
          <button type="button" className="btn small" onClick={reveal}>Show this cell</button>
        </>}
        {!finished && mode === 'watch' && <>
          <button type="button" className="btn small primary" onClick={() => { setPlaying(false); stepWatch(); }}>Step →</button>
          <button type="button" className="btn small" onClick={() => setPlaying(x => !x)}>{playing ? 'Pause' : 'Play'}</button>
        </>}
        <button type="button" className="btn small ghost" onClick={reset}>Start over</button>
      </div>
    </>
  );
}
