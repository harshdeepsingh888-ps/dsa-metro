/** Join class names, skipping falsy ones (so `count && 'on'` works). */
export const cx = (...parts: (string | number | false | null | undefined)[]) => parts.filter(x => typeof x === 'string' && x).join(' ');

const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
export const sup = (n: number | string) => String(n).split('').map(c => SUP[c] || c).join('');

export function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const fibv = (k: number) => { let a = 0, b = 1; for (let i = 0; i < k; i++) [a, b] = [b, a + b]; return a; };

export const fmtDP = (v: number) => (v === Infinity ? '∞' : String(v));
