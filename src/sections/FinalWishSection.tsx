import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, DecorativeHeart } from '@/components/ui/primitives';
import { useIntersectionObserver, useReducedMotion } from '@/hooks';
import { finalMessage } from '@/data/special';
import { AmbientParticles } from '@/components/ui/AmbientParticles';
import { siteConfig } from '@/data/site';

export const FinalWishSection: React.FC<{ onReplay?: () => void }> = ({ onReplay }) => {
  const reduced = useReducedMotion();
  const { ref, visible } = useIntersectionObserver<HTMLElement>();
  return (
    <section id="final" ref={ref} className="final-atmosphere relative flex min-h-[100svh] items-center justify-center overflow-hidden safe-top safe-bottom">
      <AmbientParticles mood="final" />
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center">
        <motion.div initial={reduced || !visible ? {} : { opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ duration: .9 }} className="flex items-center gap-4 text-deepred-300"><span className="h-px w-10 bg-current opacity-60" /><DecorativeHeart size="sm" className="text-deepred-300" /><span className="h-px w-10 bg-current opacity-60" /></motion.div>
        <motion.p initial={reduced || !visible ? {} : { opacity: 0, y: 18 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: .18, duration: .85 }} className="mt-12 font-handwritten text-3xl leading-none text-deepred-300 md:text-4xl">{finalMessage.heading}</motion.p>
        <motion.h2 initial={reduced || !visible ? {} : { opacity: 0, y: 22 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: .34, duration: .9 }} className="mt-5 font-display text-5xl font-medium tracking-[-.06em] text-cream-50 sm:text-6xl md:text-8xl">{finalMessage.greeting}</motion.h2>
        {finalMessage.showAge && <motion.div initial={reduced || !visible ? {} : { opacity: 0, scale: .94 }} animate={visible ? { opacity: 1, scale: 1 } : {}} transition={{ delay: .55, duration: .8 }} className="mt-12 font-display text-7xl font-medium leading-none text-deepred-300 md:text-9xl">{siteConfig.turningAge}</motion.div>}
        <motion.p initial={reduced || !visible ? {} : { opacity: 0, y: 14 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: .7, duration: .8 }} className="mt-12 max-w-lg font-body text-base leading-relaxed text-cream-100/82 md:text-lg">{finalMessage.message}</motion.p>
        {finalMessage.creditText && <motion.p initial={reduced || !visible ? {} : { opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: .9 }} className="mt-12 font-handwritten text-xl text-cream-200/50">{finalMessage.creditText}</motion.p>}
        {finalMessage.replayEnabled && <motion.button initial={reduced || !visible ? {} : { opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: 1.1 }} type="button" onClick={() => { onReplay?.(); window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }} className="group mt-16 inline-flex items-center gap-3 px-5 py-3 font-body text-sm text-cream-200/60 transition-colors hover:text-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepred-500"><span>start again</span><ArrowDown size={17} className="rotate-180 transition-transform group-hover:-translate-y-1" /></motion.button>}
      </div>
    </section>
  );
};
