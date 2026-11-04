import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';

// A plain textarea with colour underneath it. The coloured copy is a <pre>
// sitting exactly behind transparent text, so typing, selecting, autocorrect
// and the phone keyboard all behave like a normal text box.
//
// The chip row above it types the awkward bits for you on a phone: quotes,
// brackets, semicolons, and the keywords people misspell.

const KEYWORDS = new Set(
  (
    'SELECT FROM WHERE AND OR NOT NULL IS IN LIKE BETWEEN ORDER BY GROUP HAVING LIMIT AS DISTINCT ' +
    'INSERT INTO VALUES UPDATE SET DELETE CREATE DATABASE TABLE DROP USE SHOW TABLES DATABASES DESCRIBE DESC ' +
    'PRIMARY KEY FOREIGN REFERENCES ON CASCADE UNIQUE DEFAULT AUTO_INCREMENT CHECK CONSTRAINT IF EXISTS TRUNCATE ' +
    'INT INTEGER TINYINT SMALLINT BIGINT DECIMAL NUMERIC FLOAT DOUBLE VARCHAR CHAR TEXT DATE DATETIME TIMESTAMP TIME BOOLEAN BOOL ENUM ' +
    'CASE WHEN THEN ELSE END ASC JOIN INNER LEFT RIGHT COUNT SUM AVG MIN MAX TRUE FALSE UNSIGNED'
  ).split(' '),
);

function highlight(src: string) {
  const out: { t: string; c?: string }[] = [];
  const re = /(--[^\n]*|#[^\n]*)|('(?:[^'\\]|\\.|'')*'?|"(?:[^"\\]|\\.)*"?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(___)|([\s\S])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m[1]) out.push({ t: m[1], c: 'cm' });
    else if (m[2]) out.push({ t: m[2], c: 'st' });
    else if (m[3]) out.push({ t: m[3], c: 'nu' });
    else if (m[4]) out.push({ t: m[4], c: KEYWORDS.has(m[4].toUpperCase()) ? 'kw' : undefined });
    else if (m[5]) out.push({ t: m[5], c: 'bl' });
    else out.push({ t: m[6] });
  }
  return out;
}

const CHIPS: [string, string][] = [
  ["' '", "''"], [';', ';'], ['( )', '()'], [',', ', '], ['*', '*'], ['=', ' = '],
  ['SELECT', 'SELECT '], ['FROM', 'FROM '], ['WHERE', 'WHERE '], ['AND', 'AND '],
  ['INSERT INTO', 'INSERT INTO '], ['VALUES', 'VALUES '], ['UPDATE', 'UPDATE '], ['SET', 'SET '],
  ['DELETE FROM', 'DELETE FROM '], ['CREATE TABLE', 'CREATE TABLE '], ['USE', 'USE '],
];

export default function SqlEditor({
  value,
  onChange,
  onRun,
  onPaste,
  placeholder = 'Type SQL here',
  disabled,
  rows = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  onRun: () => void;
  onPaste?: (chars: number) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const pre = useRef<HTMLPreElement>(null);

  const insert = (text: string) => {
    const el = ta.current;
    if (!el) return;
    const a = el.selectionStart ?? value.length;
    const b = el.selectionEnd ?? value.length;
    const next = value.slice(0, a) + text + value.slice(b);
    // Paired chips put the cursor between the pair.
    const caret = a + (text === "''" || text === '()' ? 1 : text.length);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onRun();
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      insert('  ');
    }
  };

  const paste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const n = e.clipboardData.getData('text').length;
    if (n > 0) onPaste?.(n);
  };

  const sync = () => {
    if (pre.current && ta.current) {
      pre.current.scrollTop = ta.current.scrollTop;
      pre.current.scrollLeft = ta.current.scrollLeft;
    }
  };

  return (
    <div className="sb-editor">
      <div className="sb-chips" role="toolbar" aria-label="Insert SQL">
        {CHIPS.map(([label, text]) => (
          <button key={label} type="button" className="sb-chip" onClick={() => insert(text)} disabled={disabled} tabIndex={-1}>
            {label}
          </button>
        ))}
      </div>
      <div className="sb-editor__box" style={{ ['--rows' as string]: rows }}>
        <pre ref={pre} className="sb-editor__hl" aria-hidden="true">
          {highlight(value).map((p, i) => (p.c ? <span key={i} className={`sb-hl-${p.c}`}>{p.t}</span> : p.t))}
          {'\n'}
        </pre>
        <textarea
          ref={ta}
          className="sb-editor__ta"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKey}
          onPaste={paste}
          onScroll={sync}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          disabled={disabled}
          aria-label="SQL editor"
        />
      </div>
    </div>
  );
}
