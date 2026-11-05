// ─── What the student is doing right now, for the TA's live screen ────────
// Not part of the saved profile: it describes this moment on this device.
// Screens call report() when the student moves to a new step, and
// reportFail() when a run or a submission doesn't pass. The time on the
// current step is sent as seconds, so the sheet can work out "since when"
// with its own clock rather than trusting the student's.

export interface Activity {
  key: string;
  where: string;
  detail: string;
  fails: number;
  since: number;
}

let cur: Activity = { key: 'map', where: 'Levels map', detail: '', fails: 0, since: Date.now() };
const subs = new Set<() => void>();
const emit = () => subs.forEach(f => f());

export function report(a: { key: string; where: string; detail?: string }) {
  const detail = (a.detail ?? '').replace(/\s+/g, ' ').trim().slice(0, 110);
  if (a.key === cur.key) {
    if (cur.where === a.where && cur.detail === detail) return;
    cur = { ...cur, where: a.where, detail };
  } else {
    cur = { key: a.key, where: a.where, detail, fails: 0, since: Date.now() };
  }
  emit();
}

export function reportFail() {
  cur = { ...cur, fails: cur.fails + 1 };
  emit();
}

export interface ActivityPayload {
  doing: string;
  step: string;
  stepSecs: number;
  fails: number;
}

export function activityPayload(): ActivityPayload {
  return { doing: cur.where, step: cur.detail, stepSecs: Math.round((Date.now() - cur.since) / 1000), fails: cur.fails };
}

export function onActivity(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}
