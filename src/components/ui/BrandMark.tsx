interface BrandMarkProps {
  className?: string;
  logoVariant?: keyof typeof LOGO_PATHS;
}

const LOGO_PATHS = {
  new: '/YooBees/brand-logo-new.svg',
  legacy: '/YooBees/brand-mark.svg',
} as const;

// Change this to 'legacy' anytime you want to switch back globally.
const DEFAULT_LOGO_VARIANT: keyof typeof LOGO_PATHS = 'new';

export default function BrandMark({ className = 'h-10 w-auto', logoVariant = DEFAULT_LOGO_VARIANT }: BrandMarkProps) {
  const activeVariant: keyof typeof LOGO_PATHS = logoVariant ?? DEFAULT_LOGO_VARIANT;

  return (
    <img
      src={LOGO_PATHS[activeVariant]}
      alt="YooBees logo"
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
