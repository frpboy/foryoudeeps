import React from 'react';
import { DecorativeHeart } from './primitives';

interface FutureContentProps {
  title: string;
  message: string;
}

export const FutureContent: React.FC<FutureContentProps> = ({ title, message }) => (
  <div className="editorial-empty mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
    <DecorativeHeart size="sm" className="opacity-75" />
    <h3 className="font-display text-3xl font-medium tracking-[-0.04em] text-cream-100 md:text-4xl">{title}</h3>
    <p className="max-w-md font-body leading-relaxed text-cream-200/65">{message}</p>
  </div>
);
