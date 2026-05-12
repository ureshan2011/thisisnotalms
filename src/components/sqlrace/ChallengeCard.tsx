import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import type { SqlRaceChallenge, SqlRaceSubmission } from '../../lib/sqlRaceTypes';
import { MAX_ATTEMPTS } from '../../lib/sqlRaceTypes';
import QueryEditor from './QueryEditor';

interface Props {
  challenge: SqlRaceChallenge;
  submissions: SqlRaceSubmission[];
  onSubmit: (challengeId: string, query: string) => Promise<void>;
  readOnly?: boolean;
}

export default function ChallengeCard({ challenge, submissions, onSubmit, readOnly = false }: Props) {
  const [schemaOpen, setSchemaOpen] = useState(false);

  const attemptsUsed = submissions.length;
  const bestSubmission = submissions.find(s => s.isCorrect) ?? submissions[submissions.length - 1];
  const isCorrect = submissions.some(s => s.isCorrect);
  const isPending = submissions.some(s => s.isCorrect === null);
  const exhausted = attemptsUsed >= MAX_ATTEMPTS && !isCorrect;

  const handleSubmit = async (query: string) => {
    await onSubmit(challenge.id, query);
  };

  return (
    <div
      className="card p-5 space-y-4"
      style={
        isCorrect
          ? { borderColor: 'rgba(16,185,129,0.3)', background: 'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, white 100%)' }
          : undefined
      }
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-800 text-sm">{challenge.title}</h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
            >
              {challenge.pointValue} pt{challenge.pointValue !== 1 ? 's' : ''}
            </span>
            {challenge.status === 'closed' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                Closed
              </span>
            )}
          </div>
          {challenge.description && (
            <p className="text-xs text-gray-500 mt-1">{challenge.description}</p>
          )}
        </div>

        {/* Submission status badge */}
        {isCorrect && (
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex-shrink-0">
            <CheckCircle size={13} />
            <span className="text-[11px] font-semibold">Correct</span>
          </div>
        )}
        {isPending && !isCorrect && (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg flex-shrink-0">
            <Clock size={13} />
            <span className="text-[11px] font-semibold">Pending review</span>
          </div>
        )}
        {exhausted && (
          <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-lg flex-shrink-0">
            <XCircle size={13} />
            <span className="text-[11px] font-semibold">Attempts used</span>
          </div>
        )}
      </div>

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
          <p className="text-sm text-gray-700 font-medium leading-relaxed">{challenge.question}</p>
        </div>
      </div>

      {/* Previous incorrect attempt feedback */}
      {!isCorrect && bestSubmission && bestSubmission.isCorrect === false && (
        <div
          className="p-3 rounded-xl text-xs"
          style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}
        >
          <p className="font-semibold text-rose-600 mb-1">Last attempt (incorrect)</p>
          <pre
            className="text-gray-600 whitespace-pre-wrap break-words"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            {bestSubmission.query}
          </pre>
        </div>
      )}

      {/* Query editor — hidden when correct, read-only, or challenge closed */}
      {!readOnly && !isCorrect && challenge.status === 'active' && (
        <QueryEditor
          onSubmit={handleSubmit}
          attemptsUsed={attemptsUsed}
          disabled={exhausted}
        />
      )}
    </div>
  );
}
