'use client';

import { useEffect, useState } from 'react';

export const THEME_KEY = 'dsa-metro-theme';
type Theme = 'light' | 'dark';

/** Runs before the page paints, so night mode never flashes white. */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

function storedChoice(): Theme | null {
  try { const t = localStorage.getItem(THEME_KEY); return t === 'light' || t === 'dark' ? t : null; } catch { return null; }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    // until you pick one yourself, follow the device setting
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (!storedChoice()) apply(mq.matches ? 'dark' : 'light'); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function apply(t: Theme) {
    const root = document.documentElement;
    root.classList.add('theme-fade');
    root.setAttribute('data-theme', t);
    setTheme(t);
    setTimeout(() => root.classList.remove('theme-fade'), 400);
  }

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage blocked: still switch for this visit */ }
    apply(next);
  }

  const night = theme === 'dark';
  return (
    <button type="button" className="theme-btn" onClick={toggle} disabled={!theme}
      aria-label={night ? 'Switch to day theme' : 'Switch to night theme'} title={night ? 'Switch to day theme' : 'Switch to night theme'}>
      {night ? (
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" /></svg>
      )}
      <span>{theme ? (night ? 'Day' : 'Night') : ''}</span>
    </button>
  );
}
