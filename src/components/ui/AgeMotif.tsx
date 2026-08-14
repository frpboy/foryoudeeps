import React from 'react';

export const AgeMotif: React.FC<{ tone: 'dark' | 'paper' | 'quiet'; variant?: 'default' | 'chapter' | 'watermark' | 'behind-paper' | 'whisper' | 'return'; className?: string }> = ({ tone, variant = 'default', className = '' }) => (
  <span aria-hidden="true" className={`age-motif age-motif--${tone} age-motif--${variant} ${className}`}>31</span>
);
