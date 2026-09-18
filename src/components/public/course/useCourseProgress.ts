import { useCallback, useEffect, useState } from 'react';

// ─── Which lessons this reader has ticked off ─────────────────────────────
// Kept in localStorage, per course, and nowhere else. The course home pages
// are public and anonymous — there is no account to hang progress on, and
// inventing one to store "I read lesson 3" would be a worse trade than
// losing the ticks when somebody clears their browser.
//
// The page has to render correctly when this comes back empty, which it does
// in a private window, with site data blocked, and on a reader's first ever
// visit. Nothing here is load-bearing: the board shows 0 of N and every
// lesson still opens.

const VERSION = 'v1';

function storageKey(courseCode: string): string {
  return `btc_progress_${courseCode.toLowerCase()}_${VERSION}`;
}

function read(courseCode: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey(courseCode));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    // Anything could be under this key — another tab, an older build, a
    // reader poking at devtools — so only strings survive.
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function write(courseCode: string, ids: string[]): void {
  try {
    localStorage.setItem(storageKey(courseCode), JSON.stringify(ids));
  } catch {
    /* Private browsing, blocked site data, a full quota — all survivable. */
  }
}

export interface CourseProgress {
  /** Lesson ids this reader has ticked. */
  done: ReadonlySet<string>;
  isDone: (lessonId: string) => boolean;
  toggle: (lessonId: string) => void;
  clear: () => void;
}

export default function useCourseProgress(courseCode: string): CourseProgress {
  const [done, setDone] = useState<Set<string>>(() => new Set(read(courseCode)));

  // Switching course (the four pages share one component) has to load that
  // course's own ticks rather than carry the last one's across.
  useEffect(() => {
    setDone(new Set(read(courseCode)));
  }, [courseCode]);

  const toggle = useCallback(
    (lessonId: string) => {
      setDone(prev => {
        const next = new Set(prev);
        if (next.has(lessonId)) next.delete(lessonId);
        else next.add(lessonId);
        write(courseCode, [...next]);
        return next;
      });
    },
    [courseCode],
  );

  const clear = useCallback(() => {
    setDone(new Set());
    write(courseCode, []);
  }, [courseCode]);

  const isDone = useCallback((lessonId: string) => done.has(lessonId), [done]);

  return { done, isDone, toggle, clear };
}
