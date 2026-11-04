// ─── Reading SQL text the way MySQL does ──────────────────────────────────
// Splits a script into statements and rewrites the bits where MySQL and
// SQLite disagree about plain text:
//   - "double quotes" are strings in MySQL, identifiers in SQLite
//   - MySQL strings understand backslash escapes (\' \n \\)
//   - MySQL also allows # comments
// Everything is re-emitted with SQLite-safe single-quoted strings, so the
// rest of the engine never has to think about quoting again.

export type TokType = 'word' | 'ident' | 'string' | 'number' | 'punct' | 'op' | 'blank';

export interface Token {
  type: TokType;
  /** For strings: the decoded value. For idents: the bare name. Otherwise the text. */
  value: string;
  /** The SQLite-safe text to emit. */
  out: string;
}

export interface Statement {
  /** What the student typed, trimmed, without the trailing semicolon. */
  raw: string;
  tokens: Token[];
}

const WORD = /[A-Za-z_$À-￿]/;
const WORDCH = /[A-Za-z0-9_$À-￿]/;

function quoteString(v: string) {
  return `'${v.replace(/'/g, "''")}'`;
}

function decodeEscape(ch: string): string {
  switch (ch) {
    case 'n': return '\n';
    case 't': return '\t';
    case 'r': return '\r';
    case '0': return '';
    case 'b': return '\b';
    case 'Z': return '\x1a';
    // \% and \_ keep their backslash so LIKE still sees an escaped wildcard.
    case '%': return '\\%';
    case '_': return '\\_';
    default: return ch;
  }
}

/** Split a script into statements of tokens. Throws on an unclosed string. */
export function splitStatements(src: string): Statement[] {
  const out: Statement[] = [];
  let tokens: Token[] = [];
  let start = 0;
  let i = 0;
  const n = src.length;

  const flush = (end: number) => {
    const raw = src.slice(start, end).trim();
    const meaningful = tokens.some(t => t.type !== 'blank');
    if (meaningful) out.push({ raw: stripComments(raw), tokens: trimBlanks(tokens) });
    tokens = [];
  };

  while (i < n) {
    const c = src[i];

    // Comments
    if ((c === '-' && src[i + 1] === '-' && (i + 2 >= n || /\s/.test(src[i + 2]))) || c === '#') {
      while (i < n && src[i] !== '\n') i++;
      tokens.push({ type: 'blank', value: ' ', out: ' ' });
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end === -1 ? n : end + 2;
      tokens.push({ type: 'blank', value: ' ', out: ' ' });
      continue;
    }

    if (/\s/.test(c)) {
      while (i < n && /\s/.test(src[i])) i++;
      tokens.push({ type: 'blank', value: ' ', out: ' ' });
      continue;
    }

    if (c === ';') {
      flush(i);
      i++;
      start = i;
      continue;
    }

    // Strings: '...' and "..." are both strings in MySQL.
    if (c === "'" || c === '"') {
      const q = c;
      let v = '';
      i++;
      let closed = false;
      while (i < n) {
        const d = src[i];
        if (d === '\\' && i + 1 < n) {
          v += decodeEscape(src[i + 1]);
          i += 2;
          continue;
        }
        if (d === q) {
          if (src[i + 1] === q) {
            v += q;
            i += 2;
            continue;
          }
          closed = true;
          i++;
          break;
        }
        v += d;
        i++;
      }
      if (!closed) throw new UnclosedQuote(q);
      tokens.push({ type: 'string', value: v, out: quoteString(v) });
      continue;
    }

    if (c === '`') {
      const end = src.indexOf('`', i + 1);
      if (end === -1) throw new UnclosedQuote('`');
      const name = src.slice(i + 1, end);
      tokens.push({ type: 'ident', value: name, out: `"${name.replace(/"/g, '""')}"` });
      i = end + 1;
      continue;
    }

    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      let j = i;
      while (j < n && /[0-9.]/.test(src[j])) j++;
      if ((src[j] === 'e' || src[j] === 'E') && /[0-9+-]/.test(src[j + 1] ?? '')) {
        j += 2;
        while (j < n && /[0-9]/.test(src[j])) j++;
      }
      // 3abc is a word in MySQL, not a number followed by a word.
      if (j < n && WORD.test(src[j])) {
        while (j < n && WORDCH.test(src[j])) j++;
        const w = src.slice(i, j);
        tokens.push({ type: 'word', value: w, out: w });
      } else {
        const num = src.slice(i, j);
        tokens.push({ type: 'number', value: num, out: num });
      }
      i = j;
      continue;
    }

    if (WORD.test(c)) {
      let j = i;
      while (j < n && WORDCH.test(src[j])) j++;
      const w = src.slice(i, j);
      tokens.push({ type: 'word', value: w, out: w });
      i = j;
      continue;
    }

    const two = src.slice(i, i + 2);
    if (['<=', '>=', '<>', '!=', '||', '&&'].includes(two)) {
      tokens.push({ type: 'op', value: two, out: two === '&&' ? 'AND' : two });
      i += 2;
      continue;
    }
    if ('(),.'.includes(c)) {
      tokens.push({ type: 'punct', value: c, out: c });
    } else {
      tokens.push({ type: 'op', value: c, out: c });
    }
    i++;
  }
  flush(n);
  return out;
}

export class UnclosedQuote extends Error {
  constructor(public quote: string) {
    super(`unclosed ${quote}`);
  }
}

function trimBlanks(t: Token[]): Token[] {
  let a = 0;
  let b = t.length;
  while (a < b && t[a].type === 'blank') a++;
  while (b > a && t[b - 1].type === 'blank') b--;
  return t.slice(a, b);
}

function stripComments(raw: string) {
  return raw
    .split('\n')
    .map(l => l.replace(/^\s*(--\s|#).*$/, ''))
    .join('\n')
    .trim();
}

/** Tokens without the whitespace, for parsing. */
export function solid(tokens: Token[]): Token[] {
  return tokens.filter(t => t.type !== 'blank');
}

/** Re-emit tokens as SQLite text. */
export function emit(tokens: Token[]): string {
  return tokens.map(t => t.out).join('');
}

/** Upper-cased word value, or '' for anything that is not a bare word. */
export function kw(t: Token | undefined): string {
  return t && t.type === 'word' ? t.value.toUpperCase() : '';
}

/** A table/column name from a word or `ident` token. */
export function nameOf(t: Token | undefined): string | null {
  if (!t) return null;
  if (t.type === 'word' || t.type === 'ident') return t.value;
  return null;
}
