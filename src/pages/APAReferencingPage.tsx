import PublicLessonShell from '../components/public/PublicLessonShell';
import APAReferencingDeck from '../components/slides/APAReferencingDeck';

export default function APAReferencingPage() {
  return (
    <PublicLessonShell
      eyebrow="General Resources · Academic Writing Skills"
      titleLead="Let's make sense of"
      titleAccent="APA 7 Citations."
      gradient="linear-gradient(90deg, #4338ca, #6366f1, #f59e0b)"
      accent="#4338ca"
      orb2="#f59e0b"
      orb3="#0d9488"
      subtitle="Everything you need to cite correctly — from the first in-text citation to the last reference entry. A 14-slide interactive crash course with a practice quiz included."
      pills={[
        { emoji: '📝', name: 'In-text citations', color: '#4338ca' },
        { emoji: '📚', name: 'Reference list', color: '#0d9488' },
        { emoji: '⚠️', name: 'Common mistakes', color: '#e11d48' },
        { emoji: '✅', name: 'Practice quiz', color: '#059669' },
      ]}
    >
      <APAReferencingDeck />
    </PublicLessonShell>
  );
}
