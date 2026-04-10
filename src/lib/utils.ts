/** Generate a random uppercase alphanumeric code of given length */
export function generateCode(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I ambiguity
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/** Format a Firestore Timestamp or Date for display */
export function formatDate(d: Date | undefined | null): string {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(d);
}

export function formatDateTime(d: Date | undefined | null): string {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatTime(d: Date | undefined | null): string {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d);
}

/** Seconds remaining until expiresAt */
export function secondsUntil(expiresAt: Date): number {
  return Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
}

/** Group an array by a string key-getter */
export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item) || 'Unknown';
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/** Produce [{name, value}] from a grouped record for Recharts */
export function toCounts(grouped: Record<string, unknown[]>) {
  return Object.entries(grouped)
    .map(([name, items]) => ({ name, value: items.length }))
    .sort((a, b) => b.value - a.value);
}
