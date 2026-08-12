import React from 'react';

export const AgeMotif: React.FC<{ tone: 'dark' | 'paper' | 'quiet'; className?: string }> = ({ tone, className = '' }) => (
  <span aria-hidden="true" className={`age-motif age-motif--${tone} ${className}`}>31</span>
);
