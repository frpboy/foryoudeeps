import React from 'react';
import { DecorativeHeart } from './primitives';

interface FutureContentProps {
  title: string;
  message: string;
}

export const FutureContent: React.FC<FutureContentProps> = ({ title, message }) => (
  <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-cream-100/10 bg-matcha-800/25 px-6 py-12 text-center shadow-soft">
    <DecorativeHeart size="md" className="opacity-80" />
    <h3 className="font-display text-2xl font-semibold text-cream-100">{title}</h3>
    <p className="max-w-md font-body leading-relaxed text-cream-200/70">{message}</p>
  </div>
);
