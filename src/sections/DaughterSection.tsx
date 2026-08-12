import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play } from '@/components/ui/primitives';
import { MediaFallback } from '@/components/ui/Media';
import { AmbientParticles } from '@/components/ui/AmbientParticles';
import { useIntersectionObserver, useMediaPlayback, useReducedMotion } from '@/hooks';
import { daughterMessage } from '@/data/special';

const VideoReveal: React.FC<{ onPlay: () => void }> = ({ onPlay }) => (
  <button type="button" onClick={onPlay} aria-label="Play daughter's birthday message" className="group relative block aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-matcha-800 via-matcha-900 to-matcha-950 outline outline-1 outline-offset-8 outline-deepred-500/50">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(155,36,48,0.16),transparent_62%)]" />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-8 text-center">
      <p className="font-display text-xl leading-snug text-cream-100 md:text-3xl">one small voice,<br />all the love</p>
      <div className="relative">
        <div className="absolute inset-0 scale-150 rounded-full bg-deepred-500/25 blur-xl transition-opacity group-hover:opacity-90" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-deepred-700 text-cream-50 transition-transform group-hover:scale-105 md:h-24 md:w-24"><Play size={34} fill="currentColor" className="ml-1" strokeWidth={2.5} /></div>
      </div>
    </div>
  </button>
);

export const DaughterSection: React.FC = () => {
  const reduced = useReducedMotion();
  const { ref, visible } = useIntersectionObserver<HTMLElement>();
  const [started, setStarted] = React.useState(false);
  const [missing, setMissing] = React.useState(!daughterMessage.video?.enabled || !daughterMessage.video.src);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { pauseAll, registerVideo, unregisterVideo } = useMediaPlayback();
  useEffect(() => { const video = videoRef.current; if (!video) return; registerVideo(video); return () => unregisterVideo(video); }, [started, registerVideo, unregisterVideo]);
  if (!daughterMessage.enabled) {
    return (
      <section id="daughter" className="story-section daughter-atmosphere flex min-h-[72svh] items-center justify-center">
        <AmbientParticles mood="daughter" />
        <div className="mx-auto flex max-w-xl flex-col items-center px-6 text-center">
          <span className="font-handwritten text-3xl text-deepred-300">and then...</span>
          <h1 className="mt-5 font-display text-5xl text-cream-50 md:text-7xl">one more message</h1>
          <p className="mt-8 max-w-sm font-body leading-relaxed text-cream-200/65">A small voice is being kept for the right moment.</p>
        </div>
      </section>
    );
  }

  const play = () => {
    setStarted(true); pauseAll();
    window.setTimeout(() => videoRef.current?.play().catch(() => setMissing(true)), 100);
  };

  return (
    <section id="daughter" ref={ref} className="story-section daughter-atmosphere">
      <AmbientParticles mood="daughter" />
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <motion.div initial={reduced || !visible ? {} : { opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: .8 }} className="flex flex-col items-center gap-4 text-center">
          <span className="font-handwritten text-2xl leading-none text-deepred-300 md:text-3xl">and then...</span>
          <h2 className="font-display text-4xl font-medium tracking-[-.05em] text-cream-50 md:text-6xl">{daughterMessage.heading || 'one more message...'}</h2>
          <p className="max-w-sm font-body text-base leading-relaxed text-cream-200/60 md:text-lg">{daughterMessage.introText || 'A message made especially for you.'}</p>
        </motion.div>
        <motion.div initial={reduced || !visible ? {} : { opacity: 0, scale: .97, y: 24 }} animate={visible ? { opacity: 1, scale: 1, y: 0 } : {}} transition={{ delay: .25, duration: .9 }} className="mt-20 w-full max-w-lg">
          {missing ? <MediaFallback message="This special message is being saved for the right moment." /> : started ? (
            <div className="overflow-hidden bg-matcha-900 outline outline-1 outline-offset-8 outline-deepred-500/50"><video ref={videoRef} src={daughterMessage.video?.src} poster={daughterMessage.poster || daughterMessage.video?.poster} controls playsInline preload="metadata" className="aspect-[4/5] w-full bg-matcha-800 object-cover" onError={() => setMissing(true)} onPlay={pauseAll} /></div>
          ) : <VideoReveal onPlay={play} />}
        </motion.div>
        {daughterMessage.caption && <motion.p initial={reduced || !visible ? {} : { opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: .6 }} className="mt-20 font-handwritten text-xl leading-none text-deepred-300 md:text-2xl">{daughterMessage.caption}</motion.p>}
      </div>
    </section>
  );
};
