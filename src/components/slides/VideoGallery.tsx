import { useState } from 'react';
import { Film, Play, ExternalLink } from 'lucide-react';

export interface VideoClip {
  title: string;
  description?: string;
  url: string;           // SharePoint sharing link — opens in new tab
  thumbnailUrl?: string; // optional screenshot/poster image
  embedUrl?: string;     // optional SharePoint embed URL for inline playback
}

export default function VideoGallery({
  videos,
  accentColor = '#0d7a72',
}: {
  videos: VideoClip[];
  accentColor?: string;
}) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  if (videos.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${accentColor}15`, color: accentColor }}
        >
          <Film size={14} />
        </div>
        <h4 className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
          Video Lessons
        </h4>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${accentColor}12`, color: accentColor }}
        >
          {videos.length} clip{videos.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((clip, i) => {
          const isPlaying = playingIndex === i;
          const hasEmbed = Boolean(clip.embedUrl);

          /* ── Inline player (embed mode) ── */
          if (isPlaying && hasEmbed) {
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{ border: `1.5px solid ${accentColor}30` }}
              >
                <div className="aspect-video w-full">
                  <iframe
                    src={clip.embedUrl}
                    title={clip.title}
                    allowFullScreen
                    className="w-full h-full border-none"
                  />
                </div>
                <div
                  className="flex items-center justify-between px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.97)' }}
                >
                  <p className="text-sm font-semibold truncate" style={{ color: '#1e1b4b' }}>
                    {clip.title}
                  </p>
                  <button
                    onClick={() => setPlayingIndex(null)}
                    className="ml-3 flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full transition-opacity hover:opacity-70"
                    style={{ background: `${accentColor}12`, color: accentColor }}
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          }

          /* ── Thumbnail card ── */
          return (
            <button
              key={i}
              onClick={() =>
                hasEmbed
                  ? setPlayingIndex(i)
                  : window.open(clip.url, '_blank', 'noreferrer')
              }
              className="text-left rounded-2xl overflow-hidden group transition-all hover:shadow-lg"
              style={{
                border: `1.5px solid ${accentColor}20`,
                background: 'rgba(255,255,255,0.92)',
              }}
            >
              {/* Thumbnail / placeholder */}
              <div
                className="relative aspect-video w-full overflow-hidden"
                style={{
                  background: clip.thumbnailUrl
                    ? undefined
                    : `linear-gradient(135deg, ${accentColor}14, ${accentColor}07)`,
                }}
              >
                {clip.thumbnailUrl && (
                  <img
                    src={clip.thumbnailUrl}
                    alt={clip.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Placeholder icon (no thumbnail) */}
                {!clip.thumbnailUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film size={36} style={{ color: `${accentColor}40` }} />
                  </div>
                )}

                {/* Play / external-link button overlay */}
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.10)' }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg
                                group-hover:scale-110 transition-transform duration-150"
                    style={{ background: accentColor }}
                  >
                    {hasEmbed
                      ? <Play size={18} color="white" style={{ marginLeft: 2 }} />
                      : <ExternalLink size={16} color="white" />
                    }
                  </div>
                </div>

                {/* "Opens in new tab" badge for link-only clips */}
                {!hasEmbed && (
                  <span
                    className="absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.52)', color: '#fff' }}
                  >
                    Opens in new tab
                  </span>
                )}
              </div>

              {/* Card info */}
              <div className="px-3 py-3">
                <p className="text-sm font-semibold leading-snug" style={{ color: '#1e1b4b' }}>
                  {clip.title}
                </p>
                {clip.description && (
                  <p className="text-xs mt-0.5 leading-5" style={{ color: '#6b7280' }}>
                    {clip.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
