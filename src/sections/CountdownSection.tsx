import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useCountdown, useReducedMotion } from '@/hooks';
import { calculateAgeTransitionProgress, formatCountdownDate, padZero } from '@/lib/countdown';
import { DecorativeHeart } from '@/components/ui/primitives';
import { siteConfig } from '@/data/site';

interface CountdownSectionProps { onEnter?: () => void; userHasInteracted?: boolean; }
interface CountdownUnitProps { value: number; label: string; delay: number; reduced: boolean; }

const CountdownUnit: React.FC<CountdownUnitProps> = ({ value, label, delay, reduced }) => (
  <motion.div
    initial={reduced ? {} : { opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay / 1000, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    className="flex min-w-[54px] flex-col items-center gap-2 sm:min-w-[72px] md:min-w-[94px]"
  >
    <span aria-hidden="true" className="countdown-clock font-display text-cream-50 text-5xl font-medium leading-none tabular-nums sm:text-6xl md:text-8xl">
      {padZero(value)}
    </span>
    <span className="font-body text-[10px] font-medium uppercase tracking-[0.26em] text-cream-200/45 sm:text-xs">{label}</span>
  </motion.div>
);

export const CountdownSection: React.FC<CountdownSectionProps> = () => {
  const countdown = useCountdown(siteConfig.birthdayDate);
  const reduced = useReducedMotion();
  const ageProgress = countdown.isZero ? 1 : calculateAgeTransitionProgress(countdown.totalMs);
  const age30Opacity = 0.115 * Math.pow(1 - ageProgress, 1.35);
  const age31Opacity = 0.018 + 0.11 * Math.pow(ageProgress, 1.45);

  useEffect(() => {
    if (!countdown.isZero) return;
    const id = window.setTimeout(() => window.dispatchEvent(new CustomEvent('birthday-start')), 300);
    return () => window.clearTimeout(id);
  }, [countdown.isZero]);

  return (
    <section id="countdown" className="countdown-stage relative flex min-h-[100svh] items-center justify-center overflow-hidden safe-top safe-bottom">
      <div aria-hidden="true" className="countdown-age-transition">
        <span
          className="countdown-age countdown-age--past"
          style={{ opacity: age30Opacity, transform: `translate3d(${-ageProgress * 10}px, ${ageProgress * 8}px, 0) scale(${1 - ageProgress * 0.025})`, filter: `blur(${ageProgress * 2.2}px)` }}
        >
          {siteConfig.turningAge - 1}
        </span>
        <span
          className="countdown-age countdown-age--arriving"
          style={{ opacity: age31Opacity, transform: `translate3d(${(1 - ageProgress) * 10}px, ${(1 - ageProgress) * -8}px, 0) scale(${0.97 + ageProgress * 0.03})`, filter: `blur(${(1 - ageProgress) * 1.8}px)` }}
        >
          {siteConfig.turningAge}
        </span>
      </div>
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-6 py-16 text-center">
        <motion.div initial={reduced ? {} : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="flex flex-col items-center gap-2">
          <span className="font-handwritten text-3xl leading-none text-deepred-500 md:text-4xl">for you,</span>
          <h1 className="font-display text-5xl font-medium tracking-[-0.06em] text-cream-50 sm:text-6xl md:text-7xl">
            deeps <DecorativeHeart size="sm" className="mb-5 ml-2 inline-block" />
          </h1>
        </motion.div>

        <motion.p initial={reduced ? {} : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.8 }} className="mt-10 font-body text-base italic text-cream-200/65 md:text-lg">
          something is waiting for you...
        </motion.p>

        <div className="mt-9 flex items-end justify-center gap-2 py-4 sm:gap-5 md:gap-7" aria-live="polite" aria-atomic="true">
          <CountdownUnit value={countdown.days} label="Days" delay={300} reduced={reduced} />
          <span className="countdown-separator pb-6 text-3xl sm:text-4xl md:text-5xl">:</span>
          <CountdownUnit value={countdown.hours} label="Hours" delay={400} reduced={reduced} />
          <span className="countdown-separator pb-6 text-3xl sm:text-4xl md:text-5xl">:</span>
          <CountdownUnit value={countdown.minutes} label="Minutes" delay={500} reduced={reduced} />
          <span className="countdown-separator pb-6 text-3xl sm:text-4xl md:text-5xl">:</span>
          <CountdownUnit value={countdown.seconds} label="Seconds" delay={600} reduced={reduced} />
        </div>

        <motion.div initial={reduced ? {} : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.65 }} className="mt-10 flex items-center gap-3">
          <span className="h-px w-8 bg-deepred-500/55" />
          <span className="font-body text-sm tracking-[0.08em] text-cream-100/75 sm:text-base">{formatCountdownDate(siteConfig.birthdayDate)}</span>
          <span className="h-px w-8 bg-deepred-500/55" />
        </motion.div>

        <motion.p initial={reduced ? {} : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }} className="mt-12 font-handwritten text-xl text-deepred-300/75">
          keep this little secret for a few more days ♡
        </motion.p>
      </div>
    </section>
  );
};
