import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SectionHeading, IconButton, Play, Pause, DecorativeHeart, PaperNote } from '@/components/ui/primitives';
import { MediaFallback, ResponsiveImage } from '@/components/ui/Media';
import { AgeMotif } from '@/components/ui/AgeMotif';
import { useReducedMotion, useIntersectionObserver, useMediaRegistry } from '@/hooks';
import { filterEnabled, sortByOrder, getWishVariant } from '@/lib/media';
import { wishes } from '@/data/wishes';
import type { Wish, WishVariant } from '@/types';

interface AudioPlayerProps {
  src: string;
  label: string;
  duration?: number;
  autoPlay?: boolean;
  pauseOthers: () => void;
  register: (el: HTMLMediaElement | null) => void;
  unregister: (el: HTMLMediaElement | null) => void;
}

function formatDuration(seconds?: number): string | null {
  if (!seconds || !Number.isFinite(seconds) || seconds < 0) return null;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, label, duration, autoPlay = false, pauseOthers, register, unregister }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [failed, setFailed] = React.useState(false);
  const [loadedDuration, setLoadedDuration] = React.useState<number | undefined>(duration);
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    register(a);
    return () => unregister(a);
  }, [register, unregister]);

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

  if (failed) {
    return <MediaFallback message="This voice note is unavailable, but the thought behind it is still here." className="min-h-24 rounded-xl" />;
  }

  return (
    <div className="flex items-center gap-3 w-full" aria-label={label}>
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        preload={autoPlay ? 'auto' : 'none'}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => {
          const mediaDuration = event.currentTarget.duration;
          if (Number.isFinite(mediaDuration)) setLoadedDuration(mediaDuration);
        }}
        onError={() => {
          setPlaying(false);
          setFailed(true);
        }}
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
      <div aria-hidden="true" className={`audio-waveform ${playing ? 'audio-waveform--playing' : ''}`}>
        {[0, 1, 2, 3, 4].map((bar) => <span key={bar} className="audio-waveform__bar" />)}
      </div>
      <div className="flex-1 h-1.5 rounded-full bg-matcha-800/60 overflow-hidden">
        <div
          className="h-full bg-deepred-500 rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      {formatDuration(loadedDuration) && (
        <span className="font-mono text-[10px] tabular-nums text-current/50" aria-label={`Duration ${formatDuration(loadedDuration)}`}>
          {formatDuration(loadedDuration)}
        </span>
      )}
    </div>
  );
};

interface WishCardProps {
  wish: Wish;
  index: number;
  reduced: boolean;
  pauseAllMedia: () => void;
  registerMedia: (el: HTMLMediaElement | null) => void;
  unregisterMedia: (el: HTMLMediaElement | null) => void;
  onOpen?: () => void;
}

export const WishCard: React.FC<WishCardProps> = ({ wish, index, reduced, pauseAllMedia, registerMedia, unregisterMedia, onOpen }) => {
  const { ref, visible } = useIntersectionObserver<HTMLDivElement>();
  const variant = getWishVariant(wish);
  const hasPhoto = Boolean(wish.photo?.enabled && wish.photo.src);
  const hasText = Boolean(wish.text?.trim());
  const hasAudio = Boolean(wish.audio?.enabled && wish.audio.src);
  const hasVideo = Boolean(wish.video?.enabled && wish.video.src);
  const toneCream = index % 3 !== 1 || wish.featured;
  const presentation = wish.presentationStyle ?? (hasAudio ? 'audio' : hasVideo ? 'video' : hasPhoto ? 'polaroid' : 'note');
  const openFromCard = (target: EventTarget | null) => {
    if (target instanceof Element && target.closest('button, a, audio, video, input, [role="slider"]')) return;
    onOpen?.();
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = React.useState(false);

  useEffect(() => setVideoFailed(false), [wish.id, wish.video?.src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    registerMedia(v);
    return () => unregisterMedia(v);
  }, [registerMedia, unregisterMedia]);

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
          {videoFailed ? (
            <MediaFallback className="aspect-video rounded-none" />
          ) : (
            <video
              ref={videoRef}
              src={wish.video.src}
              poster={wish.video.poster || wish.videoPoster}
              controls
              playsInline
              preload="metadata"
              className="w-full aspect-video object-cover bg-matcha-800/30"
              onError={() => setVideoFailed(true)}
              onPlay={pauseAllMedia}
            />
          )}
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
            duration={wish.audio.duration}
            autoPlay={wish.id === 'wish-nikitha'}
            pauseOthers={pauseAllMedia}
            register={registerMedia}
            unregister={unregisterMedia}
          />
        </div>
      )}
    </>
  );

  return (
    <motion.article
      ref={ref}
      initial={reduced || !visible ? {} : { opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: Math.min((index % 6) * 0.08, 0.45), ease: [0.22, 1, 0.36, 1] }}
      className={`wish-note wish-${presentation}`}
      role="button"
      tabIndex={0}
      aria-label={`Open ${wish.name}'s birthday wish`}
      onClick={(event) => openFromCard(event.target)}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen?.(); } }}
    >
      <PaperNote tone={toneCream ? 'cream' : 'matcha'} rotation={0} className="h-full">
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
          {presentation === 'chat' && wish.timestampLabel && (
            <span className={`font-body text-xs ${toneCream ? 'text-ink/50' : 'text-cream-100/50'}`}>{wish.timestampLabel}</span>
          )}
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
  const navigate = useNavigate();
  const location = useLocation();
  const { pauseAll, register, unregister } = useMediaRegistry();

  return (
    <section
      id="wishes"
      className="story-section wishes-atmosphere"
    >
      <AgeMotif tone="paper" />
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-16 md:mb-24">
          <SectionHeading
            eyebrow="from the people who know you"
            title="some things are better said properly"
            subtitle="Each note will arrive in its own voice."
            tone="dark"
          />
        </div>

        {items.length === 0 ? (
          <div className="editorial-empty editorial-empty--paper mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <DecorativeHeart size="sm" className="opacity-75" />
            <h3 className="font-display text-3xl font-medium tracking-[-0.04em] text-ink md:text-4xl">Words worth waiting for</h3>
            <p className="max-w-md font-body leading-relaxed text-ink/65">Every note here will be shared by the person who wrote it.</p>
          </div>
        ) : (
          <div className="wishes-list">
            {items.map((wish, i) => (
              <WishCard
                key={wish.id}
                wish={wish}
                index={i}
              reduced={reduced}
              pauseAllMedia={pauseAll}
              registerMedia={register}
              unregisterMedia={unregister}
              onOpen={() => navigate(`/wishes/${wish.id}${location.search}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
