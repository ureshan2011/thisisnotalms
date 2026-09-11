import { useId } from 'react';

// ─── Blended Teaching Content — brand lockup for the public course pages ──
//
// The glyph is two outlined circles with the overlap filled in the accent:
// the "blended" idea drawn literally, one shape where two ways of teaching
// meet. It holds together at 22px, which is the size it usually has to work
// at, and carries no course colour of its own — it picks up whatever
// `--accent-500` the page sets, so the same mark reads warm orange on the
// MBI802 page and teal on MBI806B.
//
// The wordmark is typographic: the display face at weight 800 with the
// middle word in the accent, and the byline beneath in the body face. This
// sits alongside the app-wide BrandMark/BrandLogo rather than replacing
// them — those are built for the violet Tailwind theme, and their cool
// indigo and cyan fight the warm paper these course pages stand on.

interface CourseBrandProps {
  /** Height of the square glyph in px. Everything else scales from it. */
  size?: number;
  /** `on-dark` flips the tile and the text for near-black surfaces. */
  variant?: 'on-light' | 'on-dark';
  /** Drop the byline where space is tight. */
  showByline?: boolean;
}

export default function CourseBrand({ size = 28, variant = 'on-light', showByline = true }: CourseBrandProps) {
  const lens = `bt-lens-${useId().replace(/:/g, '')}`;
  const dark = variant === 'on-dark';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.4) }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        style={{ flexShrink: 0, display: 'block' }}
        role="img"
        aria-label="Blended Teaching Content, by Yasas Sri Wickramasinghe"
      >
        <defs>
          <clipPath id={lens}>
            <circle cx="19.4" cy="16" r="6.6" />
          </clipPath>
        </defs>
        <rect width="32" height="32" rx="9" fill={dark ? 'var(--paper-50)' : 'var(--ink-900)'} />
        <circle cx="12.6" cy="16" r="6.6" fill="none" stroke={dark ? 'var(--ink-900)' : 'var(--paper-50)'} strokeWidth="1.9" />
        <circle cx="19.4" cy="16" r="6.6" fill="none" stroke={dark ? 'var(--ink-900)' : 'var(--paper-50)'} strokeWidth="1.9" />
        <circle cx="12.6" cy="16" r="6.6" fill="var(--accent-500)" clipPath={`url(#${lens})`} />
      </svg>

      <span style={{ display: 'block', lineHeight: 1.16 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: Math.round(size * 0.5),
            letterSpacing: '-0.03em',
            color: dark ? 'var(--paper-50)' : 'var(--ink-900)',
            whiteSpace: 'nowrap',
          }}
        >
          Blended <span style={{ color: 'var(--accent-500)' }}>Teaching</span> Content
        </span>
        {showByline && (
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: Math.max(10, Math.round(size * 0.33)),
              color: dark ? 'var(--ink-300)' : 'var(--ink-400)',
              marginTop: 3,
              whiteSpace: 'nowrap',
            }}
          >
            by Yasas Sri Wickramasinghe
          </span>
        )}
      </span>
    </span>
  );
}
