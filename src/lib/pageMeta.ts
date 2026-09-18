import { COURSES, COURSE_CODES, GENERAL_RESOURCES, courseHomePath } from '../content/courses';

// ─── What the browser tab, and a shared link, should say ──────────────────
// The site began as a single Extended Reality lesson, and index.html still
// carried that page's <title> and description long after it grew into a
// platform — so every route, from the DBMS lesson to the lecturer console,
// announced itself as "Not a LMS · Extended Reality lesson". A single-page
// app never reloads index.html, so nothing was going to correct it: the title
// has to be set per route, in JavaScript.
//
// Most of it is derived rather than typed out. Every lesson and course
// already has a name and a one-line description in src/content/courses.ts,
// so a new lesson published there gets its own title with no edit here. The
// map below covers only what the registry does not: the launchpad, the app's
// own screens, and the two aliases that redirect.

export const SITE_NAME = 'Not a LMS';
export const SITE_DESCRIPTION =
  'Hands-on, interactive lessons in databases, information systems planning, IT project management and business analytics, by Yasas Sri Wickramasinghe. No logins, no busywork — everything runs in your own browser.';

export interface PageMeta {
  title: string;
  description: string;
}

/** Routes the course registry knows nothing about. A title, and a
 *  description only where there is a real one to give — an invented sentence
 *  about the sign-in screen would be worse than the site's own. */
const EXPLICIT: Record<string, string | [string, string]> = {
  '/': [
    `${SITE_NAME} · Yasas Sri Wickramasinghe`,
    SITE_DESCRIPTION,
  ],
  '/home': [
    `${SITE_NAME} · Yasas Sri Wickramasinghe`,
    SITE_DESCRIPTION,
  ],

  // In the registry as a static file rather than a route, so it has no `to`
  // for the lookup below to match.
  '/security-lab': 'SwiftShop security lab · MBI802',

  // The study pack hub serves two courses, so neither code belongs in it.
  '/study-packs': [
    'Study packs · MBI800 and MBI802',
    'Both courses rewritten as properly typeset books, with worked examples, practice questions and answer keys. Download and keep.',
  ],

  '/vote': 'Class vote',
  '/vote/admin': 'Class vote · Results',
  '/login': `Sign in · ${SITE_NAME}`,
  '/register': `Create an account · ${SITE_NAME}`,
  '/hall-of-fame': `Hall of fame · ${SITE_NAME}`,
  '/alumni': `Alumni wall · ${SITE_NAME}`,

  '/student/dashboard': `Dashboard · ${SITE_NAME}`,
  '/student/profile': `Your profile · ${SITE_NAME}`,
  '/student/attendance': `Your attendance · ${SITE_NAME}`,
  '/student/history': `Your history · ${SITE_NAME}`,
  '/student/course-resources': `Course resources · ${SITE_NAME}`,
  '/student/playground': `Playground · ${SITE_NAME}`,
  '/student/notices': `Notice board · ${SITE_NAME}`,
  '/student/sql-race': `SQL race · ${SITE_NAME}`,
  '/student/daily-duel': `Daily duel · ${SITE_NAME}`,
  '/student/arena': `Arena · ${SITE_NAME}`,
  '/student/sql-exam': `SQL exam · ${SITE_NAME}`,
  '/student/skill-passport': `Skill passport · ${SITE_NAME}`,
  '/student/kudos': `Kudos · ${SITE_NAME}`,
  '/student/time-capsule': `Time capsule · ${SITE_NAME}`,

  '/lecturer/dashboard': `Lecturer console · ${SITE_NAME}`,
  '/lecturer/students': `Students · Lecturer console`,
  '/lecturer/attendance': `Attendance · Lecturer console`,
  '/lecturer/course-resources': `Course resources · Lecturer console`,
  '/lecturer/playground': `Live playground · Lecturer console`,
  '/lecturer/notices': `Notice board · Lecturer console`,
  '/lecturer/analytics': `Site analytics · Lecturer console`,
  '/lecturer/video-manager': `Video lessons · Lecturer console`,
  '/lecturer/sql-race': `SQL race · Lecturer console`,
  '/lecturer/daily-duel': `Daily duel · Lecturer console`,
  '/lecturer/class-countdown': `Class countdown · Lecturer console`,
  '/lecturer/classroom': `Classroom · Lecturer console`,
};

/** Dynamic and nested routes, longest prefix first so /student/arena/duel
 *  does not answer to the bare /student entry. */
const PREFIXES: [string, string][] = [
  ['/student/arena/duel', `Duel room · ${SITE_NAME}`],
  ['/lecturer/students', `Students · Lecturer console`],
  ['/lecturer/attendance', `Attendance · Lecturer console`],
  ['/attend', `Mark your attendance · ${SITE_NAME}`],
  ['/certificate', `Certificate · ${SITE_NAME}`],
  ['/student', `Your learning · ${SITE_NAME}`],
  ['/lecturer', `Lecturer console · ${SITE_NAME}`],
];

/** The US-spelling routes redirect, but the title would flash the wrong page
 *  in between, so they answer to the same entry as their canonical form. */
const ALIASES: Record<string, string> = {
  '/normalization': '/normalisation',
  '/normalization-activities': '/normalisation-activities',
  '/normalization-videos': '/normalisation-videos',
  '/er-to-relational': '/er-mapping',
  '/student/mbi802-resources': '/student/course-resources',
  '/lecturer/mbi802-resources': '/lecturer/course-resources',
};

/** Every course home and every lesson that has a route, built once from the
 *  registry. A lesson added there turns up here without an edit. */
function buildFromRegistry(): Record<string, PageMeta> {
  const out: Record<string, PageMeta> = {};

  for (const code of COURSE_CODES) {
    const course = COURSES[code];
    out[courseHomePath(code)] = {
      title: `${course.name} · ${course.code}`,
      description: course.lede,
    };
    for (const lesson of course.lessons) {
      // `to` is absent on the static-file lessons, and the first course to
      // claim a shared route wins — /study-packs is overridden explicitly
      // below for exactly that reason.
      if (!lesson.to || out[lesson.to]) continue;
      out[lesson.to] = { title: `${lesson.title} · ${course.code}`, description: lesson.blurb };
    }
  }

  for (const item of GENERAL_RESOURCES) {
    if (!item.to || out[item.to]) continue;
    out[item.to] = { title: `${item.title} · ${SITE_NAME}`, description: item.blurb };
  }

  return out;
}

const REGISTRY = buildFromRegistry();

function fromExplicit(path: string): PageMeta | null {
  const entry = EXPLICIT[path];
  if (!entry) return null;
  return typeof entry === 'string'
    ? { title: entry, description: SITE_DESCRIPTION }
    : { title: entry[0], description: entry[1] };
}

/** The title and description for a route. Never throws and never returns
 *  nothing: an unknown path gets the site's own, which is still true of it. */
export function resolvePageMeta(pathname: string): PageMeta {
  // A hash route can carry a query string or a trailing slash.
  const path = (pathname.split('?')[0].replace(/\/+$/, '') || '/').toLowerCase();
  const canonical = ALIASES[path] ?? path;

  const explicit = fromExplicit(canonical);
  if (explicit) return explicit;

  const known = REGISTRY[canonical];
  if (known) return known;

  const prefix = PREFIXES.find(([p]) => canonical === p || canonical.startsWith(`${p}/`));
  if (prefix) return { title: prefix[1], description: SITE_DESCRIPTION };

  return { title: SITE_NAME, description: SITE_DESCRIPTION };
}
