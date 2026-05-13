import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Star, Users, Zap } from 'lucide-react';
import type { SqlRaceChallenge, SqlRaceSubmission } from '../../lib/sqlRaceTypes';
import {
  MAX_ATTEMPTS, getChallengeSecondsLeft, formatCountdown,
  getFirstBloodSection, getSectionDisplayName, SECTION_COLORS,
} from '../../lib/sqlRaceTypes';
import QueryEditor from './QueryEditor';

interface Props {
  challenge: SqlRaceChallenge;
  submissions: SqlRaceSubmission[];        // student's own submissions
  onSubmit: (challengeId: string, query: string) => Promise<void>;
  readOnly?: boolean;
  allSubmissions?: SqlRaceSubmission[];    // all correct submissions (for collaboration info)
  studentSection?: string;                 // viewer's section
  sectionStudentCount?: number;            // total students enrolled in viewer's section
}

function useCountdown(challenge: SqlRaceChallenge): number | null {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(() => getChallengeSecondsLeft(challenge));

  useEffect(() => {
    const initial = getChallengeSecondsLeft(challenge);
    if (initial === null) { setSecondsLeft(null); return; }
    setSecondsLeft(initial);
    if (initial === 0) return;

    const id = setInterval(() => {
      const left = getChallengeSecondsLeft(challenge);
      setSecondsLeft(left);
      if (left === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id, challenge.timeLimit, challenge.activatedAt?.seconds]);

  return secondsLeft;
}

function CountdownBadge({ seconds }: { seconds: number }) {
  const pct = seconds / 100; // relative urgency color
  const color = seconds > 60 ? '#10b981' : seconds > 30 ? '#f59e0b' : '#ef4444';
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg flex-shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}40` }}
    >
      <Clock size={12} style={{ color }} />
      <span className="text-[12px] font-bold tabular-nums" style={{ color }}>
        {formatCountdown(seconds)}
      </span>
    </div>
  );
}

export default function ChallengeCard({
  challenge, submissions, onSubmit,
  readOnly = false, allSubmissions = [], studentSection, sectionStudentCount,
}: Props) {
  const [schemaOpen, setSchemaOpen] = useState(false);

  const attemptsUsed = submissions.length;
  const bestSubmission = submissions.find(s => s.isCorrect) ?? submissions[submissions.length - 1];
  const isCorrect = submissions.some(s => s.isCorrect);
  const isPending = submissions.some(s => s.isCorrect === null);
  const exhausted = attemptsUsed >= MAX_ATTEMPTS && !isCorrect;

  const secondsLeft = useCountdown(challenge);
  const isExpired = secondsLeft === 0 && challenge.timeLimit != null;

  // Collaboration: how many teammates got this right (correct only, same section)
  const teammateCorrectCount = allSubmissions.filter(
    s => s.challengeId === challenge.id && s.studentSection === studentSection && s.isCorrect,
  ).length;

  // Competition: which section answered first
  const firstBloodSection = allSubmissions.length > 0
    ? getFirstBloodSection(allSubmissions, challenge.id)
    : null;
  const iMyFirstBlood = firstBloodSection && firstBloodSection === studentSection;

  const handleSubmit = async (query: string) => {
    await onSubmit(challenge.id, query);
  };

  const showEditor = !readOnly && !isCorrect && challenge.status === 'active' && !isExpired;

  return (
    <div
      className="card p-5 space-y-4"
      style={
        isCorrect
          ? { borderColor: 'rgba(16,185,129,0.3)', background: 'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, white 100%)' }
          : isExpired && !isCorrect
          ? { borderColor: 'rgba(239,68,68,0.15)', background: 'rgba(254,242,242,0.4)' }
          : undefined
      }
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-800 text-sm">{challenge.title}</h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
            >
              {challenge.pointValue} pt{challenge.pointValue !== 1 ? 's' : ''}
            </span>
            {challenge.status === 'closed' && !isExpired && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Closed</span>
            )}
            {isExpired && !isCorrect && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">⏰ Time's up</span>
            )}
          </div>
          {challenge.description && (
            <p className="text-xs text-gray-500 mt-1">{challenge.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Live countdown */}
          {challenge.status === 'active' && secondsLeft !== null && !isExpired && (
            <CountdownBadge seconds={secondsLeft} />
          )}

          {/* Submission status badge */}
          {isCorrect && (
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <CheckCircle size={13} />
              <span className="text-[11px] font-semibold">Correct</span>
            </div>
          )}
          {isPending && !isCorrect && (
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              <Clock size={13} />
              <span className="text-[11px] font-semibold">Pending</span>
            </div>
          )}
          {exhausted && !isExpired && (
            <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
              <XCircle size={13} />
              <span className="text-[11px] font-semibold">Attempts used</span>
            </div>
          )}
        </div>
      </div>

      {/* Competitive + Collaborative info bar (only for students, not readOnly) */}
      {!readOnly && studentSection && (firstBloodSection || teammateCorrectCount > 0) && (
        <div className="flex flex-wrap gap-2">
          {firstBloodSection && (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
              style={{
                background: `${SECTION_COLORS[firstBloodSection] ?? '#8b5cf6'}15`,
                color: SECTION_COLORS[firstBloodSection] ?? '#8b5cf6',
                border: `1px solid ${SECTION_COLORS[firstBloodSection] ?? '#8b5cf6'}30`,
              }}
            >
              <Zap size={11} />
              {iMyFirstBlood
                ? '⚡ Your section answered first!'
                : `${getSectionDisplayName(firstBloodSection)} answered first`}
            </div>
          )}
          {!readOnly && teammateCorrectCount > 0 && (
            <div className="inline-flex flex-col gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-emerald-700 bg-emerald-50">
              <div className="flex items-center gap-1.5">
                <Users size={11} />
                {sectionStudentCount
                  ? `${teammateCorrectCount} / ${sectionStudentCount} section members solved this!`
                  : `${teammateCorrectCount} teammate${teammateCorrectCount !== 1 ? 's' : ''} answered correctly — keep going!`}
              </div>
              {sectionStudentCount && sectionStudentCount > 0 && (
                <div className="h-1.5 rounded-full bg-emerald-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((teammateCorrectCount / sectionStudentCount) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Schema context toggle */}
      {challenge.schemaContext && (
        <div>
          <button
            onClick={() => setSchemaOpen(v => !v)}
            className="flex items-center gap-1.5 text-xs text-brand-600 font-medium hover:text-brand-700 transition-colors"
          >
            {schemaOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {schemaOpen ? 'Hide' : 'Show'} database schema
          </button>
          {schemaOpen && (
            <pre
              className="mt-2 p-3 rounded-xl text-xs overflow-auto"
              style={{
                background: '#1e1b4b',
                color: '#c4b5fd',
                fontFamily: "'Courier New', Courier, monospace",
                maxHeight: '220px',
                lineHeight: '1.5',
              }}
            >
              {challenge.schemaContext}
            </pre>
          )}
        </div>
      )}

      {/* Question */}
      <div
        className="p-3 rounded-xl"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(139,92,246,0.03) 100%)', border: '1px solid rgba(124,58,237,0.10)' }}
      >
        <div className="flex items-start gap-2">
          <Star size={13} className="text-brand-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-line">{challenge.question}</p>
        </div>
      </div>

      {/* Previous incorrect attempt feedback */}
      {!isCorrect && bestSubmission && bestSubmission.isCorrect === false && (
        <div
          className="p-3 rounded-xl text-xs"
          style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}
        >
          <p className="font-semibold text-rose-600 mb-1">Last attempt (incorrect)</p>
          <pre className="text-gray-600 whitespace-pre-wrap break-words" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            {bestSubmission.query}
          </pre>
        </div>
      )}

      {/* Time's up notice */}
      {isExpired && !isCorrect && (
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-sm font-semibold text-rose-600">⏰ Time's up — this challenge has closed.</p>
          {attemptsUsed === 0 && (
            <p className="text-xs text-rose-400 mt-0.5">You didn't submit for this round. Stay sharp for the next one!</p>
          )}
        </div>
      )}

      {/* Query editor */}
      {showEditor && (
        <QueryEditor
          onSubmit={handleSubmit}
          attemptsUsed={attemptsUsed}
          disabled={exhausted}
        />
      )}
    </div>
  );
}
