import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Play, Pause, Volume2, VolumeX } from '@/components/ui/primitives';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/hooks';
import { filterEnabled, sortByOrder } from '@/lib/media';
import { musicTracks } from '@/data/special';

interface MusicControllerProps {
  enabled: boolean;
  userInteracted: boolean;
}

export const MusicController: React.FC<MusicControllerProps> = ({ enabled, userInteracted }) => {
  const reduced = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const tracks = sortByOrder(filterEnabled(musicTracks));
  const hasTracks = tracks.length > 0 && enabled;

  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const trackIndex = useRef(0);

  useEffect(() => {
    if (!userInteracted || !hasTracks) return;
    setActive(true);
  }, [userInteracted, hasTracks]);

  const togglePlayback = () => {
    const a = audioRef.current;
    if (!a || !hasTracks) return;
    if (playing) {
      a.pause();
    } else {
      a.play().catch(() => setPlaying(false));
    }
  };

  if (!hasTracks || !active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={reduced ? {} : { opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-40 bottom-5 right-5 safe-bottom"
      >
        <audio
          ref={audioRef}
          src={tracks[trackIndex.current]?.src}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            trackIndex.current = (trackIndex.current + 1) % tracks.length;
            const a = audioRef.current;
            if (a) {
              a.src = tracks[trackIndex.current].src;
              a.play().catch(() => setPlaying(false));
            }
          }}
          preload="metadata"
          loop={tracks.length === 1}
        />
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-matcha-900/85 backdrop-blur-xl border border-cream-100/10 shadow-card">
          <span className="hidden sm:block font-handwritten text-deepred-400 text-lg leading-none pr-1">
            {tracks[trackIndex.current]?.title}
          </span>
          <IconButton
            icon={playing ? Pause : Play}
            size="sm"
            variant="red"
            label={playing ? 'Pause music' : 'Play music'}
            onClick={togglePlayback}
            className="!w-9 !h-9"
          />
          <IconButton
            icon={Volume2}
            size="sm"
            variant="ghost"
            label="Music"
            className="!w-9 !h-9 opacity-70 hover:opacity-100"
            onClick={togglePlayback}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
