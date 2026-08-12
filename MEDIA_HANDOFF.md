# Media handoff

The site ships without invented personal images, videos, audio, or draft wishes.
Add only reviewed, publishable material, then update the matching typed data
file. Run `npm run validate-content` before committing.

## Asset folders

- `public/media/journey/` - real story or milestone photos/videos.
- `public/media/gallery/` - gallery photos/videos.
- `public/media/wishes/` - contributor photos, audio, and videos.
- `public/media/daughter/` - the dedicated daughter message video and poster.
- `public/media/music/` - optional licensed or owned music.

Use stable, descriptive filenames such as `journey-001.webp`,
`gallery-003.mp4`, `wish-001.mp3`, and `daughter-message-poster.webp`.

## Data files

- `src/data/journey.ts`
- `src/data/gallery.ts`
- `src/data/wishes.ts`
- `src/data/special.ts` for daughter media, final message, and music

Media source paths must begin with `/media/` and must match an existing file
under `public/`. Image entries need meaningful alt text. IDs and `order`
values must be unique inside each collection; set `enabled: false` to keep an
item in source without publishing it.

## Publish checklist

1. Optimize images for the web (WebP/AVIF where practical) and prepare video
   poster frames.
2. Remove sensitive metadata from personal media before publishing.
3. Add the files to the matching folder.
4. Add or enable the corresponding typed data item.
5. Run `npm run validate-content`, `npm run test`, and `npm run build`.
6. Verify the item in desktop and mobile browsers before release.

## Previewing before 15 August

The normal homepage intentionally remains on the countdown until midnight IST.
For owner testing, open `/?preview-birthday` after the site URL (the
equivalent `/?preview=birthday` also works). This bypasses only the date gate
and shows a small `Birthday preview` label; it does not change the normal
visitor flow. Remove the query parameter to return to the countdown.
