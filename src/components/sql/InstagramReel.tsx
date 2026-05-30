import { useState } from 'react';
import { Play, Instagram, ExternalLink } from 'lucide-react';

interface InstagramReelProps {
  /** The reel shortcode, e.g. "DUbBkrHD8Dy" from instagram.com/reel/DUbBkrHD8Dy/ */
  shortcode: string;
  title: string;
  caption?: string;
}

/**
 * Lite Instagram reel embed: shows a fun gradient poster with a play button,
 * then loads the official Instagram embed iframe on click (saves bandwidth and
 * avoids loading Instagram's scripts until the student actually wants to watch).
 */
export default function InstagramReel({ shortcode, title, caption }: InstagramReelProps) {
  const [loaded, setLoaded] = useState(false);
  const reelUrl = `https://www.instagram.com/reel/${shortcode}/`;

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg shadow-black/30 transition-transform hover:-translate-y-1">
      <div className="relative aspect-[9/16] w-full bg-black">
        {!loaded ? (
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-fuchsia-600/30 via-rose-500/20 to-amber-500/20"
            aria-label={`Play reel: ${title}`}
          >
            {/* Instagram-style glow blobs */}
            <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-fuchsia-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-amber-400/30 blur-3xl" />

            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-xl transition-transform group-hover:scale-110">
              <Play className="h-9 w-9 translate-x-0.5 text-white" fill="white" />
            </div>
            <div className="relative z-10 px-6 text-center">
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                <Instagram className="h-3.5 w-3.5" />
                Reel
              </div>
              <p className="text-base font-semibold text-white drop-shadow">{title}</p>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.instagram.com/reel/${shortcode}/embed/`}
            title={title}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            scrolling="no"
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          {caption && <p className="truncate text-xs text-slate-400">{caption}</p>}
        </div>
        <a
          href={reelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-slate-400 transition-colors hover:text-pink-400"
          aria-label="Open on Instagram"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
