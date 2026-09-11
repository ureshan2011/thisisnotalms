// Shared access code gating the publicly-viewable lesson pages (see
// LessonPasswordGate). This is a lightweight, client-side convenience gate —
// not a real security boundary, since the value ships inside the JS bundle.
export const LESSON_ACCESS_PASSWORD = 'Yasas-9443jhZu4W';

// sessionStorage key used to remember a successful unlock for the current
// browser tab/session. Bump the suffix if the password above ever changes,
// so previously-granted sessions are forced to re-enter it.
export const LESSON_ACCESS_STORAGE_KEY = 'yoobees_lesson_access_v1';
