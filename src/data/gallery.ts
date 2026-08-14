import type { GalleryItem } from '@/types';

const celebrationPhotoAlt = [
  'Deeps in a black dress at an indoor celebration.',
  'Deeps with her daughter at an indoor celebration.',
  'Deeps with her daughter at an indoor celebration.',
  'Deeps, her daughter, and friends at an indoor celebration.',
  'Deeps in a black dress at an indoor celebration.',
  'Deeps, her daughter, and friends taking a group selfie.',
  'Deeps in a black dress at an indoor celebration.',
  'Deeps in a black dress at an indoor celebration.',
  'Deeps, her daughter, and friends at an indoor celebration.',
  'Deeps in a black dress at an indoor celebration.',
  'Deeps, her daughter, and friends at an indoor celebration.',
  'Deeps with her daughter at an indoor celebration.',
  'Deeps in a black dress at an indoor celebration.',
  'Deeps in a black dress at an indoor celebration.',
  'Deeps in a black dress at an indoor celebration.',
  'Deeps with her daughter at an indoor celebration.',
  'Deeps, her daughter, and friends at an indoor celebration.',
  'Deeps in a black dress at an indoor celebration.',
  'Deeps with her daughter at an indoor celebration.',
  'Deeps, her daughter, and friends at an indoor celebration.',
  'Deeps in a black dress at an indoor celebration.',
  'Deeps with her daughter at an indoor celebration.',
];

// This supplied batch contains many near-identical portraits from the same
// moment. Keep the distinct solo, mother-and-daughter, and friends memories;
// original files remain in public/media/gallery for the content owner.
const selectedCelebrationPhotoIndexes = new Set([0, 2, 3, 5, 10]);

const celebrationGalleryItems: GalleryItem[] = celebrationPhotoAlt.flatMap((alt, index) => {
  if (!selectedCelebrationPhotoIndexes.has(index)) return [];
  const order = index + 8;
  const sequence = String(order).padStart(3, '0');
  return [{
    id: `gallery-${sequence}`,
    media: {
      id: `gallery-${sequence}-image`,
      type: 'image',
      src: `/media/gallery/deeps-gallery-${sequence}.jpeg`,
      alt,
      width: index === 5 ? 1280 : 960,
      height: index === 5 ? 720 : 1280,
      order,
      enabled: true,
    },
    order,
    rotation: index % 2 === 0 ? 1 : -1,
    enabled: true,
  }];
});

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
  {
    id: 'gallery-004',
    media: {
      id: 'gallery-004-image',
      type: 'image',
      src: '/media/gallery/deeps-gallery-004.jpg',
      alt: 'Deeps smiling outdoors in a green embroidered outfit among plants.',
      width: 1080,
      height: 1440,
      order: 4,
      enabled: true,
    },
    order: 4,
    rotation: 1.4,
    enabled: true,
  },
  {
    id: 'gallery-005',
    media: {
      id: 'gallery-005-image',
      type: 'image',
      src: '/media/gallery/deeps-gallery-005.jpg',
      alt: 'Deeps standing outdoors in front of a green hedge.',
      width: 1080,
      height: 1440,
      order: 5,
      enabled: true,
    },
    order: 5,
    rotation: -1.3,
    enabled: true,
  },
  {
    id: 'gallery-006',
    media: {
      id: 'gallery-006-image',
      type: 'image',
      src: '/media/gallery/deeps-gallery-006.jpg',
      alt: 'Deeps standing outdoors in a pink saree surrounded by tropical leaves.',
      width: 1080,
      height: 1440,
      order: 6,
      enabled: true,
    },
    order: 6,
    rotation: 0.9,
    enabled: true,
  },
  {
    id: 'gallery-007',
    media: {
      id: 'gallery-007-image',
      type: 'image',
      src: '/media/gallery/deeps-gallery-007.jpg',
      alt: 'Deeps standing outdoors in a blue outfit near flowering plants.',
      width: 1080,
      height: 1440,
      order: 7,
      enabled: true,
    },
    order: 7,
    rotation: -0.7,
    enabled: true,
  },
  ...celebrationGalleryItems,
];
