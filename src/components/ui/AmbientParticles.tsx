import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks';

type ParticleMood = 'birthday' | 'memories' | 'gallery' | 'wishes' | 'daughter' | 'final';

const positions = [
  [7, 12], [16, 76], [24, 31], [34, 88], [42, 16], [51, 63], [61, 8], [68, 44], [76, 82], [84, 23],
  [93, 66], [11, 48], [29, 57], [46, 38], [57, 91], [72, 14], [88, 48], [4, 91], [39, 6], [64, 73],
  [97, 36], [20, 94], [53, 27], [80, 61], [14, 22], [36, 70], [59, 51], [91, 9], [31, 42], [70, 96],
  [49, 83], [6, 65], [86, 88], [24, 4], [62, 30], [43, 54], [96, 77], [18, 63], [75, 35], [55, 14],
] as const;

const kindsByMood: Record<ParticleMood, readonly string[]> = {
  birthday: ['dot', 'heart', 'sparkle', 'dot', 'heart'],
  memories: ['dust', 'dust', 'sparkle', 'doodle'],
  gallery: ['dust', 'dot', 'dust', 'sparkle'],
  wishes: ['heart', 'dot', 'sparkle', 'heart'],
  daughter: ['dot', 'dust', 'dot'],
  final: ['dust', 'dot', 'sparkle'],
};

const foregroundKindsByMood: Record<ParticleMood, readonly string[]> = {
  birthday: ['sparkle', 'heart', 'sparkle'],
  memories: ['sparkle', 'doodle', 'sparkle'],
  gallery: ['sparkle', 'dot', 'sparkle'],
  wishes: ['heart', 'sparkle', 'heart'],
  daughter: ['sparkle', 'dot', 'sparkle'],
  final: ['sparkle', 'heart', 'sparkle'],
};

export const AmbientParticles: React.FC<{ mood: ParticleMood; className?: string }> = ({ mood, className = '' }) => {
  const reduced = useReducedMotion();
  const kinds = kindsByMood[mood];
  const foregroundKinds = foregroundKindsByMood[mood];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover)').matches) return;
    const onPointerMove = (event: PointerEvent) => {
      const root = containerRef.current;
      if (!root) return;
      root.style.setProperty('--ambient-pointer-x', `${((event.clientX / window.innerWidth) - .5) * 14}px`);
      root.style.setProperty('--ambient-pointer-y', `${((event.clientY / window.innerHeight) - .5) * 10}px`);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reduced]);

  return (
    <div ref={containerRef} aria-hidden="true" className={`ambient-particles ambient-particles--${mood} ${reduced ? 'ambient-particles--still' : ''} ${className}`}>
      <div className="ambient-particles__midground">
        {positions.map(([left, top], index) => (
          <span
            key={`${left}-${top}`}
            className={`ambient-particle ambient-particle--${kinds[index % kinds.length]}`}
            style={{ '--particle-left': `${left}%`, '--particle-top': `${top}%`, '--particle-delay': `${-(index % 9) * 0.73}s`, '--particle-duration': `${5.8 + (index % 7) * 0.64}s` } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="ambient-particles__foreground">
        {positions.filter((_, index) => index % 5 === 0).map(([left, top], index) => (
          <span
            key={`foreground-${left}-${top}`}
            className={`ambient-particle ambient-particle--foreground ambient-particle--${foregroundKinds[index % foregroundKinds.length]}`}
            style={{ '--particle-left': `${left}%`, '--particle-top': `${top}%`, '--particle-delay': `${-(index % 6) * 1.2}s`, '--particle-duration': `${7.5 + (index % 4) * .9}s` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};
