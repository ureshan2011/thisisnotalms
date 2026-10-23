import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { CoursePage, SectionHead, Reveal } from '../components/blend';
import type { VideoClip } from '../components/slides/VideoGallery';
import { db } from '../lib/firebase';

const BASE = import.meta.env.BASE_URL;

// /normalisation-videos — MBI802, public and ungated. Built on Blend
// (src/components/blend/README.md). The clips are a real sequence, so they are
// a numbered list, not a grid of identical cards. Every clip opens its
// SharePoint link in a new tab.

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

const NAV = [{ id: 'clips', label: 'Clips' }];

/** "Normalization – 1NF Further Example" reads as "1NF further example" under the page's own title. */
const clipTitle = (t: string) => t.replace(/^Normali[sz]ation\s*[–-]\s*/, '');

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
  const first = videos[0];

  return (
    <CoursePage
      courseCode="MBI802"
      courseName="Database Management Systems"
      nav={NAV}
      footerNote="Nothing on this page is tracked or saved. No login, no personal data collected."
      hero={
        <div className="bt-herogrid">
          <div>
            <span className="bt-flag">
              <span className="bt-dot" style={{ background: 'var(--accent-500)' }} />
              {videos.length} short clips
            </span>
            <h1>Normalisation, on <span className="bt-stop">video.</span></h1>
            <p className="bt-hero__lede">
              Why we normalise, what a functional dependency is, then 1NF and 2NF, one clip at a time.
            </p>
            <div className="bt-hero__cta">
              <a className="bt-btn" href={first.url} target="_blank" rel="noreferrer">
                Watch the first clip
                <span className="bt-btn__badge" aria-hidden="true">↗</span>
              </a>
              <Link className="bt-btn bt-btn--tertiary" to="/normalisation-activities">
                Then practise
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <a className="bt-heroart bt-vidhero" href={first.url} target="_blank" rel="noreferrer">
            <span className="bt-heroart__lbl">Clip 1 · opens in a new tab</span>
            {first.thumbnailUrl && <img src={first.thumbnailUrl} alt="" />}
            <b>{clipTitle(first.title)}</b>
          </a>
        </div>
      }
    >
      <section id="clips" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="The series"
            title="Watch in this order"
            stop="."
            aside="Each clip builds on the one before it. Every clip opens in a new tab."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-track">
            {videos.map((clip, i) => (
              <li key={`${clip.url}-${i}`} className="bt-trackrow bt-vidrow">
                <span className="bt-trackrow__n bt-tnum" aria-hidden="true">{i + 1}</span>
                <a className="bt-vidrow__thumb" href={clip.url} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
                  {clip.thumbnailUrl && <img src={clip.thumbnailUrl} alt="" loading="lazy" />}
                </a>
                <div className="bt-trackrow__body">
                  <h3>{clipTitle(clip.title)}</h3>
                  {clip.description && <p>{clip.description}</p>}
                  <a className="bt-btn bt-btn--sm bt-btn--tertiary" href={clip.url} target="_blank" rel="noreferrer">
                    Watch
                    <span className="bt-btn__badge" aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>
    </CoursePage>
  );
}
