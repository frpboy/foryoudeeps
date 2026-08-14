import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Volume2, VolumeX } from '@/components/ui/primitives';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks';
import { filterEnabled, sortByOrder } from '@/lib/media';
import { musicTracks } from '@/data/special';

interface MusicControllerProps {
  enabled: boolean;
  userInteracted: boolean;
}

const DUCKED_VOLUME = 0.0005;

export const MusicController: React.FC<MusicControllerProps> = ({ enabled, userInteracted }) => {
  const reduced = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const foregroundMedia = useRef(new Set<HTMLMediaElement>());
  const resumeAfterFocus = useRef(false);
  const tracks = sortByOrder(filterEnabled(musicTracks));
  const activeTrack = tracks[0];
  const hasTrack = Boolean(enabled && activeTrack);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ducked, setDucked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : ducked ? DUCKED_VOLUME : 1;
  }, [ducked, muted]);

  useEffect(() => {
    if (!hasTrack || muted) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = ducked ? DUCKED_VOLUME : 1;
    void audio.play().catch(() => setPlaying(false));
  }, [ducked, hasTrack, muted, userInteracted]);

  useEffect(() => {
    const startFromFirstGesture = () => {
      const audio = audioRef.current;
      if (!hasTrack || muted || !audio) return;
      audio.volume = ducked ? DUCKED_VOLUME : 1;
      void audio.play().catch(() => setPlaying(false));
    };
    window.addEventListener('pointerdown', startFromFirstGesture, { once: true, capture: true });
    window.addEventListener('keydown', startFromFirstGesture, { once: true, capture: true });
    return () => {
      window.removeEventListener('pointerdown', startFromFirstGesture, true);
      window.removeEventListener('keydown', startFromFirstGesture, true);
    };
  }, [ducked, hasTrack, muted]);

  useEffect(() => {
    const syncDucking = () => setDucked(foregroundMedia.current.size > 0);
    const onMediaEvent = (event: Event) => {
      const media = event.target;
      if (!(media instanceof HTMLMediaElement) || media === audioRef.current) return;
      if (event.type === 'play' && !media.muted && media.volume > 0) foregroundMedia.current.add(media);
      else foregroundMedia.current.delete(media);
      syncDucking();
    };
    document.addEventListener('play', onMediaEvent, true);
    document.addEventListener('pause', onMediaEvent, true);
    document.addEventListener('ended', onMediaEvent, true);
    return () => {
      document.removeEventListener('play', onMediaEvent, true);
      document.removeEventListener('pause', onMediaEvent, true);
      document.removeEventListener('ended', onMediaEvent, true);
    };
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.visibilityState === 'hidden') {
        resumeAfterFocus.current = !audio.paused && !muted;
        audio.pause();
      } else if (resumeAfterFocus.current && !muted) {
        resumeAfterFocus.current = false;
        audio.volume = ducked ? DUCKED_VOLUME : 1;
        void audio.play().catch(() => setPlaying(false));
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [ducked, muted]);

  if (!hasTrack) return null;

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: -10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed right-4 top-4 z-[60] safe-top"
    >
      <audio
        ref={audioRef}
        src={activeTrack.src}
        autoPlay
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setPlaying(false)}
      />
      <div className="flex items-center gap-2 rounded-full border border-cream-100/10 bg-matcha-950/90 px-2 py-1.5 shadow-card backdrop-blur-xl">
        <span className={`music-spectrum ${playing && !muted ? 'music-spectrum--playing' : ''}`} aria-label={playing && !muted ? 'Background music playing' : 'Background music paused'}>
          {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
        </span>
        <IconButton
          icon={muted ? VolumeX : Volume2}
          size="sm"
          variant="ghost"
          label={muted ? 'Unmute background music' : 'Mute background music'}
          className="!h-9 !w-9 text-cream-100"
          onClick={() => setMuted((value) => !value)}
        />
      </div>
    </motion.div>
  );
};
