import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection, doc, onSnapshot, addDoc, updateDoc, setDoc,
  query, where, orderBy, limit, runTransaction, serverTimestamp,
  deleteDoc, getDocs,
} from 'firebase/firestore';
import {
  Swords, Trophy, Users, Zap, Flame, Crown, Star,
  Clock, ChevronRight, X, Search, Eye, Shield,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  calculateElo, getTier, tierProgress, TIER_CONFIG, getWeekKey, todayStr, pickDuelQuestions,
  type EloRating, type DuelInvite, type DuelRoom,
} from '../../lib/eloUtils';
import type { StudentProfile } from '../../lib/types';

const INVITE_TTL = 60_000; // 60 seconds

function TierBadge({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const tier = getTier(rating);
  const cfg  = TIER_CONFIG[tier];
  const px   = size === 'lg' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`font-bold rounded-full ${px}`}
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function EloCard({ elo }: { elo: EloRating }) {
  const tier    = getTier(elo.rating);
  const cfg     = TIER_CONFIG[tier];
  const prog    = tierProgress(elo.rating);
  const nextTier: Record<string, string> = { bronze: 'Silver', silver: 'Gold', gold: 'Queen Bee', queen: 'MAX' };
  const weekGain = elo.rating - (elo.weeklyRatingStart ?? elo.rating);
  const hasCrown = elo.crownUntil && new Date(elo.crownUntil) > new Date();

  return (
    <div className="rounded-3xl p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 70%, #0f172a 100%)',
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 12px 40px ${cfg.bg}`,
      }}>
      {/* crown glow */}
      {hasCrown && (
        <div className="absolute top-3 right-3 text-2xl animate-pulse" title="7-day streak crown!">👑</div>
      )}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: cfg.bg, border: `2px solid ${cfg.border}` }}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold mb-0.5" style={{ color: '#64748b' }}>MBI802 Arena Rank</p>
          <p className="text-2xl font-extrabold leading-none" style={{ color: cfg.color }}>{cfg.label}</p>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
            {elo.rating.toLocaleString()} ELO
            {weekGain !== 0 && (
              <span style={{ color: weekGain > 0 ? '#34d399' : '#f87171' }}>
                {' '}{weekGain > 0 ? '+' : ''}{weekGain} this week
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {tier !== 'queen' && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#64748b' }}>
            <span>{cfg.label}</span>
            <span>{prog}% → {nextTier[tier]} Bee</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-2 rounded-full transition-all duration-700"
              style={{ width: `${prog}%`, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}99)` }} />
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Wins',   value: elo.totalWins,    color: '#34d399' },
          { label: 'Losses', value: elo.totalLosses,  color: '#f87171' },
          { label: 'Streak', value: `${elo.duelStreak}d`, color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} className="text-center rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs" style={{ color: '#64748b' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Student picker modal ──────────────────────────────────────────────────────
function ChallengeModal({
  students, myUid, onChallenge, onClose,
}: {
  students: (StudentProfile & { elo?: number })[]; myUid: string;
  onChallenge: (s: StudentProfile & { elo?: number }) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = students
    .filter(s => s.uid !== myUid)
    .filter(s => !search || s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.includes(search));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: 'rgba(15,10,30,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.3)', maxHeight: '80vh' }}>
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="font-bold text-base" style={{ color: '#e2e8f0' }}>Challenge a Classmate</p>
          <button onClick={onClose}><X size={18} style={{ color: '#64748b' }} /></button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={14} style={{ color: '#64748b' }} />
            <input className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: '#e2e8f0' }} placeholder="Search name or ID…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-y-auto px-4 pb-5 space-y-2" style={{ maxHeight: 360 }}>
          {filtered.length === 0 && (
            <p className="text-center text-sm py-6" style={{ color: '#475569' }}>No classmates found</p>
          )}
          {filtered.map(s => {
            const tier = getTier(s.elo ?? 1000);
            const cfg  = TIER_CONFIG[tier];
            return (
              <button key={s.uid}
                onClick={() => onChallenge(s)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: cfg.bg }}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#e2e8f0' }}>
                    {s.fullName || s.email}
                  </p>
                  <p className="text-xs" style={{ color: '#64748b' }}>
                    {s.elo ?? 1000} ELO · {s.section || '—'}
                  </p>
                </div>
                <ChevronRight size={16} style={{ color: '#475569' }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ArenaPage() {
  const { user, studentProfile } = useAuth();
  const navigate  = useNavigate();
  const weekKey   = getWeekKey();

  const [myElo, setMyElo]                   = useState<EloRating | null>(null);
  const [receivedInvites, setReceivedInvites] = useState<DuelInvite[]>([]);
  const [myInvite, setMyInvite]             = useState<DuelInvite | null>(null);
  const [activeRooms, setActiveRooms]       = useState<(DuelRoom & { id: string })[]>([]);
  const [leaderboard, setLeaderboard]       = useState<(EloRating & { name: string })[]>([]);
  const [students, setStudents]             = useState<(StudentProfile & { elo?: number })[]>([]);
  const [tab, setTab]                       = useState<'duel' | 'board' | 'live'>('duel');
  const [searching, setSearching]           = useState(false);
  const [showChallenge, setShowChallenge]   = useState(false);
  const [searchMsg, setSearchMsg]           = useState('');
  const [myActiveRoom, setMyActiveRoom]     = useState<string | null>(null);
  const searchTimeout                       = useRef<ReturnType<typeof setTimeout> | null>(null);

  const uid  = user?.uid ?? '';
  const name = studentProfile?.fullName || user?.email || 'Student';
  const today = todayStr();

  // ── Init ELO doc if missing ──────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, 'eloRatings', uid), async snap => {
      if (!snap.exists()) {
        await setDoc(doc(db, 'eloRatings', uid), {
          uid, rating: 1000, tier: 'bronze',
          weekKey, weeklyRatingStart: 1000,
          totalWins: 0, totalLosses: 0,
          duelStreak: 0, bestDuelStreak: 0, lastDuelDate: '',
          hallOfBees: false, hallOfBeesWeek: '',
          dailyTokenUsed: '', crownUntil: '',
        });
      } else {
        setMyElo(snap.data() as EloRating);
      }
    });
    return unsub;
  }, [uid, weekKey]);

  // ── Received invites (challenges sent to me) ─────────────────────────────
  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, 'duelInvites'),
      where('toUid', '==', uid),
      where('status', '==', 'pending')
    );
    const unsub = onSnapshot(q, snap => {
      const invites = snap.docs.map(d => ({ ...d.data(), id: d.id } as DuelInvite));
      // filter out expired
      setReceivedInvites(invites.filter(inv =>
        inv.expiresAt && inv.expiresAt.toDate().getTime() > Date.now()
      ));
    });
    return unsub;
  }, [uid]);

  // ── My pending invite ────────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, 'duelInvites'),
      where('fromUid', '==', uid),
      where('status', '==', 'pending')
    );
    const unsub = onSnapshot(q, snap => {
      if (snap.empty) { setMyInvite(null); return; }
      const inv = { ...snap.docs[0].data(), id: snap.docs[0].id } as DuelInvite;
      setMyInvite(inv);
      // Navigate when accepted
      if (inv.status === 'accepted' && inv.roomId) {
        navigate(`/student/arena/duel/${inv.roomId}`);
      }
    });
    return unsub;
  }, [uid, navigate]);

  // ── Watch all invites for quick-match acceptance ─────────────────────────
  useEffect(() => {
    if (!uid || !myInvite?.id) return;
    const unsub = onSnapshot(doc(db, 'duelInvites', myInvite.id), snap => {
      if (!snap.exists()) return;
      const inv = snap.data() as DuelInvite;
      if (inv.status === 'accepted' && inv.roomId) {
        navigate(`/student/arena/duel/${inv.roomId}`);
      }
    });
    return unsub;
  }, [myInvite?.id, uid, navigate]);

  // ── Active rooms for spectating ──────────────────────────────────────────
  useEffect(() => {
    const q = query(
      collection(db, 'duelRooms'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const unsub = onSnapshot(q, snap => {
      const rooms = snap.docs.map(d => ({ ...d.data(), id: d.id } as DuelRoom & { id: string }));
      setActiveRooms(rooms);
      // Check if I'm in an active room
      const mine = rooms.find(r => r.p1.uid === uid || r.p2.uid === uid);
      setMyActiveRoom(mine?.id ?? null);
    });
    return unsub;
  }, [uid]);

  // ── Weekly leaderboard ───────────────────────────────────────────────────
  useEffect(() => {
    const q = query(
      collection(db, 'eloRatings'),
      orderBy('rating', 'desc'),
      limit(10)
    );
    const unsub = onSnapshot(q, async snap => {
      const entries = snap.docs.map(d => d.data() as EloRating);
      // Fetch names from students collection
      const withNames = await Promise.all(entries.map(async e => {
        try {
          const sSnap = await getDocs(query(collection(db, 'students'), where('uid', '==', e.uid)));
          const name = sSnap.empty ? e.uid : (sSnap.docs[0].data().fullName || e.uid);
          return { ...e, name };
        } catch {
          return { ...e, name: e.uid };
        }
      }));
      setLeaderboard(withNames);
    });
    return unsub;
  }, []);

  // ── Load classmates for challenge modal ──────────────────────────────────
  useEffect(() => {
    if (!showChallenge) return;
    const q = query(collection(db, 'students'), where('subjects', 'array-contains', 'MBI802'));
    getDocs(q).then(async snap => {
      const studs = snap.docs.map(d => d.data() as StudentProfile);
      // Enrich with ELO
      const enriched = await Promise.all(studs.map(async s => {
        try {
          const eSnap = await getDocs(query(collection(db, 'eloRatings'), where('uid', '==', s.uid)));
          return { ...s, elo: eSnap.empty ? 1000 : (eSnap.docs[0].data() as EloRating).rating };
        } catch { return { ...s, elo: 1000 }; }
      }));
      setStudents(enriched.filter(s => s.uid !== uid));
    });
  }, [showChallenge, uid]);

  // ── Create open invite (quick match) ─────────────────────────────────────
  async function findQuickMatch() {
    if (!myElo || !uid) return;

    // Check daily token
    if (myElo.dailyTokenUsed === today) {
      setSearchMsg('Daily token already used. Come back tomorrow!'); return;
    }

    setSearching(true);
    setSearchMsg('Looking for an opponent…');

    // Look for existing open invites (not mine)
    const q = query(
      collection(db, 'duelInvites'),
      where('toUid', '==', null),
      where('status', '==', 'pending')
    );
    const openSnap = await getDocs(q);
    const open = openSnap.docs
      .map(d => ({ ...d.data(), id: d.id } as DuelInvite))
      .filter(inv => inv.fromUid !== uid && inv.expiresAt && inv.expiresAt.toDate().getTime() > Date.now());

    if (open.length > 0) {
      // Accept the oldest invite
      const target = open.sort((a, b) =>
        (a.createdAt?.toDate().getTime() ?? 0) - (b.createdAt?.toDate().getTime() ?? 0)
      )[0];
      await acceptInvite(target, null);
      return;
    }

    // No open invites — create one
    const expiresAt = new Date(Date.now() + INVITE_TTL);
    await addDoc(collection(db, 'duelInvites'), {
      fromUid: uid, fromName: name, fromElo: myElo.rating,
      toUid: null, toName: null,
      status: 'pending',
      roomId: null,
      createdAt: serverTimestamp(),
      expiresAt,
    });

    // Mark daily token used
    await updateDoc(doc(db, 'eloRatings', uid), { dailyTokenUsed: today });

    setSearchMsg('Invite sent — waiting for an opponent…');

    // Auto-expire after TTL
    searchTimeout.current = setTimeout(async () => {
      setSearching(false);
      setSearchMsg('No opponent found. Try again!');
    }, INVITE_TTL);
  }

  // ── Challenge specific student ────────────────────────────────────────────
  async function challengeStudent(target: StudentProfile & { elo?: number }) {
    if (!myElo || !uid) return;
    setShowChallenge(false);
    await addDoc(collection(db, 'duelInvites'), {
      fromUid: uid, fromName: name, fromElo: myElo.rating,
      toUid: target.uid, toName: target.fullName || target.email,
      status: 'pending',
      roomId: null,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + INVITE_TTL),
    });
    setSearchMsg(`Challenge sent to ${target.fullName || target.email}! Waiting…`);
  }

  // ── Accept a received invite ──────────────────────────────────────────────
  async function acceptInvite(invite: DuelInvite, inviteId: string | null) {
    if (!myElo || !uid) return;
    const id   = inviteId ?? invite.id!;
    const qIds = pickDuelQuestions(5);

    try {
      await runTransaction(db, async tx => {
        const iRef    = doc(db, 'duelInvites', id);
        const iSnap   = await tx.get(iRef);
        const iData   = iSnap.data() as DuelInvite;
        if (iData.status !== 'pending') throw new Error('Already taken');

        const roomRef = doc(collection(db, 'duelRooms'));
        tx.set(roomRef, {
          p1: { uid: iData.fromUid, name: iData.fromName, elo: iData.fromElo, section: '' },
          p2: { uid, name, elo: myElo.rating, section: studentProfile?.section ?? '' },
          questionIds: qIds,
          currentRound: 0,
          roundStartedAt: serverTimestamp(),
          score: { p1: 0, p2: 0 },
          status: 'active',
          winner: null,
          eloProcessed: false,
          spectators: [],
          createdAt: serverTimestamp(),
          completedAt: null,
        });
        tx.update(iRef, { status: 'accepted', roomId: roomRef.id });
        // Mark token for acceptor too
        const eRef = doc(db, 'eloRatings', uid);
        tx.update(eRef, { dailyTokenUsed: today });

        navigate(`/student/arena/duel/${roomRef.id}`);
      });
    } catch {
      setSearchMsg('Duel already taken — try another!');
    }
    setSearching(false);
  }

  async function declineInvite(inviteId: string) {
    await updateDoc(doc(db, 'duelInvites', inviteId), { status: 'declined' });
  }

  async function cancelSearch() {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setSearching(false);
    setSearchMsg('');
    if (myInvite?.id) {
      await deleteDoc(doc(db, 'duelInvites', myInvite.id));
    }
  }

  const tokenAvailable = myElo && myElo.dailyTokenUsed !== today;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <PageHeader title="⚔️ Arena" subtitle="MBI802 · 1v1 Brain Duels · ER Diagrams & SQL" />

      {showChallenge && (
        <ChallengeModal
          students={students} myUid={uid}
          onChallenge={challengeStudent}
          onClose={() => setShowChallenge(false)}
        />
      )}

      <div className="max-w-2xl mx-auto space-y-5 pb-10">

        {/* Resume active duel */}
        {myActiveRoom && (
          <button
            onClick={() => navigate(`/student/arena/duel/${myActiveRoom}`)}
            className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
            style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.1))', border: '1px solid rgba(239,68,68,0.4)' }}>
            <Flame size={20} style={{ color: '#f87171', flexShrink: 0 }} />
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: '#fca5a5' }}>You have an active duel!</p>
              <p className="text-xs" style={{ color: '#f87171' }}>Tap to rejoin — your opponent is waiting</p>
            </div>
            <ChevronRight size={16} style={{ color: '#f87171' }} />
          </button>
        )}

        {/* Pending challenges received */}
        {receivedInvites.map(inv => (
          <div key={inv.id!}
            className="rounded-2xl p-4 border"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.35)' }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: TIER_CONFIG[getTier(inv.fromElo)].bg }}>
                {TIER_CONFIG[getTier(inv.fromElo)].icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: '#e2e8f0' }}>
                  {inv.fromName} challenged you!
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                  {inv.fromElo} ELO · MBI802 Duel · 5 Rounds
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => acceptInvite(inv, inv.id!)}
                className="flex-1 py-2 rounded-xl text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff' }}>
                Accept Challenge ⚔️
              </button>
              <button
                onClick={() => declineInvite(inv.id!)}
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                Decline
              </button>
            </div>
          </div>
        ))}

        {/* ELO Card */}
        {myElo ? (
          <EloCard elo={myElo} />
        ) : (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl w-full"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
          {(['duel', 'board', 'live'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: tab === t ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'transparent',
                color: tab === t ? '#fff' : '#7c3aed',
              }}>
              {t === 'duel' ? '⚔️ Duel' : t === 'board' ? '🏆 Leaderboard' : '👁 Live'}
            </button>
          ))}
        </div>

        {/* ── DUEL TAB ─────────────────────────────────────────────── */}
        {tab === 'duel' && (
          <div className="space-y-4">

            {/* Status message */}
            {searchMsg && (
              <div className="rounded-2xl px-4 py-3 text-sm font-medium text-center"
                style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                {searchMsg}
              </div>
            )}

            {/* Daily token */}
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: tokenAvailable
                  ? 'linear-gradient(135deg, rgba(245,243,255,0.9), rgba(237,233,254,0.7))'
                  : 'rgba(255,255,255,0.04)',
                border: tokenAvailable ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(255,255,255,0.07)',
              }}>
              <Zap size={18} style={{ color: tokenAvailable ? '#7c3aed' : '#475569', flexShrink: 0 }} />
              <div className="flex-1">
                <p className="text-xs font-bold" style={{ color: tokenAvailable ? '#4c1d95' : '#64748b' }}>
                  Daily Token {tokenAvailable ? '🟢 Available' : '🔴 Used'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: tokenAvailable ? '#6d28d9' : '#475569' }}>
                  {tokenAvailable
                    ? 'One free quick-match duel resets every midnight'
                    : 'Token refreshes at midnight — challenge friends anytime'}
                </p>
              </div>
              {myElo?.duelStreak && myElo.duelStreak > 0 ? (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                  🔥 {myElo.duelStreak}d
                </span>
              ) : null}
            </div>

            {/* Quick match button */}
            {searching ? (
              <div className="rounded-2xl p-5 text-center" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full border-2 animate-spin"
                    style={{ borderColor: '#818cf844', borderTopColor: '#818cf8' }} />
                  <span className="text-sm font-semibold" style={{ color: '#a5b4fc' }}>Searching…</span>
                </div>
                <button onClick={cancelSearch} className="text-xs px-4 py-1.5 rounded-full"
                  style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={findQuickMatch}
                disabled={!myElo || !tokenAvailable}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all"
                style={{
                  background: tokenAvailable
                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                    : 'rgba(255,255,255,0.05)',
                  color: tokenAvailable ? '#fff' : '#475569',
                  boxShadow: tokenAvailable ? '0 8px 32px rgba(99,102,241,0.4)' : 'none',
                  cursor: tokenAvailable ? 'pointer' : 'not-allowed',
                }}>
                <Swords size={20} />
                Quick Duel — Match Me!
                <ChevronRight size={18} />
              </button>
            )}

            {/* Challenge specific friend */}
            <button
              onClick={() => setShowChallenge(true)}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
              <Users size={16} />
              Challenge a Specific Classmate
            </button>

            {/* How it works */}
            <div className="rounded-2xl p-4 space-y-3"
              style={{ background: 'rgba(245,243,255,0.7)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <p className="text-xs font-bold" style={{ color: '#4c1d95' }}>How Duels Work</p>
              {[
                ['⚔️', 'Best of 5 rounds — first to 3 round wins takes the duel'],
                ['⏱', 'Each round: one MBI802 question, 60 seconds, first correct answer wins'],
                ['📊', 'ELO adjusts after every duel — beat stronger opponents for bigger gains'],
                ['🔥', 'Duel daily to build your streak — 7 days earns a 24h crown 👑'],
              ].map(([icon, text]) => (
                <div key={text as string} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 text-base">{icon}</span>
                  <p className="text-xs leading-5" style={{ color: '#5b21b6' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LEADERBOARD TAB ─────────────────────────────────────── */}
        {tab === 'board' && (
          <div className="space-y-4">
            {/* Hall of Bees */}
            <div className="rounded-2xl p-4 border"
              style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.05))', borderColor: 'rgba(245,158,11,0.3)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Crown size={16} style={{ color: '#f59e0b' }} />
                <span className="text-sm font-bold" style={{ color: '#92400e' }}>Hall of Bees</span>
                <span className="text-xs ml-auto" style={{ color: '#b45309' }}>Previous weeks' top 3</span>
              </div>
              {leaderboard.filter(e => e.hallOfBees).length === 0 ? (
                <p className="text-xs text-center py-3" style={{ color: '#92400e', opacity: 0.6 }}>
                  No inductees yet — finish top 3 in a weekly leaderboard to earn a permanent badge!
                </p>
              ) : (
                leaderboard.filter(e => e.hallOfBees).map((e, i) => (
                  <div key={e.uid} className="flex items-center gap-2 py-1.5">
                    <Star size={12} className="fill-amber-500 text-amber-500 flex-shrink-0" />
                    <span className="text-xs font-semibold flex-1" style={{ color: '#92400e' }}>{e.name}</span>
                    <span className="text-xs" style={{ color: '#b45309' }}>Week {e.hallOfBeesWeek}</span>
                  </div>
                ))
              )}
            </div>

            {/* This week */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.18)' }}>
              <div className="px-4 py-3 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.8))' }}>
                <Trophy size={16} style={{ color: '#7c3aed' }} />
                <span className="text-sm font-bold" style={{ color: '#4c1d95' }}>This Week — Top ELO</span>
                <span className="text-xs ml-auto px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}>Live</span>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
                {leaderboard.map((e, idx) => {
                  const isMe  = e.uid === uid;
                  const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                  return (
                    <div key={e.uid}
                      className="px-4 py-2.5 flex items-center gap-3"
                      style={{ background: isMe ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.5)' }}>
                      <span className="w-7 text-center flex-shrink-0 text-sm">{medal}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: isMe ? '#4c1d95' : '#1e1b4b' }}>
                          {e.name}{isMe ? ' (you)' : ''}
                          {e.hallOfBees && <Star size={11} className="inline ml-1 fill-amber-500 text-amber-500" />}
                        </p>
                        <p className="text-xs" style={{ color: '#6b7280' }}>
                          {e.totalWins}W / {e.totalLosses}L
                        </p>
                      </div>
                      <TierBadge rating={e.rating} size="sm" />
                      <span className="text-sm font-bold ml-2 flex-shrink-0" style={{ color: '#4c1d95' }}>
                        {e.rating}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── LIVE TAB ─────────────────────────────────────────────── */}
        {tab === 'live' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold" style={{ color: '#1e1b4b' }}>
                {activeRooms.length} live duel{activeRooms.length !== 1 ? 's' : ''} in progress
              </span>
            </div>
            {activeRooms.length === 0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(139,92,246,0.15)' }}>
                <Eye size={28} style={{ color: '#c4b5fd', margin: '0 auto 10px' }} />
                <p className="text-sm" style={{ color: '#9ca3af' }}>No active duels right now — be the first!</p>
              </div>
            ) : (
              activeRooms.map(room => {
                const isMyRoom = room.p1.uid === uid || room.p2.uid === uid;
                const p1Tier = TIER_CONFIG[getTier(room.p1.elo)];
                const p2Tier = TIER_CONFIG[getTier(room.p2.elo)];
                return (
                  <div key={room.id}
                    className="rounded-2xl p-4 border"
                    style={{ border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.04)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                      <span className="text-xs font-bold" style={{ color: '#a5b4fc' }}>
                        Round {room.currentRound + 1} of 5 · {room.score.p1}–{room.score.p2}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 text-center">
                        <span className="text-lg">{p1Tier.icon}</span>
                        <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: '#e2e8f0' }}>{room.p1.name}</p>
                        <p className="text-xs" style={{ color: '#64748b' }}>{room.score.p1} wins</p>
                      </div>
                      <div className="text-base font-extrabold" style={{ color: '#475569' }}>VS</div>
                      <div className="flex-1 text-center">
                        <span className="text-lg">{p2Tier.icon}</span>
                        <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: '#e2e8f0' }}>{room.p2.name}</p>
                        <p className="text-xs" style={{ color: '#64748b' }}>{room.score.p2} wins</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/student/arena/duel/${room.id}`)}
                      className="w-full mt-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      style={{ background: isMyRoom ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.06)', color: isMyRoom ? '#fff' : '#94a3b8' }}>
                      <Eye size={12} />
                      {isMyRoom ? 'Rejoin Duel' : 'Spectate'}
                    </button>
                  </div>
                );
              })
            )}

            {/* ELO Tier guide */}
            <div className="rounded-2xl p-4 space-y-2" style={{ background: 'rgba(245,243,255,0.7)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <p className="text-xs font-bold mb-2" style={{ color: '#4c1d95' }}>ELO Tier Guide</p>
              {(Object.entries(TIER_CONFIG) as [string, typeof TIER_CONFIG.bronze][]).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-base w-6">{cfg.icon}</span>
                  <span className="text-xs font-semibold flex-1" style={{ color: cfg.color }}>{cfg.label}</span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>
                    {key === 'queen' ? '1500+' : `${cfg.min}–${cfg.max}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
