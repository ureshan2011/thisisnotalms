import { useEffect, useState } from 'react';
import {
  collection, doc, getDoc, getDocs, limit, query, where,
} from 'firebase/firestore';
import { Award, Copy, Check, Linkedin, Lock, ShieldCheck } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { ALL_BADGES } from '../../lib/badgeData';
import type { StudentProfile } from '../../lib/types';

const CERT_BASE_URL = 'https://ureshan2011.github.io/YooBees/#/certificate/';

function buildLinkedInPost(name: string, earnedIds: Set<string>, certId?: string | null): string {
  const earned = ALL_BADGES.filter((b) => earnedIds.has(b.id));
  const lines = earned.map((b) => `${b.emoji} ${b.name}`).join('\n');
  const certLine = certId
    ? `\nVerify my SQL Certificate: ${CERT_BASE_URL}${certId}`
    : '';
  return `Just checked my YooBees Skill Passport — ${earned.length} of ${ALL_BADGES.length} badges earned this semester! 🎓\n\n${lines}${certLine}\n\nAn incredible learning platform by Ureshan. Check it out: https://ureshan2011.github.io/YooBees/\n\n#YooBees #SQL #DatabaseManagement #LearningAndDevelopment #NewSkills`;
}

export default function SkillPassportPage() {
  const { user, studentProfile } = useAuth();
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [postCopied, setPostCopied] = useState(false);

  useEffect(() => {
    if (!user || !studentProfile) return;
    (async () => {
      const earned = new Set<string>();

      // Badges from student profile flags
      if (studentProfile.sqlExamCertificateId) earned.add('sql-cert');
      if (studentProfile.erMcqBadge) earned.add('er-expert');
      if ((studentProfile as any).agileScrumMcqBadge) earned.add('agile-champion');

      // SQL Racer — any correct submission
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

      // Arena Warrior + Streak Master — from eloRatings
      try {
        const eloSnap = await getDoc(doc(db, 'eloRatings', user.uid));
        if (eloSnap.exists()) {
          const data = eloSnap.data();
          if ((data.rating ?? 0) >= 1300) earned.add('arena-warrior');
          if ((data.bestDuelStreak ?? data.duelStreak ?? 0) >= 5) earned.add('streak-master');
        }
      } catch { /* no elo data */ }

      // Dedicated Learner — 8+ attendance records
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

  const postText = buildLinkedInPost(
    studentProfile?.fullName ?? '',
    earnedIds,
    studentProfile?.sqlExamCertificateId
  );
  const certUrl = studentProfile?.sqlExamCertificateId
    ? `${CERT_BASE_URL}${studentProfile.sqlExamCertificateId}`
    : null;

  function copyPost() {
    navigator.clipboard.writeText(postText).then(() => {
      setPostCopied(true);
      setTimeout(() => setPostCopied(false), 2500);
    });
  }

  function copyLink() {
    const url = certUrl ?? 'https://ureshan2011.github.io/YooBees/';
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl ?? 'https://ureshan2011.github.io/YooBees/')}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  }

  const earnedCount = earnedIds.size;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: '#1e1b4b' }}>
            My Skill Passport
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
            Earn all 7 badges to complete your YooBees Skill Passport.
          </p>
        </div>

        {/* Progress summary */}
        {!loading && (
          <div className="rounded-2xl p-5 border text-center"
            style={{
              background: 'linear-gradient(135deg,rgba(238,242,255,0.95),rgba(224,231,255,0.85))',
              borderColor: 'rgba(99,102,241,0.25)',
            }}>
            <p className="text-4xl font-extrabold" style={{ color: '#4f46e5' }}>
              {earnedCount} <span className="text-xl font-semibold" style={{ color: '#6b7280' }}>/ {ALL_BADGES.length}</span>
            </p>
            <p className="text-sm font-semibold mt-1" style={{ color: '#4338ca' }}>
              Badges earned
            </p>
            <div className="w-full rounded-full h-3 mt-3" style={{ background: 'rgba(129,140,248,0.2)' }}>
              <div className="h-3 rounded-full transition-all"
                style={{
                  width: `${Math.round((earnedCount / ALL_BADGES.length) * 100)}%`,
                  background: 'linear-gradient(90deg,#818cf8,#4f46e5)',
                }} />
            </div>
          </div>
        )}

        {/* Badge grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_BADGES.map((badge) => {
              const earned = earnedIds.has(badge.id);
              return (
                <div key={badge.id}
                  className="rounded-2xl p-4 border flex items-start gap-3 transition-all"
                  style={{
                    background: earned ? badge.bgColor : 'rgba(249,250,251,0.6)',
                    borderColor: earned ? badge.borderColor : 'rgba(209,213,219,0.6)',
                    opacity: earned ? 1 : 0.65,
                  }}
                >
                  <div className="text-2xl flex-shrink-0 mt-0.5">
                    {earned ? badge.emoji : <Lock size={20} style={{ color: '#9ca3af' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: earned ? badge.color : '#6b7280' }}>
                      {badge.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: earned ? badge.color : '#9ca3af' }}>
                      {earned ? badge.description : badge.howToEarn}
                    </p>
                    {earned && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.6)', color: badge.color }}>
                        <ShieldCheck size={11} /> Earned
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Share section — only when at least 1 badge */}
        {!loading && earnedCount > 0 && (
          <div className="rounded-2xl border p-5 space-y-3"
            style={{ background: 'rgba(240,247,255,0.9)', borderColor: 'rgba(37,99,235,0.2)' }}>
            <div className="flex items-center gap-2">
              <Award size={18} style={{ color: '#1e3a5f' }} />
              <p className="text-sm font-bold" style={{ color: '#1e3a5f' }}>
                Share your Skill Passport on LinkedIn
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={shareLinkedIn}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: '#0a66c2' }}>
                <Linkedin size={16} /> Share on LinkedIn
              </button>
              <button onClick={copyLink}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', color: '#4338ca' }}>
                {copied ? <Check size={15} style={{ color: '#059669' }} /> : <Copy size={15} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            {/* Suggested post */}
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                Suggested LinkedIn post — copy and paste:
              </p>
              <div className="relative">
                <div className="rounded-xl p-3 pr-10 text-xs leading-5 font-mono border whitespace-pre-wrap"
                  style={{
                    background: '#fff',
                    borderColor: 'rgba(37,99,235,0.2)',
                    color: '#374151',
                    maxHeight: 200,
                    overflowY: 'auto',
                  }}>
                  {postText}
                </div>
                <button onClick={copyPost}
                  className="absolute top-2 right-2 p-1.5 rounded-lg"
                  style={{ background: postCopied ? 'rgba(5,150,105,0.1)' : 'rgba(99,102,241,0.1)' }}>
                  {postCopied
                    ? <Check size={14} style={{ color: '#059669' }} />
                    : <Copy size={14} style={{ color: '#4338ca' }} />}
                </button>
              </div>
              <p className="text-xs mt-1.5" style={{ color: '#9ca3af' }}>
                Paste this into your LinkedIn post after clicking Share.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
