import { useEffect, useMemo, useState } from 'react';
import { Trophy } from 'lucide-react';
import { SaveAsPdf } from '../blend';
import { buildNotes } from '../../lib/sqlSandbox/notes';
import { fetchBoard, sheetEnabled, type BoardRow } from '../../lib/sqlSandbox/progress';
import { fullTableSql, type Theme } from '../../lib/sqlSandbox/themes';
import { useSandbox } from './useSandbox';
import Workspace from './Workspace';

// ── Playground ──────────────────────────────────────────────────────────────

const SCHOOL = `CREATE DATABASE school;
USE school;
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  city VARCHAR(30)
);
CREATE TABLE courses (
  code CHAR(6) PRIMARY KEY,
  title VARCHAR(60) NOT NULL,
  credits INT DEFAULT 15
);
CREATE TABLE enrolments (
  student_id INT,
  course_code CHAR(6),
  grade CHAR(2),
  PRIMARY KEY (student_id, course_code),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_code) REFERENCES courses(code)
);
INSERT INTO students (name, city) VALUES ('Aroha', 'Auckland'), ('Ben', 'Wellington'), ('Chloe', NULL), ('Dev', 'Auckland');
INSERT INTO courses VALUES ('MBI802', 'Database Management Systems', 15), ('MBI800', 'Strategic IS Planning', 15);
INSERT INTO enrolments VALUES (1, 'MBI802', 'A'), (2, 'MBI802', 'B+'), (2, 'MBI800', 'A-'), (4, 'MBI800', NULL);`;

const PLAY_DRAFT = 'sqlsb:draft:play';

export function Playground({ theme }: { theme: Theme }) {
  const sb = useSandbox('play', () => '');
  const [editor, setEditor] = useState(() => {
    try {
      return localStorage.getItem(PLAY_DRAFT) ?? 'SHOW DATABASES;';
    } catch {
      return 'SHOW DATABASES;';
    }
  });
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(PLAY_DRAFT, editor);
      } catch {
        /* fine */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [editor]);

  return (
    <div className="sb-play">
      <div className="sb-map__intro">
        <h2>
          Playground<span className="bt-stop">.</span>
        </h2>
        <p>Anything goes. Nothing here is marked, and it stays on this device.</p>
        <div className="sb-play__load">
          <button type="button" className="sb-tool" onClick={() => sb.load(fullTableSql(theme))}>
            Load my {theme.table} table
          </button>
          <button type="button" className="sb-tool" onClick={() => sb.load(SCHOOL)}>
            Load a school database
          </button>
        </div>
      </div>
      <Workspace sb={sb} value={editor} onChange={setEditor} resetLabel="Empty it" />
    </div>
  );
}

// ── Notes ───────────────────────────────────────────────────────────────────

const CHEAT: [string, string][] = [
  ['CREATE DATABASE shop;', 'Make a database'],
  ['USE shop;', 'Work inside it'],
  ['CREATE TABLE items (id INT, name VARCHAR(30));', 'Make a table'],
  ["INSERT INTO items (id, name) VALUES (1, 'Tea');", 'Add a row'],
  ['SELECT * FROM items WHERE id = 1;', 'Read rows'],
  ["UPDATE items SET name = 'Green tea' WHERE id = 1;", 'Change rows'],
  ['DELETE FROM items WHERE id = 1;', 'Remove rows'],
  ['DROP TABLE items;', 'Remove the table'],
];

export function NotesTab({ theme }: { theme: Theme }) {
  const doc = useMemo(() => buildNotes(theme), [theme]);
  return (
    <div className="sb-notes">
      <div className="sb-map__intro">
        <h2>
          Notes<span className="bt-stop">.</span>
        </h2>
        <p>The whole beginner path as a PDF, using your own business as the example. Plus a cheat sheet.</p>
      </div>
      <SaveAsPdf doc={doc} />
      <div className="sb-card">
        <p className="sb-step__task">Cheat sheet</p>
        <div className="sb-cheat">
          {CHEAT.map(([code, what]) => (
            <div key={code}>
              <code>{code}</code>
              <span>{what}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Class board ─────────────────────────────────────────────────────────────

const mask = (id: string) => (id.length <= 3 ? id : `•••${id.slice(-3)}`);

export function Board({ me }: { me: string }) {
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  useEffect(() => {
    if (!sheetEnabled()) return;
    fetchBoard().then(setRows).catch(() => setRows(null));
  }, []);
  if (!rows || rows.length === 0) return null;
  return (
    <div className="sb-card sb-board">
      <p className="sb-step__task">
        <Trophy size={16} /> Top of the class
      </p>
      <ol>
        {rows.slice(0, 10).map((r, i) => (
          <li key={r.id} className={r.id === mask(me) || r.id === me ? 'is-me' : ''}>
            <span className="sb-board__rank">{i + 1}</span>
            <span className="sb-board__id">{r.id}</span>
            <span className="sb-muted">{r.levels}/8 levels · {r.challenges} challenges</span>
            <strong>{r.xp} XP</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
