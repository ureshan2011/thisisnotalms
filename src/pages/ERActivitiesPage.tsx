import PublicLessonShell from '../components/public/PublicLessonShell';
import ERDiagramActivitiesDeck from '../components/slides/ERDiagramActivitiesDeck';

export default function ERActivitiesPage() {
  return (
    <PublicLessonShell
      eyebrow="MBI802 · Data Modelling"
      titleLead="Let's make sense of"
      titleAccent="ER Diagrams in practice."
      gradient="linear-gradient(90deg, #1d4ed8, #3b82f6, #06b6d4)"
      accent="#1d4ed8"
      orb2="#3b82f6"
      orb3="#06b6d4"
      subtitle="Theory only sticks when you build something. Model five real systems — a library, a university, a hospital, an online store and a hotel — and check your diagram against a worked answer."
      pills={[
        { emoji: '📚', name: 'Library', color: '#1d4ed8' },
        { emoji: '🎓', name: 'University', color: '#7c3aed' },
        { emoji: '🏥', name: 'Hospital', color: '#dc2626' },
        { emoji: '🛒', name: 'Online Store', color: '#059669' },
        { emoji: '🏨', name: 'Hotel', color: '#d97706' },
      ]}
    >
      <ERDiagramActivitiesDeck />
    </PublicLessonShell>
  );
}
