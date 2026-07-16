import PublicLessonShell from '../components/public/PublicLessonShell';
import MBI800BonusLectureLesson from '../components/public/MBI800BonusLectureLesson';

export default function MBI800BonusLecturePage() {
  return (
    <PublicLessonShell
      eyebrow="MBI800 · Capstone Bonus Lecture"
      titleLead="Let's make sense of"
      titleAccent="shipping your own site."
      gradient="linear-gradient(90deg, #7c3aed, #4f46e5, #059669)"
      accent="#7c3aed"
      orb2="#4f46e5"
      orb3="#059669"
      subtitle="How to go from an idea to a live website in one sitting, using Google Stitch, Claude Code, and GitHub Pages."
      pills={[
        { emoji: '🎨', name: 'Google Stitch 2.0', color: '#7c3aed' },
        { emoji: '⌘', name: 'Claude Code (Web)', color: '#4f46e5' },
        { emoji: '🚀', name: 'GitHub Pages', color: '#059669' },
      ]}
    >
      <MBI800BonusLectureLesson />
    </PublicLessonShell>
  );
}
