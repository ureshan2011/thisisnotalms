import { Link } from 'react-router-dom';
import BrandLogo from '../components/ui/BrandLogo';
import IntroToDBMSLesson from '../components/public/IntroToDBMSLesson';

// This page intentionally does not use PublicLessonShell. That shell is
// built for the other public lessons (a full-bleed hero, drifting colour
// orbs, pill badges) and works well there, but this page is meant to read
// like a course page a lecturer put together, not a product landing page.
// Plain masthead, one column, real course material below.

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

export default function IntroToDBMSPage() {
  return (
    <div style={{ fontFamily: FONT }} className="min-h-screen bg-white text-[#1d1d1f]">
      <nav className="border-b border-black/[0.08]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/home" className="no-underline">
            <BrandLogo iconSize={26} variant="on-light" />
          </Link>
          <span className="text-[12px] text-[#8e8e93]">MBI802 course page</span>
        </div>
      </nav>

      <header className="border-b border-black/[0.08] px-6 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#6d28d9]">
            MBI802 · Database Management Systems
          </p>
          <h1 className="mt-4 text-[34px] sm:text-[44px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#111827]">
            Welcome to the course.
          </h1>
          <p className="mt-3 text-[14px] text-[#6b7280]">
            Class 1 of 8 &nbsp;·&nbsp; written by Yasas Sri Wickramasinghe, MBI802 lecturer
          </p>
          <div className="mt-6 max-w-2xl space-y-4 text-[16px] sm:text-[17px] leading-relaxed text-[#374151]">
            <p>
              MBI802 is an introduction to database management systems. This page covers the course
              outline, the learning objectives, and examples from the lessons.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6">
        <IntroToDBMSLesson />
      </main>

      <footer className="border-t border-black/[0.08] px-6 py-10">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <BrandLogo iconSize={22} variant="on-light" />
          <p className="text-[12px] text-[#9ca3af]">
            No login required.
          </p>
        </div>
      </footer>
    </div>
  );
}
