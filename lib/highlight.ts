// A small syntax highlighter for the C++ and Python snippets. Returns HTML.
import type { Lang } from './types';

const KW: Record<Lang, Set<string>> = {
  cpp: new Set('int long double float bool void auto return if else for while do vector pair string const struct class new nullptr true false unordered_map unordered_set map set stack queue deque priority_queue using namespace std char break continue static public private max min sizeof INT_MAX'.split(' ')),
  py: new Set('def return if elif else for while in not and or None True False import from class lambda range len max min float int list dict set enumerate break continue pass is with as'.split(' ')),
};

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (t: string) => t.replace(/[&<>"']/g, c => ESC[c]);

export function highlight(code: string, lang: Lang) {
  const re = lang === 'py'
    ? /(#.*$)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?(?:e\d+)?\b)|([A-Za-z_]\w*)/gm
    : /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?(?:e\d+)?\b)|([A-Za-z_]\w*)/gm;
  let out = '', last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    const t = m[0];
    if (m[1]) out += '<span class="t-com">' + esc(t) + '</span>';
    else if (m[2]) out += '<span class="t-str">' + esc(t) + '</span>';
    else if (m[3]) out += '<span class="t-num">' + esc(t) + '</span>';
    else if (KW[lang].has(t)) out += '<span class="t-kw">' + esc(t) + '</span>';
    else out += esc(t);
    last = re.lastIndex;
  }
  return out + esc(code.slice(last));
}
