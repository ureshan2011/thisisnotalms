import { useEffect, useState, type FormEvent } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { CheckCircle2, Eye, Share2, DollarSign, AlertTriangle, Radio, Send } from 'lucide-react';
import { db } from '../lib/firebase';
import { useTeams, useLiveState } from '../lib/useVoteData';
import { EMPTY_RATINGS, RATING_CRITERIA, VOTE_COLLECTIONS, voteDocId, type Ratings } from '../lib/voteTypes';
import BrandMark from '../components/ui/BrandMark';
import StarRating from '../components/vote/StarRating';

const CRITERION_ICONS: Record<string, React.ReactNode> = {
  clarity:       <Eye size={15} style={{ color: '#7c3aed' }} />,
  networkEffect: <Share2 size={15} style={{ color: '#7c3aed' }} />,
  businessModel: <DollarSign size={15} style={{ color: '#7c3aed' }} />,
  risk:          <AlertTriangle size={15} style={{ color: '#7c3aed' }} />,
};

const STORAGE_KEY_STUDENT_ID  = 'yoobees_vote_studentId';
const STORAGE_KEY_FIRST_NAME  = 'yoobees_vote_firstName';

type FieldErrors = Partial<Record<'studentId' | 'firstName' | 'teamId' | 'finding' | keyof Ratings, boolean>>;

export default function VotePage() {
  const { teams } = useTeams();
  const { currentTeamId } = useLiveState();

  const [studentId, setStudentId] = useState(() => localStorage.getItem(STORAGE_KEY_STUDENT_ID) ?? '');
  const [firstName, setFirstName] = useState(() => localStorage.getItem(STORAGE_KEY_FIRST_NAME) ?? '');
  const [teamId, setTeamId]                 = useState('');
  const [teamManuallySet, setTeamManuallySet] = useState(false);
  const [ratings, setRatings]               = useState<Ratings>(EMPTY_RATINGS);
  const [finding, setFinding]               = useState('');
  const [submitting, setSubmitting]         = useState(false);
  const [fieldErrors, setFieldErrors]       = useState<FieldErrors>({});
  const [submitError, setSubmitError]       = useState<string | null>(null);
  const [confirmation, setConfirmation]     = useState<{ type: 'created' | 'updated'; teamName: string } | null>(null);

  // Follow the admin's "currently presenting" pick until the student overrides it.
  useEffect(() => {
    if (!teamManuallySet && currentTeamId) setTeamId(currentTeamId);
  }, [currentTeamId, teamManuallySet]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENT_ID, studentId);
  }, [studentId]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FIRST_NAME, firstName);
  }, [firstName]);

  useEffect(() => {
    if (!confirmation) return;
    const t = setTimeout(() => setConfirmation(null), 3500);
    return () => clearTimeout(t);
  }, [confirmation]);

  const currentTeam = teams.find((t) => t.id === currentTeamId) ?? null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const errors: FieldErrors = {};
    if (!studentId.trim()) errors.studentId = true;
    if (!firstName.trim()) errors.firstName = true;
    if (!teamId)           errors.teamId = true;
    if (!finding.trim())   errors.finding = true;
    for (const { key } of RATING_CRITERIA) {
      if (ratings[key] === 0) errors[key] = true;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const team = teams.find((t) => t.id === teamId);
    const docId = voteDocId(studentId, teamId);
    const ref = doc(db, VOTE_COLLECTIONS.votes, docId);

    setSubmitting(true);
    try {
      const existing = await getDoc(ref);
      await setDoc(ref, {
        studentId: studentId.trim(),
        firstName: firstName.trim(),
        teamId,
        teamName: team?.name ?? '',
        ratings,
        mostInterestingFinding: finding.trim(),
        updatedAt: serverTimestamp(),
      });
      setConfirmation({ type: existing.exists() ? 'updated' : 'created', teamName: team?.name ?? '' });
      setTeamManuallySet(false);
      setTeamId(currentTeamId ?? '');
      setRatings(EMPTY_RATINGS);
      setFinding('');
      setFieldErrors({});
    } catch {
      setSubmitError('Something went wrong submitting your vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-page px-4 py-6 sm:py-10">
      {/* Confirmation toast */}
      {confirmation && (
        <div className="fixed z-50 top-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96 animate-toastIn">
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
            style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(16,185,129,0.20)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #10b981, #2dd4bf)' }}
            >
              <CheckCircle2 size={15} color="white" />
            </div>
            <p className="text-sm font-bold" style={{ color: '#065f46' }}>
              {confirmation.type === 'created' ? 'Vote recorded' : 'Vote updated'}
              {confirmation.teamName && <span className="font-medium"> — {confirmation.teamName}</span>}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-2xl p-2 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}>
            <BrandMark className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: '#1e1b4b' }}>Live Vote</h1>
            <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>Platform strategy presentations</p>
          </div>
        </div>

        {/* Currently presenting banner */}
        {currentTeam && (
          <div
            className="flex items-center gap-2.5 rounded-2xl px-4 py-3 mb-5"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.05))', border: '1px solid rgba(124,58,237,0.15)' }}
          >
            <Radio size={15} className="pulse-ring" style={{ color: '#7c3aed', flexShrink: 0 }} />
            <p className="text-sm font-semibold" style={{ color: '#5b21b6' }}>
              Now presenting: <span className="font-bold">{currentTeam.name}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-3xl p-5 sm:p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(124,58,237,0.15)', boxShadow: '0 4px 24px rgba(124,58,237,0.10)' }}>
          {/* Student ID */}
          <div>
            <label className="label">Student ID (index number)</label>
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. 21ug1234"
              className={`input-field ${fieldErrors.studentId ? 'ring-2 ring-red-400' : ''}`}
            />
          </div>

          {/* First name */}
          <div>
            <label className="label">First name</label>
            <input
              type="text"
              autoComplete="off"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Amara"
              className={`input-field ${fieldErrors.firstName ? 'ring-2 ring-red-400' : ''}`}
            />
          </div>

          {/* Team */}
          <div>
            <label className="label">Team</label>
            <select
              value={teamId}
              onChange={(e) => { setTeamId(e.target.value); setTeamManuallySet(true); }}
              className={`input-field ${fieldErrors.teamId ? 'ring-2 ring-red-400' : ''}`}
            >
              <option value="" disabled>Select a team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="divider" />

          {/* Ratings */}
          <div className="space-y-5">
            {RATING_CRITERIA.map(({ key, label, description }) => (
              <StarRating
                key={key}
                label={label}
                description={description}
                icon={CRITERION_ICONS[key]}
                value={ratings[key]}
                onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
                error={fieldErrors[key]}
              />
            ))}
          </div>

          <div className="divider" />

          {/* Most interesting finding */}
          <div>
            <label className="label">Most interesting finding</label>
            <p className="text-xs font-medium mb-2" style={{ color: '#9ca3af' }}>
              What's the most interesting thing you learned from this team?
            </p>
            <textarea
              value={finding}
              onChange={(e) => setFinding(e.target.value)}
              rows={3}
              placeholder="Type your answer…"
              className={`input-field resize-none ${fieldErrors.finding ? 'ring-2 ring-red-400' : ''}`}
            />
          </div>

          {submitError && (
            <p className="text-sm font-semibold text-center" style={{ color: '#dc2626' }}>{submitError}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3.5 text-base">
            {submitting ? 'Submitting…' : <><Send size={16} /> Submit vote</>}
          </button>
        </form>
      </div>
    </div>
  );
}
