import { useEffect, useState } from 'react';
import {
  collection, getDocs, getDoc, doc, limit, orderBy, query, where,
} from 'firebase/firestore';
import { Trophy, Swords, Copy, Check, Linkedin, Crown } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

interface RaceEntry {
  uid: string;
  name: string;
  displayId: string;
  section: string;
  totalMarks: number;
}

interface ArenaEntry {
  uid: string;
  name: string;
  displayId: string;
  rating: number;
  tier: string;
}

const TIER_LABELS: Record<string, string> = {
  queen: 'Queen Bee 👑',
  gold:  'Gold Bee 🥇',
  silver: 'Silver Bee 🥈',
  bronze: 'Bronze Bee 🥉',
};

const PLATFORM_URL = 'https://ureshan2011.github.io/YooBees/';

function buildSharePost(category: 'race' | 'arena', rank: number, value: string | number, name: string): string {
  if (category === 'race') {
    return `I'm ranked #${rank} on the YooBees SQL Race Hall of Fame with ${value} total marks! 🏎️\n\nLearning SQL in the most competitive way possible on this amazing platform by Ureshan.\n\nCheck it out: ${PLATFORM_URL}\n\n#SQL #YooBees #DatabaseManagement #Competitive #LearningAndDevelopment`;
  }
  return `I'm ranked #${rank} on the YooBees Arena Hall of Fame with an ELO rating of ${value}! ⚔️\n\nCompeting in 1v1 SQL duels on this amazing platform by Ureshan.\n\nCheck it out: ${PLATFORM_URL}\n\n#SQL #YooBees #Arena #Competitive #LearningAndDevelopment`;
}

export default function HallOfFame() {
  const { user, studentProfile } = useAuth();
  const [raceBoard, setRaceBoard] = useState<RaceEntry[]>([]);
  const [arenaBoard, setArenaBoard] = useState<ArenaEntry[]>([]);
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // ── SQL Race top 10 ─────────────────────────────────────────
      const marksMap: Record<string, RaceEntry> = {};
      try {
        const raceSnap = await getDocs(
          query(collection(db, 'sqlRaceSubmissions'), where('isCorrect', '==', true))
        );
        raceSnap.forEach((d) => {
          const r = d.data();
          const uid = r.studentUid;
          if (!marksMap[uid]) {
            marksMap[uid] = {
              uid,
              name: r.studentName ?? '',
              displayId: r.studentDisplayId ?? '',
              section: r.studentSection ?? '',
              totalMarks: 0,
            };
          }
          marksMap[uid].totalMarks += r.marksAwarded ?? 1;
        });
      } catch { /* rules may restrict */ }

      const raceEntries = Object.values(marksMap)
        .sort((a, b) => b.totalMarks - a.totalMarks)
        .slice(0, 10);
      setRaceBoard(raceEntries);

      // ── Arena top 10 ────────────────────────────────────────────
      try {
        const eloSnap = await getDocs(
          query(collection(db, 'eloRatings'), orderBy('rating', 'desc'), limit(10))
        );

        // Fetch names from students collection for arena entries
        const uids = eloSnap.docs.map((d) => d.id);
        const nameMap: Record<string, string> = {};
        const displayMap: Record<string, string> = {};
        await Promise.all(
          uids.map(async (uid) => {
            try {
              const s = await getDoc(doc(db, 'students', uid));
              if (s.exists()) {
                nameMap[uid] = s.data().fullName ?? '';
                displayMap[uid] = s.data().studentId ?? '';
              }
            } catch { /* skip */ }
          })
        );
        setStudentNames(nameMap);

        setArenaBoard(
          eloSnap.docs.map((d) => ({
            uid: d.id,
            name: nameMap[d.id] ?? d.id.slice(0, 8),
            displayId: displayMap[d.id] ?? '',
            rating: d.data().rating ?? 0,
            tier: d.data().tier ?? 'bronze',
          }))
        );
      } catch { /* no elo data */ }

      setLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function copyPost(key: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    });
  }

  function shareLinkedIn(text: string) {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PLATFORM_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
    navigator.clipboard.writeText(text).catch(() => {});
  }

  const myRaceRank = raceBoard.findIndex((e) => e.uid === user?.uid) + 1;
  const myArenaRank = arenaBoard.findIndex((e) => e.uid === user?.uid) + 1;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold" style={{ color: '#1e1b4b' }}>
            Hall of Fame
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Top performers across SQL Grand Prix and Arena duels.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── SQL Race Leaderboard ──────────────────────── */}
            <LeaderboardCard
              title="SQL Grand Prix"
              subtitle="Top mark earners"
              icon={<Trophy size={18} style={{ color: '#ea580c' }} />}
              accentColor="#ea580c"
              entries={raceBoard.map((e, i) => ({
                rank: i + 1,
                uid: e.uid,
                name: e.name || e.displayId || 'Student',
                displayId: e.displayId,
                value: `${e.totalMarks} pts`,
                badge: e.section ? `Section ${e.section}` : undefined,
                isMe: e.uid === user?.uid,
              }))}
              myRank={myRaceRank}
              onShare={(rank, val) => {
                const post = buildSharePost('race', rank, raceBoard[rank - 1]?.totalMarks ?? val, studentProfile?.fullName ?? '');
                shareLinkedIn(post);
                copyPost(`race-${rank}`, post);
              }}
              copiedKey={copiedKey}
              shareKeyPrefix="race"
            />

            {/* ── Arena Leaderboard ─────────────────────────── */}
            <LeaderboardCard
              title="Arena"
              subtitle="Highest ELO ratings"
              icon={<Swords size={18} style={{ color: '#4f46e5' }} />}
              accentColor="#4f46e5"
              entries={arenaBoard.map((e, i) => ({
                rank: i + 1,
                uid: e.uid,
                name: e.name || e.displayId || 'Student',
                displayId: e.displayId,
                value: `${e.rating} ELO`,
                badge: TIER_LABELS[e.tier],
                isMe: e.uid === user?.uid,
              }))}
              myRank={myArenaRank}
              onShare={(rank, val) => {
                const post = buildSharePost('arena', rank, arenaBoard[rank - 1]?.rating ?? val, studentProfile?.fullName ?? '');
                shareLinkedIn(post);
                copyPost(`arena-${rank}`, post);
              }}
              copiedKey={copiedKey}
              shareKeyPrefix="arena"
            />
          </div>
        )}

        {/* Your spotlight section */}
        {!loading && (myRaceRank > 0 || myArenaRank > 0) && (
          <SpotlightBanner
            raceRank={myRaceRank}
            arenaRank={myArenaRank}
            name={studentProfile?.fullName ?? user?.email ?? ''}
            raceMarks={myRaceRank > 0 ? raceBoard[myRaceRank - 1]?.totalMarks : undefined}
            arenaRating={myArenaRank > 0 ? arenaBoard[myArenaRank - 1]?.rating : undefined}
          />
        )}
      </div>
    </Layout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface LeaderboardEntry {
  rank: number;
  uid: string;
  name: string;
  displayId: string;
  value: string;
  badge?: string;
  isMe: boolean;
}

function LeaderboardCard({
  title, subtitle, icon, accentColor, entries, myRank,
  onShare, copiedKey, shareKeyPrefix,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  entries: LeaderboardEntry[];
  myRank: number;
  onShare: (rank: number, val: string) => void;
  copiedKey: string | null;
  shareKeyPrefix: string;
}) {
  const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
      {/* Card header */}
      <div className="px-4 py-3 flex items-center gap-2"
        style={{ background: 'linear-gradient(135deg,rgba(238,242,255,0.9),rgba(224,231,255,0.8))' }}>
        {icon}
        <div>
          <p className="text-sm font-bold" style={{ color: '#312e81' }}>{title}</p>
          <p className="text-xs" style={{ color: '#6b7280' }}>{subtitle}</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: '#9ca3af' }}>
          No data yet.
        </p>
      ) : (
        <div className="divide-y" style={{ borderColor: 'rgba(99,102,241,0.08)' }}>
          {entries.map((e) => (
            <div key={e.uid}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: e.isMe
                  ? `rgba(${accentColor === '#ea580c' ? '234,88,12' : '99,102,241'},0.06)`
                  : 'rgba(255,255,255,0.6)',
              }}>
              <span className="text-sm font-bold w-6 text-center flex-shrink-0" style={{ color: '#6b7280' }}>
                {MEDAL[e.rank] ?? `#${e.rank}`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: e.isMe ? accentColor : '#1e1b4b' }}>
                  {e.name} {e.isMe && <span className="text-xs font-normal">(you)</span>}
                </p>
                {e.badge && (
                  <p className="text-xs" style={{ color: '#6b7280' }}>{e.badge}</p>
                )}
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: e.rank <= 3 ? `rgba(${accentColor === '#ea580c' ? '234,88,12' : '99,102,241'},0.1)` : 'rgba(107,114,128,0.1)',
                  color: e.rank <= 3 ? accentColor : '#6b7280',
                }}>
                {e.value}
              </span>
              {e.isMe && (
                <button onClick={() => onShare(e.rank, e.value)}
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0"
                  style={{ background: '#0a66c2', color: '#fff' }}
                  title="Share on LinkedIn">
                  {copiedKey === `${shareKeyPrefix}-${e.rank}`
                    ? <Check size={12} />
                    : <Linkedin size={12} />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SpotlightBanner({
  raceRank, arenaRank, name, raceMarks, arenaRating,
}: {
  raceRank: number; arenaRank: number; name: string;
  raceMarks?: number; arenaRating?: number;
}) {
  const [postCopied, setPostCopied] = useState(false);

  const lines: string[] = [];
  if (raceRank > 0) lines.push(`🏎️ SQL Grand Prix: Rank #${raceRank} (${raceMarks} pts)`);
  if (arenaRank > 0) lines.push(`⚔️ Arena: Rank #${arenaRank} (${arenaRating} ELO)`);

  const post = `Proud to be on the YooBees Hall of Fame! 🏆\n\n${lines.join('\n')}\n\nAmazing competitive learning platform by Ureshan.\n\nJoin at: ${PLATFORM_URL}\n\n#YooBees #SQL #DatabaseManagement #HallOfFame #Competitive`;

  function copy() {
    navigator.clipboard.writeText(post).then(() => {
      setPostCopied(true);
      setTimeout(() => setPostCopied(false), 2500);
    });
  }

  function share() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PLATFORM_URL)}`, '_blank', 'noopener,noreferrer,width=600,height=600');
    navigator.clipboard.writeText(post).catch(() => {});
  }

  return (
    <div className="rounded-2xl border p-5 space-y-3"
      style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.1),rgba(245,158,11,0.05))', borderColor: 'rgba(251,191,36,0.35)' }}>
      <div className="flex items-center gap-2">
        <Crown size={20} style={{ color: '#b45309' }} />
        <p className="text-sm font-bold" style={{ color: '#92400e' }}>
          You're on the Hall of Fame! Share your achievement.
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={share}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
          style={{ background: '#0a66c2' }}>
          <Linkedin size={15} /> Share on LinkedIn
        </button>
        <button onClick={copy}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold border"
          style={{ borderColor: 'rgba(180,83,9,0.3)', background: 'rgba(180,83,9,0.08)', color: '#b45309' }}>
          {postCopied ? <Check size={15} /> : <Copy size={15} />}
          {postCopied ? 'Copied!' : 'Copy Post'}
        </button>
      </div>
    </div>
  );
}
