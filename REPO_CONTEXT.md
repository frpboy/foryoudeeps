# For You, Deeps — Repository Context

Last reviewed: 2026-08-14 (Asia/Kolkata)

## Purpose

A private, mobile-first birthday-story site for Deepthi Jaya (“Deeps”), built as a React/Vite single-page application. It starts as a countdown and, on the configured birthday (or explicit preview), reveals a routed visual story.

## Runtime and delivery

- React 18 + TypeScript + Vite 5
- React Router 6 for client-side routes
- `motion/react` for animation; Tailwind CSS plus `src/styles/index.css`
- Vitest/Testing Library unit/component coverage and Playwright desktop/mobile E2E coverage
- Vercel SPA rewrite is in `vercel.json`; standard defensive response headers are configured

## Story routes and gating

`src/App.tsx` owns routing, birthday gating, the preview escape hatch (`?preview=birthday` or `?preview-birthday`), story navigation, keyboard navigation, touch navigation, and desktop progress controls.

```
/                       countdown before 2026-08-15 00:00 IST
/birthday               reveal
/memories               journey
/gallery                photo stack
/gallery/:id            gallery detail
/wishes                 message cards
/wishes/:id             message detail
/daughter               daughter-message placeholder or video
/final                  closing/replay
```

All post-countdown routes redirect to `/` until the birthday is available, except through the explicit preview query parameter.

## Content model and source of truth

Content lives under `src/data/` and is typed in `src/types/index.ts`.

- `site.ts`: August 15, 2026, 00:00 IST, age 31, and high-level feature flags.
- `journey.ts`: currently intentionally empty.
- `gallery.ts`: twelve curated local photographs are rendered from twenty-nine supplied files; non-rendered near-duplicates are preserved on disk.
- `wishes.ts`: twelve enabled starter messages, explicitly marked as draft wording pending contributor approval.
- `special.ts`: final message is enabled; music track list is empty and daughter message is disabled.

Media must be local `/media/...` assets under `public/media/{gallery,journey,wishes,daughter,music}`. Do not replace personal memories with generated or remote placeholder media. The authoritative portrait is `public/media/gallery/deeps-gallery-003.jpeg`; retain the original and its detail view's `object-fit: contain` treatment.

`scripts/validate-content.ts` enforces unique IDs/orders, valid IST birthday format, local media paths, file existence, and image alt text.

## Component organization

- `src/sections/`: one visual scene per route; the gallery is a scrollable polaroid album so every supplied photo remains reachable within its fixed-height scene.
- `src/pages.tsx`: shared routed scene frame plus gallery/wish detail navigation.
- `src/components/ui/`: primitives, image/fallback/media presentation, modal, particles, and age motif.
- `src/components/music/MusicController.tsx`: optional soundtrack controller.
- `src/hooks/index.ts`: countdown, reduced-motion, intersection and coordinated media-playback hooks.
- `src/lib/countdown.ts` and `src/lib/media.ts`: pure date/content helpers.

Scenes respect reduced motion. Gallery and wish detail pages support arrow keys and horizontal touch gestures while excluding interactive media/control targets.

## Current content/release status

- Available real personal media: twenty-nine gallery JPEGs, with twelve currently curated into the rendered album.
- Outstanding supplied content: journey photographs/video, contributor-approved wishes, daughter video, and music.
- Intentional empty states are visible for missing personal material; preserve them until reviewed source material is supplied.
- `log.md` is append-only. Do not rewrite its existing history.

## Verification evidence from this review

Passed:

- `npm run validate` — content validation passed.
- `npm run typecheck` — passed.

Inconclusive in this environment:

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run test:e2e`

The latter checks exceeded the available 34-second command window, so they must be rerun in a normal local/CI session before being claimed as current evidence. They are not recorded here as failures.

## Safe continuation checklist

1. Keep stories anonymous where applicable and preserve the current visual/story order unless a change is explicitly requested.
2. Add only supplied, approved personal media and text through `src/data` and `public/media`.
3. Run `npm run validate`, then typecheck, lint, tests, build, and Playwright after content or behavior changes.
4. Treat browser/device media playback verification as separate from static/toolchain checks.
5. Append—not rewrite—`log.md` when a user asks for an implementation or release record.
