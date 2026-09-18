import { useState } from 'react';
import type { CourseLesson } from '../../../content/courses';

// ─── The progress board ───────────────────────────────────────────────────
// The hero object on a course home page, and the one thing on it that is
// about *this reader* rather than about the course: every lesson as one
// square, threaded in teaching order, filling in as they tick them off.
//
// It has to hold up at both ends of the range. MBI806B publishes two lessons
// and MBI802 publishes sixteen, so the count is set in display type and the
// map sits under it: on a short course the numeral carries the panel, on a
// long one the map does, and neither reads as a half-empty box.
//
// Squares rather than a row of dots because the three states have to be
// legible without colour alone — solid for done, a ring for open, a dashed
// ring for the ones needing the class code.

const VIEW_W = 440;
const TILE = 56;
const GAP = 18;

interface Placed {
  lesson: CourseLesson;
  n: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
}

/** Lay the lessons out boustrophedon — left to right, then back again — so
 *  consecutive lessons are always adjacent and one polyline draws the whole
 *  sequence without a jump back across the panel. */
function layout(lessons: CourseLesson[]): { placed: Placed[]; width: number; height: number } {
  const cols = lessons.length <= 4 ? Math.max(lessons.length, 1) : 5;
  const rows = Math.ceil(lessons.length / cols);
  const gridW = cols * TILE + (cols - 1) * GAP;
  const x0 = (VIEW_W - gridW) / 2;

  const placed = lessons.map((lesson, i) => {
    const row = Math.floor(i / cols);
    const within = i % cols;
    const col = row % 2 === 0 ? within : cols - 1 - within;
    const x = x0 + col * (TILE + GAP);
    const y = row * (TILE + GAP);
    return { lesson, n: i + 1, x, y, cx: x + TILE / 2, cy: y + TILE / 2 };
  });

  return { placed, width: VIEW_W, height: rows * TILE + (rows - 1) * GAP };
}

export default function CourseBoard({
  lessons,
  done,
  onJump,
  onClear,
}: {
  lessons: CourseLesson[];
  done: ReadonlySet<string>;
  /** Scroll the index to this lesson and mark it for a moment. */
  onJump: (lessonId: string) => void;
  onClear: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);

  const { placed, width, height } = layout(lessons);
  const doneCount = lessons.filter(l => done.has(l.id)).length;
  const pct = lessons.length === 0 ? 0 : Math.round((doneCount / lessons.length) * 100);

  const hovered = placed.find(p => p.lesson.id === active);
  const openCount = lessons.filter(l => l.access === 'open').length;

  return (
    <div className="bt-heroart">
      <span className="bt-heroart__lbl">Your way through the course</span>

      <div className="bt-board__top">
        <span className="bt-board__num">
          {doneCount}
          <span style={{ color: 'var(--ink-300)' }}>/{lessons.length}</span>
        </span>
        <span className="bt-board__of">
          {doneCount === 0
            ? 'lessons done — nothing ticked yet'
            : doneCount === lessons.length
              ? 'lessons done. That is the whole course.'
              : `lessons done · ${pct}% of the way`}
        </span>
      </div>

      <span className="bt-bar bt-board__bar">
        <i style={{ width: `${pct}%` }} />
      </span>

      <svg
        className="bt-board__map"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`The ${lessons.length} lessons of this course in teaching order, ${doneCount} of them ticked off. Each square opens that lesson in the list below.`}
      >
        {/* The thread runs behind the squares: the course is a sequence, and
            the line is what says so. */}
        {placed.length > 1 && (
          <polyline
            points={placed.map(p => `${p.cx},${p.cy}`).join(' ')}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {placed.map(p => {
          const isDone = done.has(p.lesson.id);
          const needsCode = p.lesson.access === 'code';
          return (
            <g
              key={p.lesson.id}
              className="bt-tile"
              role="button"
              tabIndex={0}
              aria-label={`Lesson ${p.n}, ${p.lesson.title}. ${
                isDone ? 'Ticked off.' : needsCode ? 'Needs the class access code.' : 'Open to anybody.'
              } Jump to it in the list.`}
              onClick={() => onJump(p.lesson.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onJump(p.lesson.id);
                }
              }}
              onMouseEnter={() => setActive(p.lesson.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(p.lesson.id)}
              onBlur={() => setActive(null)}
            >
              <rect
                x={p.x}
                y={p.y}
                width={TILE}
                height={TILE}
                rx="12"
                fill={isDone ? 'var(--accent-500)' : needsCode ? 'var(--paper-50)' : 'var(--paper-0)'}
                stroke={isDone ? 'var(--accent-500)' : needsCode ? 'var(--ink-200)' : 'var(--accent-300)'}
                strokeWidth="1.5"
                strokeDasharray={!isDone && needsCode ? '4 4' : undefined}
              />
              <text
                x={p.cx}
                y={p.cy + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fontFamily="var(--font-mono)"
                fill={isDone ? '#fff' : 'var(--ink-400)'}
                style={{ pointerEvents: 'none' }}
              >
                {p.n}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="bt-legend" aria-hidden="true">
        <span><i className="is-done" />Ticked</span>
        <span><i className="is-open" />Open to anybody</span>
        <span><i className="is-code" />Class code</span>
      </div>

      {/* Fixed height, so hovering the map never nudges the page under the
          pointer. */}
      <p className="bt-board__read">
        {hovered ? (
          <>
            <b>
              {hovered.n}. {hovered.lesson.title}
            </b>{' '}
            — {hovered.lesson.access === 'open' ? 'opens for anybody' : 'needs the class access code'}. Click to
            find it in the list.
          </>
        ) : (
          <>
            <b>{openCount} of these open with no code at all.</b> Ticking one off is kept in this browser only —
            nothing is sent anywhere, and there is no account to make.
          </>
        )}
      </p>

      {doneCount > 0 && (
        <button type="button" className="bt-board__reset" onClick={onClear}>
          Clear my ticks
        </button>
      )}
    </div>
  );
}
