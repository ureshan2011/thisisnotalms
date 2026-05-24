import { useState, useEffect, useRef } from 'react';
import {
  collection, doc, query, where, onSnapshot,
  addDoc, setDoc, serverTimestamp, orderBy, limit,
  runTransaction,
} from 'firebase/firestore';
import {
  Swords, Flame, Trophy, CheckCircle2, XCircle,
  Clock, Zap, BookOpen, ChevronRight, Users, Star, Ghost,
} from 'lucide-react';
import type { GhostRecord } from '../../lib/eloUtils';
import { todayStr } from '../../lib/eloUtils';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  DUEL_QUESTIONS, DIFFICULTY_CONFIG, TOPIC_CONFIG,
  type DuelQuestion, type DuelChallenge, type DuelResponse, type DuelStats,
} from '../../lib/duelData';

const today = todayStr;

type Phase = 'loading' | 'no_challenge' | 'question' | 'submitted';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'] as const;

// ── helpers ──────────────────────────────────────────────────────────────────

function fmtTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}

function streak_label(n: number) {
  if (n >= 30) return '👑 Legendary';
  if (n >= 14) return '🔥 On Fire';
  if (n >= 7)  return '⚡ Hot Streak';
  if (n >= 3)  return '✨ Building Up';
  return '🐝 Getting Started';
}

// ── Question display — renders SQL code in mono ───────────────────────────────
function QuestionText({ text }: { text: string }) {
  const parts = text.split('\n');
  const prose: string[] = [];
  const code: string[] = [];
  let inCode = false;

  for (const line of parts) {
    const trimmed = line.trimStart();
    const isSql =
      /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|FROM|WHERE|GROUP|ORDER|HAVING|JOIN|INNER|LEFT|RIGHT|UNION|WITH)\b/i.test(trimmed) ||
      /^[A-Z_]+\s*\(/.test(trimmed);
    if (isSql || (inCode && trimmed !== '')) {
      inCode = true;
      code.push(line);
    } else {
      if (inCode && trimmed === '') { inCode = false; }
      prose.push(line);
    }
  }

  // Simplified: just detect lines starting with SQL keywords or starting with spaces (indented code)
  const blocks: { type: 'text' | 'code'; content: string }[] = [];
  let currentType: 'text' | 'code' | null = null;
  let currentLines: string[] = [];

  for (const line of parts) {
    const trimmed = line.trimStart();
    const looksLikeCode =
      line.startsWith('  ') ||
      /^(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|GROUP|ORDER|HAVING|JOIN|INNER|LEFT|RIGHT|UNION)\b/i.test(trimmed);

    const type: 'text' | 'code' = looksLikeCode ? 'code' : 'text';
    if (type !== currentType) {
      if (currentLines.length > 0) blocks.push({ type: currentType!, content: currentLines.join('\n') });
      currentLines = [line];
      currentType = type;
    } else {
      currentLines.push(line);
    }
  }
  if (currentLines.length > 0) blocks.push({ type: currentType!, content: currentLines.join('\n') });

  return (
    <div className="space-y-2">
      {blocks.map((b, i) =>
        b.type === 'code' ? (
          <pre
            key={i}
            className="text-xs rounded-xl px-4 py-3 overflow-x-auto leading-6"
            style={{
              background: 'rgba(15,10,30,0.65)',
              color: '#a5f3fc',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            {b.content}
          </pre>
        ) : (
          <p key={i} className="text-sm leading-6" style={{ color: '#e2e8f0' }}>
            {b.content}
          </p>
        )
      )}
    </div>
  );
}

// ── Vote bar after submission ─────────────────────────────────────────────────
function VoteBar({
  index, label, text, votes, total, isCorrect, isSelected,
}: {
  index: number; label: string; text: string; votes: number; total: number;
  isCorrect: boolean; isSelected: boolean;
}) {
  const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
  let bg = 'rgba(255,255,255,0.08)';
  let border = 'rgba(255,255,255,0.1)';
  let barColor = 'rgba(139,92,246,0.5)';
  let textColor = '#cbd5e1';

  if (isCorrect) { bg = 'rgba(16,185,129,0.15)'; border = 'rgba(16,185,129,0.4)'; barColor = '#10b981'; textColor = '#6ee7b7'; }
  else if (isSelected) { bg = 'rgba(239,68,68,0.12)'; border = 'rgba(239,68,68,0.3)'; barColor = '#ef4444'; textColor = '#fca5a5'; }

  return (
    <div
      className="rounded-xl px-3 py-2.5 border relative overflow-hidden transition-all"
      style={{ background: bg, borderColor: border }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-xl transition-all duration-700"
        style={{ width: `${pct}%`, background: barColor.replace(')', ',0.18)').replace('rgb', 'rgba'), opacity: 0.6 }}
      />
      <div className="relative flex items-center gap-2">
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
          style={{ background: isCorrect ? '#10b981' : isSelected ? '#ef4444' : 'rgba(255,255,255,0.12)', color: '#fff' }}
        >
          {isCorrect ? '✓' : label}
        </span>
        <span className="flex-1 text-xs leading-5" style={{ color: textColor }}>{text}</span>
        <span className="text-xs font-bold flex-shrink-0" style={{ color: textColor }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DailyDuelPage() {
  const { user, studentProfile } = useAuth();

  const [phase, setPhase]               = useState<Phase>('loading');
  const [challenge, setChallenge]       = useState<DuelChallenge | null>(null);
  const [myResponse, setMyResponse]     = useState<DuelResponse | null>(null);
  const [allResponses, setAllResponses] = useState<DuelResponse[]>([]);
  const [myStats, setMyStats]           = useState<DuelStats | null>(null);

  const [ghost, setGhost]               = useState<GhostRecord | null>(null);
  const [beatGhost, setBeatGhost]       = useState<boolean | null>(null);

  // question-taking state
  const [selected, setSelected]         = useState<0 | 1 | 2 | 3 | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const [elapsed, setElapsed]           = useState(0); // ms since question shown
  const timerRef                        = useRef<ReturnType<typeof setInterval> | null>(null);
  const shownAt                         = useRef<number>(0);

  const dateKey = today();

  // ── load today's challenge ──────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'duelChallenges', dateKey), snap => {
      if (!snap.exists()) {
        setChallenge(null);
        setPhase('no_challenge');
        return;
      }
      const data = snap.data();
      setChallenge(data as DuelChallenge);
    });
    return unsub;
  }, [dateKey]);

  // ── load ghost record for today's question ────────────────────────────
  useEffect(() => {
    if (!challenge?.question?.id) return;
    const unsub = onSnapshot(doc(db, 'duelGhosts', challenge.question.id), snap => {
      setGhost(snap.exists() ? snap.data() as GhostRecord : null);
    });
    return unsub;
  }, [challenge?.question?.id]);

  // ── load my response for today ─────────────────────────────────────────────
  useEffect(() => {
    if (!user || !challenge) return;
    const q = query(
      collection(db, 'duelResponses'),
      where('studentUid', '==', user.uid),
      where('challengeDate', '==', dateKey)
    );
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        const d = snap.docs[0].data() as DuelResponse;
        setMyResponse({ ...d, id: snap.docs[0].id });
        setPhase('submitted');
      } else {
        setMyResponse(null);
        setPhase('question');
      }
    });
    return unsub;
  }, [user, challenge, dateKey]);

  // ── load class responses for today (live) ─────────────────────────────────
  useEffect(() => {
    const q = query(
      collection(db, 'duelResponses'),
      where('challengeDate', '==', dateKey),
      orderBy('submittedAt', 'asc'),
      limit(200)
    );
    const unsub = onSnapshot(q, snap => {
      setAllResponses(snap.docs.map(d => ({ ...d.data(), id: d.id } as DuelResponse)));
    });
    return unsub;
  }, [dateKey]);

  // ── load my stats ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'duelStats', user.uid), snap => {
      if (snap.exists()) setMyStats(snap.data() as DuelStats);
    });
    return unsub;
  }, [user]);

  // ── start timer when question phase begins ─────────────────────────────────
  useEffect(() => {
    if (phase === 'question') {
      shownAt.current = Date.now();
      timerRef.current = setInterval(() => setElapsed(Date.now() - shownAt.current), 500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // ── submit answer ──────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (selected === null || !user || !challenge || submitting) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect   = selected === challenge.question.correct;
    const pointsEarned = isCorrect ? challenge.question.points : 0;
    const responseTime = Date.now() - shownAt.current;
    const name        = studentProfile?.fullName || user.email || 'Student';

    try {
      await addDoc(collection(db, 'duelResponses'), {
        challengeDate:  dateKey,
        studentUid:     user.uid,
        studentName:    name,
        studentSection: studentProfile?.section ?? '',
        studentCampus:  studentProfile?.campus  ?? '',
        selectedChoice: selected,
        isCorrect,
        pointsEarned,
        responseTimeMs: responseTime,
        submittedAt:    serverTimestamp(),
      });

      // update ghost record if this is a correct answer and fastest
      if (isCorrect && challenge?.question?.id) {
        try {
          const ghostRef = doc(db, 'duelGhosts', challenge.question.id);
          await runTransaction(db, async tx => {
            const gSnap = await tx.get(ghostRef);
            if (!gSnap.exists() || (gSnap.data()?.timeMs ?? Infinity) > responseTime) {
              tx.set(ghostRef, {
                questionId: challenge.question.id, uid: user?.uid ?? '',
                name: studentProfile?.fullName || user?.email || 'Student',
                timeMs: responseTime, date: dateKey,
              });
              setBeatGhost(true);
            } else {
              setBeatGhost(false);
            }
          });
        } catch { setBeatGhost(false); }
      }

      // update cumulative stats
      const yesterday  = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const lastPlayed = myStats?.lastPlayedDate ?? '';
      const newStreak  =
        lastPlayed === yesterday ? (myStats?.streak ?? 0) + 1 :
        lastPlayed === dateKey   ? myStats?.streak ?? 1 :
        1;
      const newBest = Math.max(newStreak, myStats?.bestStreak ?? 0);

      await setDoc(doc(db, 'duelStats', user.uid), {
        totalPoints:    (myStats?.totalPoints    ?? 0) + pointsEarned,
        correctAnswers: (myStats?.correctAnswers ?? 0) + (isCorrect ? 1 : 0),
        totalAttempts:  (myStats?.totalAttempts  ?? 0) + 1,
        streak:         newStreak,
        bestStreak:     newBest,
        lastPlayedDate: dateKey,
      });
    } catch {
      // silently continue — local state updates even on write failure
    }
    setSubmitting(false);
  }

  // ── derived state ──────────────────────────────────────────────────────────
  const q = challenge?.question;
  const voteCounts = q
    ? [0, 1, 2, 3].map(i => allResponses.filter(r => r.selectedChoice === i).length)
    : [0, 0, 0, 0];
  const totalVotes = allResponses.length;
  const correctCount = allResponses.filter(r => r.isCorrect).length;

  // top 8 leaderboard: correct first, then by speed
  const leaderboard = [...allResponses]
    .sort((a, b) => {
      if (b.isCorrect !== a.isCorrect) return (b.isCorrect ? 1 : 0) - (a.isCorrect ? 1 : 0);
      return a.responseTimeMs - b.responseTimeMs;
    })
    .slice(0, 8);

  // ── render ─────────────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (phase === 'no_challenge') {
    return (
      <Layout>
        <PageHeader
          title="Daily Duel"
          subtitle="MBI802 · ER Diagrams & SQL"
        />
        <div className="max-w-xl mx-auto">
          <div
            className="rounded-3xl p-8 text-center border"
            style={{
              background: 'linear-gradient(135deg, rgba(15,10,30,0.95) 0%, rgba(30,27,75,0.9) 100%)',
              borderColor: 'rgba(99,102,241,0.3)',
              boxShadow: '0 12px 48px rgba(99,102,241,0.15)',
            }}
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(99,102,241,0.2)', border: '2px solid rgba(99,102,241,0.3)' }}
            >
              <Swords size={36} style={{ color: '#818cf8' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#e2e8f0' }}>
              No Challenge Yet Today
            </h2>
            <p className="text-sm leading-6 mb-6" style={{ color: '#94a3b8' }}>
              Your lecturer hasn't posted today's Brain Duel yet. Check back soon — a new challenge drops every day!
            </p>

            {/* My stats mini-card */}
            {myStats && myStats.totalAttempts > 0 && (
              <div
                className="rounded-2xl p-4 text-left grid grid-cols-3 gap-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="text-center">
                  <p className="text-2xl font-extrabold" style={{ color: '#a5f3fc' }}>
                    {myStats.streak}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Day Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold" style={{ color: '#fde68a' }}>
                    {myStats.totalPoints}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Total Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold" style={{ color: '#86efac' }}>
                    {myStats.totalAttempts > 0
                      ? Math.round((myStats.correctAnswers / myStats.totalAttempts) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Accuracy</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // ── Question phase ─────────────────────────────────────────────────────────
  if (phase === 'question' && q) {
    const topicCfg = TOPIC_CONFIG[q.topic];
    const diffCfg  = DIFFICULTY_CONFIG[q.difficulty];

    return (
      <Layout>
        <PageHeader
          title="Daily Duel"
          subtitle="MBI802 · ER Diagrams & SQL"
        />
        <div className="max-w-2xl mx-auto space-y-4 pb-10">

          {/* Stats bar */}
          <div className="flex items-center gap-3 flex-wrap">
            {myStats && myStats.streak > 0 && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}
              >
                <Flame size={13} />
                {myStats.streak} day streak
              </div>
            )}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}
            >
              <Trophy size={13} />
              {myStats?.totalPoints ?? 0} pts
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ml-auto"
              style={{ background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.2)' }}
            >
              <Users size={13} />
              {totalVotes} answered
            </div>
          </div>

          {/* Challenge card */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #0f0a1e 0%, #1e1b4b 60%, #1e3a5f 100%)',
              boxShadow: '0 16px 64px rgba(99,102,241,0.2)',
              border: '1px solid rgba(99,102,241,0.25)',
            }}
          >
            {/* Header */}
            <div
              className="px-5 pt-5 pb-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: topicCfg.bg, color: topicCfg.color, border: `1px solid ${topicCfg.color}40` }}
                >
                  {topicCfg.label}
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: diffCfg.bg, color: diffCfg.color, border: `1px solid ${diffCfg.color}40` }}
                >
                  {diffCfg.label}
                </span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}
                >
                  {q.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: '#fbbf24' }}>
                <Clock size={13} />
                <span className="text-xs font-mono font-semibold">{fmtTime(elapsed)}</span>
              </div>
            </div>

            {/* Points badge */}
            <div className="px-5 pt-4 flex items-center gap-2">
              <Zap size={14} style={{ color: diffCfg.color }} />
              <span className="text-xs font-bold" style={{ color: diffCfg.color }}>
                {q.points} points for correct answer
              </span>
            </div>

            {/* Question */}
            <div className="px-5 pt-3 pb-5">
              <QuestionText text={q.question} />
            </div>

            {/* Choices */}
            <div className="px-5 pb-5 space-y-2.5">
              {q.choices.map((choice, i) => {
                const idx = i as 0 | 1 | 2 | 3;
                const isSel = selected === idx;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(idx)}
                    className="w-full text-left rounded-2xl px-3.5 py-3 border transition-all duration-150 flex items-start gap-3"
                    style={{
                      borderColor: isSel ? '#818cf8' : 'rgba(255,255,255,0.1)',
                      background: isSel
                        ? 'linear-gradient(135deg, rgba(129,140,248,0.2), rgba(99,102,241,0.15))'
                        : 'rgba(255,255,255,0.04)',
                      color: isSel ? '#e2e8f0' : '#94a3b8',
                      transform: isSel ? 'scale(1.005)' : 'scale(1)',
                    }}
                  >
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                      style={{
                        background: isSel ? '#818cf8' : 'rgba(255,255,255,0.1)',
                        color: isSel ? '#fff' : '#94a3b8',
                      }}
                    >
                      {CHOICE_LABELS[i]}
                    </span>
                    <span className="text-sm leading-5">{choice}</span>
                  </button>
                );
              })}
            </div>

            {/* Ghost challenge */}
            {ghost && ghost.uid !== user?.uid && (
              <div className="mx-5 mb-3 px-3 py-2.5 rounded-2xl flex items-center gap-2"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Ghost size={14} style={{ color: '#818cf8', flexShrink: 0 }} />
                <p className="text-xs" style={{ color: '#a5b4fc' }}>
                  Beat <strong>{ghost.name}</strong>'s ghost — answered correctly in{' '}
                  <strong>{(ghost.timeMs / 1000).toFixed(1)}s</strong>. Can you go faster?
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="px-5 pb-6">
              <button
                onClick={handleSubmit}
                disabled={selected === null || submitting}
                className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: selected !== null
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'rgba(255,255,255,0.06)',
                  color: selected !== null ? '#fff' : '#475569',
                  cursor: selected !== null ? 'pointer' : 'not-allowed',
                  boxShadow: selected !== null ? '0 4px 20px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: '#fff3', borderTopColor: '#fff' }} />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Swords size={16} />
                    Lock In Answer
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Past record */}
          {myStats && myStats.totalAttempts > 0 && (
            <div
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{ background: 'rgba(245,243,255,0.7)', border: '1px solid rgba(139,92,246,0.15)' }}
            >
              <BookOpen size={18} style={{ color: '#7c3aed', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: '#4c1d95' }}>
                  Your Record
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                  {myStats.correctAnswers} correct out of {myStats.totalAttempts} duels ·{' '}
                  {Math.round((myStats.correctAnswers / myStats.totalAttempts) * 100)}% accuracy ·{' '}
                  Best streak: {myStats.bestStreak} days
                </p>
              </div>
              {myStats.streak >= 3 && (
                <span className="text-xs font-bold flex-shrink-0" style={{ color: '#f59e0b' }}>
                  {streak_label(myStats.streak)}
                </span>
              )}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // ── Submitted / Result phase ───────────────────────────────────────────────
  if ((phase === 'submitted' || myResponse) && q) {
    const isCorrect    = myResponse?.isCorrect ?? false;
    const myChoice     = myResponse?.selectedChoice ?? -1;
    const topicCfg     = TOPIC_CONFIG[q.topic];
    const diffCfg      = DIFFICULTY_CONFIG[q.difficulty];
    const myRank       = leaderboard.findIndex(r => r.studentUid === user?.uid) + 1;
    const newStreak    = myStats?.streak ?? 0;

    return (
      <Layout>
        <PageHeader title="Daily Duel" subtitle="MBI802 · ER Diagrams & SQL" />
        <div className="max-w-2xl mx-auto space-y-4 pb-10">

          {/* Result hero */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: isCorrect
                ? 'linear-gradient(160deg, #052e16 0%, #064e3b 60%, #0f172a 100%)'
                : 'linear-gradient(160deg, #1c0a0a 0%, #3b0f0f 60%, #0f172a 100%)',
              border: isCorrect ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
              boxShadow: isCorrect
                ? '0 16px 64px rgba(16,185,129,0.15)'
                : '0 16px 64px rgba(239,68,68,0.1)',
            }}
          >
            {/* Result header */}
            <div className="px-6 pt-6 pb-4 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)',
                  border: isCorrect ? '2px solid rgba(16,185,129,0.4)' : '2px solid rgba(239,68,68,0.3)',
                }}
              >
                {isCorrect
                  ? <CheckCircle2 size={28} style={{ color: '#34d399' }} />
                  : <XCircle size={28} style={{ color: '#f87171' }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-extrabold" style={{ color: isCorrect ? '#6ee7b7' : '#fca5a5' }}>
                  {isCorrect ? '🎉 Nailed it!' : '💡 Not quite!'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: isCorrect ? '#6ee7b7' : '#fca5a5', opacity: 0.8 }}>
                  {isCorrect
                    ? `+${myResponse?.pointsEarned ?? 0} points earned · Answered in ${fmtTime(myResponse?.responseTimeMs ?? 0)}`
                    : 'Read the explanation below — you\'ll get it next time!'}
                </p>
              </div>
              {isCorrect && newStreak > 0 && (
                <div className="flex flex-col items-center flex-shrink-0">
                  <Flame size={24} style={{ color: '#fbbf24' }} />
                  <span className="text-xs font-bold" style={{ color: '#fbbf24' }}>{newStreak}d</span>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="px-6 pb-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: topicCfg.bg, color: topicCfg.color }}>
                {topicCfg.label}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: diffCfg.bg, color: diffCfg.color }}>
                {diffCfg.label}
              </span>
              {myRank > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full ml-auto"
                  style={{ background: 'rgba(250,204,21,0.15)', color: '#fbbf24' }}>
                  #{myRank} overall
                </span>
              )}
            </div>

            {/* Question recap */}
            <div className="px-6 pb-3">
              <QuestionText text={q.question} />
            </div>

            {/* Vote bars */}
            <div className="px-6 pb-5 space-y-2">
              {q.choices.map((choice, i) => (
                <VoteBar
                  key={i}
                  index={i}
                  label={CHOICE_LABELS[i]}
                  text={choice}
                  votes={voteCounts[i]}
                  total={totalVotes}
                  isCorrect={i === q.correct}
                  isSelected={i === myChoice}
                />
              ))}
            </div>

            {/* Explanation */}
            <div
              className="mx-5 mb-5 rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-start gap-2">
                <BookOpen size={15} style={{ color: '#818cf8', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: '#818cf8' }}>Why?</p>
                  <p className="text-xs leading-5" style={{ color: '#94a3b8' }}>{q.explanation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Class stats */}
          <div
            className="rounded-2xl p-4 grid grid-cols-3 gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(245,243,255,0.9), rgba(237,233,254,0.7))',
              border: '1px solid rgba(139,92,246,0.15)',
            }}
          >
            <div className="text-center">
              <p className="text-xl font-extrabold" style={{ color: '#4c1d95' }}>{totalVotes}</p>
              <p className="text-xs mt-0.5" style={{ color: '#7c3aed' }}>Participated</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold" style={{ color: '#059669' }}>
                {totalVotes > 0 ? Math.round((correctCount / totalVotes) * 100) : 0}%
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#7c3aed' }}>Got It Right</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold" style={{ color: '#f59e0b' }}>
                {myStats?.totalPoints ?? 0}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#7c3aed' }}>Your Total Pts</p>
            </div>
          </div>

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(139,92,246,0.18)' }}
            >
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.8))' }}
              >
                <Trophy size={16} style={{ color: '#7c3aed' }} />
                <span className="text-sm font-bold" style={{ color: '#4c1d95' }}>
                  Today's Leaderboard
                </span>
                <span className="text-xs ml-auto" style={{ color: '#6b7280' }}>
                  Correct answers ranked by speed
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
                {leaderboard.map((r, idx) => {
                  const isMe = r.studentUid === user?.uid;
                  const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                  return (
                    <div
                      key={r.id ?? idx}
                      className="px-4 py-2.5 flex items-center gap-3"
                      style={{
                        background: isMe ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      <span className="text-sm w-6 text-center flex-shrink-0">{medal}</span>
                      <span
                        className="flex-1 text-sm font-medium truncate"
                        style={{ color: isMe ? '#4c1d95' : '#374151' }}
                      >
                        {r.studentName}
                        {isMe && <span className="ml-1.5 text-xs" style={{ color: '#7c3aed' }}>(you)</span>}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {r.isCorrect
                          ? <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                          : <XCircle size={13} style={{ color: '#ef4444' }} />
                        }
                        <span className="text-xs font-mono" style={{ color: '#6b7280' }}>
                          {fmtTime(r.responseTimeMs)}
                        </span>
                        <span
                          className="text-xs font-bold w-10 text-right"
                          style={{ color: r.isCorrect ? '#059669' : '#9ca3af' }}
                        >
                          {r.isCorrect ? `+${r.pointsEarned}` : '0'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ghost result */}
          {isCorrect && beatGhost !== null && (
            <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{
                background: beatGhost ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.04)',
                border: beatGhost ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.07)',
              }}>
              <Ghost size={16} style={{ color: beatGhost ? '#818cf8' : '#475569', flexShrink: 0 }} />
              <p className="text-xs font-medium" style={{ color: beatGhost ? '#a5b4fc' : '#64748b' }}>
                {beatGhost
                  ? `👻 New ghost record! You're now the fastest correct answer for this question.`
                  : `Ghost still holds. ${ghost ? `${ghost.name} answered in ${(ghost.timeMs / 1000).toFixed(1)}s.` : ''}`}
              </p>
            </div>
          )}

          {/* All-time stats */}
          {myStats && (
            <div
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{ background: 'rgba(245,243,255,0.7)', border: '1px solid rgba(139,92,246,0.15)' }}
            >
              <Star size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: '#4c1d95' }}>Your All-Time Record</p>
                <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                  {myStats.correctAnswers}/{myStats.totalAttempts} correct ·{' '}
                  Best streak {myStats.bestStreak} days ·{' '}
                  {streak_label(newStreak)}
                </p>
              </div>
              <span className="text-lg font-extrabold flex-shrink-0" style={{ color: '#7c3aed' }}>
                {myStats.totalPoints}pts
              </span>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    </Layout>
  );
}
