import { useEffect, useState, useMemo, type ReactNode } from 'react';
import {
  collection, query, onSnapshot, orderBy, doc, updateDoc,
  serverTimestamp, where, getDocs, writeBatch,
} from 'firebase/firestore';
import { Trophy, Plus, Flag, ToggleRight, Users, BarChart2, Download, Clock } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import RaceTrack from '../../components/sqlrace/RaceTrack';
import ChallengeCard from '../../components/sqlrace/ChallengeCard';
import CreateChallengeModal from '../../components/sqlrace/CreateChallengeModal';
import ActivateChallengeModal from '../../components/sqlrace/ActivateChallengeModal';
import ContributionPanel from '../../components/sqlrace/ContributionPanel';
import type { SqlRaceChallenge, SqlRaceSubmission } from '../../lib/sqlRaceTypes';
import { getChallengeSecondsLeft, formatCountdown } from '../../lib/sqlRaceTypes';
import { PRELOADED_CHALLENGES, TITLE_TO_SORT_ORDER } from '../../lib/sqlRacePreload';
import type { StudentProfile } from '../../lib/types';

type Tab = 'race' | 'challenges' | 'contributions';

function LiveTimer({ challenge }: { challenge: SqlRaceChallenge }) {
  const [secs, setSecs] = useState<number | null>(() => getChallengeSecondsLeft(challenge));

  useEffect(() => {
    const initial = getChallengeSecondsLeft(challenge);
    if (initial === null) { setSecs(null); return; }
    setSecs(initial);
    if (initial === 0) return;
    const id = setInterval(() => {
      const left = getChallengeSecondsLeft(challenge);
      setSecs(left);
      if (left === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id, challenge.timeLimit, challenge.activatedAt?.seconds]);

  if (secs === null) return <span className="text-xs text-gray-400">No time limit</span>;
  if (secs === 0) return <span className="text-xs font-bold text-rose-600">⏰ Expired</span>;

  const color = secs > 60 ? '#10b981' : secs > 30 ? '#f59e0b' : '#ef4444';
  return (
    <span className="text-xs font-bold tabular-nums flex items-center gap-1" style={{ color }}>
      <Clock size={11} />
      {formatCountdown(secs)}
    </span>
  );
}

export default function LecturerSQLRacePage() {
  const { user } = useAuth();

  const [tab, setTab] = useState<Tab>('race');
  const [challenges, setChallenges] = useState<SqlRaceChallenge[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<SqlRaceSubmission[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [activatingChallenge, setActivatingChallenge] = useState<SqlRaceChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState<string | null>(null);
  const [preloading, setPreloading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<number | null>(null);

  // Load challenges; sort client-side by sortOrder (falls back to 0 for non-starter challenges)
  useEffect(() => {
    const q = query(collection(db, 'sqlRaceChallenges'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, snap => {
      const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as SqlRaceChallenge));
      loaded.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
      setChallenges(loaded);
      setLoading(false);
    });
  }, []);

  // Load all submissions
  useEffect(() => {
    const q = query(collection(db, 'sqlRaceSubmissions'), orderBy('submittedAt', 'desc'));
    return onSnapshot(q, snap => {
      setAllSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() } as SqlRaceSubmission)));
    });
  }, []);

  // Load MBI802 students
  useEffect(() => {
    getDocs(query(collection(db, 'students'), where('subjects', 'array-contains', 'MBI802')))
      .then(snap => setStudents(snap.docs.map(d => d.data() as StudentProfile)));
  }, []);

  const closeChallenge = async (challengeId: string) => {
    setClosing(challengeId);
    try {
      await updateDoc(doc(db, 'sqlRaceChallenges', challengeId), {
        status: 'closed',
        closedAt: serverTimestamp(),
      });
    } finally {
      setClosing(null);
    }
  };

  const handlePreload = async () => {
    if (!user) return;
    setPreloading(true);
    try {
      const batch = writeBatch(db);
      for (const ch of PRELOADED_CHALLENGES) {
        const ref = doc(collection(db, 'sqlRaceChallenges'));
        batch.set(ref, {
          title: ch.title,
          description: ch.description,
          schemaContext: ch.schemaContext,
          question: ch.question,
          requiredKeywords: ch.requiredKeywords,
          pointValue: ch.pointValue,
          sortOrder: ch.sortOrder,
          status: 'closed',
          createdByUid: user.uid,
          createdAt: serverTimestamp(),
          timeLimit: null,
          activatedAt: null,
        });
      }
      await batch.commit();
    } finally {
      setPreloading(false);
    }
  };

  // Patches existing starter challenges in-place: fixes table names, descriptions,
  // question wording and sortOrder without touching IDs, marks or submissions.
  const handleSync = async () => {
    if (!user) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const bySort = new Map(PRELOADED_CHALLENGES.map(ch => [ch.sortOrder, ch]));
      const batch = writeBatch(db);
      let count = 0;
      for (const existing of challenges) {
        const newSort = TITLE_TO_SORT_ORDER[existing.title];
        if (newSort === undefined) continue; // custom challenge — skip
        const preload = bySort.get(newSort);
        if (!preload) continue;
        batch.update(doc(db, 'sqlRaceChallenges', existing.id), {
          title:            preload.title,
          description:      preload.description,
          schemaContext:    preload.schemaContext,
          question:         preload.question,
          requiredKeywords: preload.requiredKeywords,
          sortOrder:        newSort,
          // pointValue, status, createdAt, timeLimit, activatedAt intentionally preserved
        });
        count++;
      }
      await batch.commit();
      setSyncResult(count);
    } finally {
      setSyncing(false);
    }
  };

  const sectionStudentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of students) {
      if (s.section) counts[s.section] = (counts[s.section] ?? 0) + 1;
    }
    return counts;
  }, [students]);

  const totalMarks = challenges.reduce((sum, c) => sum + c.pointValue, 0);
  const activeChallenges = challenges.filter(c => c.status === 'active');

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        {/* Header */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 50%, #312e81 100%)',
            boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
          }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #818cf8, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl" style={{ background: 'rgba(251,191,36,0.15)' }}>
                  <Trophy size={20} className="text-amber-400" />
                </div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">MBI802 · Staff View</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mb-1">SQL Grand Prix</h1>
              <p className="text-indigo-200 text-sm">Manage challenges, track the race, and monitor student contributions.</p>
            </div>
            <div className="flex gap-4 flex-wrap">
              {[
                { value: activeChallenges.length, label: 'Active' },
                { value: totalMarks, label: 'Total pts' },
                { value: students.length, label: 'Students' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-[11px] text-indigo-300 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.10)' }}>
          {([
            { key: 'race', label: 'Live Race', icon: <Flag size={14} /> },
            { key: 'challenges', label: 'Challenges', icon: <BarChart2 size={14} /> },
            { key: 'contributions', label: 'Contributions', icon: <Users size={14} /> },
          ] as { key: Tab; label: string; icon: ReactNode }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-xl transition-all"
              style={
                tab === t.key
                  ? { background: 'white', color: '#7c3aed', boxShadow: '0 2px 8px rgba(124,58,237,0.12)' }
                  : { color: '#6b7280' }
              }
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Live Race */}
        {tab === 'race' && (
          <div className="space-y-4">
            <RaceTrack challenges={challenges} submissions={allSubmissions} sectionStudentCounts={sectionStudentCounts} />
            <div className="space-y-3">
              <h2 className="section-label">All Challenges</h2>
              {loading ? (
                <div className="card p-6 text-center text-gray-400 text-sm">Loading…</div>
              ) : challenges.length === 0 ? (
                <div className="card p-8 text-center text-gray-400 text-sm">No challenges yet.</div>
              ) : (
                challenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    submissions={allSubmissions.filter(s => s.challengeId === challenge.id)}
                    onSubmit={async () => {}}
                    readOnly
                    allSubmissions={allSubmissions}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab: Challenges */}
        {tab === 'challenges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="page-subtitle">Manage Challenges</h2>
              <div className="flex gap-2 flex-wrap">
                {challenges.length === 0 && (
                  <button
                    onClick={handlePreload}
                    disabled={preloading}
                    className="btn-secondary flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-50"
                  >
                    <Download size={14} />
                    {preloading ? 'Loading…' : 'Load 10 Starter Challenges'}
                  </button>
                )}
                {challenges.length > 0 && (
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    title="Update existing starter challenges: fixes table names, descriptions and sort order without changing marks or submissions."
                    className="btn-secondary flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-50"
                  >
                    <Download size={14} />
                    {syncing ? 'Syncing…' : 'Sync Starter Content'}
                  </button>
                )}
                <button
                  onClick={() => setShowCreate(true)}
                  className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
                >
                  <Plus size={15} />
                  New Challenge
                </button>
              </div>
            </div>
            {syncResult !== null && (
              <div
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold animate-fadeIn"
                style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.18)' }}
              >
                ✓ {syncResult} starter challenge{syncResult !== 1 ? 's' : ''} updated — table names, descriptions and sort order are now correct.
              </div>
            )}

            {loading ? (
              <div className="card p-6 text-center text-gray-400 text-sm">Loading…</div>
            ) : challenges.length === 0 ? (
              <div className="card p-10 text-center">
                <Trophy size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-500">No challenges yet</p>
                <p className="text-sm text-gray-400 mt-1 mb-4">
                  Load the 10 starter challenges or create your own.
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <button onClick={handlePreload} disabled={preloading} className="btn-secondary text-sm px-5 py-2 disabled:opacity-50 flex items-center gap-2">
                    <Download size={14} />
                    {preloading ? 'Loading…' : 'Load Starter Challenges'}
                  </button>
                  <button onClick={() => setShowCreate(true)} className="btn-primary text-sm px-5 py-2">Create Custom</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {challenges.map((challenge, idx) => {
                  const subCount = allSubmissions.filter(s => s.challengeId === challenge.id).length;
                  const correctCount = allSubmissions.filter(s => s.challengeId === challenge.id && s.isCorrect).length;
                  const isActive = challenge.status === 'active';

                  return (
                    <div
                      key={challenge.id}
                      className="card p-4"
                      style={isActive ? { borderColor: 'rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.02)' } : undefined}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                              #{challenge.sortOrder ?? idx + 1}
                            </span>
                            <h3 className="font-bold text-gray-800 text-sm">{challenge.title}</h3>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
                            >
                              {challenge.pointValue} pt{challenge.pointValue !== 1 ? 's' : ''}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {isActive ? '● Active' : 'Closed'}
                            </span>
                          </div>
                          {challenge.description && (
                            <p className="text-xs text-gray-500 mb-1.5">{challenge.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                            <span>{subCount} submission{subCount !== 1 ? 's' : ''}</span>
                            <span>{correctCount} correct</span>
                            {isActive && <LiveTimer challenge={challenge} />}
                          </div>
                        </div>

                        {/* Action button */}
                        {isActive ? (
                          <button
                            onClick={() => closeChallenge(challenge.id)}
                            disabled={closing === challenge.id}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 flex-shrink-0"
                            style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}
                          >
                            <ToggleRight size={13} />
                            {closing === challenge.id ? 'Closing…' : 'Close'}
                          </button>
                        ) : (
                          <button
                            onClick={() => setActivatingChallenge(challenge)}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex-shrink-0"
                            style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}
                          >
                            🚦 Activate
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Contributions */}
        {tab === 'contributions' && (
          <ContributionPanel students={students} challenges={challenges} submissions={allSubmissions} />
        )}
      </div>

      {showCreate && (
        <CreateChallengeModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {}}
        />
      )}

      {activatingChallenge && (
        <ActivateChallengeModal
          challenge={activatingChallenge}
          onClose={() => setActivatingChallenge(null)}
        />
      )}
    </Layout>
  );
}
