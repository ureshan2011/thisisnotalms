import { useEffect, useState, type FormEvent } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { CheckCircle2, Send } from 'lucide-react';
import { db } from '../lib/firebase';
import { useTeams, useLiveState } from '../lib/useVoteData';
import { EMPTY_RATINGS, RATING_CRITERIA, VOTE_COLLECTIONS, voteDocId, type Ratings } from '../lib/voteTypes';
import '../styles/voteTheme.css';
import StarRating from '../components/vote/StarRating';

const STORAGE_KEY_STUDENT_ID = 'yoobees_vote_studentId';
const STORAGE_KEY_FIRST_NAME = 'yoobees_vote_firstName';

type FieldErrors = Partial<Record<'studentId' | 'firstName' | 'teamId' | 'platform' | 'wentWell' | 'couldImprove' | keyof Ratings, boolean>>;

export default function VotePage() {
  const { teams } = useTeams();
  const { currentTeamId } = useLiveState();

  const [studentId, setStudentId] = useState(() => localStorage.getItem(STORAGE_KEY_STUDENT_ID) ?? '');
  const [firstName, setFirstName] = useState(() => localStorage.getItem(STORAGE_KEY_FIRST_NAME) ?? '');
  const [teamId, setTeamId]                   = useState('');
  const [teamManuallySet, setTeamManuallySet] = useState(false);
  const [ratings, setRatings]                 = useState<Ratings>(EMPTY_RATINGS);
  const [platform, setPlatform]               = useState('');
  const [wentWell, setWentWell]               = useState('');
  const [couldImprove, setCouldImprove]       = useState('');
  const [submitting, setSubmitting]           = useState(false);
  const [fieldErrors, setFieldErrors]         = useState<FieldErrors>({});
  const [submitError, setSubmitError]         = useState<string | null>(null);
  const [confirmation, setConfirmation]       = useState<{ type: 'created' | 'updated'; teamName: string } | null>(null);

  // Follow the admin's "currently presenting" pick until the student overrides it.
  useEffect(() => {
    if (!teamManuallySet && currentTeamId) setTeamId(currentTeamId);
  }, [currentTeamId, teamManuallySet]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY_STUDENT_ID, studentId); }, [studentId]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_FIRST_NAME, firstName); }, [firstName]);

  useEffect(() => {
    if (!confirmation) return;
    const t = setTimeout(() => setConfirmation(null), 3500);
    return () => clearTimeout(t);
  }, [confirmation]);

  const currentTeam = teams.find((t) => t.id === currentTeamId) ?? null;

  function clearError(key: keyof FieldErrors) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const errors: FieldErrors = {};
    if (!studentId.trim())     errors.studentId = true;
    if (!firstName.trim())     errors.firstName = true;
    if (!teamId)                errors.teamId = true;
    if (!platform.trim())      errors.platform = true;
    if (!wentWell.trim())      errors.wentWell = true;
    if (!couldImprove.trim())  errors.couldImprove = true;
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
        platform: platform.trim(),
        wentWell: wentWell.trim(),
        couldImprove: couldImprove.trim(),
        updatedAt: serverTimestamp(),
      });
      setConfirmation({ type: existing.exists() ? 'updated' : 'created', teamName: team?.name ?? '' });
      setTeamManuallySet(false);
      setTeamId(currentTeamId ?? '');
      setRatings(EMPTY_RATINGS);
      setPlatform('');
      setWentWell('');
      setCouldImprove('');
      setFieldErrors({});
    } catch {
      setSubmitError('Something went wrong submitting your vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="vote-theme px-4 py-6 sm:py-10">
      {/* Confirmation toast */}
      {confirmation && (
        <div className="fixed z-50 top-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96 animate-toastIn">
          <div className="vote-card flex items-center gap-3 px-4 py-3.5" style={{ borderColor: 'var(--gold-border)' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--gold-strong)', flexShrink: 0 }} />
            <p className="text-sm font-bold" style={{ color: 'var(--paper)' }}>
              {confirmation.type === 'created' ? 'Vote recorded' : 'Vote updated'}
              {confirmation.teamName && <span style={{ color: 'var(--paper-dim)', fontWeight: 500 }}> — {confirmation.teamName}</span>}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-5">
          <p className="vote-eyebrow mb-1">MBI · Platform Strategy Presentations</p>
          <h1 className="vote-marquee text-4xl">Live Vote</h1>
        </div>

        {/* Currently presenting banner */}
        {currentTeam && (
          <div className="vote-live-banner mb-5">
            <span className="vote-live-dot" />
            <span>Now presenting — {currentTeam.name}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="vote-card p-5 sm:p-6 space-y-5">
          {/* Student ID */}
          <div>
            <label className="vote-label">Student ID (index number)</label>
            <input
              type="text"
              autoComplete="off"
              value={studentId}
              onChange={(e) => { setStudentId(e.target.value); clearError('studentId'); }}
              placeholder="e.g. 21ug1234"
              className={`vote-input ${fieldErrors.studentId ? 'vote-error' : ''}`}
            />
          </div>

          {/* First name */}
          <div>
            <label className="vote-label">First name</label>
            <input
              type="text"
              autoComplete="off"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }}
              placeholder="e.g. Amara"
              className={`vote-input ${fieldErrors.firstName ? 'vote-error' : ''}`}
            />
          </div>

          {/* Team */}
          <div>
            <label className="vote-label">Team</label>
            <select
              value={teamId}
              onChange={(e) => { setTeamId(e.target.value); setTeamManuallySet(true); clearError('teamId'); }}
              className={`vote-input ${fieldErrors.teamId ? 'vote-error' : ''}`}
            >
              <option value="" disabled>Select a team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <hr className="vote-divider" />

          {/* Ratings */}
          <div className="space-y-5">
            {RATING_CRITERIA.map(({ key, label, description }) => (
              <StarRating
                key={key}
                label={label}
                description={description}
                value={ratings[key]}
                onChange={(v) => { setRatings((r) => ({ ...r, [key]: v })); clearError(key); }}
                error={fieldErrors[key]}
              />
            ))}
          </div>

          <hr className="vote-divider" />

          {/* Platform presented */}
          <div>
            <label className="vote-label">Platform they presented</label>
            <p className="vote-hint">Which company or platform was this pitch about?</p>
            <input
              type="text"
              autoComplete="off"
              value={platform}
              onChange={(e) => { setPlatform(e.target.value); clearError('platform'); }}
              placeholder="e.g. DoorDash, Airbnb, Uber…"
              className={`vote-input ${fieldErrors.platform ? 'vote-error' : ''}`}
            />
          </div>

          {/* What went well */}
          <div>
            <label className="vote-label">What went well</label>
            <p className="vote-hint">Name one best practice this team nailed — something you'd reuse.</p>
            <textarea
              value={wentWell}
              onChange={(e) => { setWentWell(e.target.value); clearError('wentWell'); }}
              rows={3}
              placeholder="e.g. They clearly separated the two sides of the marketplace and showed how each one hooks the other…"
              className={`vote-input resize-none ${fieldErrors.wentWell ? 'vote-error' : ''}`}
            />
          </div>

          {/* What could improve */}
          <div>
            <label className="vote-label">What could improve</label>
            <p className="vote-hint">Name one gap, risk, or unclear point they missed.</p>
            <textarea
              value={couldImprove}
              onChange={(e) => { setCouldImprove(e.target.value); clearError('couldImprove'); }}
              rows={3}
              placeholder="e.g. They didn't address what stops a competitor from undercutting on price…"
              className={`vote-input resize-none ${fieldErrors.couldImprove ? 'vote-error' : ''}`}
            />
          </div>

          {submitError && <p className="vote-error-text text-center">{submitError}</p>}

          <button type="submit" disabled={submitting} className="vote-btn-primary w-full py-3.5 text-base">
            {submitting ? 'Submitting…' : <><Send size={16} /> Submit vote</>}
          </button>
        </form>
      </div>
    </div>
  );
}
