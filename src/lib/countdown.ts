import type { CountdownValues } from '@/types';

export function getTargetTimestamp(isoDateWithOffset: string): number {
  return new Date(isoDateWithOffset).getTime();
}

export function calculateCountdown(targetMs: number): CountdownValues {
  const now = Date.now();
  const remainingMs = Math.max(0, targetMs - now);

  const days = Math.floor(remainingMs / 86400000);
  const hours = Math.floor((remainingMs % 86400000) / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: remainingMs,
    isZero: remainingMs <= 0,
  };
}

export function isBirthday(targetMs: number): boolean {
  return Date.now() >= targetMs;
}

/**
 * A bounded visual progression for the age-transition artwork. It uses the
 * same target/remaining countdown values as the clock; this is deliberately
 * not another timer or a date-specific collection of thresholds.
 */
export function calculateAgeTransitionProgress(remainingMs: number, transitionWindowMs = 3 * 86400000): number {
  if (transitionWindowMs <= 0) return remainingMs <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, 1 - remainingMs / transitionWindowMs));
}

export function padZero(value: number, length = 2): string {
  return value.toString().padStart(length, '0');
}

export function formatCountdownDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

export function formatCompactDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}
