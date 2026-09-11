import { Link } from 'react-router-dom';
import BrandLogo from '../components/ui/BrandLogo';
import IntroToBusinessAnalyticsLesson from '../components/public/IntroToBusinessAnalyticsLesson';

// Same plain, editorial approach as /intro-to-dbms: no gradient hero, no pill
// badges, one column, real course material below. See IntroToDBMSPage.tsx
// for the reasoning.

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

export default function IntroToBusinessAnalyticsPage() {
  return (
    <div style={{ fontFamily: FONT }} className="min-h-screen bg-white text-[#1d1d1f]">
      <nav className="border-b border-black/[0.08]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/home" className="no-underline">
            <BrandLogo iconSize={26} variant="on-light" />
          </Link>
          <span className="text-[12px] text-[#8e8e93]">MBI806B course page</span>
        </div>
      </nav>

      <header className="border-b border-black/[0.08] px-6 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0d9488]">
            MBI806B · Business Data Analytics with Visualisation and Decision-Making
          </p>
          <h1 className="mt-4 text-[34px] sm:text-[44px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#111827]">
            Welcome to MBI806B.
          </h1>
          <p className="mt-3 text-[14px] text-[#6b7280]">
            Session 1 &nbsp;·&nbsp; written by Yasas Sri Wickramasinghe
          </p>
          <div className="mt-6 max-w-2xl space-y-4 text-[16px] sm:text-[17px] leading-relaxed text-[#374151]">
            <p>
              I'm Yasas. This page covers our first session together: an introduction to AI and Machine
              Learning in a business setting, and how they connect to the decisions organisations make
              every day.
            </p>
            <p>
              If the words "AI" and "Machine Learning" sound a bit intimidating, that is completely
              normal, and it is exactly why we start here. You do not need any background in statistics,
              programming or data science for this course. By the end of today, those two terms will
              feel a lot more ordinary, and you will notice how often you already use them without
              realising it.
            </p>
            <p>
              Below is a real look at what today covers, in the same order we will actually go through it
              in class, plus what the whole course builds towards.
            </p>
          </div>
        </div>
      </header>

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
