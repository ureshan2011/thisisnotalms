import { useState } from 'react';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { Briefcase, CheckCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  onCompleted: () => void;
}

export default function EmploymentSurveyModal({ onCompleted }: Props) {
  const { user, studentProfile, refreshStudentProfile } = useAuth();
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    answer !== null &&
    (answer === 'no' || (company.trim() !== '' && jobRole.trim() !== ''));

  const handleSubmit = async () => {
    if (!user || !canSubmit) return;
    setSubmitting(true);
    const payload: Record<string, unknown> = {
      uid: user.uid,
      fullName: studentProfile?.fullName ?? '',
      email: user.email ?? '',
      course: studentProfile?.course ?? '',
      intake: studentProfile?.intake ?? '',
      section: studentProfile?.section ?? '',
      campus: studentProfile?.campus ?? '',
      answer,
      submittedAt: serverTimestamp(),
    };
    if (answer === 'yes') {
      payload.company = company.trim();
      payload.jobRole = jobRole.trim();
    }
    await Promise.all([
      setDoc(doc(db, 'employmentSurvey', user.uid), payload),
      updateDoc(doc(db, 'students', user.uid), { employmentSurveyDone: true }),
    ]);
    await refreshStudentProfile();
    setSubmitting(false);
    onCompleted();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop — no click-to-close, survey is mandatory */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(30,27,75,0.50)', backdropFilter: 'blur(10px)' }}
      />

      <div
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 animate-scaleIn"
        style={{
          background: 'rgba(255,255,255,0.99)',
          border: '1px solid rgba(139,92,246,0.14)',
          boxShadow: '0 32px 80px rgba(124,106,247,0.22)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <div
            className="rounded-2xl p-2.5 flex-shrink-0 mt-0.5"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(139,92,246,0.07))' }}
          >
            <Briefcase size={20} style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-snug" style={{ color: '#1e1b4b' }}>
              Quick Survey
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
              Please complete this short survey before continuing.
            </p>
          </div>
        </div>

        <div className="divider !mb-5" />

        {/* Clarification notice */}
        <div
          className="rounded-2xl px-4 py-3 mb-5 text-xs leading-relaxed"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.09), rgba(251,191,36,0.05))',
            border: '1px solid rgba(245,158,11,0.22)',
            color: '#92400e',
          }}
        >
          <strong>Important:</strong> This survey only asks about work or employment you
          obtained <strong>after starting your Master's programme at Yoobee</strong>.
          Jobs you already held before enrolment are <strong>not</strong> included.
        </div>

        {/* Question */}
        <p className="text-sm font-semibold mb-5" style={{ color: '#1e1b4b', lineHeight: 1.7 }}>
          Have you started working after beginning your Master's programme at Yoobee?
          This includes part-time jobs, casual or odd jobs, freelance work, remote or online
          work, internships, or full-time employment obtained <em>after</em> starting the programme.
        </p>

        {/* Yes / No buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {(['yes', 'no'] as const).map(opt => {
            const selected = answer === opt;
            return (
              <button
                key={opt}
                onClick={() => setAnswer(opt)}
                className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all text-sm font-semibold"
                style={{
                  borderColor: selected ? '#7c3aed' : 'rgba(139,92,246,0.18)',
                  background: selected
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(139,92,246,0.07))'
                    : 'rgba(250,248,255,0.9)',
                  color: selected ? '#7c3aed' : '#374151',
                  boxShadow: selected ? '0 0 0 3px rgba(124,58,237,0.10)' : 'none',
                }}
              >
                <span
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderColor: selected ? '#7c3aed' : '#d1d5db',
                    background: selected ? '#7c3aed' : 'transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-white block" />}
                </span>
                {opt === 'yes' ? 'Yes' : 'No'}
              </button>
            );
          })}
        </div>

        {/* Conditional fields — only when "Yes" */}
        {answer === 'yes' && (
          <div className="space-y-4 mb-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                Company / Organisation Name <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <input
                className="input-field w-full"
                placeholder="e.g. Spark NZ, ABC Consulting"
                value={company}
                onChange={e => setCompany(e.target.value)}
                autoComplete="organization"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                Job Role / Position Title <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <input
                className="input-field w-full"
                placeholder="e.g. Junior Developer, Data Analyst Intern"
                value={jobRole}
                onChange={e => setJobRole(e.target.value)}
                autoComplete="organization-title"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          className="btn-primary w-full justify-center"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {submitting ? (
            'Submitting…'
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle size={16} />
              Submit &amp; Continue
            </span>
          )}
        </button>

        <p className="text-[11px] text-center mt-3" style={{ color: '#9ca3af' }}>
          Your response is confidential and used for academic programme tracking only.
        </p>
      </div>
    </div>
  );
}
