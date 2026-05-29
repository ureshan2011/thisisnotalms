interface BrandMarkProps {
  className?: string;
}

export default function BrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand-mark.svg`}
      alt="Not a LMS logo"
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
