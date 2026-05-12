import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { MAX_ATTEMPTS } from '../../lib/sqlRaceTypes';

interface Props {
  onSubmit: (query: string) => Promise<void>;
  attemptsUsed: number;
  disabled?: boolean;
}

export default function QueryEditor({ onSubmit, attemptsUsed, disabled = false }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const remaining = MAX_ATTEMPTS - attemptsUsed;
  const canSubmit = !disabled && remaining > 0 && query.trim().length > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await onSubmit(query.trim());
      setQuery('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={query}
        onChange={e => setQuery(e.target.value)}
        disabled={disabled || remaining === 0}
        placeholder={"-- Write your SQL query here\nSELECT ..."}
        rows={5}
        style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '13px', resize: 'vertical' }}
        className="input-field w-full"
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <AlertCircle
            size={13}
            className={remaining <= 1 ? 'text-rose-500' : 'text-gray-400'}
          />
          <span
            className={`text-xs font-medium ${remaining <= 1 ? 'text-rose-500' : 'text-gray-500'}`}
          >
            {remaining === 0
              ? 'No attempts remaining'
              : `${remaining} of ${MAX_ATTEMPTS} attempt${remaining !== 1 ? 's' : ''} remaining`}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn-primary flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={14} />
          )}
          {loading ? 'Checking…' : 'Submit Query'}
        </button>
      </div>
    </div>
  );
}
