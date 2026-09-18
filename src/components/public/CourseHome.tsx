import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { Reveal, SectionHead } from '../blend';
import {
  COURSES,
  COURSE_CODES,
  GENERAL_RESOURCES,
  courseHomePath,
  type Course,
  type CourseHomeCode,
  type CourseLesson,
  type LessonKind,
} from '../../content/courses';
import type { CourseProgress } from './course/useCourseProgress';

// ─── The body of a course home page ───────────────────────────────────────
// Everything under the hero on /mbi800, /mbi802, /mbi804 and /mbi806b. The
// hero itself, and the board in it, live in CourseHomePage and CourseBoard —
// the board and this list are two views of the same lesson array, which is
// why jumping from a square lands on a row.
//
// The index is the point of the page. Every lesson that has a page on this
// site appears here, whether or not it opens without the class access code,
// and the access state is a visible, filterable property rather than a
// surprise on arrival. The public intro pages deliberately linked nothing
// gated, on the grounds that a shareable page should not end in a password
// box; naming the state up front answers the same worry without hiding two
// thirds of a course from the person taking it.

const BASE = import.meta.env.BASE_URL;

type Filter = 'all' | 'open' | 'code' | LessonKind;

/** Filters, in a fixed order, with the format filters the course actually
 *  needs. A course with no video lesson does not get a Video pill. */
function filtersFor(course: Course): { id: Filter; label: string }[] {
  const kinds: LessonKind[] = [];
  for (const lesson of course.lessons) {
    if (!kinds.includes(lesson.kind)) kinds.push(lesson.kind);
  }
  return [
    { id: 'all', label: `All ${course.lessons.length}` },
    { id: 'open', label: 'Open now' },
    { id: 'code', label: 'Class code' },
    ...kinds.map(k => ({ id: k as Filter, label: k })),
  ];
}

function matches(lesson: CourseLesson, filter: Filter): boolean {
  if (filter === 'all') return true;
  if (filter === 'open' || filter === 'code') return lesson.access === filter;
  return lesson.kind === filter;
}

/** The one control that opens a lesson. Tertiary, not the solid accent pill:
 *  sixteen orange buttons down a page is exactly what "the accent is
 *  rationed" is there to prevent. */
function OpenLink({ lesson, className = 'bt-btn bt-btn--sm bt-btn--tertiary' }: { lesson: CourseLesson; className?: string }) {
  if (lesson.href) {
    return (
      <a className={className} href={BASE + lesson.href}>
        Open lesson
        <span className="bt-btn__badge" aria-hidden="true">↗</span>
      </a>
    );
  }
  return (
    <Link className={className} to={lesson.to ?? '/home'}>
      Open lesson
      <span className="bt-btn__badge" aria-hidden="true">→</span>
    </Link>
  );
}

function KindTags({ lesson }: { lesson: CourseLesson }) {
  return (
    <div className="bt-idx__tags">
      <span className="bt-kind">{lesson.kind}</span>
      {lesson.access === 'open' ? (
        <span className="bt-kind bt-kind--open">Open to anybody</span>
      ) : (
        <span className="bt-kind bt-kind--code">
          <Lock size={11} aria-hidden="true" />
          Class code
        </span>
      )}
    </div>
  );
}

export default function CourseHome({
  course,
  progress,
  /** Set by the board when a square is clicked; cleared once it has landed. */
  flashId,
  onFlashed,
}: {
  course: Course;
  progress: CourseProgress;
  flashId: string | null;
  onFlashed: () => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');

  const filters = useMemo(() => filtersFor(course), [course]);
  const shown = course.lessons.filter(l => matches(l, filter));

  // Arriving from the board. A square can name a lesson the current filter is
  // hiding, so the filter clears first and the scroll waits for that render —
  // otherwise there is no row to scroll to.
  useEffect(() => {
    if (flashId) setFilter('all');
  }, [flashId]);

  useEffect(() => {
    if (!flashId || filter !== 'all') return;
    document.getElementById(`lesson-${flashId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const timer = window.setTimeout(onFlashed, 1400);
    return () => window.clearTimeout(timer);
  }, [flashId, filter, onFlashed]);

  // A course always opens on something that needs no code — that lesson is
  // the whole argument for a public course page, so it gets the dark panel.
  const first = course.lessons.find(l => l.access === 'open') ?? course.lessons[0];
  const openCount = course.lessons.filter(l => l.access === 'open').length;
  const handsOn = course.lessons.filter(l => l.kind === 'Lab' || l.kind === 'Practice').length;

  const siblings = COURSE_CODES.filter(c => c !== course.code);

  return (
    <div>
      {/* ══ Counts ═══════════════════════════════════════════════════════ */}
      <div className="bt-stats">
        <div>
          <b className="bt-tnum">{course.lessons.length}</b>
          <span>Lessons with a page on this site</span>
        </div>
        <div>
          <b className="bt-tnum">{openCount}</b>
          <span>Open to anybody, no code needed</span>
        </div>
        <div>
          <b className="bt-tnum">{handsOn}</b>
          <span>Labs and practice sets, not slides</span>
        </div>
        <div>
          <b className="bt-tnum">15</b>
          <span>Credits, Level 8</span>
        </div>
      </div>

      {/* ══ Start here ═══════════════════════════════════════════════════ */}
      <section id="start" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="If you read one thing"
            title="Start here"
            aside="The first lesson opens for anybody with the link. No account, nothing to install, and it is the real lesson rather than a course brochure."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-start">
            <p className="bt-eyebrow">Lesson 1 · {course.code}</p>
            <h3>{first.title}</h3>
            <p>{first.blurb}</p>
            <div className="bt-start__cta">
              <OpenLink lesson={first} className="bt-btn bt-btn--dark" />
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('lessons')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                See all {course.lessons.length}
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ The index ════════════════════════════════════════════════════ */}
      <section id="lessons" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="The whole course"
            title="Every lesson, in teaching order"
            stop="."
            aside="Each one assumes the one before it. Tick them off as you go — the board at the top of the page fills in, and it stays in this browser."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-filters">
            {filters.map(f => (
              <button
                key={f.id}
                type="button"
                className="bt-ctxchip"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
            <span className="bt-filters__note">
              {shown.length === course.lessons.length
                ? `Showing all ${course.lessons.length}`
                : `Showing ${shown.length} of ${course.lessons.length}`}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {shown.length === 0 ? (
            <p className="bt-empty">
              Nothing in this course carries that label yet. Choose <b>All {course.lessons.length}</b> to see the
              rest.
            </p>
          ) : (
            <ul className="bt-track">
              {shown.map(lesson => {
                const n = course.lessons.indexOf(lesson) + 1;
                const isDone = progress.isDone(lesson.id);
                return (
                  <li
                    key={lesson.id}
                    id={`lesson-${lesson.id}`}
                    className={`bt-trackrow bt-trackrow--idx${isDone ? ' bt-trackrow--done' : ''}${
                      flashId === lesson.id ? ' bt-trackrow--flash' : ''
                    }`}
                  >
                    <div className="bt-trackrow__n bt-tnum">{String(n).padStart(2, '0')}</div>
                    <div className="bt-trackrow__body">
                      <h3>{lesson.title}</h3>
                      <p>{lesson.blurb}</p>
                      <KindTags lesson={lesson} />
                    </div>
                    <div className="bt-idx__acts">
                      <OpenLink lesson={lesson} />
                      <button
                        type="button"
                        className="bt-tick"
                        aria-pressed={isDone}
                        aria-label={`${isDone ? 'Untick' : 'Tick off'} ${lesson.title}`}
                        onClick={() => progress.toggle(lesson.id)}
                      >
                        <i aria-hidden="true">
                          <Check size={13} strokeWidth={3} />
                        </i>
                        {isDone ? 'Done' : 'Mark done'}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Reveal>

        <Reveal delay={0.05}>
          <p className="bt-note">
            Lessons marked <b>Class code</b> ask for the code I give out in class. It is the same code for
            everything on this site, and it is not a login — nothing about you is stored either way.
          </p>
        </Reveal>
      </section>

      {/* ══ The descriptor ═══════════════════════════════════════════════ */}
      <section id="covers" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="From the course descriptor"
            title={course.outcomes.length > 0 ? 'What you leave being able to do' : 'What the course covers'}
            aside={
              course.outcomes.length > 0
                ? 'The learning outcomes as the descriptor words them. Every lesson above exists to serve one of these.'
                : 'The topics the course works through, in the order it works through them.'
            }
          />
        </Reveal>

        {course.outcomes.length > 0 && (
          <Reveal delay={0.05}>
            <div className="bt-lo">
              {course.outcomes.map(lo => (
                <div key={lo.n} className="bt-card">
                  <p className="bt-lo__n">{lo.n}</p>
                  <h4>{lo.short}</h4>
                  <p>{lo.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {course.assessments.length > 0 && (
          <Reveal delay={0.05}>
            <div className="bt-assess">
              {course.assessments.map(([weight, title, note]) => (
                <div key={title}>
                  <b className="bt-tnum">{weight}</b>
                  <div>
                    <h4>{title}</h4>
                    <p>{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <ul className="bt-topics" style={{ marginTop: 34 }}>
            {course.content.map((topic, i) => (
              <li key={topic}>
                <span className="bt-topics__n">{String(i + 1).padStart(2, '0')}</span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ══ Everything else ══════════════════════════════════════════════ */}
      <section id="more" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Beyond this course"
            title="The rest of the site"
            aside="Two things belong to no single course, and the other three courses have a page of their own laid out exactly like this one."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <ul className="bt-track bt-track--compact">
            {GENERAL_RESOURCES.map(item => (
              <li key={item.id} className="bt-trackrow bt-trackrow--idx">
                {/* No number: these are not a step in any course's sequence.
                    The empty gutter keeps them aligned with the index above. */}
                <div aria-hidden="true" />
                <div className="bt-trackrow__body">
                  <h3>{item.title}</h3>
                  <p>{item.blurb}</p>
                  <KindTags lesson={item} />
                </div>
                <div className="bt-idx__acts">
                  <OpenLink lesson={item} />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-siblings" style={{ marginTop: 34 }}>
            {siblings.map(code => {
              const other = COURSES[code as CourseHomeCode];
              return (
                <Link key={code} className="bt-sibling" to={courseHomePath(code as CourseHomeCode)}>
                  <span>{other.code}</span>
                  <h4>{other.name}</h4>
                  <p>
                    {other.lessons.length} {other.lessons.length === 1 ? 'lesson' : 'lessons'} ·{' '}
                    {other.lessons.filter(l => l.access === 'open').length} open with no code
                  </p>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
