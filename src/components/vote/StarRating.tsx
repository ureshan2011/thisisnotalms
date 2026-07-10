import { Star } from 'lucide-react';

interface StarRatingProps {
  label:       string;
  description: string;
  icon:        React.ReactNode;
  value:       number;
  onChange:    (value: number) => void;
  error?:      boolean;
}

export default function StarRating({ label, description, icon, value, onChange, error }: StarRatingProps) {
  return (
    <div>
      <div className="flex items-start gap-2.5 mb-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(167,139,250,0.08))' }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>{label}</p>
          <p className="text-xs font-medium leading-snug" style={{ color: '#9ca3af' }}>{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2" role="radiogroup" aria-label={label}>
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
              className="flex-1 flex items-center justify-center rounded-2xl transition-all duration-150 active:scale-95"
              style={{
                height: 48,
                background: filled
                  ? 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)'
                  : 'rgba(124,58,237,0.06)',
                border: filled ? 'none' : '1px solid rgba(124,58,237,0.14)',
                boxShadow: filled ? '0 4px 14px rgba(124,58,237,0.30)' : 'none',
              }}
            >
              <Star size={20} className={filled ? 'fill-white text-white' : 'text-brand-300'} strokeWidth={filled ? 0 : 1.75} />
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs font-semibold mt-1.5" style={{ color: '#e11d48' }}>Please rate this criterion</p>
      )}
    </div>
  );
}
