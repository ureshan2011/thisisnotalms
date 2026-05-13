import { useEffect, useState, useMemo } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, where, orderBy, getDocs } from 'firebase/firestore';
import { Trophy, Flag, Zap } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import RaceTrack from '../../components/sqlrace/RaceTrack';
import ChallengeCard from '../../components/sqlrace/ChallengeCard';
import type { SqlRaceChallenge, SqlRaceSubmission } from '../../lib/sqlRaceTypes';
import { autoValidate, MAX_ATTEMPTS, getSectionDisplayName } from '../../lib/sqlRaceTypes';
import { useToast } from '../../components/ui/ToastProvider';
import type { StudentProfile } from '../../lib/types';

export default function SQLRacePage() {
  const { user, studentProfile } = useAuth();
  const { showToast } = useToast();

  const [challenges, setChallenges] = useState<SqlRaceChallenge[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<SqlRaceSubmission[]>([]);
  const [mySubmissions, setMySubmissions] = useState<SqlRaceSubmission[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const mySection = studentProfile?.section || 'Section Default (No Section)';
  const mySectionDisplay = getSectionDisplayName(mySection);

  // All challenges (sorted by creation order)
  useEffect(() => {
    const q = query(collection(db, 'sqlRaceChallenges'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, snap => {
      setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() } as SqlRaceChallenge)));
      setLoading(false);
    });
  }, []);

  // All correct submissions for the race track + collaboration info
  useEffect(() => {
    const q = query(collection(db, 'sqlRaceSubmissions'), where('isCorrect', '==', true));
    return onSnapshot(q, snap => {
      setAllSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() } as SqlRaceSubmission)));
    });
  }, []);

  // Own submissions (all, including incorrect, for attempt tracking)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'sqlRaceSubmissions'), where('studentUid', '==', user.uid));
    return onSnapshot(q, snap => {
      setMySubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() } as SqlRaceSubmission)));
    });
  }, [user]);

  // MBI802 students for accurate section counts
  useEffect(() => {
    getDocs(query(collection(db, 'students'), where('subjects', 'array-contains', 'MBI802')))
      .then(snap => setStudents(snap.docs.map(d => d.data() as StudentProfile)));
  }, []);

  const sectionStudentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of students) {
      if (s.section) counts[s.section] = (counts[s.section] ?? 0) + 1;
    }
    return counts;
  }, [students]);

  const mySectionCount = sectionStudentCounts[mySection];

  const handleSubmit = async (challengeId: string, queryText: string) => {
    if (!user || !studentProfile) return;

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const existingForChallenge = mySubmissions.filter(s => s.challengeId === challengeId);
    if (existingForChallenge.length >= MAX_ATTEMPTS) {
      showToast({ type: 'error', title: 'Max attempts reached', description: 'You have used all attempts for this challenge.' });
      return;
    }

    const isCorrect = autoValidate(queryText, challenge.requiredKeywords);

    await addDoc(collection(db, 'sqlRaceSubmissions'), {
      challengeId,
      studentUid: user.uid,
      studentName: studentProfile.fullName || user.email || '',
      studentDisplayId: studentProfile.studentId || '',
      studentSection: mySection,
      studentCampus: studentProfile.campus || '',
      query: queryText,
      isCorrect,
      marksAwarded: isCorrect ? challenge.pointValue : 0,
      attemptNumber: existingForChallenge.length + 1,
      submittedAt: serverTimestamp(),
    });

    const remaining = MAX_ATTEMPTS - existingForChallenge.length - 1;
    if (isCorrect) {
      showToast({ type: 'success', title: `Correct! +${challenge.pointValue} pts`, description: `Earned for ${mySectionDisplay} 🏎` });
    } else if (remaining > 0) {
      showToast({ type: 'error', title: 'Not quite', description: `${remaining} attempt${remaining !== 1 ? 's' : ''} remaining` });
    } else {
      showToast({ type: 'error', title: 'No attempts remaining', description: 'You have used all attempts for this challenge.' });
    }
  };

  const activeChallenges = challenges.filter(c => c.status === 'active');

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        {/* Page header */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 50%, #312e81 100%)',
            boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
          }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #818cf8, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-24 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translateY(50%)' }} />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl" style={{ background: 'rgba(251,191,36,0.15)' }}>
                  <Trophy size={20} className="text-amber-400" />
                </div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">MBI802</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mb-1">SQL Grand Prix</h1>
              <p className="text-indigo-200 text-sm leading-relaxed max-w-md">
                Solve SQL challenges and race your section to the finish line. Every correct query earns points for your team.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 text-right flex-shrink-0">
              <Flag size={28} className="text-white opacity-20" />
              {studentProfile?.section && (
                <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wide">
                  {mySectionDisplay}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Race track */}
        <RaceTrack
          challenges={challenges}
          submissions={allSubmissions}
          sectionStudentCounts={sectionStudentCounts}
        />

        {/* Active challenges only */}
        {loading ? (
          <div className="card p-8 text-center text-gray-400">
            <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading challenges…</p>
          </div>
        ) : activeChallenges.length === 0 ? (
          <div className="card p-10 text-center">
            <Zap size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-500">No active challenges</p>
            <p className="text-sm text-gray-400 mt-1">Your lecturer will activate SQL challenges when the race begins.</p>
          </div>
        ) : (
          <section className="space-y-3">
            <h2 className="section-label flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Challenges
            </h2>
            {activeChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                submissions={mySubmissions.filter(s => s.challengeId === challenge.id)}
                onSubmit={handleSubmit}
                allSubmissions={allSubmissions}
                studentSection={mySection}
                sectionStudentCount={mySectionCount}
              />
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
}
