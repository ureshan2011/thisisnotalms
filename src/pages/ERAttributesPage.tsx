import PublicLessonShell from '../components/public/PublicLessonShell';
import ERAttributeConstraintsDeck from '../components/slides/ERAttributeConstraintsDeck';

export default function ERAttributesPage() {
  return (
    <PublicLessonShell
      eyebrow="MBI802 · Data Modelling"
      titleLead="Let's make sense of"
      titleAccent="Attributes & Participation."
      gradient="linear-gradient(90deg, #0f766e, #14b8a6, #6366f1)"
      accent="#0f766e"
      orb2="#14b8a6"
      orb3="#6366f1"
      subtitle="The details that decide whether a model is right or wrong. Break attributes into their parts, then read participation constraints — when every row must join in, and when it's optional — through two guided activities."
      pills={[
        { emoji: '🧩', name: 'Composite attrs', color: '#0f766e' },
        { emoji: '➖', name: 'Partial', color: '#d97706' },
        { emoji: '➕', name: 'Total', color: '#dc2626' },
        { emoji: '✅', name: 'Activities + answers', color: '#6366f1' },
      ]}
    >
      <ERAttributeConstraintsDeck />
    </PublicLessonShell>
  );
}
