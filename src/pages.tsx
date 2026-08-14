import React, { useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowDown, ChevronLeft, ChevronRight } from '@/components/ui/primitives';
import { ResponsiveImage } from '@/components/ui/Media';
import { galleryItems } from '@/data/gallery';
import { wishes } from '@/data/wishes';
import { filterEnabled, sortByOrder } from '@/lib/media';
import { useReducedMotion } from '@/hooks';
import { AgeMotif } from '@/components/ui/AgeMotif';
import { AmbientParticles } from '@/components/ui/AmbientParticles';

export const StoryPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduced = useReducedMotion();
  return <motion.main initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? .01 : .42, ease: [0.22, 1, 0.36, 1] }} className="scene-page">{children}</motion.main>;
};

export const StoryAction: React.FC<{ to: string; children: React.ReactNode; tone?: 'light' | 'dark' }> = ({ to, children, tone = 'light' }) => (
  <div className="scene-action"><Link to={to} className={`group inline-flex items-center gap-3 px-5 py-3 font-body text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepred-500 ${tone === 'dark' ? 'text-ink/65 hover:text-ink' : 'text-cream-200/70 hover:text-cream-50'}`}><span>{children}</span><ArrowDown size={17} className="transition-transform group-hover:translate-x-1 -rotate-90" /></Link></div>
);

function GalleryMedia({ item }: { item: typeof galleryItems[number] }) {
  if (item.media.type === 'video') return <video src={item.media.src} poster={item.media.poster} autoPlay muted loop playsInline preload="metadata" className="max-h-[72svh] w-full object-contain" />;
  return <ResponsiveImage src={item.media.src} alt={item.media.alt || ''} lazy={false} rounded="none" className="max-h-[72svh] w-full" />;
}

export const RoutedGalleryDetail: React.FC<{ to: (path: string) => string }> = ({ to }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const items = sortByOrder(filterEnabled(galleryItems)).filter((item) => item.media.enabled);
  const index = items.findIndex((item) => item.id === id);
  const item = items[index];
  const prev = index > 0 ? items[index - 1] : undefined;
  const next = index < items.length - 1 ? items[index + 1] : undefined;
  const start = useRef<{ x: number; y: number; blocked: boolean } | null>(null);
  const isInteractive = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest('button, a, video, audio, input, textarea, select, [role="slider"]'));
  const move = useCallback((direction: -1 | 1) => {
    const candidate = direction < 0 ? prev : next;
    if (candidate) navigate(to(`/gallery/${candidate.id}`));
  }, [navigate, next, prev, to]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (!isInteractive(event.target) && event.key === 'ArrowLeft') move(-1); else if (!isInteractive(event.target) && event.key === 'ArrowRight') move(1); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [move]);
  useEffect(() => { if (next?.media.type === 'image') { const preload = new Image(); preload.src = next.media.src; } }, [next]);
  if (!item) return <StoryFallback birthdayAvailable to={to} />;
  return <StoryPage><section onTouchStart={(e) => { start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, blocked: isInteractive(e.target) }; }} onTouchEnd={(e) => { const gesture = start.current; start.current = null; if (!gesture || gesture.blocked) return; const dx = e.changedTouches[0].clientX - gesture.x; const dy = e.changedTouches[0].clientY - gesture.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); }} className="gallery-atmosphere scene-detail"><AmbientParticles mood="gallery" /><AgeMotif tone="quiet" className="age-motif--signature" /><div className="scene-detail__content"><Link to={to('/gallery')} className="inline-flex items-center gap-2 font-body text-sm text-cream-200/70 hover:text-cream-50"><ChevronLeft size={17} /> back to memories</Link><div className="scene-detail__media mt-5 overflow-hidden bg-matcha-950 shadow-modal"><GalleryMedia item={item} /></div><div className="mt-4 flex flex-wrap items-end justify-between gap-3"><div>{item.dateLabel && <p className="font-handwritten text-xl text-deepred-300">{item.dateLabel}</p>}{item.caption && <p className="mt-1 max-w-xl font-body text-sm leading-relaxed text-cream-100 md:text-base">{item.caption}</p>}</div><p className="font-mono text-xs text-cream-200/45">{index + 1} / {items.length}</p></div><div className="mt-5 flex justify-between"><button type="button" disabled={!prev} onClick={() => move(-1)} className="inline-flex items-center gap-2 font-body text-sm text-cream-200/70 disabled:opacity-20"><ChevronLeft size={18} /> previous</button><button type="button" disabled={!next} onClick={() => move(1)} className="inline-flex items-center gap-2 font-body text-sm text-cream-200/70 disabled:opacity-20">next <ChevronRight size={18} /></button></div></div></section></StoryPage>;
};

export const RoutedWishDetail: React.FC<{ to: (path: string) => string }> = ({ to }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const entries = sortByOrder(filterEnabled(wishes));
  const index = entries.findIndex((entry) => entry.id === id);
  const wish = entries[index];
  const previous = index > 0 ? entries[index - 1] : undefined;
  const next = index < entries.length - 1 ? entries[index + 1] : undefined;
  const start = useRef<{ x: number; y: number; blocked: boolean } | null>(null);
  const isInteractive = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest('button, a, video, audio, input, textarea, select, [role="slider"]'));
  const move = useCallback((direction: -1 | 1) => {
    const candidate = direction < 0 ? previous : next;
    if (candidate) navigate(to(`/wishes/${candidate.id}`));
  }, [navigate, next, previous, to]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (!isInteractive(event.target) && event.key === 'ArrowLeft') move(-1); else if (!isInteractive(event.target) && event.key === 'ArrowRight') move(1); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [move]);
  if (!wish) return <StoryFallback birthdayAvailable to={to} />;
  return <StoryPage><section onTouchStart={(event) => { start.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, blocked: isInteractive(event.target) }; }} onTouchEnd={(event) => { const gesture = start.current; start.current = null; if (!gesture || gesture.blocked) return; const dx = event.changedTouches[0].clientX - gesture.x; const dy = event.changedTouches[0].clientY - gesture.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); }} className="wishes-atmosphere scene-detail"><AmbientParticles mood="wishes" /><div className="scene-detail__content"><Link to={to('/wishes')} className="inline-flex items-center gap-2 font-body text-sm text-ink/60 hover:text-ink"><ChevronLeft size={17} /> back to wishes</Link><article className="paper-edge card-cream mt-5 p-5 md:p-7"><h1 className="font-display text-3xl text-ink md:text-4xl">{wish.name}</h1>{wish.relationship && <p className="mt-1 font-handwritten text-xl text-deepred-700">{wish.relationship}</p>}{wish.photo?.enabled && <ResponsiveImage src={wish.photo.src} alt={wish.photo.alt || wish.name} className="mt-4 max-h-[36dvh]" aspect="4 / 5" />}{wish.text && <p className="mt-4 font-body text-sm leading-relaxed text-ink md:text-base">{wish.text}</p>}{wish.video?.enabled && <video src={wish.video.src} controls playsInline preload="metadata" className="mt-4 max-h-[36dvh] w-full" />}{wish.audio?.enabled && <audio src={wish.audio.src} controls preload="metadata" className="mt-4 w-full" />}</article><nav aria-label="Wish navigation" className="mt-5 flex justify-between"><button type="button" disabled={!previous} onClick={() => move(-1)} className="inline-flex items-center gap-2 font-body text-sm text-ink/65 disabled:opacity-25"><ChevronLeft size={18} /> previous</button><button type="button" disabled={!next} onClick={() => move(1)} className="inline-flex items-center gap-2 font-body text-sm text-ink/65 disabled:opacity-25">next <ChevronRight size={18} /></button></nav></div></section></StoryPage>;
};

export const StoryFallback: React.FC<{ birthdayAvailable: boolean; to: (path: string) => string }> = ({ birthdayAvailable, to }) => <StoryPage><section className="final-atmosphere scene-detail justify-center px-6 text-center"><div><p className="font-handwritten text-3xl text-deepred-300">a small wrong turn</p><h1 className="mt-5 font-display text-5xl text-cream-50">Looks like you wandered somewhere that isn’t part of the surprise.</h1><Link to={birthdayAvailable ? to('/birthday') : '/'} className="mt-10 inline-block font-body text-cream-200/70 hover:text-cream-50">take me back</Link></div></section></StoryPage>;
