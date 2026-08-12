import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowDown, ChevronLeft, ChevronRight } from '@/components/ui/primitives';
import { ResponsiveImage } from '@/components/ui/Media';
import { galleryItems } from '@/data/gallery';
import { wishes } from '@/data/wishes';
import { filterEnabled, sortByOrder } from '@/lib/media';
import { useReducedMotion } from '@/hooks';

export const StoryPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduced = useReducedMotion();
  return <motion.main initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? .01 : .42, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.main>;
};

export const StoryAction: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <div className="-mt-12 flex justify-center pb-24"><Link to={to} className="group inline-flex items-center gap-3 px-5 py-3 font-body text-sm text-cream-200/70 transition-colors hover:text-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepred-500"><span>{children}</span><ArrowDown size={17} className="transition-transform group-hover:translate-x-1 -rotate-90" /></Link></div>
);

function GalleryMedia({ item }: { item: typeof galleryItems[number] }) {
  if (item.media.type === 'video') return <video src={item.media.src} poster={item.media.poster} controls playsInline preload="metadata" className="max-h-[72svh] w-full object-contain" />;
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
  useEffect(() => { if (next?.media.type === 'image') { const preload = new Image(); preload.src = next.media.src; } }, [next]);
  if (!item) return <StoryFallback birthdayAvailable to={to} />;
  return <StoryPage><section className="gallery-atmosphere min-h-[100svh] px-5 py-10 md:px-12 md:py-16"><div className="mx-auto max-w-6xl"><Link to={to('/gallery')} className="inline-flex items-center gap-2 font-body text-sm text-cream-200/70 hover:text-cream-50"><ChevronLeft size={17} /> back to memories</Link><div className="mt-10 overflow-hidden bg-matcha-950 shadow-modal"><GalleryMedia item={item} /></div><div className="mt-7 flex flex-wrap items-end justify-between gap-5"><div>{item.dateLabel && <p className="font-handwritten text-xl text-deepred-300">{item.dateLabel}</p>}{item.caption && <p className="mt-2 max-w-xl font-body leading-relaxed text-cream-100">{item.caption}</p>}</div><p className="font-mono text-xs text-cream-200/45">{index + 1} / {items.length}</p></div><div className="mt-12 flex justify-between"><button type="button" disabled={!prev} onClick={() => prev && navigate(to(`/gallery/${prev.id}`))} className="inline-flex items-center gap-2 font-body text-sm text-cream-200/70 disabled:opacity-20"><ChevronLeft size={18} /> previous</button><button type="button" disabled={!next} onClick={() => next && navigate(to(`/gallery/${next.id}`))} className="inline-flex items-center gap-2 font-body text-sm text-cream-200/70 disabled:opacity-20">next <ChevronRight size={18} /></button></div></div></section></StoryPage>;
};

export const RoutedWishDetail: React.FC<{ to: (path: string) => string }> = ({ to }) => {
  const { id } = useParams();
  const wish = filterEnabled(wishes).find((entry) => entry.id === id);
  if (!wish) return <StoryFallback birthdayAvailable to={to} />;
  return <StoryPage><section className="wishes-atmosphere min-h-[100svh] px-5 py-12 md:px-12"><div className="mx-auto max-w-2xl"><Link to={to('/wishes')} className="inline-flex items-center gap-2 font-body text-sm text-ink/60 hover:text-ink"><ChevronLeft size={17} /> back to wishes</Link><article className="paper-edge card-cream mt-12 p-7 md:p-10"><h1 className="font-display text-4xl text-ink">{wish.name}</h1>{wish.relationship && <p className="mt-2 font-handwritten text-2xl text-deepred-700">{wish.relationship}</p>}{wish.photo?.enabled && <ResponsiveImage src={wish.photo.src} alt={wish.photo.alt || wish.name} className="mt-7" aspect="4 / 5" />}{wish.text && <p className="mt-7 font-body leading-relaxed text-ink">{wish.text}</p>}{wish.video?.enabled && <video src={wish.video.src} controls playsInline preload="metadata" className="mt-7 w-full" />}{wish.audio?.enabled && <audio src={wish.audio.src} controls preload="metadata" className="mt-7 w-full" />}</article></div></section></StoryPage>;
};

export const StoryFallback: React.FC<{ birthdayAvailable: boolean; to: (path: string) => string }> = ({ birthdayAvailable, to }) => <StoryPage><section className="final-atmosphere flex min-h-[100svh] items-center justify-center px-6 text-center"><div><p className="font-handwritten text-3xl text-deepred-300">a small wrong turn</p><h1 className="mt-5 font-display text-5xl text-cream-50">Looks like you wandered somewhere that isn’t part of the surprise.</h1><Link to={birthdayAvailable ? to('/birthday') : '/'} className="mt-10 inline-block font-body text-cream-200/70 hover:text-cream-50">take me back</Link></div></section></StoryPage>;
