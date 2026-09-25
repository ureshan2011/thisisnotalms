// ─── The random forest example, shared by its three widgets ───────────────
// Twenty gym members and five tiny one-question trees. The same numbers are
// in PLAY_FOREST in PredictingWithDataLesson.tsx, so what the Python prints
// is what the widgets show. Change one, change the other.
//
// With this data: the trees score 13, 15, 15, 15 and 16 out of 20 on their
// own, and 19 when they vote. Computed below, never typed into prose.

export type Member = { name: string; visits: number; months: number; quit: boolean };

export const MEMBERS: Member[] = [
  { name: 'Amy', visits: 1, months: 2, quit: true },
  { name: 'Ben', visits: 1, months: 9, quit: true },
  { name: 'Cal', visits: 2, months: 3, quit: true },
  { name: 'Dan', visits: 2, months: 18, quit: false },
  { name: 'Eva', visits: 3, months: 1, quit: true },
  { name: 'Fay', visits: 3, months: 7, quit: true },
  { name: 'Gus', visits: 3, months: 26, quit: false },
  { name: 'Hana', visits: 4, months: 4, quit: true },
  { name: 'Ivy', visits: 4, months: 11, quit: true },
  { name: 'Jay', visits: 4, months: 30, quit: false },
  { name: 'Kim', visits: 5, months: 2, quit: true },
  { name: 'Leo', visits: 5, months: 13, quit: false },
  { name: 'Mia', visits: 6, months: 5, quit: true },
  { name: 'Ned', visits: 6, months: 20, quit: false },
  { name: 'Oli', visits: 7, months: 3, quit: false },
  { name: 'Pia', visits: 8, months: 10, quit: false },
  { name: 'Raj', visits: 9, months: 2, quit: false },
  { name: 'Sam', visits: 9, months: 22, quit: false },
  { name: 'Tia', visits: 11, months: 6, quit: false },
  { name: 'Zoe', visits: 12, months: 15, quit: false },
];

export interface Tree {
  n: number;
  /** The question, split where it should break inside the tree drawing. */
  lines: [string, string];
  field: 'visits' | 'months';
  cutOff: number;
}

export const TREES: Tree[] = [
  { n: 1, lines: ['Comes less than', '3 times a month?'], field: 'visits', cutOff: 3 },
  { n: 2, lines: ['Comes less than', '5 times a month?'], field: 'visits', cutOff: 5 },
  { n: 3, lines: ['Comes less than', '7 times a month?'], field: 'visits', cutOff: 7 },
  { n: 4, lines: ['Joined less than', '6 months ago?'], field: 'months', cutOff: 6 },
  { n: 5, lines: ['Joined less than', '12 months ago?'], field: 'months', cutOff: 12 },
];

/** A tree's answer is "yes" to its question, and yes means "will quit". */
export const saysQuit = (t: Tree, m: Member) => m[t.field] < t.cutOff;
export const quitVotes = (m: Member) => TREES.filter(t => saysQuit(t, m)).length;
export const forestSaysQuit = (m: Member) => quitVotes(m) * 2 > TREES.length;

export const treeScore = (t: Tree) => MEMBERS.filter(m => saysQuit(t, m) === m.quit).length;
export const forestScore = MEMBERS.filter(m => forestSaysQuit(m) === m.quit).length;

export const describe = (t: Tree, m: Member) =>
  t.field === 'visits' ? `${m.name} comes ${m.visits}× a month` : `${m.name} joined ${m.months} months ago`;

/** Quit is a filled square, stay a hollow circle, so the two never rely on
 *  colour alone — same marks as the decision tree widget above. */
export function VoteMark({ quit, size = 14 }: { quit: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" style={{ flex: `0 0 ${size}px` }}>
      {quit ? (
        <rect x="1" y="1" width="12" height="12" rx="3" fill="var(--cat-2)" />
      ) : (
        <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--cat-3)" strokeWidth="2.2" />
      )}
    </svg>
  );
}

/** A tiny upside-down tree: one question, two answers. */
export function TreeGlyph({ size = 30, color = 'var(--accent-500)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 30 27" aria-hidden="true" style={{ flex: `0 0 ${size}px` }}>
      <line x1="15" y1="10" x2="7" y2="20" stroke={color} strokeWidth="2" />
      <line x1="15" y1="10" x2="23" y2="20" stroke={color} strokeWidth="2" />
      <rect x="7" y="2" width="16" height="9" rx="3" fill={color} />
      <circle cx="7" cy="21.5" r="4" fill="var(--paper-0)" stroke={color} strokeWidth="2" />
      <circle cx="23" cy="21.5" r="4" fill="var(--paper-0)" stroke={color} strokeWidth="2" />
    </svg>
  );
}
