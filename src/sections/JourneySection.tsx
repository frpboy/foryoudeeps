import React from 'react';
import { motion } from 'motion/react';
import { SectionHeading, PaperNote, DecorativeLeaf } from '@/components/ui/primitives';
import { MediaFallback, ResponsiveImage } from '@/components/ui/Media';
import { FutureContent } from '@/components/ui/FutureContent';
import { AmbientParticles } from '@/components/ui/AmbientParticles';
import { useReducedMotion, useIntersectionObserver } from '@/hooks';
import { filterEnabled, sortByOrder } from '@/lib/media';
import { journeyItems } from '@/data/journey';
import type { JourneyItem } from '@/types';

interface JourneyCardProps {
  item: JourneyItem;
  index: number;
  reduced: boolean;
}

const JourneyCard: React.FC<JourneyCardProps> = ({ item, index, reduced }) => {
  const { ref, visible } = useIntersectionObserver<HTMLDivElement>();
  const isLeft = index % 2 === 0;
  const rotation = (index % 3 - 1) * 0.8;
  const [videoFailed, setVideoFailed] = React.useState(false);

  React.useEffect(() => setVideoFailed(false), [item.id, item.video?.src]);

  return (
    <motion.div
      ref={ref}
      initial={reduced || !visible ? {} : { opacity: 0, y: 40, x: isLeft ? -30 : 30, rotate: rotation * 2 }}
      animate={visible ? { opacity: 1, y: 0, x: 0, rotate: rotation } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full ${item.emphasis === 'featured' ? 'lg:col-span-2' : ''}`}
    >
      <AmbientParticles mood="memories" />
      <PaperNote tone={isLeft ? 'cream' : 'matcha'} rotation={rotation} className="h-full">
        <div className="flex flex-col gap-4 h-full">
          {item.image?.enabled && (
            <ResponsiveImage
              src={item.image.src}
              alt={item.image.alt || ''}
              aspect={item.emphasis === 'featured' ? '16 / 9' : '4 / 5'}
              rounded="md"
              lazy={index > 0}
            />
          )}
          {item.video?.enabled && (
            videoFailed ? (
              <MediaFallback className="aspect-video rounded-xl" />
            ) : (
              <video
                src={item.video.src}
                poster={item.video.poster}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full rounded-xl bg-matcha-800/30 object-cover"
                onError={() => setVideoFailed(true)}
              />
            )
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
  const items = sortByOrder(filterEnabled(journeyItems)).filter((item) => item.image?.enabled || item.video?.enabled || item.caption);

  return (
    <section
      id="journey"
      className="story-section journey-atmosphere"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-16 md:mb-24">
          <SectionHeading
            eyebrow="a little journey"
            title="the parts that stay with us"
            subtitle="A few photographs will arrive here soon — exactly as they happened."
          />
        </div>

        {items.length === 0 ? (
          <FutureContent
            title="A few memories, held close"
            message="The photographs that belong in this part of the story are being gathered with care."
          />
        ) : (
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
            {items.map((item, i) => (
              <JourneyCard key={item.id} item={item} index={i} reduced={reduced} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
