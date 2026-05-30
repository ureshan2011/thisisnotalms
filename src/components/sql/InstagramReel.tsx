import { useState } from 'react';

// ─── Lightweight Instagram-reel embed ───────────────────────────────────────
// Mirrors the YouTubeEmbed lite-embed pattern used on the XR lesson: a poster
// with a play button is shown first, and only when the student taps it do we
// load Instagram's official embed iframe. The reel then plays *inline on this
// page* — the iframe never navigates the student away to instagram.com.

interface InstagramReelProps {
  /** The reel shortcode, e.g. "DUbBkrHD8Dy" from instagram.com/reel/DUbBkrHD8Dy/ */
  shortcode: string;
  title: string;
  caption?: string;
}

export default function InstagramReel({ shortcode, title, caption }: InstagramReelProps) {
  const [active, setActive] = useState(false);

  return (
    <figure className="mx-auto w-full max-w-[360px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[1.75rem] bg-black shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06]">
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            // /embed/captioned plays the reel inline within this iframe
            src={`https://www.instagram.com/reel/${shortcode}/embed/captioned/`}
            title={title}
            loading="lazy"
            scrolling="no"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Play reel: ${title}`}
          >
            {/* Instagram-style gradient poster */}
            <span
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)',
              }}
            />
            <span className="absolute inset-0 bg-black/15 transition group-hover:bg-black/5" />

            {/* play glyph */}
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[#d62976]" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>

            {/* reel chip */}
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-[12px] font-medium text-white backdrop-blur">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-white" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="white" stroke="none" />
              </svg>
              Reel
            </span>

            {/* title overlay */}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left">
              <span className="block text-[15px] font-semibold leading-snug text-white drop-shadow">{title}</span>
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-xs text-center text-[14px] leading-relaxed text-[#86868b]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
