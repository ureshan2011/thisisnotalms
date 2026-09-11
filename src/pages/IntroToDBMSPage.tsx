import PublicLessonShell from '../components/public/PublicLessonShell';
import IntroToDBMSLesson from '../components/public/IntroToDBMSLesson';

export default function IntroToDBMSPage() {
  return (
    <PublicLessonShell
      eyebrow="MBI802 · Database Management Systems"
      titleLead="Welcome to"
      titleAccent="Class 1."
      gradient="linear-gradient(90deg, #8b5cf6, #6366f1, #059669)"
      accent="#8b5cf6"
      orb2="#6366f1"
      orb3="#059669"
      subtitle="Eight classes, one goal: go from 'what even is a database' to designing, querying, and trusting one. Today we meet each other, meet the subject, and get MySQL running."
      pills={[
        { emoji: '🗄️', name: 'Database Management Systems', color: '#8b5cf6' },
        { emoji: '1️⃣', name: 'Class 1 of 8', color: '#6366f1' },
        { emoji: '🌍', name: 'Meet the class', color: '#059669' },
      ]}
      footerNote="This page collects a first name, a map pin and a one-line intro for today's live icebreaker — nothing else, no login required."
    >
      <IntroToDBMSLesson />
    </PublicLessonShell>
  );
}
