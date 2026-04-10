import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title:    string;
  value:    string | number;
  icon:     LucideIcon;
  color:    'indigo' | 'violet' | 'emerald' | 'amber' | 'rose' | 'sky';
  subtitle?: string;
}

const colorMap: Record<StatCardProps['color'], {
  gradient: string;
  iconBg:   string;
  iconText: string;
  valueText: string;
  glow:     string;
}> = {
  indigo: {
    gradient:  'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)',
    iconBg:    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    iconText:  '#fff',
    valueText: '#4338ca',
    glow:      'rgba(99,102,241,0.20)',
  },
  violet: {
    gradient:  'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(167,139,250,0.05) 100%)',
    iconBg:    'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    iconText:  '#fff',
    valueText: '#6d28d9',
    glow:      'rgba(124,58,237,0.20)',
  },
  emerald: {
    gradient:  'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(45,212,191,0.05) 100%)',
    iconBg:    'linear-gradient(135deg, #10b981 0%, #2dd4bf 100%)',
    iconText:  '#fff',
    valueText: '#059669',
    glow:      'rgba(16,185,129,0.20)',
  },
  amber: {
    gradient:  'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(249,115,22,0.05) 100%)',
    iconBg:    'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    iconText:  '#fff',
    valueText: '#d97706',
    glow:      'rgba(245,158,11,0.20)',
  },
  rose: {
    gradient:  'linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(232,121,160,0.05) 100%)',
    iconBg:    'linear-gradient(135deg, #f43f5e 0%, #e879a0 100%)',
    iconText:  '#fff',
    valueText: '#e11d48',
    glow:      'rgba(244,63,94,0.20)',
  },
  sky: {
    gradient:  'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(96,165,250,0.05) 100%)',
    iconBg:    'linear-gradient(135deg, #0ea5e9 0%, #60a5fa 100%)',
    iconText:  '#fff',
    valueText: '#0284c7',
    glow:      'rgba(14,165,233,0.20)',
  },
};

export default function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const c = colorMap[color];

  return (
    <div
      className="card p-5 animate-fadeIn group cursor-default"
      style={{
        background: `rgba(255,255,255,0.92)`,
        transition: 'box-shadow 0.22s ease, transform 0.22s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px ${c.glow}, 0 2px 8px rgba(0,0,0,0.06)`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full opacity-60"
        style={{ background: c.iconBg }}
      />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="stat-icon flex-shrink-0 shadow-lg"
          style={{
            background: c.iconBg,
            boxShadow: `0 6px 16px ${c.glow}`,
          }}
        >
          <Icon size={22} color={c.iconText} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide leading-none mb-2">
            {title}
          </p>
          <p
            className="text-3xl font-bold leading-none tracking-tight"
            style={{ color: c.valueText }}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1.5 font-medium">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Background gradient */}
      <div
        className="absolute inset-0 rounded-[20px] opacity-50 pointer-events-none"
        style={{ background: c.gradient }}
      />
    </div>
  );
}
