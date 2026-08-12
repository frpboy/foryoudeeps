import { describe, expect, it, vi } from 'vitest';
import { calculateAgeTransitionProgress, calculateCountdown, formatCountdownDate, getTargetTimestamp, isBirthday, padZero } from '@/lib/countdown';

describe('countdown utilities', () => {
  it('calculates an IST countdown without negative values', () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-08-14T23:59:58+05:30').getTime());
    const value = calculateCountdown(getTargetTimestamp('2026-08-15T00:00:00+05:30'));
    expect(value).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 2, isZero: false });
    vi.restoreAllMocks();
  });

  it('reaches zero and recognises the birthday boundary', () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-08-15T00:00:00+05:30').getTime());
    const target = getTargetTimestamp('2026-08-15T00:00:00+05:30');
    expect(calculateCountdown(target)).toMatchObject({ totalMs: 0, isZero: true });
    expect(isBirthday(target)).toBe(true);
    vi.restoreAllMocks();
  });

  it('formats configured dates and padded values consistently', () => {
    expect(formatCountdownDate('2026-08-15T00:00:00+05:30')).toBe('15 August 2026');
    expect(padZero(7)).toBe('07');
  });

  it('derives the age artwork progression from the same remaining countdown time', () => {
    expect(calculateAgeTransitionProgress(3 * 86400000)).toBe(0);
    expect(calculateAgeTransitionProgress(36 * 3600000)).toBeCloseTo(0.5);
    expect(calculateAgeTransitionProgress(0)).toBe(1);
    expect(calculateAgeTransitionProgress(-1)).toBe(1);
  });
});
