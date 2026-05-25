import { useEffect, useState } from 'react';
import {
  collection, doc, getDoc, getDocs, limit, orderBy, query, where,
} from 'firebase/firestore';
import {
  Database, GitFork, Star, RotateCw, Zap, Award, Timer, Shield,
  Flame, BookOpen, Lock, CheckCircle2, Linkedin, Copy, Check,
  ExternalLink, type LucideProps,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { ALL_BADGES, BADGE_SECTION_LABELS, type BadgeDefinition, type BadgeCategory } from '../../lib/badgeData';

type LucideIcon = React.FC<LucideProps>;

const BADGE_ICONS: Record<string, LucideIcon> = {
  Database, GitFork, Star, RotateCw, Zap, Award, Timer, Shield, Flame, BookOpen,
};

const CERT_BASE_URL = 'https://ureshan2011.github.io/YooBees/#/certificate/';
const PLATFORM_URL  = 'https://ureshan2011.github.io/YooBees/';

function buildPost(earnedBadges: BadgeDefinition[], certId?: string | null): string {
  const names = earnedBadges.map((b) => `  — ${b.name}`).join('\n');
  const link  = certId ? `${CERT_BASE_URL}${certId}` : PLATFORM_URL;
  return `Here's what I earned on YooBees this semester:\n\n${names}\n\n${earnedBadges.length} of ${ALL_BADGES.length} badges. The platform by Dr. Yasas Sri Wickramasinghe at Yoobee College of Creative Innovation has been a great way to build real database skills.\n\n${link}\n\nTag: @Dr. Yasas Sri Wickramasinghe (https://nz.linkedin.com/in/yasassri)\n@Yoobee College of Creative Innovation (https://nz.linkedin.com/school/yoobeecollegeofcreativeinnovation/)\n\n#YooBees #Yoobee #technology #MBI #studentfeedback #successstories #SQL #DatabaseManagement`;
}

// ── Badge card ────────────────────────────────────────────────────────────────
function BadgeCard({ badge, earned }: { badge: BadgeDefinition; earned: boolean }) {
  const Icon = BADGE_ICONS[badge.iconName] ?? Award;
  const isDistinction = badge.tier === 'distinction';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      background: '#ffffff',
      border: `1px ${earned ? 'solid' : 'dashed'} ${earned ? (isDistinction ? badge.color + '55' : '#d1d5db') : '#d1d5db'}`,
      borderRadius: 10,
      transition: 'border-color 0.15s',
    }}>
      {/* Icon container */}
      <div style={{
        width: 38, height: 38, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: earned ? badge.subtleColor : '#f9fafb',
        border: `1px solid ${earned ? badge.color + '30' : '#e5e7eb'}`,
      }}>
        {earned
          ? <Icon size={18} style={{ color: badge.color }} />
          : <Lock size={15} style={{ color: '#d1d5db' }} />
        }
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: earned ? '#111827' : '#6b7280' }}>
            {badge.name}
          </span>
          {isDistinction && earned && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.6px',
              textTransform: 'uppercase',
              color: badge.color,
              background: badge.subtleColor,
              border: `1px solid ${badge.color}35`,
              padding: '1px 6px', borderRadius: 100,
            }}>
              Distinction
            </span>
          )}
        </div>
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, lineHeight: 1.4 }}>
          {earned ? badge.description : badge.howToEarn}
        </p>
      </div>

      {/* Status indicator */}
      {earned
        ? <CheckCircle2 size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
        : <div style={{ width: 15, height: 15, borderRadius: '50%', border: '1.5px solid #e5e7eb', flexShrink: 0 }} />
      }
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SkillPassportPage() {
  const { user, studentProfile } = useAuth();
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading]     = useState(true);
  const [postCopied, setPostCopied] = useState(false);

  useEffect(() => {
    if (!user || !studentProfile) return;
    (async () => {
      const earned = new Set<string>();

      // ── SQL Exam Certificate ─────────────────────────────────
      if (studentProfile.sqlExamCertificateId) earned.add('sql-cert');

      // ── ER MCQ (pass ≥50%, distinction from profile flag) ────
      try {
        const erSnap = await getDoc(doc(db, 'erMcqResults', user.uid));
        if (erSnap.exists()) {
          if ((erSnap.data().bestPercentage ?? 0) >= 50) earned.add('er-diagrams');
          if (erSnap.data().badgeEarned || studentProfile.erMcqBadge) earned.add('er-distinction');
        }
      } catch { /* not enrolled */ }

      // ── Agile MCQ (pass ≥50%, distinction from profile flag) ─
      try {
        const agileSnap = await getDoc(doc(db, 'agileScrumMcqResults', user.uid));
        if (agileSnap.exists()) {
          if ((agileSnap.data().bestPercentage ?? 0) >= 50) earned.add('agile-practitioner');
          if (agileSnap.data().badgeEarned || (studentProfile as any).agileScrumMcqBadge) earned.add('agile-distinction');
        }
      } catch { /* not enrolled */ }

      // ── MBI802 Quiz (best score ≥60%) ───────────────────────
      try {
        const mbiSnap = await getDocs(
          query(
            collection(db, 'mbi802QuizResults'),
            where('studentUid', '==', user.uid),
            orderBy('percentage', 'desc'),
            limit(1)
          )
        );
        if (!mbiSnap.empty && (mbiSnap.docs[0].data().percentage ?? 0) >= 60) {
          earned.add('dbms-scholar');
        }
      } catch { /* not enrolled */ }

      // ── SQL Race (any correct submission) ────────────────────
      try {
        const raceSnap = await getDocs(
          query(
            collection(db, 'sqlRaceSubmissions'),
            where('studentUid', '==', user.uid),
            where('isCorrect', '==', true),
            limit(1)
          )
        );
        if (!raceSnap.empty) earned.add('sql-racer');
      } catch { /* not enrolled */ }

      // ── ELO — Arena Warrior (≥1300) + Streak Master (≥5) ────
      try {
        const eloSnap = await getDoc(doc(db, 'eloRatings', user.uid));
        if (eloSnap.exists()) {
          const d = eloSnap.data();
          if ((d.rating ?? 0) >= 1300) earned.add('arena-warrior');
          if ((d.bestDuelStreak ?? d.duelStreak ?? 0) >= 5) earned.add('streak-master');
        }
      } catch { /* no arena data */ }

      // ── Attendance (8+ records) ──────────────────────────────
      try {
        const attSnap = await getDocs(
          query(
            collection(db, 'attendanceRecords'),
            where('studentUid', '==', user.uid),
            limit(8)
          )
        );
        if (attSnap.size >= 8) earned.add('dedicated');
      } catch { /* no records */ }

      setEarnedIds(earned);
      setLoading(false);
    })();
  }, [user, studentProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const earnedBadges = ALL_BADGES.filter((b) => earnedIds.has(b.id));
  const certId       = studentProfile?.sqlExamCertificateId ?? null;
  const postText     = buildPost(earnedBadges, certId);
  const certUrl      = certId ? `${CERT_BASE_URL}${certId}` : null;

  const assessmentBadges = ALL_BADGES.filter((b) => b.category === 'assessment');
  const activityBadges   = ALL_BADGES.filter((b) => b.category === 'activity');

  function copyPost() {
    navigator.clipboard.writeText(postText).then(() => {
      setPostCopied(true);
      setTimeout(() => setPostCopied(false), 2500);
    });
  }
  function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl ?? PLATFORM_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  }

  return (
    <Layout>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* ── Page header ──────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.3px' }}>
            Skill Passport
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            Badges earned from assessments, challenges, and attendance on YooBees.
          </p>
        </div>

        {/* ── Progress bar ─────────────────────────────────────────── */}
        {!loading && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            marginBottom: 28,
          }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                {earnedBadges.length} of {ALL_BADGES.length} badges earned
              </p>
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                {earnedBadges.length === ALL_BADGES.length
                  ? 'Passport complete!'
                  : `${ALL_BADGES.length - earnedBadges.length} remaining`}
              </p>
            </div>
            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', maxWidth: 140, justifyContent: 'flex-end' }}>
              {ALL_BADGES.map((b) => (
                <div key={b.id} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: earnedIds.has(b.id) ? b.color : '#e5e7eb',
                  transition: 'background 0.2s',
                }} />
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <div className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: '#e5e7eb', borderTopColor: '#374151' }} />
          </div>
        ) : (
          <>
            {/* ── Badge sections ──────────────────────────────────────── */}
            {(['assessment', 'activity'] as BadgeCategory[]).map((cat) => {
              const badges = cat === 'assessment' ? assessmentBadges : activityBadges;
              return (
                <div key={cat} style={{ marginBottom: 24 }}>
                  <p style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '1px',
                    textTransform: 'uppercase', color: '#9ca3af',
                    marginBottom: 10,
                  }}>
                    {BADGE_SECTION_LABELS[cat]}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {badges.map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} earned={earnedIds.has(badge.id)} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* ── LinkedIn share — only if at least 1 badge earned ──── */}
            {earnedBadges.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '1px',
                  textTransform: 'uppercase', color: '#9ca3af',
                  marginBottom: 10,
                }}>
                  Share your progress
                </p>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                  {/* LinkedIn post header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#f9fafb',
                    borderBottom: '1px solid #f3f4f6',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Linkedin size={14} style={{ color: '#0a66c2' }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                        Post preview
                      </span>
                    </div>
                    <button
                      onClick={copyPost}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 12, fontWeight: 500, color: '#6b7280',
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '4px 8px', borderRadius: 6,
                      }}>
                      {postCopied ? <Check size={13} style={{ color: '#16a34a' }} /> : <Copy size={13} />}
                      {postCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Post body */}
                  <div style={{ padding: '14px 16px', background: '#ffffff' }}>
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, whiteSpace: 'pre-line', margin: 0 }}>
                      {postText}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 14px',
                    background: '#f9fafb',
                    borderTop: '1px solid #f3f4f6',
                  }}>
                    <button
                      onClick={shareLinkedIn}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: 13, fontWeight: 600, color: '#ffffff',
                        background: '#0a66c2',
                        border: 'none', cursor: 'pointer',
                        padding: '7px 14px', borderRadius: 7,
                      }}>
                      <Linkedin size={14} /> Share on LinkedIn
                    </button>
                    {certUrl && (
                      <a
                        href={certUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          fontSize: 12, fontWeight: 500, color: '#6b7280',
                          background: 'none', textDecoration: 'none',
                          padding: '7px 10px', borderRadius: 7,
                          border: '1px solid #e5e7eb',
                        }}>
                        <ExternalLink size={13} /> View Certificate
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
