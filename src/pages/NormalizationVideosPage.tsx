import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import PublicLessonShell from '../components/public/PublicLessonShell';
import VideoGallery, { type VideoClip } from '../components/slides/VideoGallery';
import { db } from '../lib/firebase';

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
  {
    title: 'Normalization – 1NF Further Example',
    description: 'First Normal Form worked example with a real-world Orders table',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQCqqC2tZ9-CSLbaDx7tEzrZAUMXnC5WKuT8CeKb0HX8mQ4?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=4U7kWZ',
    thumbnailUrl: `${BASE}Norm1NFExample.png`,
  },
  {
    title: 'Normalization – Second Normal Form (2NF)',
    description: 'Second Normal Form theory — partial dependencies and how to eliminate them',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQCqqC2tZ9-CSLbaDx7tEzrZAUMXnC5WKuT8CeKb0HX8mQ4?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=igJmfx',
    thumbnailUrl: `${BASE}Norm2ND.png`,
  },
];

export default function NormalizationVideosPage() {
  // Lecturer-added videos (2NF, 1NF example, etc.) live in Firestore under the
  // MBI802 / normalization lesson. The videoLessons collection is publicly
  // readable, so we merge them in after the built-ins — no login required.
  const [extraVideos, setExtraVideos] = useState<VideoClip[]>([]);

  useEffect(() => {
    if (!db) return;
    let cancelled = false;
    (async () => {
      try {
        // Fetch the whole (small) collection and filter in JS — same approach as
        // the logged-in Course Resources page, so the public page shows exactly
        // the same MBI802 / normalization videos.
        const snap = await getDocs(collection(db, 'videoLessons'));
        const videos: VideoClip[] = [];
        snap.forEach((d) => {
          const data = d.data() as {
            courseId?: string;
            lessonId?: string;
            videos?: VideoClip[];
          };
          if (
            data.courseId === 'MBI802' &&
            data.lessonId === 'normalization' &&
            Array.isArray(data.videos)
          ) {
            videos.push(...data.videos);
          }
        });
        if (!cancelled) setExtraVideos(videos);
      } catch {
        // Offline or rules not yet deployed — fall back to the built-in set.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const videos = [...NORMALIZATION_VIDEOS, ...extraVideos];

  return (
    <PublicLessonShell
      eyebrow="MBI802 · Database Design"
      titleLead="Let's make sense of"
      titleAccent="Normalization — on video."
      gradient="linear-gradient(90deg, #6366f1, #818cf8, #06b6d4)"
      accent="#6366f1"
      orb2="#818cf8"
      orb3="#06b6d4"
      subtitle="Prefer to watch and learn? The full walkthrough series on database normalization — from why we do it and functional dependencies, climbing the normal forms one clip at a time."
      pills={[
        { emoji: '🤔', name: 'Why normalise?', color: '#7c3aed' },
        { emoji: '🔗', name: 'Functional deps', color: '#0891b2' },
        { emoji: '1️⃣', name: '1NF', color: '#0d9488' },
        { emoji: '🪜', name: '2NF & beyond', color: '#6366f1' },
      ]}
    >
      <VideoGallery videos={videos} accentColor="#6366f1" />
    </PublicLessonShell>
  );
}
