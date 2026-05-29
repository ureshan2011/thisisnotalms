import { useState } from 'react';

// ─── Lightweight YouTube embed ──────────────────────────────────────────────
// Shows the video thumbnail with a play button and only loads the real YouTube
// iframe once the student clicks. This keeps the lesson page fast on phones
// (no heavy iframes loading until they're actually wanted).

interface YouTubeEmbedProps {
  id: string;
  title: string;
  caption?: string;
}

export default function YouTubeEmbed({ id, title, caption }: YouTubeEmbedProps) {
  const [active, setActive] = useState(false);

  return (
    <figure className="mx-auto max-w-[820px]">
      <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-black shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06]">
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Play video: ${title}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/15" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[#0071e3]" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-xl text-center text-[14px] leading-relaxed text-[#86868b]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
