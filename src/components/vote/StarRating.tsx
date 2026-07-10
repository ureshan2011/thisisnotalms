import { Star } from 'lucide-react';

interface StarRatingProps {
  label:       string;
  description: string;
  value:       number;
  onChange:    (value: number) => void;
  error?:      boolean;
}

export default function StarRating({ label, description, value, onChange, error }: StarRatingProps) {
  return (
    <div>
      <p className="vote-label" style={{ marginBottom: 3 }}>{label}</p>
      <p className="vote-hint">{description}</p>

      <div className="vote-star-row" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= value;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} out of 5`}
              onClick={() => onChange(n)}
              className={`vote-star-btn ${filled ? 'filled' : ''}`}
            >
              <Star
                size={18}
                strokeWidth={filled ? 0 : 1.75}
                className={filled ? 'fill-[var(--ink)] text-[var(--ink)]' : 'text-[var(--paper-dim)]'}
              />
            </button>
          );
        })}
      </div>
      {error && <p className="vote-error-text">Please rate this criterion</p>}
    </div>
  );
}
