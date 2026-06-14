import PublicLessonShell from '../components/public/PublicLessonShell';
import VideoGallery, { type VideoClip } from '../components/slides/VideoGallery';

const BASE = import.meta.env.BASE_URL;

// Built-in normalization video lessons (SharePoint links — open in a new tab).
const NORMALIZATION_VIDEOS: VideoClip[] = [
  {
    title: 'Normalization – Introduction',
    description: 'Introductory video for Database Normalization & Functional Dependencies',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQAowdJDkOhQTq1zdGLQEhuVAVOSCBFxoYfC_6R_udOvPx8?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=tDjwog',
    thumbnailUrl: `${BASE}NormIntro.png`,
  },
  {
    title: 'Normalization – Why Normalise?',
    description: 'Understanding the need for database normalization',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQB8pA9SvlmuQ7FBkSDvkwuAAabog23pf1imS32sfOJWjnU?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=y0Xrms',
    thumbnailUrl: `${BASE}NormWhy.png`,
  },
  {
    title: 'Normalization – Functional Dependencies',
    description: 'Introduction to functional dependencies in relational databases',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQBJVg0hKdB1SZJcHC2qHBxcASVGMpngLuFNOcPSWisP73Q?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=3AOjNd',
    thumbnailUrl: `${BASE}NormFD.png`,
  },
  {
    title: 'Normalization – First Normal Form (1NF)',
    description: 'Understanding and applying First Normal Form',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQDwiXe1GAG4QornPClJYm6PAej3l8tqwmUvRsE9xRboIsA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=INiQAM',
    thumbnailUrl: `${BASE}Norm1NF.png`,
  },
];

export default function NormalizationVideosPage() {
  return (
    <PublicLessonShell
      eyebrow="MBI802 · Database Design"
      titleLead="Let's make sense of"
      titleAccent="Normalization — on video."
      gradient="linear-gradient(90deg, #6366f1, #818cf8, #06b6d4)"
      accent="#6366f1"
      orb2="#818cf8"
      orb3="#06b6d4"
      subtitle="Prefer to watch and learn? A short walkthrough series on database normalization — why we do it, functional dependencies, and First Normal Form — one clip at a time."
      pills={[
        { emoji: '▶️', name: 'Introduction', color: '#6366f1' },
        { emoji: '🤔', name: 'Why normalise?', color: '#7c3aed' },
        { emoji: '🔗', name: 'Functional deps', color: '#0891b2' },
        { emoji: '1️⃣', name: '1NF', color: '#0d9488' },
      ]}
    >
      <VideoGallery videos={NORMALIZATION_VIDEOS} accentColor="#6366f1" />
    </PublicLessonShell>
  );
}
