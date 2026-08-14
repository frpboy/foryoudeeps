import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks';
import { AgeMotif } from '@/components/ui/AgeMotif';

const letterParagraphs = [
  'Some people become part of your journey simply because you happen to work with them. And then there are a few people whose presence genuinely makes the journey better. You are one of those people.',
  'Over the years, I have seen you handle pressure, chaos, problems, bugs, last-minute changes, and probably more “it’s just a small change” situations than anyone should have to deal with. 😄 Yet somehow, you keep showing up, helping people, figuring things out, and making things move forward.',
  'What I admire most isn’t just how much you know. It’s the way you share what you know, the way you guide people, and the way you don’t easily give up when something gets difficult.',
  'You have been there from the early days, through all the changes, challenges, and everything in between. And I think that deserves more than just a birthday wish.',
  'So here’s to 31.',
  'A new chapter, more memories, more laughter, more adventures, fewer bugs hopefully 😄, and a lot more reasons to be proud of the person you’ve become.',
  'Stay exactly who you are — calm when it matters, strict when necessary, funny when nobody expects it, and always there when someone needs help.',
  'Happy 31st Birthday, Deeps. ❤️',
  'May this year be kinder, brighter, and every bit as memorable as you deserve.',
];

export const LetterSection: React.FC = () => {
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  const guideScroll = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch' || reduced) return;
    const panel = scrollRef.current;
    if (!panel) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    panel.scrollTop = progress * (panel.scrollHeight - panel.clientHeight);
  };

  return (
    <section className="letter-scene" onPointerMove={guideScroll}>
      <AgeMotif tone="paper" />
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? .01 : .55, ease: [0.22, 1, 0.36, 1] }}
        className="letter-paper"
      >
        <div className="letter-paper__heading">
          <p className="font-handwritten text-2xl text-deepred-700">a birthday wish</p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">Happy Birthday, Deeps. ❤️</h1>
          <p className="letter-scroll-hint">Move your cursor down to read</p>
        </div>
        <div ref={scrollRef} className="letter-paper__body" tabIndex={0} aria-label="A birthday wish for Deeps">
          {letterParagraphs.map((paragraph, index) => (
            <p key={paragraph} className={index === 4 || index === 7 ? 'letter-paper__emphasis' : undefined}>{paragraph}</p>
          ))}
          <p className="letter-paper__signature">With appreciation, always.</p>
        </div>
      </motion.div>
    </section>
  );
};
