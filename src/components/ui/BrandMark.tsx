interface BrandMarkProps {
  className?: string;
}

export default function BrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <rect x="7" y="7" width="35" height="35" rx="10" fill="#4338CA" />
      <rect x="22" y="22" width="35" height="35" rx="10" fill="#0891B2" />
      <rect x="22" y="22" width="20" height="20" rx="9" fill="#1D4ED8" />
    </svg>
  );
}
