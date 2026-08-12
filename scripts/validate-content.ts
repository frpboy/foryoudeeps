import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { galleryItems } from '../src/data/gallery';
import { journeyItems } from '../src/data/journey';
import { daughterMessage, musicTracks } from '../src/data/special';
import { siteConfig } from '../src/data/site';
import { wishes } from '../src/data/wishes';
import type { MediaAsset } from '../src/types';

const errors: string[] = [];

function report(message: string) {
  errors.push(message);
}

function validateIds(label: string, items: Array<{ id: string; order: number }>) {
  const ids = new Set<string>();
  const orders = new Set<number>();
  for (const item of items) {
    if (!item.id.trim()) report(`${label}: missing id`);
    if (ids.has(item.id)) report(`${label}: duplicate id "${item.id}"`);
    if (orders.has(item.order)) report(`${label}: duplicate order ${item.order}`);
    ids.add(item.id);
    orders.add(item.order);
  }
}

function validateMedia(label: string, asset?: MediaAsset) {
  if (!asset || !asset.enabled) return;
  if (!asset.src.startsWith('/media/')) {
    report(`${label}: media src must start with /media/`);
    return;
  }
  const diskPath = join(process.cwd(), 'public', asset.src.slice(1));
  if (!existsSync(diskPath)) report(`${label}: missing file ${asset.src}`);
  if (asset.type === 'image' && !asset.alt?.trim()) report(`${label}: image alt text is required`);
}

if (Number.isNaN(Date.parse(siteConfig.birthdayDate))) report('site: birthdayDate is invalid');
if (!siteConfig.birthdayDate.endsWith('+05:30')) report('site: birthdayDate must use IST offset +05:30');

validateIds('gallery', galleryItems);
galleryItems.forEach((item) => validateMedia(`gallery:${item.id}`, item.media));

validateIds('journey', journeyItems);
journeyItems.forEach((item) => {
  validateMedia(`journey:${item.id}:image`, item.image);
  validateMedia(`journey:${item.id}:video`, item.video);
});

validateIds('wishes', wishes);
wishes.forEach((wish) => {
  if (!wish.name.trim()) report(`wish:${wish.id}: display name is required`);
  if (!wish.text?.trim() && !wish.photo?.src && !wish.audio?.src && !wish.video?.src) {
    report(`wish:${wish.id}: needs text or media`);
  }
  validateMedia(`wish:${wish.id}:photo`, wish.photo);
  validateMedia(`wish:${wish.id}:audio`, wish.audio);
  validateMedia(`wish:${wish.id}:video`, wish.video);
});

validateIds('music', musicTracks);
musicTracks.forEach((track) => validateMedia(`music:${track.id}`, {
  id: track.id,
  type: 'audio',
  src: track.src,
  order: track.order,
  enabled: track.enabled,
}));
validateMedia('daughter:video', daughterMessage.video);

if (errors.length) {
  console.error('Content validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log('Content validation passed.');
}
