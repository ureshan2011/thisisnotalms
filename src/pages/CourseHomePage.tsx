import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CoursePage } from '../components/blend';
import CourseHome from '../components/public/CourseHome';
import CourseBoard from '../components/public/course/CourseBoard';
import useCourseProgress from '../components/public/course/useCourseProgress';
import { COURSES, type CourseHomeCode } from '../content/courses';

// ─── The four course home pages ───────────────────────────────────────────
// /mbi800, /mbi802, /mbi804 and /mbi806b. One component serves all four,
// because four hand-maintained copies of the same page drift apart the first
// time a lesson is added to one of them. What differs between the courses —
// the accent, the title, the lesson list, the descriptor — is data in
// src/content/courses.ts, and the pages are generated from it.
//
// Built on Blend (src/components/blend/README.md), so each course keeps its
// own hue inside one visual language: MBI800's indigo, MBI802's warm orange,
// MBI804's plum, MBI806B's teal.
//
// These pages are ungated on purpose — they are the link I hand to somebody
// deciding whether to take the course, and to a student who wants the whole
// index rather than the one lesson they were sent. That is also why they are
// listed in LessonPasswordGate's EXCLUDED_PREFIXES, alongside the four public
// lesson pages they open onto.
//
// The hero object is the reader's own progress board rather than a picture of
// the subject: on an index page, the useful thing to show somebody is where
// they are up to, and it is the one element on the page that a course
// brochure could not have.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'start', label: 'Start here' },
  { id: 'lessons', label: 'Every lesson' },
  { id: 'covers', label: 'What it covers' },
  { id: 'more', label: 'Other courses' },
];

export default function CourseHomePage({ code }: { code: CourseHomeCode }) {
  const course = COURSES[code];
  const progress = useCourseProgress(code);
  const [flashId, setFlashId] = useState<string | null>(null);

  const first = course.lessons.find(l => l.access === 'open') ?? course.lessons[0];
  const onFlashed = useCallback(() => setFlashId(null), []);

  return (
    <CoursePage
      accent={course.accent}
      courseCode={course.code}
      courseName={course.name}
      nav={NAV}
      footerNote="Every lesson listed here runs in your own browser. Nothing on this page is tracked, and what you tick off never leaves the device you ticked it on."
      hero={
        <div className="bt-herogrid bt-hero--title">
          <div>
            <motion.span
              className="bt-flag"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {course.code} · course home
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              {course.headline[0]}
              <br />
              {course.headline[1]}
              <span className="bt-stop">.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              {course.lede}
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              {course.meta}
            </motion.p>

            <motion.div
              className="bt-hero__cta"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.3 }}
            >
              {first.href ? (
                <a className="bt-btn" href={import.meta.env.BASE_URL + first.href}>
                  Start lesson 1
                  <span className="bt-btn__badge" aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link className="bt-btn" to={first.to ?? '/home'}>
                  Start lesson 1
                  <span className="bt-btn__badge" aria-hidden="true">→</span>
                </Link>
              )}
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('lessons')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                See all {course.lessons.length}
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <CourseBoard
              lessons={course.lessons}
              done={progress.done}
              onJump={setFlashId}
              onClear={progress.clear}
            />
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span>{course.keyline}</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <CourseHome course={course} progress={progress} flashId={flashId} onFlashed={onFlashed} />
    </CoursePage>
  );
}
