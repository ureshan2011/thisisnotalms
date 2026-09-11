import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import CourseBrand from './CourseBrand';
import PillNav, { type NavItem } from './PillNav';
import '../../styles/blend.css';

// The whole outer frame of a Blend course page: brand header, floating pill
// nav, hero slot, content column and dark footer. A new lesson page supplies
// a hero, a nav list and its body, and gets the rest for free.
//
// Everything lives inside `.bt`, so the theme's tokens and classes never
// reach the rest of the app.

export type BlendAccent = 'default' | 'analytics';

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
          <span style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>
            {courseCode} · {courseName}
          </span>
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
