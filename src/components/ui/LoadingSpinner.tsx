export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6';
  return (
    <div className={`animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 ${cls}`} />
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-slate-400 font-medium">Loading…</p>
      </div>
    </div>
  );
}
