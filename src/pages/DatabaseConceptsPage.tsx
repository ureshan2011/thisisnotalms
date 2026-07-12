import PublicLessonShell from '../components/public/PublicLessonShell';
import DatabaseConceptsLesson from '../components/slides/DatabaseConceptsLesson';

export default function DatabaseConceptsPage() {
  return (
    <PublicLessonShell
      eyebrow="MBI802 · Database Management"
      titleLead="Let's make sense of"
      titleAccent="Advanced Database Concepts"
      gradient="linear-gradient(90deg, #2563eb, #0d9488, #7c3aed)"
      accent="#2563eb"
      orb2="#0d9488"
      orb3="#dc2626"
      subtitle="One database, one table, built up step by step. We create it, shape it, back it up, sort it and count it, then take a plain-English, hands-on look at SQL injection."
      pills={[
        { emoji: '🗄️', name: 'Table design', color: '#2563eb' },
        { emoji: '🔗', name: 'Foreign keys & CASCADE', color: '#0891b2' },
        { emoji: '💾', name: 'Backup & restore', color: '#b45309' },
        { emoji: '🛡️', name: 'SQL injection', color: '#dc2626' },
      ]}
    >
      <DatabaseConceptsLesson />
    </PublicLessonShell>
  );
}
