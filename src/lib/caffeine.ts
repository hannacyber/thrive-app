import { HALF_LIFE_HOURS } from '../data/drinks';

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function isToday(iso: string): boolean {
  return dateKey(new Date(iso)) === dateKey(new Date());
}

export function fmtTime(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}

/** Builds a Date for today at the given "HH:MM" wall-clock time. */
export function timeToday(hhmm: string): Date {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Tonight's bedtime as a real Date. Handles after-midnight bedtimes (e.g. "00:30"
 * means tomorrow 00:30 when it's still evening) and the hours after midnight
 * (at 1 AM with a 23:00 bedtime, tonight's bedtime was yesterday 23:00).
 */
export function bedtimeTarget(hhmm: string, now: Date = new Date()): Date {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  const lateNight = now.getHours() < 5;
  if (h < 5 && !lateNight) d.setDate(d.getDate() + 1);
  if (h >= 5 && lateNight) d.setDate(d.getDate() - 1);
  return d;
}

/** Exponential decay: caffeine remaining after `hoursSince` a dose of `mg`. */
export function decayedMg(mg: number, hoursSince: number): number {
  const h = Math.max(0, hoursSince);
  return mg * Math.pow(0.5, h / HALF_LIFE_HOURS);
}

/**
 * Reverse of `decayedMg`: how many hours it takes a dose of `mg` to decay down
 * to `targetMg`. Returns 0 if the dose is already at or under the target.
 */
export function hoursToDecay(mg: number, targetMg: number): number {
  if (mg <= targetMg || targetMg <= 0) return 0;
  return HALF_LIFE_HOURS * Math.log2(mg / targetMg);
}

/**
 * "Cutoff Window": the latest clock time a dose of `mg` could still be had and
 * decay to `budgetMg` or under by `bedtime`.
 * - Returns `bedtime` itself when the dose would already be under budget even
 *   with zero decay time (safe any time up to bedtime).
 * - Returns `null` when there's no budget left at all — i.e. what's already
 *   logged today is projected to be over the safe threshold by bedtime, so no
 *   more caffeine is safe today regardless of timing.
 */
export function cutoffTime(mg: number, budgetMg: number, bedtime: Date): Date | null {
  if (budgetMg <= 0) return null;
  if (mg <= budgetMg) return bedtime;
  const hoursBefore = hoursToDecay(mg, budgetMg);
  return new Date(bedtime.getTime() - hoursBefore * 3600000);
}

const WEEKDAY_2 = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export function weekdayShort(d: Date): string {
  return WEEKDAY_2[d.getDay()];
}
