import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { SectionHeading, IconButton, Play, Pause, DecorativeHeart, PaperNote } from '@/components/ui/primitives';
import { ResponsiveImage } from '@/components/ui/Media';
import { useReducedMotion, useIntersectionObserver, useMediaPlayback } from '@/hooks';
import { filterEnabled, sortByOrder, getWishVariant } from '@/lib/media';
import { wishes } from '@/data/wishes';
import type { Wish, WishVariant } from '@/types';

interface AudioPlayerProps {
  src: string;
  label: string;
  pauseOthers: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, label, pauseOthers }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { registerAudio, unregisterAudio } = useMediaPlayback();

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    registerAudio(a);
    return () => unregisterAudio(a);
  }, [registerAudio, unregisterAudio]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      pauseOthers();
      a.play().catch(() => setPlaying(false));
    }
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const t = e.currentTarget;
          setProgress(t.duration ? (t.currentTime / t.duration) * 100 : 0);
        }}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
      />
      <IconButton
        icon={playing ? Pause : Play}
        size="md"
        variant="red"
        label={playing ? `Pause ${label}` : `Play ${label}`}
        onClick={toggle}
        className="shrink-0"
      />
      <div className="flex-1 h-1.5 rounded-full bg-matcha-800/60 overflow-hidden">
        <div
          className="h-full bg-deepred-500 rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

interface WishCardProps {
  wish: Wish;
  index: number;
  reduced: boolean;
  pauseAllMedia: () => void;
}

const WishCard: React.FC<WishCardProps> = ({ wish, index, reduced, pauseAllMedia }) => {
  const { ref, visible } = useIntersectionObserver<HTMLDivElement>();
  const variant = getWishVariant(wish);
  const hasPhoto = Boolean(wish.photo);
  const hasText = Boolean(wish.text?.trim());
  const hasAudio = Boolean(wish.audio?.src);
  const hasVideo = Boolean(wish.video?.src);
  const toneCream = index % 3 !== 1 || wish.featured;
  const rotation = wish.featured ? 0 : ((index % 5) - 2) * 0.4;

  const videoRef = useRef<HTMLVideoElement>(null);
  const { registerVideo, unregisterVideo } = useMediaPlayback();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    registerVideo(v);
    return () => unregisterVideo(v);
  }, [registerVideo, unregisterVideo]);

  const contentOrder = (
    <>
      {hasPhoto && (
        <div className={hasText || hasAudio || hasVideo ? 'mb-4' : ''}>
          <ResponsiveImage
            src={wish.photo!.src}
            alt={wish.photo!.alt || `${wish.name}`}
            aspect={wish.featured ? '16 / 10' : '1 / 1'}
            rounded="xl"
            lazy={index > 2}
          />
        </div>
      )}
      {hasVideo && wish.video && (
        <div className="relative rounded-xl overflow-hidden mb-4 border border-cream-100/10">
          <video
            ref={videoRef}
            src={wish.video.src}
            poster={wish.video.poster || wish.videoPoster}
            controls
            playsInline
            preload="metadata"
            className="w-full aspect-video object-cover bg-matcha-800/30"
            onPlay={pauseAllMedia}
          />
        </div>
      )}
      {hasText && (
        <p
          className={`font-body leading-relaxed mb-4 ${
            toneCream ? 'text-ink' : 'text-cream-100'
          } ${wish.featured ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}
        >
          {wish.text}
        </p>
      )}
      {hasAudio && wish.audio && (
        <div className="mb-4">
          <AudioPlayer
            src={wish.audio.src}
            label={`${wish.name}'s voice message`}
            pauseOthers={pauseAllMedia}
          />
        </div>
      )}
    </>
  );

  return (
    <motion.article
      ref={ref}
      initial={reduced || !visible ? {} : { opacity: 0, y: 32, rotate: rotation * 2 }}
      animate={visible ? { opacity: 1, y: 0, rotate: rotation } : {}}
      transition={{ duration: 0.6, delay: Math.min((index % 6) * 0.08, 0.45), ease: [0.22, 1, 0.36, 1] }}
      className={`${wish.featured ? 'md:col-span-2' : ''}`}
    >
      <PaperNote tone={toneCream ? 'cream' : 'matcha'} rotation={rotation} className="h-full">
        {wish.featured && (
          <div className="absolute -top-3 right-4">
            <DecorativeHeart size="md" className="animate-float" />
          </div>
        )}
        {!wish.featured && variant === 'text-only' && (
          <div className="absolute -top-2 left-1/3 w-1 h-1 rounded-full bg-deepred-500/70" />
        )}

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h3
              className={`font-display leading-none ${
                wish.featured ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
              } ${toneCream ? 'text-ink font-semibold' : 'text-cream-50 font-semibold'}`}
            >
              {wish.name}
            </h3>
            {wish.relationship && (
              <span
                className={`font-handwritten leading-none ${
                  toneCream ? 'text-deepred-700' : 'text-deepred-300'
                } ${wish.featured ? 'text-xl' : 'text-lg'}`}
              >
                {wish.relationship}
              </span>
            )}
          </div>
        </div>

        {hasPhoto && variant === ('photo-only' as WishVariant) ? (
          <div className="order-2 mb-0">{contentOrder.props?.children}</div>
        ) : (
          contentOrder
        )}
        <div className="h-0" />
      </PaperNote>
    </motion.article>
  );
};

export const WishesSection: React.FC = () => {
  const reduced = useReducedMotion();
  const items = sortByOrder(filterEnabled(wishes));
  const { pauseAll } = useMediaPlayback();

  if (items.length === 0) return null;

  return (
    <section
      id="wishes"
      className="relative py-24 md:py-32 px-6 bg-matcha-900 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-deepred-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-matcha-600/10 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cream-100/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="mb-16 md:mb-20">
          <SectionHeading
            eyebrow="words for deeps ♡"
            title="from your people"
            subtitle="Every one of these is a little piece of how much you are loved."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 lg:gap-8">
          {items.map((wish, i) => (
            <WishCard
              key={wish.id}
              wish={wish}
              index={i}
              reduced={reduced}
              pauseAllMedia={pauseAll}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
