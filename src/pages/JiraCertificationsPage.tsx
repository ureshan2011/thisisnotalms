import PublicLessonShell from '../components/public/PublicLessonShell';
import JiraCertificationsLesson from '../components/public/JiraCertificationsLesson';

export default function JiraCertificationsPage() {
  return (
    <PublicLessonShell
      eyebrow="Career development · Project Management"
      titleLead="Let's make sense of"
      titleAccent="free Jira & Agile certifications."
      gradient="linear-gradient(90deg, #0052CC, #0A66C2, #059669)"
      accent="#0052CC"
      orb2="#0A66C2"
      orb3="#059669"
      subtitle="Three hand-picked Jira and Agile credentials — Atlassian's own learning path, a LinkedIn Professional Certificate, and a quick free certificate. Earn one, put it on LinkedIn, and let your skills speak for themselves."
      pills={[
        { emoji: '🔷', name: 'Atlassian path', color: '#0052CC' },
        { emoji: '🎓', name: 'LinkedIn certificate', color: '#0A66C2' },
        { emoji: '🏆', name: 'Free completion cert', color: '#059669' },
        { emoji: '🆓', name: 'Free to access', color: '#7c3aed' },
      ]}
    >
      <JiraCertificationsLesson />
    </PublicLessonShell>
  );
}
