import type { GalleryItem } from '@/types';

// Reviewed real photographs. Add captions, stickers, and date labels only when
// the content owner explicitly supplies or approves them.
export const galleryItems: GalleryItem[] = [
  {
    id: 'gallery-003',
    media: {
      id: 'gallery-003-image',
      type: 'image',
      src: '/media/gallery/deeps-gallery-003.jpeg',
      alt: 'Deeps standing indoors in a black dress.',
      width: 960,
      height: 1280,
      order: 1,
      enabled: true,
    },
    order: 1,
    featured: true,
    rotation: -1.1,
    enabled: true,
  },
  {
    id: 'gallery-001',
    media: {
      id: 'gallery-001-image',
      type: 'image',
      src: '/media/gallery/deeps-gallery-001.jpeg',
      alt: 'Three people smiling outdoors in front of large green leaves.',
      width: 901,
      height: 1600,
      order: 2,
      enabled: true,
    },
    order: 2,
    rotation: 1.2,
    enabled: true,
  },
  {
    id: 'gallery-002',
    media: {
      id: 'gallery-002-image',
      type: 'image',
      src: '/media/gallery/deeps-gallery-002.jpeg',
      alt: 'Two people smiling together indoors near a window.',
      width: 1158,
      height: 1544,
      order: 3,
      enabled: true,
    },
    order: 3,
    rotation: -0.8,
    enabled: true,
  },
];
