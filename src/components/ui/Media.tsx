import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lazy?: boolean;
  aspect?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  fit?: 'cover' | 'contain';
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  lazy = true,
  aspect,
  rounded = 'lg',
  fit = 'cover',
  className = '',
  ...props
}) => {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    none: 'rounded-none',
  };
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';

  if (errored) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-matcha-800/40 border border-cream-100/5 text-muted ${roundedClasses[rounded]} ${aspect ? '' : 'p-8'} ${className}`}
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        <ImageOff size={32} className="mb-2 opacity-60" />
        <span className="text-sm font-body">Memory unavailable</span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-matcha-800/20 ${roundedClasses[rounded]} ${aspect ? '' : ''} ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-matcha-800/30 via-matcha-900/20 to-matcha-800/30 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        onError={() => setErrored(true)}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full ${fitClass} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};

interface MediaFallbackProps {
  message?: string;
  className?: string;
}

export const MediaFallback: React.FC<MediaFallbackProps> = ({
  message = 'This memory is taking a little break.',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl bg-matcha-800/40 border border-cream-100/5 p-8 text-center ${className}`}
    >
      <ImageOff size={36} className="text-muted" />
      <p className="font-body text-sm text-cream-200/60">{message}</p>
    </div>
  );
};
