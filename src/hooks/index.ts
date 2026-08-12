import { useState, useEffect, useRef, useCallback } from 'react';
import type { CountdownValues } from '@/types';
import { calculateCountdown, getTargetTimestamp } from '@/lib/countdown';

export function useCountdown(birthdayDate: string): CountdownValues {
  const targetRef = useRef(getTargetTimestamp(birthdayDate));

  const [values, setValues] = useState<CountdownValues>(() =>
    calculateCountdown(targetRef.current)
  );

  useEffect(() => {
    const tick = () => {
      setValues(calculateCountdown(targetRef.current));
    };

    const intervalId = setInterval(tick, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        tick();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return values;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, []);

  return reduced;
}

export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (locked) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [locked]);
}

export function useFocusReturn(
  active: boolean
): {
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  returnFocus: () => void;
} {
  const triggerRef = useRef<HTMLElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (active) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
    }
  }, [active]);

  const returnFocus = useCallback(() => {
    (previouslyFocused.current || triggerRef.current)?.focus?.();
  }, []);

  return { triggerRef, returnFocus };
}

export function useMediaPlayback(): {
  pauseAll: () => void;
  registerAudio: (el: HTMLAudioElement | null) => void;
  registerVideo: (el: HTMLVideoElement | null) => void;
  unregisterAudio: (el: HTMLAudioElement | null) => void;
  unregisterVideo: (el: HTMLVideoElement | null) => void;
} {
  const audios = useRef<Set<HTMLAudioElement>>(new Set());
  const videos = useRef<Set<HTMLVideoElement>>(new Set());

  const pauseAll = useCallback(() => {
    audios.current.forEach((a) => {
      try {
        a.pause();
      } catch {
        /* noop */
      }
    });
    videos.current.forEach((v) => {
      try {
        v.pause();
      } catch {
        /* noop */
      }
    });
  }, []);

  return {
    pauseAll,
    registerAudio: (el) => el && audios.current.add(el),
    registerVideo: (el) => el && videos.current.add(el),
    unregisterAudio: (el) => el && audios.current.delete(el),
    unregisterVideo: (el) => el && videos.current.delete(el),
  };
}

export function useMediaRegistry(): {
  pauseAll: () => void;
  register: (el: HTMLMediaElement | null) => void;
  unregister: (el: HTMLMediaElement | null) => void;
} {
  const media = useRef<Set<HTMLMediaElement>>(new Set());

  const pauseAll = useCallback(() => {
    media.current.forEach((element) => {
      try {
        element.pause();
      } catch {
        /* noop */
      }
    });
  }, []);

  const register = useCallback((element: HTMLMediaElement | null) => {
    if (element) media.current.add(element);
  }, []);
  const unregister = useCallback((element: HTMLMediaElement | null) => {
    if (element) media.current.delete(element);
  }, []);

  return { pauseAll, register, unregister };
}

export function useIntersectionObserver<T extends Element>(
  options?: IntersectionObserverInit
): {
  ref: React.MutableRefObject<T | null>;
  visible: boolean;
} {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.rootMargin, options?.threshold]);

  return { ref, visible };
}
