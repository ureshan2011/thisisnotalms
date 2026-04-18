import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import {
  ExternalLink,
  Monitor,
  Laptop,
  Sparkles,
  Apple,
  MonitorSmartphone,
  FlaskConical,
  GraduationCap,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MBI802Quiz from '../../components/quiz/MBI802Quiz';
import QuizResultsDashboard from '../../components/quiz/QuizResultsDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import type { StudentProfile } from '../../lib/types';

export default function MBI802Resources() {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(role === 'student');
  const [hasAccess, setHasAccess] = useState(role !== 'student');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    if (!user || role !== 'student') return;

    (async () => {
      const snap = await getDoc(doc(db, 'students', user.uid));
      const profile = snap.exists() ? (snap.data() as StudentProfile) : null;
      const hasMBI802 = (profile?.subjects || []).includes('MBI802');
      setStudentProfile(profile);
      setHasAccess(hasMBI802);
      setLoading(false);
    })();
  }, [user, role]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!hasAccess) {
    return (
      <Layout>
        <div className="card p-6">
          <h1 className="page-title">MBI802 Additional Resources</h1>
          <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>
            This area is available to students enrolled in MBI802, and to all lecturers and teaching
            assistants.
          </p>
        </div>
      </Layout>
    );
  }

  const isStaff = role === 'lecturer' || role === 'teachingAssistant';

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="page-title">MBI802 Additional Resources</h1>
        <p className="page-subtitle">Shared lesson posts, guides, and setup resources for MBI802.</p>
      </div>

      {/* ── Setup guides post ─────────────────────────────────────────────── */}
      <article className="card p-6 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b5cf6' }}>
            Post
          </p>
          <h2 className="text-xl font-bold mt-1" style={{ color: '#1e1b4b' }}>
            MySQL Development Environment Setup Video Tutorials
          </h2>
          <p className="text-sm mt-3" style={{ color: '#4b5563' }}>
            Dear students, Ayubowan!
          </p>
          <p
            className="text-xs mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ color: '#6d28d9', background: 'rgba(221,214,254,0.55)' }}
          >
            <Sparkles size={12} /> Author: MBI802 Lecturer
          </p>
        </div>

        <p className="text-sm leading-6" style={{ color: '#374151' }}>
          I have created two video tutorials to help you set up MySQL on your Windows or Mac
          computer. Please try the installation on your own. You will also have time in class next
          week to set it up with support.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-4 border"
            style={{
              background:
                'linear-gradient(135deg, rgba(219,234,254,0.85), rgba(186,230,253,0.7))',
              borderColor: 'rgba(59,130,246,0.18)',
            }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1d4ed8' }}>
              <Apple size={16} /> MacOS Setup Path
            </div>
            <p className="text-xs mt-2" style={{ color: '#1e3a8a' }}>
              Recommended for MacBook and iMac users. Follow this first before class support time.
            </p>
          </div>

          <div
            className="rounded-2xl p-4 border"
            style={{
              background:
                'linear-gradient(135deg, rgba(237,233,254,0.9), rgba(224,231,255,0.75))',
              borderColor: 'rgba(124,58,237,0.20)',
            }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#6d28d9' }}>
              <MonitorSmartphone size={16} /> Windows Setup Path
            </div>
            <p className="text-xs mt-2" style={{ color: '#4c1d95' }}>
              Best for Windows laptops and desktops. Keep screenshots ready if any installer error
              appears.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="https://myacg.sharepoint.com/:v:/s/2511-YCCI-MBI-Blended-TeachingSpace/IQAdgK7LxBsxQ4OpdEwrXl17AX3mZyaMmmlXdA3xw4jSvcs?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=Ebi4ee"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl border hover:border-violet-300 transition-all"
            style={{ borderColor: 'rgba(139,92,246,0.18)', background: 'rgba(245,243,255,0.6)' }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#5b21b6' }}>
              <Laptop size={16} /> MacOS Guide Video <ExternalLink size={14} />
            </div>
          </a>

          <a
            href="https://myacg.sharepoint.com/:v:/s/2511-YCCI-MBI-Blended-TeachingSpace/IQAGNda_bc72R55878wdYxfRAbAKGBetSMR65xdEWdQO3ZU?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=wTx1An"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl border hover:border-violet-300 transition-all"
            style={{ borderColor: 'rgba(139,92,246,0.18)', background: 'rgba(245,243,255,0.6)' }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#5b21b6' }}>
              <Monitor size={16} /> Windows Guide Video <ExternalLink size={14} />
            </div>
          </a>
        </div>

        <p className="text-sm leading-6" style={{ color: '#374151' }}>
          Some of you may see a popup asking to install Visual C++. If that happens, simply download
          the recommended file that appears on your screen, or use this link:{' '}
          <a
            href="https://aka.ms/vs/17/release/vc_redist.x64.exe"
            target="_blank"
            rel="noreferrer"
            className="font-semibold"
            style={{ color: '#6d28d9' }}
          >
            Visual C++ Redistributable
          </a>
          .
        </p>

        <p className="text-sm leading-6" style={{ color: '#374151' }}>
          Different computers can show different errors depending on the software versions you have.
          One full hour has been set aside in the next class for one-to-one in-person help from your
          teaching assistants. If you run into any issues, take screenshots and bring them to class.
        </p>

        <p className="text-sm leading-6" style={{ color: '#374151' }}>
          Please avoid posting errors here, since there are more than one hundred students and it
          becomes difficult to manage. Comments and suggestions are welcome, especially if you would
          like more video tutorials.
        </p>

        <p className="text-sm leading-6" style={{ color: '#374151' }}>
          If your issue is still not solved by the end of the next class, a Google Form will be
          shared where you can submit your details. This is exactly why the database setup started
          early, so there is no pressure at all.
        </p>

        <p className="text-sm font-semibold" style={{ color: '#4c1d95' }}>
          Happy learning!
        </p>
      </article>

      {/* ── DBMS Knowledge Quiz ────────────────────────────────────────────── */}
      <section className="mt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap size={22} style={{ color: '#7c3aed' }} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#1e1b4b' }}>
              DBMS Knowledge Check
            </h2>
            <p className="text-xs" style={{ color: '#6b7280' }}>
              38 multiple-choice questions · No time limit · Unlimited attempts
            </p>
          </div>
        </div>

        {/* "Setup ready" notice — only shown to students */}
        {!isStaff && (
          <div
            className="flex items-start gap-3 rounded-2xl px-4 py-3 border mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(254,243,199,0.95), rgba(253,230,138,0.6))',
              borderColor: 'rgba(245,158,11,0.35)',
            }}
          >
            <FlaskConical size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p className="text-sm font-bold" style={{ color: '#92400e' }}>
                Try this only if you have your MySQL setup ready!
              </p>
              <p className="text-xs mt-0.5 leading-5" style={{ color: '#78350f' }}>
                These questions are designed for students who have already completed the MySQL
                installation. If your setup is still in progress, finish the setup first — come back
                to this quiz once you are ready. The quiz covers Database Management System theory
                and real-world scenarios, not SQL coding.
              </p>
            </div>
          </div>
        )}

        {/* Quiz or Results Dashboard */}
        <div className="card p-6">
          {isStaff ? (
            <QuizResultsDashboard />
          ) : (
            <MBI802Quiz studentProfile={studentProfile} />
          )}
        </div>
      </section>
    </Layout>
  );
}
