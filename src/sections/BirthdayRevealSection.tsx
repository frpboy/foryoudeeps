import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, DecorativeHeart } from '@/components/ui/primitives';
import { AmbientParticles } from '@/components/ui/AmbientParticles';
import { useIntersectionObserver, useReducedMotion } from '@/hooks';
import { siteConfig } from '@/data/site';

interface BirthdayRevealSectionProps { onContinue?: () => void; }

const burstParticles = Array.from({ length: 18 }, (_, index) => {
  const angle = (index / 18) * Math.PI * 2;
  const distance = 50 + (index % 4) * 17;
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, delay: index * .025 };
});

export const BirthdayRevealSection: React.FC<BirthdayRevealSectionProps> = ({ onContinue }) => {
  const reduced = useReducedMotion();
  const { ref, visible } = useIntersectionObserver<HTMLElement>();
  const moveToStory = () => {
    onContinue?.();
  };

  return (
    <section id="reveal" ref={ref} className="reveal-stage relative flex items-center justify-center overflow-hidden safe-top safe-bottom">
      <div aria-hidden="true" className={`reveal-photo-wave${reduced ? ' reveal-photo-wave--still' : ''}`} />
      <motion.div aria-hidden="true" initial={reduced || !visible ? {} : { opacity: .9 }} animate={visible ? { opacity: 0 } : {}} transition={{ delay: .18, duration: 1.15, ease: [0.22, 1, 0.36, 1] }} className="reveal-curtain" />
      <motion.div initial={reduced || !visible ? {} : { opacity: 0, scale: .98 }} animate={visible ? { opacity: 1, scale: 1 } : {}} transition={{ delay: .24, duration: .85 }} className="absolute inset-0"><AmbientParticles mood="birthday" /></motion.div>
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 py-16 text-center">
        <motion.p
          initial={reduced || !visible ? {} : { opacity: 0, y: 16, scale: 0.98 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: .72, duration: .7, ease: [0.22, 1, 0.36, 1] }}
          className="font-handwritten text-3xl leading-none text-deepred-500 md:text-4xl"
        >
          happy birthday,
        </motion.p>
        <motion.h1
          initial={reduced || !visible ? {} : { opacity: 0, letterSpacing: '-0.08em', scale: 1.06, clipPath: 'inset(0 50% 0 50%)' }}
          animate={visible ? { opacity: 1, letterSpacing: '0.015em', scale: 1, clipPath: 'inset(0 0% 0 0%)' } : {}}
          transition={{ delay: 1.35, duration: 1.08, ease: [0.22, 1, 0.36, 1] }}
          className="reveal-name mt-7 font-display font-medium text-cream-50"
        >
          <span className="reveal-name__word">
            {siteConfig.displayName}
            <span aria-hidden="true" className="reveal-name-sparkles">
              {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
            </span>
          </span>
        </motion.h1>
        <motion.div
          initial={reduced || !visible ? {} : { opacity: 0, y: 18 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.48, duration: .55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex items-center gap-4 text-deepred-300"
        >
          <span className="h-px w-9 bg-current opacity-60" />
          <DecorativeHeart size="sm" className="text-deepred-300" />
          <span className="h-px w-9 bg-current opacity-60" />
        </motion.div>
        <motion.div
          initial={reduced || !visible ? {} : { opacity: 0, scale: .6, y: 10 }}
          animate={visible ? { opacity: 1, scale: [0.6, 1.14, 1], y: 0 } : {}}
          transition={{ delay: 2.92, duration: .72, times: [0, .65, 1], ease: [0.22, 1, 0.36, 1] }}
          className="reveal-age-mark"
        >
          {siteConfig.turningAge}
        </motion.div>
        <motion.p
          initial={reduced || !visible ? {} : { opacity: 0, scale: .72 }}
          animate={visible ? { opacity: 1, scale: [0.72, 1.08, 1] } : {}}
          transition={{ delay: 3.52, duration: .65, times: [0, .62, 1], ease: [0.22, 1, 0.36, 1] }}
          className="level-seal mt-5 py-2 font-body text-[10px] uppercase text-cream-100/80 sm:text-xs"
        >
          {siteConfig.levelPhrase}
        </motion.p>
        <div aria-hidden="true" className="reveal-burst">
          {burstParticles.map((particle, index) => (
            <motion.span
              key={index}
              initial={reduced || !visible ? {} : { opacity: 0, x: 0, y: 0, scale: .25 }}
              animate={visible ? { opacity: [0, 1, 0], x: particle.x, y: particle.y, scale: [.25, 1, .4] } : {}}
              transition={{ delay: 3.93 + particle.delay, duration: .72, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
        <motion.button
          initial={reduced || !visible ? {} : { opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 4.52, duration: .55 }}
          onClick={moveToStory}
          className="group mt-14 inline-flex flex-col items-center gap-3 rounded-full px-6 py-3 font-body text-sm text-cream-200/70 transition-colors hover:text-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepred-500"
          aria-label="Continue to memories"
        >
          <span>begin the story</span>
          <ArrowDown size={18} className="transition-transform duration-300 group-hover:translate-y-1" />
        </motion.button>
      </div>
    </section>
  );
};
