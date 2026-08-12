import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, DecorativeHeart } from '@/components/ui/primitives';
import { AmbientParticles } from '@/components/ui/AmbientParticles';
import { useIntersectionObserver, useReducedMotion } from '@/hooks';
import { siteConfig } from '@/data/site';

interface BirthdayRevealSectionProps { onContinue?: () => void; }

export const BirthdayRevealSection: React.FC<BirthdayRevealSectionProps> = ({ onContinue }) => {
  const reduced = useReducedMotion();
  const { ref, visible } = useIntersectionObserver<HTMLElement>();
  const moveToStory = () => {
    onContinue?.();
  };

  return (
    <section id="reveal" ref={ref} className="reveal-stage relative flex items-center justify-center overflow-hidden safe-top safe-bottom">
      <AmbientParticles mood="birthday" />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 py-16 text-center">
        <motion.p
          initial={reduced || !visible ? {} : { opacity: 0, y: 16, scale: 0.98 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-handwritten text-3xl leading-none text-deepred-500 md:text-4xl"
        >
          happy birthday,
        </motion.p>
        <motion.h1
          initial={reduced || !visible ? {} : { opacity: 0, letterSpacing: '-0.13em', scale: 0.96 }}
          animate={visible ? { opacity: 1, letterSpacing: '-0.085em', scale: 1 } : {}}
          transition={{ delay: 0.72, duration: 0.92, ease: [0.22, 1, 0.36, 1] }}
          className="reveal-name mt-7 font-display font-medium text-cream-50"
        >
          {siteConfig.displayName}
        </motion.h1>
        <motion.div
          initial={reduced || !visible ? {} : { opacity: 0, y: 18 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.48, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex items-center gap-4 text-deepred-300"
        >
          <span className="h-px w-9 bg-current opacity-60" />
          <DecorativeHeart size="sm" className="text-deepred-300" />
          <span className="h-px w-9 bg-current opacity-60" />
        </motion.div>
        <motion.p
          initial={reduced || !visible ? {} : { opacity: 0, scale: 0.7 }}
          animate={visible ? { opacity: 1, scale: [0.7, 1.1, 1] } : {}}
          transition={{ delay: 1.86, duration: 0.7, times: [0, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
          className="level-seal mt-8 py-2 font-body text-[10px] uppercase text-cream-100/80 sm:text-xs"
        >
          {siteConfig.levelPhrase}
        </motion.p>
        <motion.button
          initial={reduced || !visible ? {} : { opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 2.25, duration: 0.55 }}
          onClick={moveToStory}
          className="group mt-20 inline-flex flex-col items-center gap-3 rounded-full px-6 py-3 font-body text-sm text-cream-200/70 transition-colors hover:text-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepred-500"
          aria-label="Continue to memories"
        >
          <span>begin the story</span>
          <ArrowDown size={18} className="transition-transform duration-300 group-hover:translate-y-1" />
        </motion.button>
      </div>
    </section>
  );
};
