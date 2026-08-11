import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useCountdown, useReducedMotion } from '@/hooks';
import { padZero, formatCountdownDate } from '@/lib/countdown';
import { DecorativeHeart } from '@/components/ui/primitives';
import { siteConfig } from '@/data/site';

interface CountdownSectionProps {
  onEnter?: () => void;
  userHasInteracted?: boolean;
}

interface CountdownUnitProps {
  value: number;
  label: string;
  delay: number;
  reduced: boolean;
}

const CountdownUnit: React.FC<CountdownUnitProps> = ({ value, label, delay, reduced }) => {
  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-1 min-w-[64px] sm:min-w-[80px] md:min-w-[96px]"
    >
      <div className="relative">
        <span
          aria-hidden="true"
          className="font-display text-cream-100 text-5xl sm:text-6xl md:text-7xl font-semibold leading-none tabular-nums"
        >
          {padZero(value)}
        </span>
        <DecorativeHeart size="sm" className="absolute -top-2 -right-3 opacity-0 animate-fade-in" />
      </div>
      <span className="font-body text-cream-200/60 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium">
        {label}
      </span>
    </motion.div>
  );
};

export const CountdownSection: React.FC<CountdownSectionProps> = () => {
  const countdown = useCountdown(siteConfig.birthdayDate);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (countdown.isZero) {
      const id = window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('birthday-start'));
      }, 300);
      return () => window.clearTimeout(id);
    }
  }, [countdown.isZero]);

  return (
    <section
      id="countdown"
      className="relative min-h-[100svh] flex items-center justify-center bg-gradient-matcha safe-top safe-bottom overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-deepred-800/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-matcha-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 px-6 py-16 w-full max-w-xl mx-auto text-center">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-handwritten text-deepred-500 text-3xl md:text-4xl leading-none">
            for you,
          </span>
          <h1 className="font-display text-cream-50 text-4xl md:text-5xl font-semibold tracking-tight">
            deeps
            <DecorativeHeart size="sm" className="inline-block ml-3 -translate-y-2" />
          </h1>
        </motion.div>

        <motion.div
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-cream-200/70 font-body text-base md:text-lg"
        >
          something special is waiting for you.
        </motion.div>

        <div
          className="flex items-end justify-center gap-3 sm:gap-6 md:gap-8 py-4"
          aria-live="polite"
          aria-atomic="true"
        >
          <CountdownUnit value={countdown.days} label="Days" delay={300} reduced={reduced} />
          <span className="font-display text-deepred-500 text-4xl sm:text-5xl md:text-6xl pb-6 opacity-60 animate-pulse-soft">:</span>
          <CountdownUnit value={countdown.hours} label="Hours" delay={400} reduced={reduced} />
          <span className="font-display text-deepred-500 text-4xl sm:text-5xl md:text-6xl pb-6 opacity-60 animate-pulse-soft">:</span>
          <CountdownUnit value={countdown.minutes} label="Minutes" delay={500} reduced={reduced} />
          <span className="font-display text-deepred-500 text-4xl sm:text-5xl md:text-6xl pb-6 opacity-60 animate-pulse-soft">:</span>
          <CountdownUnit value={countdown.seconds} label="Seconds" delay={600} reduced={reduced} />
        </div>

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-cream-100/10 bg-matcha-800/30 backdrop-blur-sm">
            <DecorativeHeart size="sm" />
            <span className="font-body text-cream-100/90 text-sm sm:text-base tracking-wide">
              {formatCountdownDate(siteConfig.birthdayDate)}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="pt-4"
          aria-hidden="true"
        >
          <DecorativeHeart size="md" className="text-deepred-500/60 animate-float" />
        </motion.div>
      </div>
    </section>
  );
};
