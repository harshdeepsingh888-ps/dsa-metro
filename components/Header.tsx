'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { inr, streak, xp } from '@/lib/progress';
import { useProgress } from './ProgressProvider';
import { Seg } from './Seg';
import { ThemeToggle } from './ThemeToggle';

export function BrandMark() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <rect x="2" y="17" width="36" height="6" rx="3" style={{ fill: 'var(--ink)' }} />
      <circle cx="8" cy="20" r="5" style={{ fill: 'var(--yellow)' }} />
      <circle cx="16" cy="20" r="5" style={{ fill: 'var(--blue)' }} />
      <circle cx="24" cy="20" r="5" style={{ fill: 'var(--red)' }} />
      <circle cx="32" cy="20" r="5" style={{ fill: 'var(--magenta)' }} />
    </svg>
  );
}

export function Header() {
  const { p, ready, update, xpPop } = useProgress();
  const path = usePathname();
  const section = path.startsWith('/guide') ? 'guide' : path.startsWith('/practice') ? 'practice' : 'map';
  return (
    <header className="top">
      <div className="wrap top-in">
        <Link className="brand" href="/" aria-label="DSA Metro, route map"><BrandMark /><span>DSA Metro</span></Link>
        <nav className="mainnav" aria-label="Main">
          <Link href="/" aria-current={section === 'map' ? 'page' : undefined}>Map</Link>
          <Link href="/practice/" aria-current={section === 'practice' ? 'page' : undefined}>Practice</Link>
          <Link href="/guide/" aria-current={section === 'guide' ? 'page' : undefined}>Study guide</Link>
        </nav>
        <div className="stats">
          {xpPop && <span key={xpPop.id} className="xp-pop go" aria-hidden="true">+{xpPop.n}</span>}
          <span className="chip"><b>{ready ? inr(xp(p)) : '–'}</b> XP</span>
          <span className="chip"><b>{ready ? streak(p) : '–'}</b>-day streak</span>
          <Seg options={[['cpp', 'C++'], ['py', 'Python']]} value={p.lang} label="Code language" onChange={l => update(d => { d.lang = l; })} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
