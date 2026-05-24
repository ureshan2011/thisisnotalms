import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  collection, doc, onSnapshot, addDoc, updateDoc,
  runTransaction, serverTimestamp,
} from 'firebase/firestore';
import {
  Swords, CheckCircle2, XCircle, Clock, Trophy, BookOpen,
  Eye, ArrowLeft, Zap,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  calculateElo, getTier, tierProgress, TIER_CONFIG, todayStr,
  type DuelRoom, type DuelAnswer, type EloRating,
} from '../../lib/eloUtils';
import { DUEL_QUESTIONS, TOPIC_CONFIG, DIFFICULTY_CONFIG } from '../../lib/duelData';

const ROUND_DURATION = 60; // seconds per round
const ROUND_PAUSE    = 2500; // ms to show result before advancing
const CHOICE_LABELS  = ['A', 'B', 'C', 'D'] as const;

function fmtSecs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ── Player panel ──────────────────────────────────────────────────────────────
function PlayerPanel({
  player, score, isMe, answered, isWinner, isLoser,
}: {
  player: DuelRoom['p1']; score: number; isMe: boolean;
  answered: boolean; isWinner: boolean; isLoser: boolean;
}) {
  const tier = getTier(player.elo);
  const cfg  = TIER_CONFIG[tier];
  return (
    <div
      className="flex-1 rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all"
      style={{
        background: isWinner
          ? 'rgba(16,185,129,0.15)'
          : isLoser ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
        border: isWinner
          ? '2px solid rgba(16,185,129,0.5)'
          : isLoser ? '2px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.1)',
      }}>
      <div className="text-2xl">{cfg.icon}</div>
      <p className="text-xs font-bold text-center truncate w-full" style={{ color: '#e2e8f0' }}>
        {player.name}{isMe ? ' (You)' : ''}
      </p>
      <p className="text-xs" style={{ color: '#64748b' }}>{player.elo} ELO</p>
      <div className="text-2xl font-extrabold" style={{ color: isWinner ? '#34d399' : isLoser ? '#f87171' : '#e2e8f0' }}>
        {score}
      </div>
      <div className="text-xs font-medium" style={{
        color: answered ? '#34d399' : '#94a3b8',
      }}>
        {answered ? '✅ Answered' : '✍️ Thinking…'}
      </div>
    </div>
  );
}

// ── Question text with SQL highlighting ───────────────────────────────────────
function QuestionText({ text }: { text: string }) {
  const blocks = text.split('\n').reduce<{ type: 'text' | 'code'; lines: string[] }[]>((acc, line) => {
    const isCode = line.startsWith('  ') || /^(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|GROUP|ORDER|HAVING|JOIN|UNION)\b/i.test(line.trim());
    const type: 'text' | 'code' = isCode ? 'code' : 'text';
    const last = acc[acc.length - 1];
    if (last && last.type === type) { last.lines.push(line); }
    else acc.push({ type, lines: [line] });
    return acc;
  }, []);
  return (
    <div className="space-y-2">
      {blocks.map((b, i) => b.type === 'code' ? (
        <pre key={i} className="text-xs rounded-xl px-4 py-3 leading-6 overflow-x-auto"
          style={{ background: 'rgba(15,10,30,0.7)', color: '#a5f3fc', fontFamily: '"Fira Code",monospace', border: '1px solid rgba(99,102,241,0.3)' }}>
          {b.lines.join('\n')}
        </pre>
      ) : (
        <p key={i} className="text-sm leading-6" style={{ color: '#e2e8f0' }}>
          {b.lines.join('\n')}
        </p>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DuelRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate   = useNavigate();
  const { user, studentProfile } = useAuth();

  const [room, setRoom]     = useState<DuelRoom | null>(null);
  const [answers, setAnswers] = useState<DuelAnswer[]>([]);
  const [eloData, setEloData] = useState<EloRating | null>(null);
  const [selected, setSelected] = useState<0 | 1 | 2 | 3 | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [eloResult, setEloResult] = useState<{ delta: number; newRating: number } | null>(null);
  const [roundPauseActive, setRoundPauseActive] = useState(false);
  const advancedRounds = useRef<Set<number>>(new Set());
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  const uid    = user?.uid ?? '';
  const isP1   = room?.p1.uid === uid;
  const isP2   = room?.p2.uid === uid;
  const isPlayer = isP1 || isP2;
  const me     = isP1 ? room?.p1 : isP2 ? room?.p2 : null;
  const opp    = isP1 ? room?.p2 : isP2 ? room?.p1 : null;
  const myScoreKey  = isP1 ? 'p1' : 'p2';
  const oppScoreKey = isP1 ? 'p2' : 'p1';

  // ── Subscribe to room ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(doc(db, 'duelRooms', roomId), snap => {
      if (snap.exists()) setRoom(snap.data() as DuelRoom);
    });
    return unsub;
  }, [roomId]);

  // ── Subscribe to answers ──────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(collection(db, 'duelRooms', roomId, 'answers'), snap => {
      setAnswers(snap.docs.map(d => ({ ...d.data(), id: d.id } as DuelAnswer)));
    });
    return unsub;
  }, [roomId]);

  // ── Subscribe to my ELO ───────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, 'eloRatings', uid), snap => {
      if (snap.exists()) setEloData(snap.data() as EloRating);
    });
    return unsub;
  }, [uid]);

  // ── Round countdown timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (!room || room.status !== 'active') return;
    if (timerRef.current) clearInterval(timerRef.current);

    const update = () => {
      const started = room.roundStartedAt?.toDate?.()?.getTime() ?? Date.now();
      const elapsed = (Date.now() - started) / 1000;
      setTimeLeft(Math.max(0, ROUND_DURATION - elapsed));
    };
    update();
    timerRef.current = setInterval(update, 250);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [room?.currentRound, room?.roundStartedAt, room?.status]);

  // ── Detect round winner and advance ──────────────────────────────────────
  useEffect(() => {
    if (!room || room.status !== 'active') return;
    const cr = room.currentRound;
    if (advancedRounds.current.has(cr)) return;

    const roundAnswers = answers.filter(a => a.round === cr);
    const correct = roundAnswers.filter(a => a.isCorrect).sort((a, b) => a.timeMs - b.timeMs);

    // Advance if correct answer found, or if time is up
    const shouldAdvance = correct.length > 0 || timeLeft <= 0;
    if (!shouldAdvance) return;

    advancedRounds.current.add(cr);
    setRoundPauseActive(true);
    setSelected(null);

    const winnerUid = correct[0]?.uid ?? null;
    setTimeout(() => {
      setRoundPauseActive(false);
      advanceRound(cr, winnerUid);
    }, ROUND_PAUSE);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, timeLeft <= 0, room?.currentRound]);

  // ── Process ELO when duel completes ──────────────────────────────────────
  useEffect(() => {
    if (!room || room.status !== 'completed' || room.eloProcessed || !uid || !roomId) return;
    processElo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.status, room?.eloProcessed]);

  async function advanceRound(completedRound: number, winnerUid: string | null) {
    if (!roomId || !room) return;
    try {
      await runTransaction(db, async tx => {
        const snap = await tx.get(doc(db, 'duelRooms', roomId));
        const r    = snap.data() as DuelRoom;
        if (r.currentRound !== completedRound) return;

        const newScore = { ...r.score };
        if (winnerUid === r.p1.uid) newScore.p1 += 1;
        else if (winnerUid === r.p2.uid) newScore.p2 += 1;

        const nextRound = completedRound + 1;
        const maxWins   = Math.max(newScore.p1, newScore.p2);
        const isDone    = maxWins >= 3 || nextRound >= 5;

        if (isDone) {
          const winner = newScore.p1 > newScore.p2 ? r.p1.uid
            : newScore.p2 > newScore.p1 ? r.p2.uid : null;
          tx.update(doc(db, 'duelRooms', roomId), {
            score: newScore, currentRound: nextRound,
            status: 'completed', winner, completedAt: serverTimestamp(),
          });
        } else {
          tx.update(doc(db, 'duelRooms', roomId), {
            score: newScore, currentRound: nextRound,
            roundStartedAt: serverTimestamp(),
          });
        }
      });
    } catch { /* already advanced by opponent */ }
  }

  async function processElo() {
    if (!room || !roomId) return;
    try {
      await runTransaction(db, async tx => {
        const roomSnap = await tx.get(doc(db, 'duelRooms', roomId));
        const r = roomSnap.data() as DuelRoom;
        if (r.eloProcessed) return;

        const p1Snap = await tx.get(doc(db, 'eloRatings', r.p1.uid));
        const p2Snap = await tx.get(doc(db, 'eloRatings', r.p2.uid));
        const p1Elo  = (p1Snap.data() as EloRating)?.rating ?? 1000;
        const p2Elo  = (p2Snap.data() as EloRating)?.rating ?? 1000;
        const p1Won  = r.winner === r.p1.uid;
        const p2Won  = r.winner === r.p2.uid;
        const result = calculateElo(p1Elo, p2Elo, p1Won);

        const today  = todayStr();
        const updatePlayer = (pUid: string, pSnap: typeof p1Snap, newRating: number, won: boolean) => {
          const old = (pSnap.data() as EloRating) ?? {};
          const yesterday = new Date(Date.now() - 86_400_000).toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' });
          const lastDate  = old.lastDuelDate ?? '';
          const newStreak = lastDate === yesterday ? (old.duelStreak ?? 0) + 1 : 1;
          const newBest   = Math.max(newStreak, old.bestDuelStreak ?? 0);
          const crownUntil = newStreak >= 7
            ? new Date(Date.now() + 86_400_000).toISOString()
            : (old.crownUntil ?? '');
          tx.update(doc(db, 'eloRatings', pUid), {
            rating: newRating, tier: getTier(newRating),
            totalWins:   (old.totalWins ?? 0) + (won ? 1 : 0),
            totalLosses: (old.totalLosses ?? 0) + (won ? 0 : 1),
            duelStreak: newStreak, bestDuelStreak: newBest,
            lastDuelDate: today, crownUntil,
          });
        };

        updatePlayer(r.p1.uid, p1Snap, result.newA, p1Won);
        updatePlayer(r.p2.uid, p2Snap, result.newB, p2Won);
        tx.update(doc(db, 'duelRooms', roomId), { eloProcessed: true });

        // Show my delta
        const myDelta = uid === r.p1.uid ? result.deltaA : result.deltaB;
        const myNew   = uid === r.p1.uid ? result.newA : result.newB;
        setEloResult({ delta: myDelta, newRating: myNew });
      });
    } catch { /* already processed */ }
  }

  async function submitAnswer(choice: 0 | 1 | 2 | 3) {
    if (!room || !uid || !roomId || selected !== null) return;
    setSelected(choice);

    const q         = DUEL_QUESTIONS.find(q => q.id === room.questionIds[room.currentRound]);
    if (!q) return;
    const isCorrect  = choice === q.correct;
    const started    = room.roundStartedAt?.toDate?.()?.getTime() ?? Date.now();
    const timeMs     = Date.now() - started;

    await addDoc(collection(db, 'duelRooms', roomId, 'answers'), {
      uid, round: room.currentRound, choice, isCorrect, timeMs, submittedAt: serverTimestamp(),
    });

    // Update ghost record if correct and fast
    if (isCorrect) {
      try {
        const ghostRef = doc(db, 'duelGhosts', q.id);
        await runTransaction(db, async tx => {
          const snap = await tx.get(ghostRef);
          if (!snap.exists() || (snap.data()?.timeMs ?? Infinity) > timeMs) {
            tx.set(ghostRef, {
              questionId: q.id, uid,
              name: studentProfile?.fullName || user?.email || 'Student',
              timeMs, date: todayStr(),
            });
          }
        });
      } catch { /* ghost update optional */ }
    }
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  if (!room) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>
      </Layout>
    );
  }

  const cr         = room.currentRound;
  const currentQ   = DUEL_QUESTIONS.find(q => q.id === room.questionIds[Math.min(cr, room.questionIds.length - 1)]);
  const roundAns   = answers.filter(a => a.round === cr);
  const myAns      = roundAns.find(a => a.uid === uid);
  const oppAns     = roundAns.find(a => a.uid !== uid);
  const correctAns = roundAns.filter(a => a.isCorrect).sort((a, b) => a.timeMs - b.timeMs);
  const roundWinner = correctAns[0]?.uid ?? null;

  const myScore    = room.score[myScoreKey];
  const oppScore   = room.score[oppScoreKey];
  const iAmWinner  = room.winner === uid;
  const isDone     = room.status === 'completed';

  // ── Duel over screen ──────────────────────────────────────────────────────
  if (isDone) {
    const tierNow = getTier(eloResult?.newRating ?? (eloData?.rating ?? 1000));
    const cfg     = TIER_CONFIG[tierNow];
    const prog    = tierProgress(eloResult?.newRating ?? 1000);
    return (
      <Layout>
        <div className="max-w-lg mx-auto py-6 px-4 space-y-5">
          {/* Result hero */}
          <div className="rounded-3xl p-7 text-center"
            style={{
              background: iAmWinner
                ? 'linear-gradient(135deg, #052e16 0%, #064e3b 100%)'
                : 'linear-gradient(135deg, #1c0a0a 0%, #3b0f0f 100%)',
              border: iAmWinner ? '2px solid rgba(16,185,129,0.4)' : '2px solid rgba(239,68,68,0.3)',
              boxShadow: iAmWinner ? '0 16px 48px rgba(16,185,129,0.15)' : 'none',
            }}>
            <div className="text-5xl mb-3">{iAmWinner ? '🏆' : room.winner === null ? '🤝' : '💀'}</div>
            <p className="text-2xl font-extrabold mb-1"
              style={{ color: iAmWinner ? '#6ee7b7' : room.winner === null ? '#fde68a' : '#fca5a5' }}>
              {iAmWinner ? 'You Win!' : room.winner === null ? 'Draw!' : 'You Lose'}
            </p>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              {me?.name ?? 'You'} {myScore} – {oppScore} {opp?.name ?? 'Opponent'}
            </p>

            {/* ELO change */}
            {eloResult && (
              <div className="mt-5 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#64748b' }}>ELO Change</p>
                <p className="text-xl font-extrabold"
                  style={{ color: eloResult.delta >= 0 ? '#34d399' : '#f87171' }}>
                  {eloResult.delta >= 0 ? '+' : ''}{eloResult.delta}
                </p>
                <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                  New rating: {eloResult.newRating} · {cfg.label}
                </p>
                {/* Tier progress */}
                {tierNow !== 'queen' && (
                  <div className="mt-3">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${prog}%`, background: cfg.color }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#64748b' }}>{prog}% to next tier</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Round recap */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.18)' }}>
            <div className="px-4 py-3" style={{ background: 'rgba(245,243,255,0.9)' }}>
              <p className="text-sm font-bold" style={{ color: '#4c1d95' }}>Round Recap</p>
            </div>
            {Array.from({ length: Math.min(cr, room.questionIds.length) }).map((_, idx) => {
              const q     = DUEL_QUESTIONS.find(q => q.id === room.questionIds[idx]);
              const myA   = answers.find(a => a.uid === uid && a.round === idx);
              const oppA  = answers.find(a => a.uid !== uid && a.round === idx);
              const wAns  = answers.filter(a => a.round === idx && a.isCorrect).sort((a, b) => a.timeMs - b.timeMs)[0];
              const iWon  = wAns?.uid === uid;
              return (
                <div key={idx} className="px-4 py-3 border-t flex items-center gap-3"
                  style={{ borderColor: 'rgba(139,92,246,0.08)', background: 'rgba(255,255,255,0.5)' }}>
                  <span className="text-lg flex-shrink-0">{iWon ? '✅' : wAns ? '❌' : '🤝'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: '#1e1b4b' }}>
                      Round {idx + 1} {q ? `· ${q.category}` : ''}
                    </p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>
                      {myA ? `You: ${myA.isCorrect ? '✓' : '✗'} (${(myA.timeMs / 1000).toFixed(1)}s)` : 'You: timed out'}
                      {oppA ? `  ·  Opp: ${oppA.isCorrect ? '✓' : '✗'} (${(oppA.timeMs / 1000).toFixed(1)}s)` : '  ·  Opp: timed out'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/student/arena')}
            className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff' }}>
            <ArrowLeft size={16} /> Back to Arena
          </button>
        </div>
      </Layout>
    );
  }

  // ── Live duel screen ──────────────────────────────────────────────────────
  const timerPct    = (timeLeft / ROUND_DURATION) * 100;
  const timerColor  = timerPct > 50 ? '#34d399' : timerPct > 25 ? '#fbbf24' : '#f87171';
  const topicCfg    = currentQ ? TOPIC_CONFIG[currentQ.topic]    : null;
  const diffCfg     = currentQ ? DIFFICULTY_CONFIG[currentQ.difficulty] : null;
  const roundWinnerName = roundWinner === uid ? 'You' : roundWinner === opp?.uid ? opp.name : null;

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-3 pb-10">

        {/* Spectator badge */}
        {!isPlayer && (
          <div className="flex items-center justify-center gap-2 py-2 rounded-2xl"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Eye size={14} style={{ color: '#818cf8' }} />
            <span className="text-xs font-semibold" style={{ color: '#a5b4fc' }}>Spectating — read only</span>
          </div>
        )}

        {/* Header: round + timer bar */}
        <div className="rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f0a1e, #1e1b4b)', border: '1px solid rgba(99,102,241,0.25)' }}>

          {/* Round info row */}
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: '#818cf8' }}>
              ROUND {Math.min(cr + 1, 5)} OF 5
            </span>
            <div className="flex items-center gap-1.5">
              <Clock size={12} style={{ color: timerColor }} />
              <span className="text-sm font-extrabold font-mono" style={{ color: timerColor }}>
                {Math.ceil(timeLeft)}s
              </span>
            </div>
          </div>

          {/* Timer bar */}
          <div className="mx-4 mb-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-1.5 rounded-full transition-all duration-250"
              style={{ width: `${timerPct}%`, background: timerColor }} />
          </div>

          {/* Player panels */}
          <div className="px-3 pb-3 flex gap-3">
            {isP1 || !isPlayer ? (
              <>
                <PlayerPanel player={room.p1} score={room.score.p1} isMe={isP1}
                  answered={!!roundAns.find(a => a.uid === room.p1.uid)}
                  isWinner={roundPauseActive && roundWinner === room.p1.uid}
                  isLoser={roundPauseActive && roundWinner !== null && roundWinner !== room.p1.uid} />
                <PlayerPanel player={room.p2} score={room.score.p2} isMe={isP2}
                  answered={!!roundAns.find(a => a.uid === room.p2.uid)}
                  isWinner={roundPauseActive && roundWinner === room.p2.uid}
                  isLoser={roundPauseActive && roundWinner !== null && roundWinner !== room.p2.uid} />
              </>
            ) : (
              <>
                <PlayerPanel player={room.p2} score={room.score.p2} isMe={true}
                  answered={!!myAns}
                  isWinner={roundPauseActive && roundWinner === room.p2.uid}
                  isLoser={roundPauseActive && roundWinner !== null && roundWinner !== room.p2.uid} />
                <PlayerPanel player={room.p1} score={room.score.p1} isMe={false}
                  answered={!!oppAns}
                  isWinner={roundPauseActive && roundWinner === room.p1.uid}
                  isLoser={roundPauseActive && roundWinner !== null && roundWinner !== room.p1.uid} />
              </>
            )}
          </div>

          {/* Round result overlay */}
          {roundPauseActive && (
            <div className="mx-3 mb-3 rounded-2xl py-3 px-4 text-center"
              style={{
                background: roundWinner === uid
                  ? 'rgba(16,185,129,0.2)' : roundWinner
                  ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
                border: roundWinner === uid
                  ? '1px solid rgba(16,185,129,0.4)' : roundWinner
                  ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.1)',
              }}>
              {roundWinner === uid ? (
                <p className="text-sm font-bold" style={{ color: '#6ee7b7' }}>✅ You won this round!</p>
              ) : roundWinner ? (
                <p className="text-sm font-bold" style={{ color: '#fca5a5' }}>❌ {roundWinnerName} got it first</p>
              ) : (
                <p className="text-sm font-bold" style={{ color: '#94a3b8' }}>⏰ Time's up — no winner this round</p>
              )}
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Next round loading…</p>
            </div>
          )}
        </div>

        {/* Question card */}
        {currentQ && (
          <div className="rounded-3xl overflow-hidden"
            style={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.2)' }}>
            {/* Badges */}
            <div className="px-4 pt-4 pb-2 flex items-center gap-2 flex-wrap">
              {topicCfg && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: topicCfg.bg, color: topicCfg.color }}>
                  {topicCfg.label}
                </span>
              )}
              {diffCfg && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: diffCfg.bg, color: diffCfg.color }}>
                  {diffCfg.label}
                </span>
              )}
              {diffCfg && (
                <span className="text-xs ml-auto flex items-center gap-1" style={{ color: diffCfg.color }}>
                  <Zap size={12} />{currentQ.points}pts
                </span>
              )}
            </div>

            <div className="px-4 pb-2">
              <QuestionText text={currentQ.question} />
            </div>

            {/* Choices */}
            <div className="px-4 pb-4 space-y-2.5">
              {currentQ.choices.map((choice, i) => {
                const idx    = i as 0 | 1 | 2 | 3;
                const isSel  = selected === idx;
                const revealCorrect = roundPauseActive && idx === currentQ.correct;
                const revealWrong   = roundPauseActive && isSel && idx !== currentQ.correct;
                let bg      = 'rgba(255,255,255,0.04)';
                let border  = 'rgba(255,255,255,0.1)';
                let color   = '#94a3b8';
                if (revealCorrect) { bg = 'rgba(16,185,129,0.15)'; border = 'rgba(16,185,129,0.5)'; color = '#6ee7b7'; }
                else if (revealWrong) { bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.35)'; color = '#fca5a5'; }
                else if (isSel) { bg = 'rgba(129,140,248,0.15)'; border = '#818cf8'; color = '#e2e8f0'; }

                return (
                  <button
                    key={i}
                    disabled={!!myAns || !isPlayer || roundPauseActive}
                    onClick={() => submitAnswer(idx)}
                    className="w-full text-left rounded-2xl px-3.5 py-3 border flex items-start gap-3 transition-all"
                    style={{ background: bg, borderColor: border, color }}>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                      style={{ background: isSel || revealCorrect ? (revealWrong ? '#ef4444' : revealCorrect ? '#10b981' : '#818cf8') : 'rgba(255,255,255,0.1)', color: '#fff' }}>
                      {revealCorrect ? '✓' : revealWrong ? '✗' : CHOICE_LABELS[i]}
                    </span>
                    <span className="text-sm leading-5">{choice}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation on round end */}
            {roundPauseActive && (
              <div className="mx-4 mb-4 rounded-2xl p-3"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div className="flex items-start gap-2">
                  <BookOpen size={13} style={{ color: '#818cf8', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-xs leading-5" style={{ color: '#94a3b8' }}>{currentQ.explanation}</p>
                </div>
              </div>
            )}

            {/* Waiting for opponent */}
            {myAns && !roundPauseActive && (
              <div className="mx-4 mb-4 py-3 rounded-2xl text-center"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: '#818cf8', animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: '#64748b' }}>Waiting for opponent…</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
