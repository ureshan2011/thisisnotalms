import type { ReactNode } from 'react';

// ─── Just enough colour to read Python by ─────────────────────────────────
// Comments grey, text green, numbers yellow, Python's own words warm, the
// built-in commands blue. Five colours a beginner can learn to ignore, not a
// full grammar: every line on this page is simple enough for a regex.
// Colours are fixed hexes because they only ever sit on the dark code
// surface.

const TOKEN =
  /(#.*$)|(f?"(?:[^"\\]|\\.)*")|\b(def|for|in|if|else|elif|return|from|import|and|or|not|True|False|None)\b|\b(print|range|abs|len|round)\b|\b(\d+(?:\.\d+)?)\b/g;

const CLASS = ['py-com', 'py-str', 'py-kw', 'py-fn', 'py-num'];

export function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(line.slice(last, at));
    const kind = m.slice(1).findIndex(g => g !== undefined);
    out.push(
      <span key={at} className={CLASS[kind]}>
        {m[0]}
      </span>,
    );
    last = at + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  // An empty line still needs height.
  return out.length ? out : [' '];
}
