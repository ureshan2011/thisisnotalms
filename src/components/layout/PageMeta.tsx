import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resolvePageMeta } from '../../lib/pageMeta';

// ─── Keeps the browser tab honest ─────────────────────────────────────────
// Renders nothing. It sits inside the router and, on every navigation, sets
// document.title and the meta description to whatever src/lib/pageMeta.ts
// says this route is.
//
// Without it a single-page app keeps index.html's <title> for the whole
// session, however far the reader navigates — which is how every page on this
// site came to announce itself as the Extended Reality lesson.
//
// It runs above the lesson password gate on purpose: the tab should name the
// page somebody is trying to reach, not the gate in front of it.

export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = resolvePageMeta(pathname);
    document.title = title;

    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;

    // og:description is what a link preview reads once it runs the page. The
    // og:title is set alongside it so a shared lesson link does not show the
    // site name where the lesson's own name belongs.
    for (const [property, value] of [
      ['og:title', title],
      ['og:description', description],
    ] as const) {
      let og = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', property);
        document.head.appendChild(og);
      }
      og.content = value;
    }
  }, [pathname]);

  return null;
}
