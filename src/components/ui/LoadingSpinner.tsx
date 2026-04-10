export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6';
  return (
    <div
      className={`animate-spin rounded-full flex-shrink-0 ${dims}`}
      style={{
        border: '2px solid rgba(139, 92, 246, 0.15)',
        borderTopColor: '#7c3aed',
      }}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-page)' }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo ring */}
        <div className="relative">
          <div
            className="h-14 w-14 rounded-full animate-spin"
            style={{
              border: '3px solid rgba(139, 92, 246, 0.12)',
              borderTopColor: '#7c3aed',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 rounded-full"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
            />
          </div>
        </div>
        <p className="text-sm font-semibold" style={{ color: '#a78bfa' }}>Loading…</p>
      </div>
    </div>
  );
}
