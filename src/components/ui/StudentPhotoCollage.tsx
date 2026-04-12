import { useMemo, useRef, useState } from 'react';
import { GalleryHorizontalEnd, Users } from 'lucide-react';
import type { StudentProfile } from '../../lib/types';
import { avatarGradient } from './PhotoUploadModal';

interface Props {
  students: StudentProfile[];
}

/* Deterministic pseudo-random helpers */
function seededRand(seed: string, salt = 0): number {
  let h = salt;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return ((h >>> 0) / 0xffffffff);
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

/* Split students into N columns as evenly as possible */
function toColumns(students: StudentProfile[], n: number): StudentProfile[][] {
  const cols: StudentProfile[][] = Array.from({ length: n }, () => []);
  students.forEach((s, i) => cols[i % n].push(s));
  return cols;
}

/* A single photo card */
function PhotoCard({ student, index }: { student: StudentProfile; index: number }) {
  const [hovered, setHovered] = useState(false);
  const delay = seededRand(student.uid, index) * 0.3;

  return (
    <div
      className="collage-card-enter relative select-none cursor-default"
      style={{
        animationDelay: `${delay}s`,
        borderRadius: '14px',
        overflow: 'hidden',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.30s ease',
        boxShadow: hovered
          ? '0 20px 50px rgba(124,58,237,0.28), 0 6px 16px rgba(0,0,0,0.12)'
          : '0 4px 16px rgba(124,106,247,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        zIndex: hovered ? 10 : 1,
        aspectRatio: seededRand(student.uid, index + 77) > 0.55 ? '4/5' : '1/1',
        marginBottom: '7px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo or gradient avatar background */}
      {student.photoURL ? (
        <img
          src={student.photoURL}
          alt={student.fullName}
          className="w-full h-full object-cover"
          loading="lazy"
          style={{ display: 'block' }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-white font-bold"
          style={{
            background: avatarGradient(student.uid),
            fontSize: 'clamp(22px, 5cqw, 40px)',
            letterSpacing: '-0.02em',
          }}
        >
          {initials(student.fullName || student.email || '?')}
        </div>
      )}

      {/* Permanent subtle gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 45%, rgba(15,8,50,0.72) 100%)',
          opacity: hovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Info overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 p-2"
        style={{
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          opacity: hovered ? 1 : 0.88,
          transition: 'transform 0.30s ease, opacity 0.30s ease',
        }}
      >
        <p
          className="text-white font-semibold leading-tight truncate"
          style={{ fontSize: '12px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
        >
          {student.fullName || 'Student'}
        </p>
        {hovered && student.course && (
          <p
            className="text-white/70 leading-tight truncate mt-0.5"
            style={{ fontSize: '10px', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
          >
            {student.course.replace('Master of ', 'M. ')}
          </p>
        )}
        {hovered && student.homeCountry && (
          <p
            className="mt-0.5 font-medium"
            style={{ fontSize: '10px', color: '#c4b5fd', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
          >
            {student.homeCountry}
          </p>
        )}
      </div>

      {/* Glow border on hover */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: '14px',
            border: '1.5px solid rgba(167,139,250,0.60)',
            boxShadow: 'inset 0 0 20px rgba(124,58,237,0.12)',
          }}
        />
      )}
    </div>
  );
}

/* A scrolling column */
function CollageColumn({
  students,
  direction,
  durationSecs,
  colIdx,
}: {
  students: StudentProfile[];
  direction: 'up' | 'down';
  durationSecs: number;
  colIdx: number;
}) {
  if (students.length === 0) return null;
  /* Duplicate for seamless infinite scroll */
  const doubled = [...students, ...students];

  return (
    <div className="flex-1 min-w-0 overflow-hidden relative">
      <div
        className={direction === 'up' ? 'collage-scroll-up' : 'collage-scroll-down'}
        style={{ animationDuration: `${durationSecs}s` }}
      >
        {doubled.map((s, i) => (
          <PhotoCard
            key={`${colIdx}-${s.uid}-${i}`}
            student={s}
            index={i + colIdx * 100}
          />
        ))}
      </div>
    </div>
  );
}

export default function StudentPhotoCollage({ students }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  /* Shuffle students once (deterministic) for visual variety */
  const shuffled = useMemo(() => {
    return [...students].sort((a, b) => seededRand(a.uid + b.uid) - 0.5);
  }, [students]);

  const numCols = Math.min(6, Math.max(3, students.length));
  const columns = toColumns(shuffled, numCols);

  /* Column config: direction + speed */
  const colConfigs: { direction: 'up' | 'down'; duration: number }[] = [
    { direction: 'up',   duration: 50 },
    { direction: 'down', duration: 58 },
    { direction: 'up',   duration: 46 },
    { direction: 'down', duration: 54 },
    { direction: 'up',   duration: 62 },
    { direction: 'down', duration: 52 },
  ];

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <div
          className="w-14 h-14 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(167,139,250,0.06))' }}
        >
          <GalleryHorizontalEnd size={24} style={{ color: '#a78bfa' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: '#c4b5fd' }}>No students to display</p>
      </div>
    );
  }

  const withPhotos = students.filter(s => s.photoURL).length;
  const withoutPhotos = students.length - withPhotos;

  return (
    <div
      className="card p-7 mb-6 animate-fadeIn overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(15,8,50,0.97) 0%, rgba(30,15,80,0.98) 50%, rgba(12,25,60,0.97) 100%)',
        border: '1px solid rgba(139,92,246,0.20)',
        boxShadow: '0 8px 40px rgba(10,4,30,0.35), 0 2px 12px rgba(124,58,237,0.12)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="rounded-2xl p-2.5"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(167,139,250,0.15))' }}
          >
            <GalleryHorizontalEnd size={18} style={{ color: '#c4b5fd' }} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#f5f3ff' }}>
              Student Gallery
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(196,181,253,0.65)' }}>
              {withPhotos} with photos · {withoutPhotos} with initials
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <Users size={12} style={{ color: '#a78bfa' }} />
            <span className="text-xs font-semibold" style={{ color: '#c4b5fd' }}>{students.length}</span>
          </div>
          <button
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: paused ? 'rgba(124,58,237,0.30)' : 'rgba(255,255,255,0.07)',
              color: paused ? '#c4b5fd' : 'rgba(196,181,253,0.60)',
              border: '1px solid rgba(139,92,246,0.25)',
            }}
            onClick={() => setPaused(p => !p)}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {/* Collage grid */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl"
        style={{
          height: '560px',
          /* pause all animations if paused */
          ...(paused ? { animationPlayState: 'paused' } : {}),
        }}
      >
        {/* Top & bottom fade masks */}
        <div
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
          style={{ height: '80px', background: 'linear-gradient(to bottom, rgba(15,8,50,0.95) 0%, transparent 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{ height: '80px', background: 'linear-gradient(to top, rgba(15,8,50,0.95) 0%, transparent 100%)' }}
        />

        {/* Animated columns */}
        <div
          className="flex gap-2 h-auto"
          style={{
            /* If paused, stop all child animations */
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {columns.slice(0, numCols).map((colStudents, i) => (
            <div
              key={i}
              className="flex-1 min-w-0 overflow-hidden"
              style={{
                /* Each column starts at a different offset for visual stagger */
                marginTop: i % 2 === 0 ? `${-24 * (i + 1)}px` : `${-16 * i}px`,
                animationPlayState: paused ? 'paused' : 'running',
              }}
            >
              <div
                className={colConfigs[i].direction === 'up' ? 'collage-scroll-up' : 'collage-scroll-down'}
                style={{
                  animationDuration: `${colConfigs[i].duration}s`,
                  animationPlayState: paused ? 'paused' : 'running',
                  paddingTop: i % 2 === 1 ? '18px' : '0',
                }}
              >
                {[...colStudents, ...colStudents].map((s, idx) => (
                  <PhotoCard
                    key={`${i}-${s.uid}-${idx}`}
                    student={s}
                    index={idx + i * 100}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Subtle center shimmer */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(15,8,50,0.20) 100%)',
          }}
        />
      </div>

      {/* Footer legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {[
          { color: '#7c3aed', label: 'Hover to see details' },
          { color: '#10b981', label: 'Photos uploaded' },
          { color: '#a78bfa', label: 'Auto-scroll' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            <span className="text-xs" style={{ color: 'rgba(196,181,253,0.50)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
