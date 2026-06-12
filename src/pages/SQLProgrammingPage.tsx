import PublicLessonShell from '../components/public/PublicLessonShell';
import SQLProgrammingDeck from '../components/slides/SQLProgrammingDeck';

export default function SQLProgrammingPage() {
  return (
    <PublicLessonShell
      eyebrow="MBI802 · Database Management"
      titleLead="Let's make sense of"
      titleAccent="SQL."
      gradient="linear-gradient(90deg, #2563eb, #4a8ef5, #22d3ee)"
      accent="#2563eb"
      orb2="#22d3ee"
      orb3="#7c3aed"
      subtitle="The language databases actually speak. Create a database, build a table, drop in some rows, then ask it questions — one interactive slide at a time."
      pills={[
        { emoji: '🗄️', name: 'CREATE', color: '#2563eb' },
        { emoji: '➕', name: 'INSERT', color: '#0891b2' },
        { emoji: '🔍', name: 'SELECT', color: '#7c3aed' },
        { emoji: '⌨️', name: 'Live syntax', color: '#0d9488' },
      ]}
      embedPath="/sql-programming"
      embedTitle="MBI802 — SQL Programming"
    >
      <SQLProgrammingDeck />
    </PublicLessonShell>
  );
}
