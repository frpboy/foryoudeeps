import { describe, expect, it } from 'vitest';
import { filterEnabled, getWishVariant, isWishEmpty, sortByOrder, validateNoDuplicateIds } from '@/lib/media';
import type { Wish } from '@/types';

const baseWish: Wish = { id: 'wish', name: 'A', order: 1, enabled: true };

describe('media utilities', () => {
  it('selects content-aware wish variants', () => {
    expect(getWishVariant({ ...baseWish, text: 'Hello' })).toBe('text-only');
    expect(getWishVariant({ ...baseWish, photo: { id: 'photo', type: 'image', src: '/media/wishes/photo.webp', alt: 'A', order: 1, enabled: true } })).toBe('photo-only');
    expect(getWishVariant({ ...baseWish, text: 'Hello', audio: { id: 'audio', type: 'audio', src: '/media/wishes/audio.mp3', order: 1, enabled: true } })).toBe('audio-text');
  });

  it('keeps enabled content in deterministic order and rejects duplicate IDs', () => {
    const items = [{ id: 'b', order: 2, enabled: true }, { id: 'a', order: 1, enabled: true }, { id: 'x', order: 3, enabled: false }];
    expect(sortByOrder(filterEnabled(items)).map((item) => item.id)).toEqual(['a', 'b']);
    expect(validateNoDuplicateIds(items)).toBe(true);
    expect(validateNoDuplicateIds([{ id: 'same' }, { id: 'same' }])).toBe(false);
  });

  it('identifies wishes with no publishable content', () => {
    expect(isWishEmpty(baseWish)).toBe(true);
    expect(isWishEmpty({ ...baseWish, text: 'Approved note' })).toBe(false);
  });
});
