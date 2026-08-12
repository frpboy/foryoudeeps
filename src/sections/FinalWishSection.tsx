import React from 'react';
import { motion } from 'motion/react';
import { DecorativeHeart, ArrowDown } from '@/components/ui/primitives';
import { useReducedMotion, useIntersectionObserver } from '@/hooks';
import { finalMessage } from '@/data/special';
import { siteConfig } from '@/data/site';
import { formatCountdownDate } from '@/lib/countdown';

interface FinalWishSectionProps {
  onReplay?: () => void;
}

export const FinalWishSection: React.FC<FinalWishSectionProps> = ({ onReplay }) => {
  const reduced = useReducedMotion();
  const { ref, visible } = useIntersectionObserver<HTMLElement>();

  const handleReplay = () => {
    onReplay?.();
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section
      id="final"
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center bg-matcha-950 overflow-hidden safe-top safe-bottom"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[radial-gradient(ellipse_at_center,rgba(11,33,23,0.9),rgba(7,21,15,1)_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-deepred-800/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 md:gap-14 px-6 py-24 w-full max-w-3xl mx-auto text-center">
        <motion.div
          initial={reduced || !visible ? {} : { opacity: 0, scale: 0.9 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          <DecorativeHeart size="sm" className="animate-float" />
          <DecorativeHeart size="md" className="animate-float" style={{ animationDelay: '0.5s' } as React.CSSProperties} />
          <DecorativeHeart size="sm" className="animate-float" style={{ animationDelay: '1s' } as React.CSSProperties} />
        </motion.div>

        <motion.div
          initial={reduced || !visible ? {} : { opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          <span className="font-handwritten text-deepred-500 text-3xl md:text-4xl leading-none">
            {finalMessage.heading}
          </span>
          <h2 className="font-display text-cream-50 leading-[1.1] text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
            {finalMessage.greeting}
          </h2>
        </motion.div>

        {finalMessage.showAge && (
          <motion.div
            initial={reduced || !visible ? {} : { opacity: 0, y: 16 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="font-display text-deepred-500 leading-none text-6xl sm:text-7xl md:text-8xl font-bold opacity-70"
          >
            {siteConfig.turningAge}
          </motion.div>
        )}

        <motion.div
          initial={reduced || !visible ? {} : { opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-xl"
        >
          <p className="font-body text-cream-100/90 leading-relaxed text-base md:text-lg text-balance">
            {finalMessage.message}
          </p>
        </motion.div>

        {finalMessage.showDate && (
          <motion.div
            initial={reduced || !visible ? {} : { opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex items-center gap-2 text-cream-200/50 font-body text-sm md:text-base"
          >
            <DecorativeHeart size="sm" className="!w-3 !h-3" />
            <span>{formatCountdownDate(siteConfig.birthdayDate)}</span>
            <DecorativeHeart size="sm" className="!w-3 !h-3" />
          </motion.div>
        )}

        {finalMessage.creditText && (
          <motion.div
            initial={reduced || !visible ? {} : { opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ delay: 0.9, duration: 1 }}
            className="pt-4"
          >
            <span className="font-handwritten text-cream-200/50 text-xl md:text-2xl leading-none">
              {finalMessage.creditText}
            </span>
          </motion.div>
        )}

        {finalMessage.replayEnabled && (
          <motion.div
            initial={reduced || !visible ? {} : { opacity: 0, y: 16 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="flex flex-col items-center gap-3 mt-6"
          >
            <button
              type="button"
              onClick={handleReplay}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-cream-100/10 bg-matcha-800/40 hover:bg-matcha-700/50 text-cream-100 font-body transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepred-500"
            >
              <span className="text-sm md:text-base">replay the experience</span>
              <span className="text-cream-200/50 animate-float">
                <ArrowDown size={18} strokeWidth={2} className="rotate-180" />
              </span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
