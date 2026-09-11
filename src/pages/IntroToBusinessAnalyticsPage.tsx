import { Link } from 'react-router-dom';
import BrandLogo from '../components/ui/BrandLogo';
import IntroToBusinessAnalyticsLesson from '../components/public/IntroToBusinessAnalyticsLesson';
import CourseHero from '../components/public/CourseHero';
import CourseStickyNav from '../components/public/CourseStickyNav';
import AnalyticsScene from '../components/public/scenes/AnalyticsScene';

// Same approach as IntroToDBMSPage.tsx: a CourseHero with an ambient 3D
// scene, then the same plain, editorial body underneath.

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';
const ACCENT = '#0f766e';

const NAV_ITEMS = [
  { id: 'course', label: 'Course' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'preview', label: 'Preview' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'setup', label: 'Power BI setup' },
];

export default function IntroToBusinessAnalyticsPage() {
  return (
    <div style={{ fontFamily: FONT }} className="min-h-screen bg-white text-[#1d1d1f]">
      <nav className="relative z-50 border-b border-black/[0.08] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/home" className="no-underline">
            <BrandLogo iconSize={26} variant="on-light" />
          </Link>
          <span className="text-[12px] text-[#8e8e93]">MBI806B course page</span>
        </div>
      </nav>

      <CourseHero
        eyebrow="MBI806B · Business Data Analytics with Visualisation and Decision-Making"
        title="Welcome to MBI806B."
        meta="Session 1 · written by Yasas Sri Wickramasinghe"
        intro="MBI806B is an introduction to business data analytics, using AI and machine learning to support business decisions. This page covers the course outline, the learning outcomes, and examples from the material. No background in statistics, programming or data science is required."
        accent={ACCENT}
        orb2="#f59e0b"
        Scene={AnalyticsScene}
      />

      <CourseStickyNav items={NAV_ITEMS} accent={ACCENT} />

      <main className="mx-auto max-w-3xl px-6">
        <IntroToBusinessAnalyticsLesson />
      </main>

      <footer className="border-t border-black/[0.08] px-6 py-10">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <BrandLogo iconSize={22} variant="on-light" />
          <p className="text-[12px] text-[#9ca3af]">
            Nothing on this page is tracked or collected. No login required.
          </p>
        </div>
      </footer>
    </div>
  );
}
