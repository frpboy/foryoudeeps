import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { SectionHeading, IconButton, Play, ChevronLeft, ChevronRight, DecorativeHeart } from '@/components/ui/primitives';
import { Modal } from '@/components/ui/Modal';
import { ResponsiveImage, MediaFallback } from '@/components/ui/Media';
import { useReducedMotion, useIntersectionObserver } from '@/hooks';
import { filterEnabled, sortByOrder } from '@/lib/media';
import { galleryItems } from '@/data/gallery';
import type { GalleryItem } from '@/types';

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  total: number;
  reduced: boolean;
  onClick: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, index, total, reduced, onClick }) => {
  const { ref, visible } = useIntersectionObserver<HTMLButtonElement>();
  const isVideo = item.media.type === 'video';
  const spans: Record<number, string> = {
    0: 'md:col-span-2 md:row-span-2',
    3: 'md:col-span-2',
    5: 'md:row-span-2',
  };
  const spanClass = spans[index % total] || '';

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      initial={reduced || !visible ? {} : { opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? {} : { scale: 1.015, y: -2 }}
      whileTap={reduced ? {} : { scale: 0.98 }}
      className={`group relative block w-full text-left overflow-hidden rounded-2xl shadow-soft card-matcha ${spanClass}`}
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
            <p className="font-body text-cream-100 text-sm md:text-base leading-snug">
              {item.caption}
            </p>
          )}
        </div>
      )}
      {item.featured && (
        <div className="absolute top-3 left-3">
          <DecorativeHeart size="sm" className="animate-float" />
        </div>
      )}
    </motion.button>
  );
};

interface LightboxContentProps {
  items: GalleryItem[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  reduced: boolean;
}

const LightboxContent: React.FC<LightboxContentProps> = ({ items, index, onPrev, onNext, onClose, reduced }) => {
  const item = items[index];
  const touchStartX = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 48) {
      if (dx < 0) onNext();
      else onPrev();
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onPrev, onNext]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    return () => {
      try {
        v.pause();
      } catch {
        /* noop */
      }
    };
  }, [index]);

  return (
    <div
      className="flex flex-col min-h-[60svh]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative flex items-center justify-center aspect-video max-h-[75svh] w-full overflow-hidden bg-matcha-950 rounded-t-3xl">
        {item.media.type === 'video' ? (
          <video
            ref={videoRef}
            key={item.id}
            src={item.media.src}
            poster={item.media.poster}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
            onError={() => {}}
          />
        ) : (
          <img
            key={item.id}
            src={item.media.src}
            alt={item.media.alt || ''}
            className="w-full h-full object-contain"
            onError={() => <MediaFallback />}
          />
        )}

        {index > 0 && (
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10">
            <IconButton
              icon={ChevronLeft}
              size="lg"
              variant="solid"
              label="Previous"
              onClick={onPrev}
              className="!w-12 !h-12 md:!w-14 md:!h-14"
            />
          </div>
        )}
        {index < items.length - 1 && (
          <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-10">
            <IconButton
              icon={ChevronRight}
              size="lg"
              variant="solid"
              label="Next"
              onClick={onNext}
              className="!w-12 !h-12 md:!w-14 md:!h-14"
            />
          </div>
        )}
      </div>

      <div className="px-6 py-5 md:px-10 md:py-7 border-t border-cream-100/5">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div className="flex flex-col gap-1">
            {item.dateLabel && (
              <span className="font-handwritten text-deepred-500 text-xl leading-none">
                {item.dateLabel}
              </span>
            )}
            {(item.caption || item.media.caption) && (
              <p className="font-body text-cream-100 leading-relaxed max-w-2xl">
                {item.caption || item.media.caption}
              </p>
            )}
          </div>
          <span className="font-mono text-xs text-cream-200/40 shrink-0 pt-1">
            {index + 1} / {items.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export const GallerySection: React.FC = () => {
  const reduced = useReducedMotion();
  const items = sortByOrder(filterEnabled(galleryItems));
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const onPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const onNext = useCallback(() => {
    setIndex((i) => Math.min(items.length - 1, i + 1));
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section id="gallery" className="relative py-24 md:py-32 px-6 bg-matcha-950">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cream-100/10 to-transparent" />
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="mb-16 md:mb-20">
          <SectionHeading
            eyebrow="moments of deeps"
            title="a gallery of memories"
            subtitle="Some favourites from the journey so far."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 auto-rows-[minmax(120px,auto)] md:auto-rows-[180px]">
          {items.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={i}
              total={items.length}
              reduced={reduced}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy="lightbox-title"
        showClose
        className="!p-0 !overflow-hidden !max-w-6xl"
      >
        <LightboxContent
          items={items}
          index={index}
          onPrev={onPrev}
          onNext={onNext}
          onClose={() => setOpen(false)}
          reduced={reduced}
        />
      </Modal>
    </section>
  );
};
