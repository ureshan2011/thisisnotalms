import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SQLBasicExam from '../../components/quiz/SQLBasicExam';
import type { StudentProfile } from '../../lib/types';

export default function SQLExamPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'students', user.uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data() as StudentProfile);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: '#1e1b4b' }}>
            SQL Fundamentals Exam
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
            Pass with 70%+ to earn your LinkedIn-shareable certificate.
          </p>
        </div>

        {loading ? <LoadingSpinner /> : <SQLBasicExam studentProfile={profile} />}
      </div>
    </Layout>
  );
}
