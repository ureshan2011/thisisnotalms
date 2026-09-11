import { ExternalLink } from 'lucide-react';
import CourseSection from './CourseSection';
import Reveal from './Reveal';

// ─── MBI802, Class 1: Introduction to Database Management Systems ─────────
// A public, ungated "Day 1" course page. Every example, SQL snippet, diagram
// and video thumbnail below is real material pulled from the actual course:
// the MBI802 study pack chapters (study-pack/content/mbi802/lessons), the
// real interactive lesson pages already live on this site, and the real
// video thumbnails already used on /normalisation-videos and the gated
// course hub. Nothing here is a generic stock example.

const BASE = import.meta.env.BASE_URL;

interface OutlineLink { label: string; to: string; }
interface OutlineLesson {
  n: string;
  title: string;
  subtitle: string;
  objective: string;
  links: OutlineLink[];
}

// Every lesson's `links` is empty for now: the interactive lesson pages
// they'd point to (/sql-programming, /er-diagrams, and so on) are still
// behind the platform's lesson password, and this page is meant to be
// openly shareable. Re-populate `links` once those pages are unlocked.
const OUTLINE: OutlineLesson[] = [
  {
    n: '01',
    title: 'Introduction to DBMS',
    subtitle: 'Data vs information, why file-based systems fail, the relational model, setting up MySQL.',
    objective: 'You are reading this lesson right now.',
    links: [],
  },
  {
    n: '02',
    title: 'SQL Programming Fundamentals',
    subtitle: 'The language of relational databases. Data types, CREATE, INSERT, and your first SELECT queries.',
    objective: 'Write DDL statements and insert your first rows into a real table.',
    links: [],
  },
  {
    n: '03',
    title: 'Advanced SQL Queries',
    subtitle: 'Filtering, sorting, safe UPDATE and DELETE, aggregate functions, and your first JOIN.',
    objective: 'Combine two related tables with an INNER JOIN.',
    links: [],
  },
  {
    n: '04',
    title: 'ER Diagrams Foundations',
    subtitle: "Chen's notation. Entities, attributes, keys, relationships, and cardinality.",
    objective: 'Draw a complete ER diagram from a written scenario.',
    links: [],
  },
  {
    n: '05',
    title: 'Advanced ER Concepts',
    subtitle: 'Weak entities, composite and multivalued attributes, and total vs partial participation.',
    objective: 'Apply the full Chen symbol set to a scenario you have not seen before.',
    links: [],
  },
  {
    n: '06',
    title: 'ER to Relational Mapping',
    subtitle: 'The eight rules that turn any ER diagram into a complete set of tables.',
    objective: 'Turn a diagram into a schema without guessing.',
    links: [],
  },
  {
    n: '07',
    title: 'Database Normalization',
    subtitle: 'Functional dependencies, 1NF through BCNF, and decomposing a messy table properly.',
    objective: 'Take a table that contradicts itself and split it until it does not.',
    links: [],
  },
  {
    n: '08',
    title: 'Consolidation & Exam Preparation',
    subtitle: 'The full pipeline from raw data to a normalized, queryable database. Where to go next.',
    objective: 'Build a small database end to end, on your own.',
    links: [],
  },
];

function Figure({ src, caption, maxWidth = 560 }: { src: string; caption: string; maxWidth?: number }) {
  return (
    <figure className="my-6">
      <div className="border border-black/[0.08] bg-[#fafafa] p-4 sm:p-5 overflow-x-auto transition-all duration-300 hover:border-[#6d28d9]/30 hover:shadow-[0_8px_24px_-12px_rgba(109,40,217,0.25)]">
        <img src={src} alt={caption} style={{ maxWidth, width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
      </div>
      <figcaption className="mt-2 text-[12.5px] text-[#8e8e93]">{caption}</figcaption>
    </figure>
  );
}

function Code({ children, title }: { children: string; title?: string }) {
  return (
    <div className="my-6 border border-black/[0.08] overflow-hidden transition-all duration-300 hover:border-[#6d28d9]/40 hover:shadow-[0_10px_28px_-14px_rgba(109,40,217,0.35)]">
      {title && (
        <div className="px-4 py-2 text-[11px] font-mono text-[#9ca3af] border-b border-white/10 bg-[#1c1c1e]">{title}</div>
      )}
      <pre className="bg-[#1c1c1e] text-[#e5e7eb] text-[12.5px] sm:text-[13px] leading-relaxed p-4 sm:p-5 overflow-x-auto font-mono whitespace-pre">
        {children}
      </pre>
    </div>
  );
}

const VIDEO_PREVIEWS = [
  { title: 'Normalization, Introduction', file: 'NormIntro.png' },
  { title: 'Normalization, Why Normalise?', file: 'NormWhy.png' },
  { title: 'Normalization, First Normal Form', file: 'Norm1NF.png' },
  { title: 'Advanced ER, Activity Walkthrough', file: 'Activity1.png' },
];

export default function IntroToDBMSLesson() {
  return (
    <div>
      {/* ── What MBI802 covers ── */}
      <section id="course" className="py-14 scroll-mt-16">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8e8e93]">What this course is</p>
          <h2 className="mt-2 font-semibold tracking-[-0.01em] text-[#111827] text-[24px] sm:text-[28px]">
            Database Management Systems.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] sm:text-[16px] leading-relaxed text-[#4b5563]">
            MBI802 is a 15 credit, Level 8 core course. No prerequisites, so everyone starts from the same
            place. Over the trimester you will design relational databases, query them with SQL, and think
            about who owns the data you are storing and why that matters. It is 150 learning hours in total.
            36 of those are in class, and 114 are yours, spent building and fixing things on your own.
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#4b5563]">
            By the end of the course, you should be able to do three things: make good decisions about who
            gets access to data and why, judge whether a database design will actually hold up under real use,
            and look at someone else's database and say what is wrong with it and how to fix it. Most of your
            career will be spent working with databases other people built, not ones you designed from
            scratch.
          </p>
        </Reveal>
      </section>

      {/* ── Lesson outline ── */}
      <CourseSection
        id="outline"
        eyebrow="The lesson outline"
        title="Eight lessons, in order."
        lead="This is the real structure of the course, the same one the study pack and the lesson plans follow. A few of these are already live as interactive lessons you can open right now. The rest, you will meet as we get there."
      >
        <div>
          {OUTLINE.map((lesson, i) => (
            <div
              key={lesson.n}
              className={`group grid grid-cols-[52px_1fr] sm:grid-cols-[64px_1fr] gap-4 sm:gap-6 py-6 px-3 -mx-3 rounded-sm transition-colors duration-300 hover:bg-[#6d28d9]/[0.03] ${i > 0 ? 'border-t border-black/[0.07]' : ''}`}
            >
              <div className="text-[28px] sm:text-[32px] font-bold tabular-nums text-[#d1d5db] transition-colors duration-300 group-hover:text-[#6d28d9]/60">{lesson.n}</div>
              <div>
                <h3 className="text-[16px] sm:text-[17px] font-semibold text-[#111827]">{lesson.title}</h3>
                <p className="mt-1 text-[13.5px] sm:text-[14px] leading-relaxed text-[#6b7280] max-w-xl">{lesson.subtitle}</p>
                <p className="mt-2 text-[13px] text-[#9ca3af] italic">{lesson.objective}</p>
                {lesson.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                    {lesson.links.map(l => (
                      <a
                        key={l.to}
                        href={`${BASE}#${l.to}`}
                        className="text-[13.5px] font-medium text-[#6d28d9] hover:underline"
                      >
                        {l.label} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CourseSection>

      {/* ── Preview walkthrough ── */}
      <CourseSection
        id="preview"
        eyebrow="A small preview"
        title="Here is some of what is coming."
        lead="These are only a few examples, pulled straight from the actual lessons. There is a lot more inside once we get going. I am showing you these so you have some idea what the course will actually feel like, not just what it is called."
      >
        <div className="space-y-14">
          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>First, we separate data from information.</strong> A number by itself does not tell you
              anything. The same number, given context, does. This is the first idea the whole course sits on,
              and it is simpler than it sounds.
            </p>
            <Figure src={`${BASE}mbi802/data-to-information.svg`} caption="From the Lesson 1 chapter: data becomes information through processing and context." />
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.1] text-left">
                    <th className="py-2 pr-4 font-semibold text-[#111827]">Quality information is</th>
                    <th className="py-2 font-semibold text-[#111827]">Meaning</th>
                  </tr>
                </thead>
                <tbody className="text-[#4b5563]">
                  <tr className="border-b border-black/[0.06]"><td className="py-2 pr-4 font-medium">Accurate</td><td className="py-2">Reflects reality. Wrong information is worse than none.</td></tr>
                  <tr className="border-b border-black/[0.06]"><td className="py-2 pr-4 font-medium">Complete</td><td className="py-2">Nothing essential is missing from the picture.</td></tr>
                  <tr className="border-b border-black/[0.06]"><td className="py-2 pr-4 font-medium">Timely</td><td className="py-2">Current, and available when the decision is made.</td></tr>
                  <tr><td className="py-2 pr-4 font-medium">Relevant</td><td className="py-2">Actually useful for the decision at hand.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>Then you start writing SQL.</strong> Not toy examples. A real table, real rows, and a
              query that actually returns something. This is the exact code from Lesson 2.
            </p>
            <Code title="lesson02_sql_fundamentals.sql">{`CREATE DATABASE school_db;
USE school_db;

CREATE TABLE students (
  id     INT PRIMARY KEY,
  name   VARCHAR(100),
  age    INT,
  email  VARCHAR(150),
  gpa    DECIMAL(3,2)
);

INSERT INTO students (id, name, age, email, gpa)
VALUES
  (1, 'Alice', 20, 'alice@uni.edu', 3.80),
  (2, 'Bob',   22, 'bob@uni.edu',   3.50),
  (3, 'Carol', 21, 'carol@uni.edu', 3.90);

SELECT name AS 'Student Name',
       gpa  AS 'Grade Point'
FROM   students;`}</Code>
            <p className="text-[13.5px] text-[#9ca3af]">
              A few lessons later, you'll do the same thing again, but with a table you designed yourself, for
              a scenario chosen for you: a library, a hospital, a hotel, a gym. Everyone gets a different one.
            </p>
          </div>

          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>A few classes in, we design before we build.</strong> I like to compare it to an
              architect's drawing. An architect plans the rooms before anyone pours concrete. We plan the
              tables before anyone writes CREATE TABLE. This is Chen's notation, the diagramming style we use
              for the whole course.
            </p>
            <Figure src={`${BASE}mbi802/chen-shapes.svg`} caption="From the Lesson 4 chapter: the four Chen notation shapes, and what each one becomes in the database." />
          </div>

          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>By Lesson 7, we clean up a table that was never designed properly.</strong> This is a
              real example from the normalization chapter. It tries to record students, departments and
              courses all in one table.
            </p>
            <div className="overflow-x-auto my-6 border border-black/[0.08]">
              <table className="w-full text-[12.5px] border-collapse">
                <thead>
                  <tr className="bg-[#fafafa] text-left border-b border-black/[0.08]">
                    <th className="py-2 px-3 font-semibold text-[#111827]">StudentID</th>
                    <th className="py-2 px-3 font-semibold text-[#111827]">Name</th>
                    <th className="py-2 px-3 font-semibold text-[#111827]">Dept</th>
                    <th className="py-2 px-3 font-semibold text-[#111827]">DeptHead</th>
                    <th className="py-2 px-3 font-semibold text-[#b3261e]">Courses</th>
                    <th className="py-2 px-3 font-semibold text-[#b3261e]">Instructor</th>
                  </tr>
                </thead>
                <tbody className="text-[#4b5563]">
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 px-3">S1</td><td className="py-2 px-3">Alice</td><td className="py-2 px-3">CS</td><td className="py-2 px-3">Dr. Smith</td>
                    <td className="py-2 px-3 text-[#b3261e]">DB, OS, Networks</td><td className="py-2 px-3 text-[#b3261e]">Lee, Ray, Kim</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">S2</td><td className="py-2 px-3">Bob</td><td className="py-2 px-3">CS</td><td className="py-2 px-3">Dr. Smith</td>
                    <td className="py-2 px-3 text-[#b3261e]">DB, AI</td><td className="py-2 px-3 text-[#b3261e]">Lee, Patel</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[14px] leading-relaxed text-[#4b5563]">
              If Dr. Smith leaves, every CS row needs updating, and it is easy to miss one. That is an update
              anomaly, one of three problems this design has. We will name all three, then split this into
              clean tables that do not contradict themselves.
            </p>
            <Figure src={`${BASE}mbi802/nf-ladder.svg`} caption="From the Lesson 7 chapter: the normalization ladder, 1NF through BCNF." maxWidth={480} />
          </div>

          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>And some of it, you will just watch.</strong> You will receive a video recording for
              every lecture, plus additional video resources on top of that. These are a few of the actual
              thumbnails from inside the course.
            </p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VIDEO_PREVIEWS.map(v => (
                <div key={v.file} className="group">
                  <div className="border border-black/[0.08] overflow-hidden">
                    <img src={`${BASE}${v.file}`} alt={v.title} className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
                  </div>
                  <p className="mt-1.5 text-[12px] leading-snug text-[#6b7280]">{v.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CourseSection>

      {/* ── Things you'll build ── */}
      <CourseSection
        id="practice"
        eyebrow="What you'll actually do"
        title="Things you will build or practise."
        lead="Not hypothetical exercises. These are the real activities from the course."
      >
        <ul className="space-y-4 max-w-2xl">
          {[
            ['Fix a hospital’s spreadsheet problem', 'A hospital keeps patient records in Excel. In Lesson 1 we work out, in pairs, exactly what goes wrong and why a database fixes it.'],
            ['Write your first working queries', 'CREATE a table, INSERT real rows, and get a real result back from SELECT. Then filter it, sort it, and join it to a second table.'],
            ['Model a real system as an ER diagram', 'Five scenarios to choose from: a library, a university, a hospital, an online store, a hotel. You draw the diagram, then check it against a worked answer.'],
            ['Get your own SQL scenario', 'Later in the course you get a personal, randomly assigned scenario, a library, a gym, a car rental company, and build a small working database for it from scratch.'],
            ['Decompose a table that contradicts itself', 'Take an unnormalized table with real update and deletion problems, and split it, step by step, into a clean design.'],
          ].map(([title, body]) => (
            <li key={title} className="border-l-2 border-[#6d28d9]/30 pl-4">
              <p className="text-[14.5px] font-semibold text-[#111827]">{title}</p>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#6b7280]">{body}</p>
            </li>
          ))}
        </ul>
      </CourseSection>

      {/* ── More resources ── */}
      <CourseSection
        id="resources"
        eyebrow="Beyond this page"
        title="There is more waiting through the course."
        lead="A few things you will get access to as we go, not all of it visible from here."
      >
        <ul className="space-y-3 max-w-2xl text-[14.5px] text-[#4b5563]">
          <li>
            A full written study pack for MBI802, typeset as a proper book with worked examples and answer
            keys.
          </li>
          <li>
            A 38 question knowledge check at the end of the DBMS section, and a separate 20 question ER
            check, both with instant feedback and, if you do well, a badge.
          </li>
          <li>
            A TA verified SQL practice lab. You get a personal scenario, build the database, and a teaching
            assistant checks your work directly.
          </li>
          <li>
            Nine genuinely free database certifications you can add to your profile once you are comfortable
            with SQL.
          </li>
        </ul>
      </CourseSection>

      {/* ── Sign off ── */}
      <section className="border-t border-black/[0.08] py-14">
        <Reveal>
          <p className="text-[13px] font-medium text-[#6b7280] inline-flex items-center gap-1.5">
            Yasas Sri Wickramasinghe
            <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#6d28d9] hover:underline">
              MBI802 lecturer <ExternalLink size={11} />
            </a>
          </p>
        </Reveal>
      </section>
    </div>
  );
}
