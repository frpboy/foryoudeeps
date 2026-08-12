import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SectionHeading, Play, DecorativeHeart } from '@/components/ui/primitives';
import { ResponsiveImage } from '@/components/ui/Media';
import { FutureContent } from '@/components/ui/FutureContent';
import { AmbientParticles } from '@/components/ui/AmbientParticles';
import { useReducedMotion, useIntersectionObserver } from '@/hooks';
import { filterEnabled, sortByOrder } from '@/lib/media';
import { galleryItems } from '@/data/gallery';
import type { GalleryItem } from '@/types';

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  total: number;
  reduced: boolean;
  onOpen: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, index, total, reduced, onOpen }) => {
  const { ref, visible } = useIntersectionObserver<HTMLButtonElement>();
  const isVideo = item.media.type === 'video';
  const spans: Record<number, string> = {
    0: 'md:col-span-2 md:row-span-2',
    3: 'md:col-span-2',
    5: 'md:row-span-2',
  };
  const spanClass = spans[index % total] || '';
  const rotation = item.rotation ?? (((index * 7) % 5) - 2) * 0.7;

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onOpen}
      initial={reduced || !visible ? {} : { opacity: 0, y: -24, scale: 0.96, rotate: rotation + (index % 2 ? 2.2 : -2.2) }}
      animate={visible ? { opacity: 1, y: 0, scale: 1, rotate: rotation } : {}}
      transition={{ duration: 0.66, delay: Math.min(index * 0.07, 0.48), ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? {} : { scale: 1.02, y: -5, rotate: rotation + (index % 2 ? 0.8 : -0.8) }}
      whileTap={reduced ? {} : { scale: 0.98 }}
      className={`gallery-memory gallery-polaroid group relative block w-full overflow-hidden text-left ${spanClass}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-label={`Open gallery item ${index + 1}`}
    >
      <div className={item.featured ? 'aspect-[4/5]' : 'aspect-square md:aspect-auto md:h-full'}>
        <ResponsiveImage
          src={item.media.poster || item.media.src}
          alt={item.media.alt || ''}
          rounded="none"
          aspect={undefined}
          lazy={index > 1}
          className="w-full h-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-matcha-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {isVideo && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-deepred-700/90 text-cream-50 flex items-center justify-center shadow-card backdrop-blur-sm">
          <Play size={22} fill="currentColor" className="ml-1" />
        </div>
      )}
      {(item.caption || item.dateLabel) && (
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
          {item.dateLabel && (
            <span className="font-handwritten text-deepred-300 text-lg leading-none block mb-1">
              {item.dateLabel}
            </span>
          )}
          {item.caption && (
            <p className={`${item.handwrittenCaption ? 'font-handwritten text-xl leading-none' : 'font-body text-sm md:text-base leading-snug'} text-cream-100`}>
              {item.caption}
            </p>
          )}
        </div>
      )}
      {item.sticker && (
        <span className="gallery-sticker absolute right-3 top-3 max-w-[60%] bg-cream-50 px-2 py-1 font-handwritten text-base leading-none text-deepred-700 shadow-soft">
          {item.sticker}
        </span>
      )}
      {item.featured && (
        <div className="absolute top-3 left-3">
          <DecorativeHeart size="sm" className="animate-float" />
        </div>
      )}
    </motion.button>
  );
};

export const GallerySection: React.FC = () => {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const items = sortByOrder(filterEnabled(galleryItems)).filter((item) => item.media.enabled);

  return (
    <section id="gallery" className="story-section gallery-atmosphere">
      <AmbientParticles mood="gallery" />
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-16 md:mb-24">
          <SectionHeading
            eyebrow="a few photographs"
            title="the album is waiting"
            subtitle="The real, unrepeatable kind of moments belong here."
          />
        </div>

        {items.length === 0 ? (
          <FutureContent
            title="The album is ready"
            message="Real photographs and small films will live here, exactly as they happened."
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 auto-rows-[minmax(120px,auto)] md:auto-rows-[180px]">
            {items.map((item, i) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={i}
                total={items.length}
                reduced={reduced}
                onOpen={() => navigate(`/gallery/${item.id}${location.search}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
