import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, IconButton, DecorativeHeart } from '@/components/ui/primitives';
import { MediaFallback } from '@/components/ui/Media';
import { useReducedMotion, useIntersectionObserver, useMediaPlayback } from '@/hooks';
import { daughterMessage } from '@/data/special';
import { formatCompactDate } from '@/lib/countdown';
import { siteConfig } from '@/data/site';

interface PosterPlaceholderProps {
  onPlay: () => void;
}

const PosterPlaceholder: React.FC<PosterPlaceholderProps> = ({ onPlay }) => {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="group relative block w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-modal bg-gradient-to-br from-matcha-800 via-matcha-900 to-matcha-950 border border-cream-100/5"
      aria-label="Play daughter's birthday message"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(155,36,48,0.15),transparent_60%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center">
        <DecorativeHeart size="lg" className="animate-float" />
        <div className="flex flex-col gap-2">
          <span className="font-handwritten text-deepred-300 text-2xl md:text-3xl leading-none">
            ♡
          </span>
          <p className="font-display text-cream-100 text-lg md:text-2xl leading-snug">
            Tap play to hear this message
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-deepred-500/30 blur-xl scale-150 opacity-60 group-hover:opacity-90 transition-opacity" />
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-deepred-700 text-cream-50 flex items-center justify-center shadow-card group-hover:scale-105 transition-transform">
            <Play size={34} fill="currentColor" className="ml-1" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </button>
  );
};

export const DaughterSection: React.FC = () => {
  const reduced = useReducedMotion();
  const { ref, visible } = useIntersectionObserver<HTMLElement>();
  const [started, setStarted] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [missing, setMissing] = React.useState(
    !daughterMessage.enabled || !daughterMessage.video?.src
  );
  const { pauseAll, registerVideo, unregisterVideo } = useMediaPlayback();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    registerVideo(v);
    return () => unregisterVideo(v);
  }, [started, registerVideo, unregisterVideo]);

  const startPlayback = () => {
    setStarted(true);
    pauseAll();
    const v = videoRef.current;
    if (v) {
      window.setTimeout(() => {
        v.play().catch(() => setMissing(true));
      }, 100);
    }
  };

  if (!daughterMessage.enabled) return null;

  return (
    <section
      id="daughter"
      ref={ref}
      className="relative py-28 md:py-40 px-6 bg-matcha-950 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-[720px] max-h-[720px] bg-[radial-gradient(ellipse_at_center,rgba(155,36,48,0.1),transparent_60%)] blur-2xl" />
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cream-100/10 to-transparent" />

      <div className="relative max-w-3xl mx-auto w-full flex flex-col items-center gap-10 md:gap-14">
        <motion.div
          initial={reduced || !visible ? {} : { opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <span className="font-handwritten text-deepred-500 text-2xl md:text-3xl leading-none">
            {daughterMessage.heading || 'one more message...'}
          </span>
          <p className="font-body text-cream-200/70 text-base md:text-lg max-w-md text-center">
            {daughterMessage.introText || 'Saved the most special one for last.'}
          </p>
        </motion.div>

        <motion.div
          initial={reduced || !visible ? {} : { opacity: 0, scale: 0.97, y: 24 }}
          animate={visible ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg mx-auto"
        >
          {missing ? (
            <MediaFallback message="This special message will be here soon." />
          ) : started ? (
            <div className="relative rounded-3xl overflow-hidden shadow-modal border border-cream-100/5 bg-matcha-900">
              <video
                ref={videoRef}
                src={daughterMessage.video?.src}
                poster={daughterMessage.poster || daughterMessage.video?.poster}
                controls
                playsInline
                preload="metadata"
                className="w-full aspect-[4/5] object-cover bg-matcha-800"
                onError={() => setMissing(true)}
                onPlay={pauseAll}
              />
            </div>
          ) : (
            <PosterPlaceholder onPlay={startPlayback} />
          )}
        </motion.div>

        {daughterMessage.caption && (
          <motion.div
            initial={reduced || !visible ? {} : { opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <p className="font-handwritten text-deepred-300 text-xl md:text-2xl leading-none">
              {daughterMessage.caption}
            </p>
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-cream-200/30">
              {formatCompactDate(siteConfig.birthdayDate)}
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
};
