import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CourseBrand from './CourseBrand';
import PillNav, { type NavItem } from './PillNav';
import { COURSE_CODES, courseHomePath, type CourseHomeCode } from '../../content/courses';
import '../../styles/blend.css';

// The whole outer frame of a Blend course page: brand header, floating pill
// nav, hero slot, content column and dark footer. A new lesson page supplies
// a hero, a nav list and its body, and gets the rest for free.
//
// Everything lives inside `.bt`, so the theme's tokens and classes never
// reach the rest of the app.
//
// The course code in the header is a link back to that course's home page
// whenever one exists, so every Blend page — including any added later — has
// a way up to its own index without each page wiring one itself. On the home
// page itself the link would point at the page you are on, so it stays text.

export type BlendAccent = 'default' | 'analytics' | 'planning' | 'project';

export default function CoursePage({
  accent = 'default',
  courseCode,
  courseName,
  nav,
  hero,
  footerNote = 'Everything on this page runs in your own browser. No login, no personal data collected.',
  children,
}: {
  /** Which accent ramp to run on. See src/styles/blend.css for the variants. */
  accent?: BlendAccent;
  /** Short code shown in the pill nav, e.g. "MBI806B". */
  courseCode: string;
  /** Full course name, shown beside the brand and in the footer. */
  courseName: string;
  nav: NavItem[];
  /** The hero block. Usually a `.bt-herogrid` with copy left and an object right. */
  hero: ReactNode;
  footerNote?: string;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const home = COURSE_CODES.includes(courseCode as CourseHomeCode)
    ? courseHomePath(courseCode as CourseHomeCode)
    : null;
  const showHomeLink = home !== null && home !== pathname;

  return (
    <div className={`bt${accent === 'default' ? '' : ` bt--${accent}`}`} style={{ minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div
          className="bt-wrap"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBlock: 14, flexWrap: 'wrap' }}
        >
          <Link to="/home" style={{ textDecoration: 'none' }} aria-label="Back to the home page">
            <CourseBrand size={28} />
          </Link>
          {showHomeLink ? (
            <Link
              to={home}
              style={{ fontSize: 12.5, color: 'var(--ink-400)', textDecoration: 'none' }}
              title={`All ${courseCode} lessons`}
            >
              <span style={{ borderBottom: '1px solid var(--border-subtle)' }}>{courseCode}</span> · {courseName}
            </Link>
          ) : (
            <span style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>
              {courseCode} · {courseName}
            </span>
          )}
        </div>
      </header>

      <PillNav label={courseCode} items={nav} />

      <div className="bt-wrap bt-hero">{hero}</div>

      <main className="bt-wrap">{children}</main>

      <footer className="bt-footer">
        <div className="bt-footer__row">
          <div>
            <CourseBrand size={26} variant="on-dark" />
            <p style={{ marginTop: 12, color: 'var(--ink-400)' }}>
              {courseCode} · {courseName}
            </p>
          </div>
          <p style={{ maxWidth: '40ch' }}>{footerNote}</p>
        </div>
      </footer>
    </div>
  );
}
