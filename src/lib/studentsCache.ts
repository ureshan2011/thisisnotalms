import type { StudentProfile } from './types';

// Module-level cache shared across Dashboard and StudentList.
// Survives navigation (module stays loaded) but clears on page refresh.
const TTL_MS = 5 * 60 * 1000;

interface Cache {
  students: StudentProfile[];
  at: number;
}

let _cache: Cache | null = null;

export function getCachedStudents(): StudentProfile[] | null {
  if (_cache && Date.now() - _cache.at < TTL_MS) return _cache.students;
  return null;
}

export function setCachedStudents(students: StudentProfile[]): void {
  _cache = { students, at: Date.now() };
}

export function invalidateCachedStudents(): void {
  _cache = null;
}
