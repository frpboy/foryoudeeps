import React from 'react';
import { X, Heart, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, ArrowDown, Maximize } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'solid' | 'cream' | 'red';
  label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  size = 'md',
  variant = 'ghost',
  label,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };
  const variantClasses = {
    ghost: 'bg-transparent text-cream-100 hover:bg-matcha-800/60 active:bg-matcha-700/60',
    solid: 'bg-matcha-700 text-cream-100 hover:bg-matcha-600 active:bg-matcha-500 shadow-soft',
    cream: 'bg-cream-100 text-matcha-950 hover:bg-cream-200 active:bg-cream-300 shadow-card',
    red: 'bg-deepred-700 text-cream-50 hover:bg-deepred-500 active:bg-deepred-800 shadow-card',
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepred-500 focus-visible:ring-offset-2 focus-visible:ring-offset-matcha-900 disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <Icon size={iconSizes[size]} strokeWidth={2} />
    </button>
  );
};

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  accent?: boolean;
  tone?: 'light' | 'dark';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  accent = true,
  tone = 'light',
}) => {
  const alignClasses = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-3 max-w-2xl w-full ${alignClasses}`}>
      {eyebrow && (
        <span className={`font-handwritten text-xl md:text-2xl leading-none ${tone === 'light' ? 'text-deepred-500' : 'text-deepred-700'}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-balance leading-[1.02] text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.045em] ${tone === 'light' ? 'text-cream-100' : 'text-ink'}`}>
        {accent ? (
          <>
            {title.split(' ').map((word, i) =>
              i === title.split(' ').length - 1 ? (
                <span key={i} className={tone === 'light' ? 'text-deepred-500' : 'text-deepred-700'}>
                  {' '}{word}
                </span>
              ) : (
                <span key={i}>{i === 0 ? '' : ' '}{word}</span>
              )
            )}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className={`font-body text-base md:text-lg leading-relaxed max-w-xl ${tone === 'light' ? 'text-cream-200/70' : 'text-ink/65'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

interface DecorativeHeartProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const DecorativeHeart: React.FC<DecorativeHeartProps> = ({ size = 'md', className = '', style }) => {
  const sizes = { sm: 12, md: 20, lg: 32 };
  return (
    <Heart
      size={sizes[size]}
      className={`text-deepred-500 fill-deepred-700/30 ${className}`}
      style={style}
      strokeWidth={1.5}
    />
  );
};

interface DecorativeLeafProps {
  className?: string;
  rotation?: number;
}

export const DecorativeLeaf: React.FC<DecorativeLeafProps> = ({ className = '', rotation = 0 }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-matcha-500/50 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      width="24"
      height="24"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.9C9.8 4.8 10.7 2 13 2c2.5 0 8 4 8 10s-4.5 9-10 9c-1.7 0-3-.3-4.2-.9C5.9 19.5 3.7 18 2 17c2.4-1 7-1 9 3z" />
    </svg>
  );
};

interface PaperNoteProps {
  children: React.ReactNode;
  rotation?: number;
  className?: string;
  tone?: 'cream' | 'matcha';
}

export const PaperNote: React.FC<PaperNoteProps> = ({
  children,
  rotation = 0,
  className = '',
  tone = 'cream',
}) => {
  const toneClasses =
    tone === 'cream'
      ? 'card-cream shadow-card border border-cream-200/50'
      : 'card-matcha shadow-card';

  return (
    <div
      className={`paper-edge relative p-5 md:p-7 ${toneClasses} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="absolute -top-2 left-1/2 h-3 w-14 -translate-x-1/2 bg-deepred-700/10" />
      {children}
    </div>
  );
};

export { X, Heart, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, ArrowDown, Maximize };
export type { LucideIcon };
