import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, DecorativeHeart } from '@/components/ui/primitives';
import { useReducedMotion, useIntersectionObserver } from '@/hooks';
import { siteConfig } from '@/data/site';
import { formatCountdownDate } from '@/lib/countdown';

interface BirthdayRevealSectionProps {
  onContinue?: () => void;
}

export const BirthdayRevealSection: React.FC<BirthdayRevealSectionProps> = ({ onContinue }) => {
  const reduced = useReducedMotion();
  const { ref, visible } = useIntersectionObserver<HTMLDivElement>();

  const handleScroll = () => {
    onContinue?.();
    const el = document.getElementById('journey');
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section
      id="reveal"
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center bg-gradient-matcha safe-top safe-bottom overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 -translate-x-1/2 -translate-y-1/2 bg-deepred-700/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 translate-x-1/3 translate-y-1/3 bg-matcha-600/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 px-6 py-20 w-full max-w-3xl mx-auto text-center">
        <motion.div
          initial={reduced || !visible ? {} : { opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          <span className="font-handwritten text-deepred-500 text-3xl md:text-4xl leading-none">
            happy birthday,
          </span>
          <h1 className="font-display text-cream-50 leading-[1] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-balance">
            {siteConfig.displayName}
          </h1>
          <DecorativeHeart size="md" className="mt-2 animate-float" />
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <motion.div
            initial={reduced || !visible ? {} : { opacity: 0, scale: 0.9 }}
            animate={visible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative"
          >
            <span className="font-display text-deepred-500 leading-none text-[7rem] sm:text-[9rem] md:text-[11rem] lg:text-[13rem] font-bold block">
              {siteConfig.turningAge}
            </span>
            <span className="absolute -top-2 -right-4 sm:-right-8 animate-pulse-soft">
              <DecorativeHeart size="lg" />
            </span>
          </motion.div>

          <motion.div
            initial={reduced || !visible ? {} : { opacity: 0, y: 12 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-2"
          >
            <span className="inline-block font-body text-cream-100 tracking-[0.25em] uppercase text-xs sm:text-sm md:text-base px-5 py-2 rounded-full border border-deepred-700/40 bg-deepred-900/30">
              {siteConfig.levelPhrase}
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={reduced || !visible ? {} : { opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex items-center gap-2 text-cream-200/60 font-body"
        >
          <DecorativeHeart size="sm" />
          <span>{formatCountdownDate(siteConfig.birthdayDate)}</span>
        </motion.div>

        <motion.button
          initial={reduced || !visible ? {} : { opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          onClick={handleScroll}
          className="group mt-4 inline-flex flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepred-500 rounded-2xl px-6 py-4"
          aria-label="Continue to memories"
        >
          <span className="font-display text-cream-100 text-lg md:text-xl">
            let us go through the memories
          </span>
          <span className="mt-1 text-cream-200/50 animate-float">
            <ArrowDown size={22} strokeWidth={2} />
          </span>
        </motion.button>
      </div>
    </section>
  );
};
