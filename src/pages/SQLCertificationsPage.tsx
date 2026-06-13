import PublicLessonShell from '../components/public/PublicLessonShell';
import SQLCertificationsLesson from '../components/public/SQLCertificationsLesson';

export default function SQLCertificationsPage() {
  return (
    <PublicLessonShell
      eyebrow="MBI802 · Database Management"
      titleLead="Let's make sense of"
      titleAccent="free SQL certifications."
      gradient="linear-gradient(90deg, #7c3aed, #6d28d9, #dc2626)"
      accent="#7c3aed"
      orb2="#6d28d9"
      orb3="#dc2626"
      subtitle="Nine genuinely free credentials — from Oracle vendor badges to IBM digital badges to project-based certs. Earn one, put it on LinkedIn, and let your skills speak for themselves."
      pills={[
        { emoji: '🏅', name: 'Oracle badge', color: '#dc2626' },
        { emoji: '✅', name: 'HackerRank cert', color: '#059669' },
        { emoji: '🎓', name: 'IBM badge', color: '#1d4ed8' },
        { emoji: '🆓', name: 'All 100% free', color: '#7c3aed' },
      ]}
    >
      <SQLCertificationsLesson />
    </PublicLessonShell>
  );
}
