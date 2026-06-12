import PublicLessonShell from '../components/public/PublicLessonShell';
import ERDiagramsDeck from '../components/slides/ERDiagramsDeck';

export default function ERDiagramsPage() {
  return (
    <PublicLessonShell
      eyebrow="MBI802 · Data Modelling"
      titleLead="Let's make sense of"
      titleAccent="ER Diagrams."
      gradient="linear-gradient(90deg, #0d7a72, #14b8a6, #0ea5e9)"
      accent="#0d7a72"
      orb2="#14b8a6"
      orb3="#0ea5e9"
      subtitle="Before a single table exists, you sketch the world it describes. Meet entities, attributes and relationships in Chen's notation — and learn to read cardinality at a glance."
      pills={[
        { emoji: '🔷', name: 'Entities', color: '#0d7a72' },
        { emoji: '🟡', name: 'Attributes', color: '#ca8a04' },
        { emoji: '◇', name: 'Relationships', color: '#0ea5e9' },
        { emoji: '↔️', name: '1:1 · 1:N · M:N', color: '#7c3aed' },
      ]}
    >
      <ERDiagramsDeck />
    </PublicLessonShell>
  );
}
