import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title:   string;
  value:   string | number;
  icon:    LucideIcon;
  color:   'indigo' | 'violet' | 'emerald' | 'amber' | 'rose' | 'sky';
  subtitle?: string;
}

const colorMap = {
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  icon: 'bg-indigo-100' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  icon: 'bg-violet-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'bg-emerald-100' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: 'bg-amber-100' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    icon: 'bg-rose-100' },
  sky:     { bg: 'bg-sky-50',     text: 'text-sky-600',     icon: 'bg-sky-100' },
};

export default function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="card p-5 flex items-start gap-4 animate-fadeIn">
      <div className={`${c.icon} ${c.text} p-3 rounded-xl flex-shrink-0`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
        <p className={`text-2xl font-bold mt-0.5 ${c.text}`}>{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
