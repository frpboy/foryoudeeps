import type { MediaAsset, Wish, WishVariant } from '@/types';

export function getWishVariant(wish: Wish): WishVariant {
  const hasText = Boolean(wish.text?.trim());
  const hasPhoto = Boolean(wish.photo?.src);
  const hasAudio = Boolean(wish.audio?.src);
  const hasVideo = Boolean(wish.video?.src);

  if (hasText && hasPhoto && hasAudio) return 'photo-text-audio';
  if (hasText && hasPhoto && hasVideo) return 'photo-text-video';
  if (hasPhoto && hasAudio && !hasText) return 'photo-audio';
  if (hasPhoto && hasVideo && !hasText) return 'photo-video';
  if (hasText && hasAudio && !hasPhoto) return 'audio-text';
  if (hasText && hasVideo && !hasPhoto) return 'video-text';
  if (hasText && hasPhoto && !hasAudio && !hasVideo) return 'photo-text';
  if (hasPhoto && !hasText && !hasAudio && !hasVideo) return 'photo-only';
  if (hasAudio && !hasText && !hasPhoto && !hasVideo) return 'audio-only';
  if (hasVideo && !hasText && !hasPhoto && !hasAudio) return 'video-only';
  return 'text-only';
}

export function isWishEmpty(wish: Wish): boolean {
  return (
    !wish.text?.trim() &&
    !wish.photo?.src &&
    !wish.audio?.src &&
    !wish.video?.src
  );
}

export function validateMediaAsset(asset?: MediaAsset): boolean {
  if (!asset) return true;
  if (!asset.enabled) return true;
  return Boolean(asset.src);
}

export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function filterEnabled<T extends { enabled: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.enabled);
}

export function validateNoDuplicateIds<T extends { id: string }>(items: T[]): boolean {
  const ids = items.map((item) => item.id);
  return ids.length === new Set(ids).size;
}
