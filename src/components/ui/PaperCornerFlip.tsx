import React, { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

const PaperSheet = React.forwardRef<HTMLDivElement, { tone: 'front' | 'back' }>(({ tone }, ref) => (
  <div ref={ref} className={`paper-corner-flip__sheet paper-corner-flip__sheet--${tone}`} />
));
PaperSheet.displayName = 'PaperSheet';

export const PaperCornerFlip: React.FC = () => {
  const bookRef = useRef<any>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const flipTimer = window.setTimeout(() => bookRef.current?.pageFlip()?.flipNext('bottom'), 80);
    const finishTimer = window.setTimeout(() => setFinished(true), 820);
    return () => {
      window.clearTimeout(flipTimer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  if (finished) return null;

  return (
    <div aria-hidden="true" className="paper-corner-flip">
      <HTMLFlipBook
        ref={bookRef}
        width={164}
        height={224}
        minWidth={164}
        maxWidth={164}
        minHeight={224}
        maxHeight={224}
        size="fixed"
        startPage={0}
        drawShadow
        flippingTime={650}
        usePortrait
        startZIndex={80}
        autoSize={false}
        maxShadowOpacity={.38}
        showCover={false}
        mobileScrollSupport
        clickEventForward={false}
        useMouseEvents={false}
        swipeDistance={30}
        showPageCorners={false}
        disableFlipByClick
        className="paper-corner-flip__book"
        style={{}}
      >
        <PaperSheet tone="front" />
        <PaperSheet tone="back" />
      </HTMLFlipBook>
    </div>
  );
};
