import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MediaFallback } from '@/components/ui/Media';
import { IconButton, Pause, Play } from '@/components/ui/primitives';
import { AmbientParticles } from '@/components/ui/AmbientParticles';
import { AgeMotif } from '@/components/ui/AgeMotif';
import { useIntersectionObserver, useMediaPlayback, useReducedMotion } from '@/hooks';
import { daughterMessage } from '@/data/special';

export const DaughterSection: React.FC = () => {
  const reduced = useReducedMotion();
  const { ref, visible } = useIntersectionObserver<HTMLElement>();
  const [started] = React.useState(true);
  const [missing, setMissing] = React.useState(!daughterMessage.video?.enabled || !daughterMessage.video.src);
  const [videoPlaying, setVideoPlaying] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { registerVideo, unregisterVideo } = useMediaPlayback();
  useEffect(() => { const video = videoRef.current; if (!video) return; registerVideo(video); return () => unregisterVideo(video); }, [started, registerVideo, unregisterVideo]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visible) return;
    video.muted = false;
    video.volume = 1;
    void video.play().catch(() => {
      // Some embedded browsers prohibit audible autoplay until the route was reached by a user gesture.
    });
  }, [visible]);
  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      video.volume = 1;
      void video.play().catch(() => setVideoPlaying(false));
      return;
    }
    video.pause();
  };
  if (!daughterMessage.enabled) {
    return (
      <section id="daughter" className="story-section daughter-atmosphere flex min-h-[72svh] items-center justify-center">
        <AmbientParticles mood="daughter" />
        <AgeMotif tone="quiet" variant="whisper" />
        <div className="mx-auto flex max-w-xl flex-col items-center px-6 text-center">
          <span className="font-handwritten text-3xl text-deepred-300">and then...</span>
          <h1 className="mt-5 font-display text-5xl text-cream-50 md:text-7xl">one more message</h1>
          <p className="mt-8 max-w-sm font-body leading-relaxed text-cream-200/65">A small voice is being kept for the right moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="daughter" ref={ref} className="story-section daughter-atmosphere">
      <AmbientParticles mood="daughter" />
      <AgeMotif tone="quiet" variant="whisper" />
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <motion.div initial={reduced || !visible ? {} : { opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: .8 }} className="flex flex-col items-center gap-4 text-center">
          <span className="font-handwritten text-2xl leading-none text-deepred-300 md:text-3xl">and then...</span>
          <h2 className="font-display text-4xl font-medium tracking-[-.05em] text-cream-50 md:text-6xl">{daughterMessage.heading || 'one more message...'}</h2>
          <p className="max-w-sm font-body text-base leading-relaxed text-cream-200/60 md:text-lg">{daughterMessage.introText || 'A message made especially for you.'}</p>
        </motion.div>
        <motion.div initial={reduced || !visible ? {} : { opacity: 0, scale: .97, y: 24 }} animate={visible ? { opacity: 1, scale: 1, y: 0 } : {}} transition={{ delay: .25, duration: .9 }} className="mt-20 w-full max-w-lg">
          {missing ? <MediaFallback message="This special message is being saved for the right moment." /> : (
            <div className="daughter-video-frame overflow-hidden outline outline-1 outline-offset-8 outline-deepred-500/50"><video ref={videoRef} src={daughterMessage.video?.src} poster={daughterMessage.poster || daughterMessage.video?.poster} autoPlay loop playsInline preload="auto" className="relative z-[1] aspect-[4/5] w-full bg-transparent object-cover" onCanPlay={() => { const video = videoRef.current; if (video) { video.muted = false; video.volume = 1; void video.play().catch(() => {}); } }} onPlay={() => setVideoPlaying(true)} onPause={() => setVideoPlaying(false)} onError={() => setMissing(true)} /><IconButton icon={videoPlaying ? Pause : Play} size="sm" variant="solid" label={videoPlaying ? 'Pause birthday video' : 'Play birthday video'} className="absolute bottom-3 right-3 z-[2] !bg-matcha-950/80 !text-cream-50 backdrop-blur-md hover:!bg-matcha-800" onClick={toggleVideo} /></div>
          )}
        </motion.div>
        {daughterMessage.caption && <motion.p initial={reduced || !visible ? {} : { opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: .6 }} className="mt-20 font-handwritten text-xl leading-none text-deepred-300 md:text-2xl">{daughterMessage.caption}</motion.p>}
      </div>
    </section>
  );
};
