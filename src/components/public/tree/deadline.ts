import type { Deadline } from '../lab/Countdown';

/** When the decision tree lab report is due: one week after the linear
 *  regression lab. New Zealand is on daylight time (+13:00) in October.
 *  The report template in public/mbi806b/decision-tree/ states the same
 *  date, so change both together. */
export const DT_DEADLINE: Deadline = {
  at: new Date('2026-10-16T23:59:00+13:00'),
  label: 'Friday 16 October 2026, 11:59 pm',
  short: 'Fri 16 Oct, 11:59 pm',
};
