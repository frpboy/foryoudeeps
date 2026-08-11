import React from 'react';
import { motion } from 'motion/react';
import { SectionHeading, PaperNote, DecorativeLeaf } from '@/components/ui/primitives';
import { ResponsiveImage } from '@/components/ui/Media';
import { useReducedMotion, useIntersectionObserver } from '@/hooks';
import { filterEnabled, sortByOrder } from '@/lib/media';
import { journeyItems } from '@/data/journey';
import type { JourneyItem } from '@/types';

const JourneyCard: React.FC<{ item: JourneyItem; index: number; reduced: boolean }> = ({ item, index, reduced }) => {
  const { ref, visible } = useIntersectionObserver<HTMLDivElement>();
  const isLeft = index % 2 === 0;
  const rotation = (index % 3 - 1) * 0.8;

  return (
    <motion.div
      ref={ref}
      initial={reduced || !visible ? {} : { opacity: 0, y: 40, x: isLeft ? -30 : 30 }}
      animate={visible ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1 }}
      className={`relative w-full ${item.emphasis === 'featured' ? 'lg:col-span-2' : ''}`}
    >
      <PaperNote tone={isLeft ? 'cream' : 'matcha'} rotation={rotation} className="h-full">
        <div className="flex flex-col gap-4 h-full">
          {item.image && (
            <ResponsiveImage
              src={item.image.src}
              alt={item.image.alt || ''}
              aspect={item.emphasis === 'featured' ? '16 / 9' : '4 / 5'}
              rounded="md"
              lazy={index > 0}
            />
          )}
          <div className="flex flex-col gap-2">
            {item.dateLabel && (
              <span className="font-handwritten text-deepred-600 text-xl leading-none">
                {item.dateLabel}
              </span>
            )}
            {item.caption && (
              <p className={`font-body leading-relaxed ${isLeft ? 'text-ink' : 'text-cream-100'}`}>
                {item.caption}
              </p>
            )}
          </div>
        </div>
        <DecorativeLeaf className="absolute -bottom-2 -right-2 w-8 h-8 opacity-30" rotation={-20} />
      </PaperNote>
    </motion.div>
  );
};

export const JourneySection: React.FC = () => {
  const reduced = useReducedMotion();
  const items = sortByOrder(filterEnabled(journeyItems));

  if (items.length === 0) return null;

  return (
    <section
      id="journey"
      className="relative py-24 md:py-32 px-6 bg-matcha-900 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cream-100/10 to-transparent" />
      <div className="relative max-w-5xl mx-auto w-full">
        <div className="mb-16 md:mb-20">
          <SectionHeading
            eyebrow="a little journey"
            title="pieces of your story"
            subtitle="Some moments stay with us forever. These are a few of ours."
          />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          {items.map((item, i) => (
            <JourneyCard key={item.id} item={item} index={i} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  );
};
