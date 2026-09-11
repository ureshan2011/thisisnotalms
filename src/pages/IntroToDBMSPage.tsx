import { Link } from 'react-router-dom';
import BrandLogo from '../components/ui/BrandLogo';
import IntroToDBMSLesson from '../components/public/IntroToDBMSLesson';
import CourseHero from '../components/public/CourseHero';
import CourseStickyNav from '../components/public/CourseStickyNav';
import DatabaseScene from '../components/public/scenes/DatabaseScene';

// This page intentionally does not use PublicLessonShell. That shell is
// built for the other public lessons; this one gets its own hero
// (CourseHero) with an ambient 3D scene, but keeps the same plain,
// editorial body below it — real course material, not decorative filler.

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';
const ACCENT = '#6d28d9';

const NAV_ITEMS = [
  { id: 'course', label: 'Course' },
  { id: 'outline', label: 'Outline' },
  { id: 'preview', label: 'Preview' },
  { id: 'practice', label: 'Practice' },
  { id: 'resources', label: 'Resources' },
];

export default function IntroToDBMSPage() {
  return (
    <div style={{ fontFamily: FONT }} className="min-h-screen bg-white text-[#1d1d1f]">
      <nav className="relative z-50 border-b border-black/[0.08] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/home" className="no-underline">
            <BrandLogo iconSize={26} variant="on-light" />
          </Link>
          <span className="text-[12px] text-[#8e8e93]">MBI802 course page</span>
        </div>
      </nav>

      <CourseHero
        eyebrow="MBI802 · Database Management Systems"
        title="Welcome to the course."
        meta="Class 1 of 8 · written by Yasas Sri Wickramasinghe, MBI802 lecturer"
        intro="MBI802 is an introduction to database management systems. This page covers the course outline, the learning objectives, and examples from the lessons."
        accent={ACCENT}
        orb2="#059669"
        Scene={DatabaseScene}
      />

      <CourseStickyNav items={NAV_ITEMS} accent={ACCENT} />

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
