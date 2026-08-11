import React, { useState, useEffect, useCallback } from 'react';
import { CountdownSection } from '@/sections/CountdownSection';
import { BirthdayRevealSection } from '@/sections/BirthdayRevealSection';
import { JourneySection } from '@/sections/JourneySection';
import { GallerySection } from '@/sections/GallerySection';
import { WishesSection } from '@/sections/WishesSection';
import { DaughterSection } from '@/sections/DaughterSection';
import { FinalWishSection } from '@/sections/FinalWishSection';
import { MusicController } from '@/components/music/MusicController';
import { siteConfig } from '@/data/site';
import { isBirthday, getTargetTimestamp } from '@/lib/countdown';

const App: React.FC = () => {
  const [isBirthdayState, setIsBirthdayState] = useState<boolean>(() =>
    isBirthday(getTargetTimestamp(siteConfig.birthdayDate))
  );
  const [userInteracted, setUserInteracted] = useState(false);
  const [, setReplayTrigger] = useState(0);

  const markInteracted = useCallback(() => setUserInteracted(true), []);

  useEffect(() => {
    const check = () => {
      setIsBirthdayState(isBirthday(getTargetTimestamp(siteConfig.birthdayDate)));
    };
    const onBirthday = () => {
      setIsBirthdayState(true);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };
    const intervalId = window.setInterval(check, 30000);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('birthday-start', onBirthday);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('birthday-start', onBirthday);
    };
  }, []);

  useEffect(() => {
    const onFirstInteraction = () => {
      markInteracted();
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
    };
    window.addEventListener('click', onFirstInteraction);
    window.addEventListener('keydown', onFirstInteraction);
    window.addEventListener('touchstart', onFirstInteraction);
    return () => {
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
    };
  }, [markInteracted]);

  const showCountdown = !isBirthdayState && siteConfig.showCountdown;

  return (
    <div className="relative min-h-screen bg-matcha-900">
      {showCountdown ? (
        <CountdownSection onEnter={markInteracted} userHasInteracted={userInteracted} />
      ) : (
        <main key={isBirthdayState ? 'birthday' : 'countdown'}>
          {siteConfig.showCountdown && !isBirthdayState ? null : (
            <>
              <BirthdayRevealSection onContinue={markInteracted} />
              {siteConfig.showJourney && <JourneySection />}
              {siteConfig.showGallery && <GallerySection />}
              {siteConfig.showWishes && <WishesSection />}
              {siteConfig.showDaughterMessage && <DaughterSection />}
              {siteConfig.showFinal && (
                <FinalWishSection
                  onReplay={() => {
                    markInteracted();
                    setReplayTrigger((n) => n + 1);
                  }}
                />
              )}
            </>
          )}
        </main>
      )}
      {siteConfig.showMusic && (
        <MusicController
          enabled={siteConfig.showMusic}
          userInteracted={userInteracted}
        />
      )}
    </div>
  );
};

export default App;
