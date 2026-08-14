import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CountdownSection } from '@/sections/CountdownSection';
import { BirthdayRevealSection } from '@/sections/BirthdayRevealSection';
import { JourneySection } from '@/sections/JourneySection';
import { GallerySection } from '@/sections/GallerySection';
import { WishesSection } from '@/sections/WishesSection';
import { LetterSection } from '@/sections/LetterSection';
import { DaughterSection } from '@/sections/DaughterSection';
import { FinalWishSection } from '@/sections/FinalWishSection';
import { MusicController } from '@/components/music/MusicController';
import { siteConfig } from '@/data/site';
import { getTargetTimestamp, isBirthday } from '@/lib/countdown';
import { RoutedGalleryDetail, RoutedWishDetail, StoryAction, StoryFallback, StoryPage } from '@/pages';

function hasBirthdayPreview(search: string) {
  const params = new URLSearchParams(search);
  return params.get('preview') === 'birthday' || params.has('preview-birthday');
}

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [birthdayNow, setBirthdayNow] = useState(() => isBirthday(getTargetTimestamp(siteConfig.birthdayDate)));
  const [userInteracted, setUserInteracted] = useState(false);
  const preview = hasBirthdayPreview(location.search);
  const birthdayAvailable = preview || birthdayNow;
  const to = useCallback((path: string) => `${path}${preview ? '?preview=birthday' : ''}`, [preview]);
  const markInteracted = useCallback(() => setUserInteracted(true), []);

  useEffect(() => {
    const viewport = window.visualViewport;
    const syncSceneHeight = () => document.documentElement.style.setProperty('--scene-height', `${window.innerHeight}px`);
    syncSceneHeight();
    viewport?.addEventListener('resize', syncSceneHeight);
    window.addEventListener('resize', syncSceneHeight);
    return () => {
      viewport?.removeEventListener('resize', syncSceneHeight);
      window.removeEventListener('resize', syncSceneHeight);
    };
  }, []);

  useEffect(() => {
    const check = () => setBirthdayNow(isBirthday(getTargetTimestamp(siteConfig.birthdayDate)));
    const onVisibility = () => document.visibilityState === 'visible' && check();
    const onBirthday = () => {
      setBirthdayNow(true);
      navigate(to('/birthday'), { replace: true });
    };
    const intervalId = window.setInterval(check, 30_000);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('birthday-start', onBirthday);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('birthday-start', onBirthday);
    };
  }, [navigate, to]);

  useEffect(() => {
    const onFirstInteraction = () => markInteracted();
    window.addEventListener('click', onFirstInteraction, { once: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });
    window.addEventListener('touchstart', onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
    };
  }, [markInteracted]);

  const guard = (content: React.ReactNode) => birthdayAvailable ? content : <Navigate to="/" replace />;
  const journey = ['/birthday', '/memories', '/gallery', '/wishes', '/letter', '/daughter', '/final'];
  const journeyIndex = journey.indexOf(location.pathname);
  const paperChapter = location.pathname === '/wishes' || location.pathname === '/letter';
  const previous = journeyIndex > 0 ? journey[journeyIndex - 1] : undefined;
  const next = journeyIndex >= 0 && journeyIndex < journey.length - 1 ? journey[journeyIndex + 1] : undefined;
  const touchStart = useRef<{ x: number; y: number; blocked: boolean } | null>(null);
  const isInteractive = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest('button, a, input, textarea, select, video, audio, [role="slider"], [contenteditable="true"]'));
  const go = useCallback((path?: string) => path && navigate(to(path)), [navigate, to]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isInteractive(event.target)) return;
      if (event.key === 'ArrowLeft') go(previous);
      if (event.key === 'ArrowRight') go(next);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, next, previous]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, blocked: isInteractive(event.target) };
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || start.blocked || journeyIndex < 0) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? next : previous);
  };
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (journeyIndex < 0 || isInteractive(event.target)) return;
    const x = event.clientX;
    const width = window.innerWidth;
    if (x <= width * .05) go(previous);
    if (x >= width * .95) go(next);
  };

  return (
    <div className="scene-app relative bg-matcha-900" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={onClick}>
      {preview && <div className="fixed left-1/2 top-3 z-[60] -translate-x-1/2 rounded-full border border-cream-100/15 bg-matcha-950/90 px-3 py-1 font-body text-xs text-cream-200/80 shadow-soft backdrop-blur">Birthday preview</div>}
      <Routes>
        <Route path="/" element={birthdayAvailable ? <Navigate to={to('/birthday')} replace /> : <CountdownSection onEnter={markInteracted} userHasInteracted={userInteracted} />} />
        <Route path="/birthday" element={guard(<StoryPage><BirthdayRevealSection onContinue={() => navigate(to('/memories'))} /></StoryPage>)} />
        <Route path="/memories" element={guard(<StoryPage><JourneySection /><StoryAction to={to('/gallery')}>see the memories</StoryAction></StoryPage>)} />
        <Route path="/gallery" element={guard(<StoryPage><GallerySection /><StoryAction to={to('/wishes')}>read their wishes</StoryAction></StoryPage>)} />
        <Route path="/gallery/:id" element={guard(<RoutedGalleryDetail to={to} />)} />
        <Route path="/wishes" element={guard(<StoryPage><WishesSection /><StoryAction to={to('/letter')} tone="dark">one more message</StoryAction></StoryPage>)} />
        <Route path="/wishes/:id" element={guard(<RoutedWishDetail to={to} />)} />
        <Route path="/letter" element={guard(<StoryPage><LetterSection /><StoryAction to={to('/daughter')} tone="dark">one more message</StoryAction></StoryPage>)} />
        <Route path="/daughter" element={guard(<StoryPage><DaughterSection /><StoryAction to={to('/final')}>one last thing</StoryAction></StoryPage>)} />
        <Route path="/final" element={guard(<StoryPage><FinalWishSection onReplay={() => navigate(to('/birthday'))} /></StoryPage>)} />
        <Route path="*" element={<StoryFallback birthdayAvailable={birthdayAvailable} to={to} />} />
      </Routes>
      {siteConfig.showMusic && <MusicController enabled={siteConfig.showMusic} userInteracted={userInteracted} />}
      {birthdayAvailable && journeyIndex >= 0 && location.pathname !== '/gallery' && <nav aria-label="Birthday story navigation" className="pointer-events-none fixed inset-x-5 top-1/2 z-50 hidden -translate-y-1/2 items-center justify-between md:flex">
        <button type="button" aria-label="Previous story page" disabled={!previous} onClick={() => go(previous)} className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-100/15 bg-matcha-950/65 font-body text-lg text-cream-100/75 backdrop-blur transition hover:bg-matcha-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepred-500 disabled:opacity-0">‹</button>
        <button type="button" aria-label="Next story page" disabled={!next} onClick={() => go(next)} className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-100/15 bg-matcha-950/65 font-body text-lg text-cream-100/75 backdrop-blur transition hover:bg-matcha-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepred-500 disabled:opacity-0">›</button>
      </nav>}
      {birthdayAvailable && journeyIndex >= 0 && <nav aria-label="Story progress" className={`story-chapter-progress ${preview ? 'story-chapter-progress--preview' : ''} ${paperChapter ? 'story-chapter-progress--paper' : ''}`}>
        <span className="story-chapter-progress__age">31</span>
        <span className="story-chapter-progress__line" aria-hidden="true"><span key={location.pathname} /></span>
      </nav>}
    </div>
  );
};

export default App;
