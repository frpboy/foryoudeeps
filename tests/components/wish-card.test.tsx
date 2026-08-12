import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WishCard } from '@/sections/WishesSection';
import { ResponsiveImage } from '@/components/ui/Media';
import type { Wish } from '@/types';

const mediaHandlers = {
  pauseAllMedia: vi.fn(),
  registerMedia: vi.fn(),
  unregisterMedia: vi.fn(),
};

const baseWish: Wish = { id: 'wish-1', name: 'Contributor', order: 1, enabled: true };

function renderWish(wish: Wish) {
  return render(<WishCard wish={wish} index={0} reduced pauseAllMedia={mediaHandlers.pauseAllMedia} registerMedia={mediaHandlers.registerMedia} unregisterMedia={mediaHandlers.unregisterMedia} />);
}

describe('WishCard', () => {
  it('renders a text-only wish without empty media blocks', () => {
    renderWish({ ...baseWish, text: 'A contributor-approved message.' });
    expect(screen.getByRole('heading', { name: 'Contributor' })).toBeInTheDocument();
    expect(screen.getByText('A contributor-approved message.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
  });

  it('renders photo, audio, and video controls only when the typed media is present', () => {
    renderWish({
      ...baseWish,
      text: 'A mixed wish.',
      photo: { id: 'photo', type: 'image', src: '/media/wishes/photo.webp', alt: 'Contributor photo', order: 1, enabled: true },
      audio: { id: 'audio', type: 'audio', src: '/media/wishes/audio.mp3', order: 2, enabled: true },
      video: { id: 'video', type: 'video', src: '/media/wishes/video.mp4', order: 3, enabled: true },
    });
    expect(screen.getByAltText('Contributor photo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play contributor's voice message/i })).toBeInTheDocument();
    expect(document.querySelector('video')).toHaveAttribute('playsinline');
  });

  it('replaces a failed image with the graceful media fallback', () => {
    render(<ResponsiveImage src="/media/gallery/missing.webp" alt="Missing memory" />);
    fireEvent.error(screen.getByAltText('Missing memory'));
    expect(screen.getByText('Memory unavailable')).toBeInTheDocument();
  });
});
