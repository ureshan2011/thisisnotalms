import { useEffect, useState, type ReactNode } from 'react';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { Trophy, Plus, Flag, ToggleLeft, ToggleRight, Users, BarChart2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import RaceTrack from '../../components/sqlrace/RaceTrack';
import ChallengeCard from '../../components/sqlrace/ChallengeCard';
import CreateChallengeModal from '../../components/sqlrace/CreateChallengeModal';
import ContributionPanel from '../../components/sqlrace/ContributionPanel';
import type { SqlRaceChallenge, SqlRaceSubmission } from '../../lib/sqlRaceTypes';
import type { StudentProfile } from '../../lib/types';

type Tab = 'race' | 'challenges' | 'contributions';

export default function LecturerSQLRacePage() {
  const { user } = useAuth();

  const [tab, setTab] = useState<Tab>('race');
  const [challenges, setChallenges] = useState<SqlRaceChallenge[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<SqlRaceSubmission[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  // Load challenges
  useEffect(() => {
    const q = query(collection(db, 'sqlRaceChallenges'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => {
      setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() } as SqlRaceChallenge)));
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

  // Load MBI802 students (one-time fetch, students list doesn't change often)
  useEffect(() => {
    getDocs(query(collection(db, 'students'), where('subjects', 'array-contains', 'MBI802')))
      .then(snap => setStudents(snap.docs.map(d => d.data() as StudentProfile)));
  }, []);

  const toggleStatus = async (challenge: SqlRaceChallenge) => {
    setToggling(challenge.id);
    const newStatus = challenge.status === 'active' ? 'closed' : 'active';
    try {
      await updateDoc(doc(db, 'sqlRaceChallenges', challenge.id), {
        status: newStatus,
        ...(newStatus === 'closed' ? { closedAt: serverTimestamp() } : { closedAt: null }),
      });
    } finally {
      setToggling(null);
    }
  };

  const correctSubmissions = allSubmissions.filter(s => s.isCorrect === true);
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
            <div className="flex gap-3 flex-wrap">
              <div className="text-center">
                <p className="text-2xl font-black text-white">{activeChallenges.length}</p>
                <p className="text-[11px] text-indigo-300 uppercase tracking-wide">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{totalMarks}</p>
                <p className="text-[11px] text-indigo-300 uppercase tracking-wide">Total pts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{students.length}</p>
                <p className="text-[11px] text-indigo-300 uppercase tracking-wide">Students</p>
              </div>
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
            <RaceTrack challenges={challenges} submissions={allSubmissions} />

            {/* All challenge results summary */}
            <div className="space-y-3">
              <h2 className="section-label">All Challenges</h2>
              {loading ? (
                <div className="card p-6 text-center text-gray-400 text-sm">Loading…</div>
              ) : challenges.length === 0 ? (
                <div className="card p-8 text-center text-gray-400 text-sm">No challenges created yet.</div>
              ) : (
                challenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    submissions={allSubmissions.filter(s => s.challengeId === challenge.id)}
                    onSubmit={async () => {}}
                    readOnly
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab: Challenges management */}
        {tab === 'challenges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="page-subtitle">Manage Challenges</h2>
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
              >
                <Plus size={15} />
                New Challenge
              </button>
            </div>

            {loading ? (
              <div className="card p-6 text-center text-gray-400 text-sm">Loading…</div>
            ) : challenges.length === 0 ? (
              <div className="card p-10 text-center">
                <Trophy size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-500">No challenges yet</p>
                <p className="text-sm text-gray-400 mt-1 mb-4">Create your first SQL challenge to start the race.</p>
                <button onClick={() => setShowCreate(true)} className="btn-primary text-sm px-5 py-2">
                  Create First Challenge
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {challenges.map(challenge => {
                  const subCount = allSubmissions.filter(s => s.challengeId === challenge.id).length;
                  const correctCount = allSubmissions.filter(s => s.challengeId === challenge.id && s.isCorrect).length;
                  return (
                    <div key={challenge.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-gray-800 text-sm">{challenge.title}</h3>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
                            >
                              {challenge.pointValue} pt{challenge.pointValue !== 1 ? 's' : ''}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                challenge.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {challenge.status === 'active' ? 'Active' : 'Closed'}
                            </span>
                          </div>
                          {challenge.description && (
                            <p className="text-xs text-gray-500 mb-2">{challenge.description}</p>
                          )}
                          <div className="flex gap-3 text-xs text-gray-400">
                            <span>{subCount} submission{subCount !== 1 ? 's' : ''}</span>
                            <span>{correctCount} correct</span>
                            <span>{challenge.requiredKeywords.length} keyword{challenge.requiredKeywords.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleStatus(challenge)}
                          disabled={toggling === challenge.id}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all disabled:opacity-50"
                          style={
                            challenge.status === 'active'
                              ? { background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }
                              : { background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }
                          }
                        >
                          {challenge.status === 'active'
                            ? <><ToggleRight size={13} /> Close</>
                            : <><ToggleLeft size={13} /> Activate</>}
                        </button>
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
          <ContributionPanel
            students={students}
            challenges={challenges}
            submissions={allSubmissions}
          />
        )}
      </div>

      {showCreate && (
        <CreateChallengeModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {}}
        />
      )}
    </Layout>
  );
}
