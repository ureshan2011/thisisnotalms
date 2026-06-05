interface BrandLogoProps {
  iconSize?: number;
  variant?: 'on-light' | 'on-dark';
}

export default function BrandLogo({ iconSize = 32, variant = 'on-light' }: BrandLogoProps) {
  const isDark = variant === 'on-dark';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
        <rect x="7" y="7" width="35" height="35" rx="10" fill="#4338CA" />
        <rect x="22" y="22" width="35" height="35" rx="10" fill="#0891B2" />
        <rect x="22" y="22" width="20" height="20" rx="9" fill="#1D4ED8" />
      </svg>
      <div style={{ lineHeight: 1.2 }}>
        <div style={{
          fontSize: Math.round(iconSize * 0.41),
          fontWeight: 600,
          color: isDark ? '#fff' : '#111827',
          fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
          letterSpacing: '-0.01em',
        }}>
          Blended <span style={{ fontWeight: 800, color: isDark ? '#93c5fd' : '#4338CA' }}>Teaching</span> Content
        </div>
        <div style={{
          fontSize: Math.round(iconSize * 0.27),
          color: isDark ? 'rgba(255,255,255,0.5)' : '#6b7280',
          fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
          fontWeight: 400,
          marginTop: 1,
        }}>
          by Yasas Sri Wickramasinghe
        </div>
      </div>
    </div>
  );
}
