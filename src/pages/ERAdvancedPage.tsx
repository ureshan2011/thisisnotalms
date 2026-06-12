import PublicLessonShell from '../components/public/PublicLessonShell';
import ERAdvancedConceptsDeck from '../components/slides/ERAdvancedConceptsDeck';

export default function ERAdvancedPage() {
  return (
    <PublicLessonShell
      eyebrow="MBI802 · Data Modelling"
      titleLead="Let's make sense of"
      titleAccent="Advanced ER Concepts."
      gradient="linear-gradient(90deg, #3b82f6, #6366f1, #a855f7)"
      accent="#3b82f6"
      orb2="#6366f1"
      orb3="#a855f7"
      subtitle="Real data is messier than the textbook. Tackle the entities that can't stand on their own, the relationships that identify them, and attributes that are multivalued or derived — with two exercises to test yourself."
      pills={[
        { emoji: '🪶', name: 'Weak entities', color: '#3b82f6' },
        { emoji: '🔗', name: 'Identifying rels', color: '#6366f1' },
        { emoji: '📦', name: 'Multivalued', color: '#a855f7' },
        { emoji: '🧮', name: 'Derived', color: '#0d9488' },
      ]}
      embedPath="/er-advanced"
      embedTitle="MBI802 — Advanced ER Concepts"
    >
      <ERAdvancedConceptsDeck />
    </PublicLessonShell>
  );
}
