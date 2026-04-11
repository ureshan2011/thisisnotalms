interface BrandMarkProps {
  className?: string;
}

export default function BrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return (
    <img
      src="/YooBees/brand-mark.svg"
      alt="YooBees logo"
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
