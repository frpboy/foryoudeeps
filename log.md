# Repository Work Log

## Append-only policy

This file is an append-only audit trail. Do not edit, delete, reorder, or
rewrite earlier entries. Record each future implementation, verification,
deployment, or decision as a new dated entry at the end of this file.

---

## 2026-08-11 - Initial full repository analysis

### Scope

Read the repository structure, tracked application source, configuration,
package scripts, public assets, Git state, and the relevant PRD/FRD/TRD/stack
documentation requirements. No product source, configuration, content, or
deployment files were changed during this analysis.

### Current repository shape

- Single-page, static-first birthday experience implemented with React 18,
  TypeScript, Vite, Tailwind CSS, Motion, and Lucide.
- One initial Git commit is present: `a1786c8 feat: initialize for-you-deeps birthday website`.
- Runtime sequence: countdown before 2026-08-15 00:00 Asia/Kolkata, then
  birthday reveal, journey, gallery lightbox, wishes wall, daughter section,
  and final replay.
- Content is centralized under `src/data/`; the view components are under
  `src/sections/`; reusable UI and hooks are under `src/components/` and
  `src/hooks/`.
- The TypeScript types cover site configuration, media, wishes, journey,
  gallery, music, daughter message, and final message data.

### Content and media state

- `public/` currently contains only `favicon.svg` and `og/preview.svg`.
- Journey, gallery, and two wish images reference remote image-generation
  URLs. They are not committed personal media assets and must be replaced or
  explicitly approved before release.
- The daughter section is enabled but no daughter video is configured. It
  therefore renders its intentional unavailable-media fallback.
- Music is disabled and `musicTracks` is empty.
- `index.html` references `/og/preview.jpg`, while the checked-in Open Graph
  asset is `/og/preview.svg`; social-preview asset configuration is currently
  inconsistent.

### Functional and implementation observations

- The countdown/reveal flow is date-based, refresh-aware, and has a
  visibility-change recheck.
- Gallery supports click/touch navigation and desktop arrow keys in its
  lightbox. It has responsive layout and lazy image loading.
- The modal has Escape handling, basic focus trapping, and scroll locking.
- Reduced-motion preferences are respected in React animation setup and CSS.
- Gallery lightbox image error handling is ineffective: returning JSX from an
  image `onError` handler does not replace the failed image with a fallback.
- The modal is labelled with `lightbox-title`, but no matching element is
  rendered.
- Wish playback isolation is incomplete: media registries are instantiated in
  individual components instead of being shared across all wish audio/video
  players, so the documented single-active-media behaviour is not assured.

### Requirements-to-repository gaps

- The PRD/TRD require approved personal media, media validation/optimization,
  privacy-conscious asset hosting, deployment security headers, and browser,
  accessibility, responsive, unit, and end-to-end verification.
- No local personal media pipeline, deploy configuration, security-header
  configuration, ESLint configuration, test source, Vitest configuration, or
  Playwright installation/configuration was found.
- The package defines `test:e2e` as `playwright test`, but Playwright is not
  listed in package dependencies.

### Verification run

Executed from repository root:

```text
npm run typecheck
npm run lint
npm run test
npm run validate
npm run build
```

Results:

- `typecheck` failed. `scripts/validate-content.ts` contains JSON rather than
  valid TypeScript; TypeScript also reports a parse error in
  `src/sections/JourneySection.tsx` line 20.
- `lint` failed because ESLint 9 could not find an `eslint.config.*` file.
- `test` failed because Vitest found no test files.
- `validate` failed because `tsx` could not transform the JSON content in
  `scripts/validate-content.ts`.
- `build` failed because TypeScript compilation failed for the same two files.
- `git diff --check` was clean before this log was created.

### Worktree hygiene

- The failed build generated untracked `vite.config.js` and `vite.config.d.ts`
  artifacts. They were removed because they were command-generated during this
  analysis and are not repository source.
- No other untracked or modified repository files existed before this log was
  created.

### Release assessment

Do not treat the site as release-ready. Restore a green TypeScript/build
baseline, configure linting and tests, provide reviewed real media, correct
the social preview path, implement shared media playback coordination and
media error fallbacks, then complete browser, accessibility, device, and
production verification.

---

## 2026-08-11 - Complete implementation and verification baseline

### Implemented

- Repaired the broken `JourneySection.tsx` syntax and upgraded `motion` to a
  version that provides the React entry point used by the application.
- Replaced generated remote people/images and unverified example wishes with
  empty typed collections. The journey, gallery, and wishes wall now retain
  their place in the experience with intentional, honest empty-content states
  until reviewed real content is added.
- Created `public/media/{journey,gallery,wishes,daughter,music}/` as the
  stable asset handoff structure and added `MEDIA_HANDOFF.md` with validation
  and publication instructions.
- Disabled the daughter section until the real dedicated video is supplied,
  preventing an unavailable-media experience and pre-birthday surprise leak.
- Simplified the final copy so it does not assert unverified personal facts.
- Added real TypeScript content validation. It enforces valid IST birthday
  configuration, unique IDs/orders, required wish data, local `/media/`
  paths, existing media files, and image alt text.
- Added ESLint flat configuration, Vitest configuration, Playwright
  configuration, and the required `validate-content` script alias.
- Added test coverage for countdown boundary behavior, IST date rendering,
  media variant utilities, deterministic content handling, and both app states.
- Added Playwright browser coverage for the birthday journey in desktop and
  mobile Chromium emulation with a test-only birthday clock.
- Fixed IST date rendering at midnight, which previously displayed 14 August
  for the configured 15 August IST boundary in UTC environments.
- Made reduced-motion detection safe where `matchMedia` is unavailable.
- Added a shared wish-media registry so starting a wish audio/video pauses
  other wish media, and repaired gallery lightbox fallback and accessible
  labelling behavior.
- Corrected the Open Graph image reference to the checked-in `preview.svg`.

### Verification

All commands passed from repository root:

```text
npm run typecheck
npm run lint
npm run validate
npm run validate-content
npm run test
npm run build
npm run test:e2e
```

- Vitest: 3 files and 8 tests passed.
- Playwright: 2 tests passed, one each in desktop Chromium and Pixel 5
  emulation.
- Production build completed successfully with Vite.
- `git diff --check` passed.

### Remaining external input

Real, publishable photos, contributor-approved wishes/media, daughter video
and poster, and any music have not been supplied. The site deliberately does
not invent or display substitutes. Follow `MEDIA_HANDOFF.md` when those assets
arrive, then rerun the validation and browser checks above.

---

## 2026-08-11 - Media-variant acceptance coverage

### Added verification

- Exported the reusable wish-card renderer for direct component coverage.
- Added renderer tests for text-only wishes, mixed photo/audio/video wishes,
  accessible audio controls, inline video playback attributes, and image-error
  fallback rendering.

### Verification

All commands passed again after the additional coverage:

```text
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
```

- Vitest: 4 files and 11 tests passed.
- Playwright: 2 browser tests passed across desktop Chromium and Pixel 5
  emulation.

---

## 2026-08-11 - Responsive browser acceptance extension

### Added verification

- Added browser coverage for a 320px-wide viewport, document horizontal
  overflow, browser console errors, scrolling to the final section, and replay
  navigation back to the opening reveal.

### Verification

- `npm run test:e2e` passed with 4 tests: full birthday journey and responsive
  replay/console checks in both desktop Chromium and Pixel 5 emulation.

---

## 2026-08-12 - Pre-birthday full-experience preview

### Implemented

- Added the explicit owner testing URL `/?preview=birthday`. It bypasses only
  the birthday date gate and displays a small `Birthday preview` indicator.
- The normal URL remains countdown-only before the configured 15 August 2026
  IST boundary; removing the query parameter restores that visitor flow.
- Documented the testing URL in `MEDIA_HANDOFF.md`.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`
  passed.
- Vitest: 4 files and 12 tests passed.
- Playwright: 6 tests passed across desktop Chromium and Pixel 5 emulation,
  including the preview URL before the birthday boundary.

---

## 2026-08-12 - Preview URL compatibility correction

### Implemented

- Added support for the short owner URL `/?preview-birthday` in addition to
  `/?preview=birthday`, so the exact Vercel testing link works before the
  birthday boundary.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`
  passed.
- Vitest: 4 files and 13 tests passed.
- Playwright: 8 tests passed across desktop Chromium and Pixel 5 emulation,
  including both accepted preview URLs.

---

## 2026-08-12 - Vercel custom-domain handoff

### Production evidence

- `https://foryoudeeps.vercel.app/?preview-birthday` returned HTTP 200 and
  its deployed JavaScript bundle contained the short preview URL support.
- `foryoudeeps.frpboy.in` resolves to Vercel infrastructure but returned a
  Vercel 404. This indicates project-domain association is missing externally,
  not an application build failure.

### Prepared

- Added `vercel.json` with production response security headers.
- Added `VERCEL_DEPLOYMENT.md` with the one-time Vercel dashboard action to
  attach `foryoudeeps.frpboy.in` to the project.

---

## 2026-08-12 - Editorial birthday experience redesign

### Implemented

- Reworked the countdown and birthday reveal into an editorial, poster-led
  experience: expressive typography, understated marks, a soft paper texture,
  and no dashboard-style metric cards.
- Gave the journey, gallery, wishes, daughter-message, and final wish their
  own visual atmospheres so the experience moves from deep matcha and wine-red
  into warm cream, then returns to a quiet final dark scene.
- Kept the existing data architecture and intentional empty states. No
  placeholder people, images, voices, or messages were fabricated while real
  media is still pending.
- Preserved reduced-motion behavior, preview URLs, replay navigation, and all
  existing content hooks; updated the browser assertions for the intentionally
  renamed `Start again` control.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, and `npm run build` passed.
- Vitest: 4 files and 13 tests passed.
- Playwright: 8 tests passed across desktop Chromium and iPhone 13 emulation,
  including both pre-birthday preview URL forms, no horizontal overflow, no
  browser console errors, and replay navigation.

---

## 2026-08-12 - Production readiness and responsive acceptance extension

### Implemented

- Added a real mute/unmute state to the optional music controller while
  preserving its user-interaction-only playback policy.
- Made individual wish videos fail gracefully to the existing media fallback;
  any contributor-approved written message remains visible if video playback
  cannot load.
- Extended browser coverage to verify the pre-birthday page remains a secret
  waiting room and does not expose birthday-only content.
- Added explicit response-status and console-error assertions, plus no-
  horizontal-overflow checks at 320, 360, 375, 390, 414, 430, 768, 1024, 1280,
  1440, and 1920 pixels.

### Production evidence

- Interactive browser inspection confirmed that
  `https://foryoudeeps.frpboy.in/?preview=birthday` resolves over HTTPS and
  serves the complete available birthday story from the custom domain.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, and `npm run build` passed.
- Vitest: 4 files and 14 tests passed.
- Playwright: 12 tests passed across desktop Chromium and mobile Chromium;
  the focused mobile console/network check also passed three concurrent repeat
  runs after a transient Vite-development-server 404 was observed.

---

## 2026-08-12 - Nested media publication safeguards

### Implemented

- Enforced the `enabled` flag on nested gallery, journey, wish, and daughter
  media assets, not just their parent records. Disabled media now cannot leak
  into an otherwise enabled item.
- Completed the existing typed journey-video path with native controls,
  `playsInline`, metadata-only preload, poster support, and graceful fallback
  on playback failure.
- Updated wish variant selection and empty-content detection to treat disabled
  media as unpublished; this keeps future content controls truthful.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, `npm run build`, and `npm run test:e2e` passed.
- Vitest: 4 files and 15 tests passed.
- Playwright: 12 tests passed across desktop and mobile Chromium, including
  the complete 320px through 1920px responsive overflow matrix.

---

## 2026-08-12 - Voice-note resilience and duration context

### Implemented

- Added a graceful, accessible failure state for future contributor audio
  notes, preserving any approved written message when audio cannot load.
- Added optional minute-and-second duration context to the minimal audio
  control when the supplied asset metadata includes a duration or the browser
  can read it.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, `npm run build`, and `npm run test:e2e` passed.
- Vitest: 4 files and 16 tests passed, including the failed-audio regression.
- Playwright: 12 browser tests passed across desktop and mobile Chromium.

---

## 2026-08-12 - Optional multi-track music completion

### Implemented

- Completed the future multi-track music controller: its displayed title now
  follows the active track, an accessible next-track action appears when more
  than one approved track exists, and automatic progression resumes playback
  after a track ends.
- Preserved the initial interaction requirement, mute control, disabled/no-
  tracks behavior, and failure-safe playback state.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, `npm run build`, and `npm run test:e2e` passed.
- Vitest: 4 files and 16 tests passed.
- Playwright: 12 browser tests passed across desktop and mobile Chromium.

---

## 2026-08-12 - Deterministic scrapbook presentation layer

### Implemented

- Added optional, data-driven scrapbook fields for gallery items: deterministic
  rotation, handwritten caption treatment, and a small owner-supplied sticker.
  Gallery memories retain the existing accessible lightbox.
- Added explicit wish presentation styles (`note`, `polaroid`, `chat`,
  `audio`, `video`, and `mixed`) plus an optional generic timestamp label for
  creative chat-style wishes. Nothing is randomly assigned or fabricated.
- Applied the reference inspiration only to future memory-bearing sections:
  warm-cream Polaroid edges, restrained tape/paper effects, and a generic chat
  bubble treatment. The dark-matcha hero/countdown identity remains unchanged.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, `npm run build`, and `npm run test:e2e` passed.
- Vitest: 4 files and 16 tests passed.
- Playwright: 12 browser tests passed across desktop and mobile Chromium.

---

## 2026-08-12 - Playlist navigation and progress completion

### Implemented

- Completed the optional playlist controls with accessible previous and next
  track actions plus a subtle live progress line. These controls render only
  when approved music tracks exist and never start audio without interaction.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, `npm run build`, and `npm run test:e2e` passed.
- Vitest: 4 files and 16 tests passed.
- Playwright: 12 browser tests passed across desktop and mobile Chromium.

---

## 2026-08-12 - First approved gallery photographs

### Added

- Added two supplied, reviewed photographs under `public/media/gallery/` as
  `deeps-gallery-001.jpeg` and `deeps-gallery-002.jpeg`.
- Published them through the typed gallery data with deterministic ordering,
  descriptive alt text, and no invented captions, dates, labels, or personal
  context.
- Extended browser coverage for opening the gallery, keyboard next navigation,
  and Escape closing in the existing accessible lightbox.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, `npm run build`, and `npm run test:e2e` passed.
- Vitest: 4 files and 16 tests passed.
- Playwright: 14 tests passed across desktop and mobile Chromium, including
  the real gallery lightbox journey.

---

## 2026-08-12 - Routed story navigation

### Implemented

- Converted the long-scroll birthday experience into guarded React Router
  views: landing/countdown, birthday, memories, gallery, gallery detail,
  wishes, wish detail, daughter, final, and a personal unknown-route fallback.
- Preserved `?preview=birthday` across internal navigation and added Vercel
  SPA rewrites for direct routed URLs.
- Replaced gallery modal navigation with client-side `/gallery/:id` detail
  routes, including back, next/previous, next-image preloading, browser
  history support, and no document reload.
- Added story-like major-page navigation through subtle progress marks,
  invisible 5% edge taps, deliberate horizontal swipe detection, and
  ArrowLeft/ArrowRight keyboard support. Interactive/media origins are ignored
  so normal controls and vertical scrolling remain usable.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run
  validate-content`, and `npm run build` passed.
- Vitest: 4 files and 16 tests passed.
- Playwright: 8 desktop/mobile route tests passed, covering pre-birthday
  guards, preview persistence, direct detail refresh, gallery history, no full
  reload, keyboard navigation, and edge-tap navigation.

---

## 2026-08-12 - Gallery detail gesture scope

### Implemented

- Added gallery-detail-specific horizontal swipe and ArrowLeft/ArrowRight
  navigation between gallery entries. Detail gestures stay inside the gallery
  sequence and do not advance the major birthday story.
- Gestures that begin on links, buttons, video/audio controls, sliders, or
  form controls remain protected from route changes.

### Verification

- `npm run typecheck`, `npm run lint`, and `npm run test:e2e` passed.
- Playwright: 8 desktop/mobile route tests passed.

---

## 2026-08-12 - Cinematic motion and age-transition pass

### Implemented

- Added a reusable, deterministic ambient-particle layer with mood-specific
  hearts, dust, dots, sparkles, and doodle marks. It uses 40 bounded desktop
  nodes and 18 mobile nodes, transform/opacity-only CSS animation, and becomes
  still for reduced-motion users.
- Applied distinct atmospheric intensity across birthday, memories, gallery,
  wishes, daughter, and final routes; the daughter and final scenes remain
  deliberately sparse and slow.
- Staged the birthday reveal into a short cinematic sequence and added a
  separate `LEVEL 31 UNLOCKED` scale overshoot/settle. Gallery Polaroids now
  settle from deterministic temporary rotations into their existing configured
  scrapbook rotations.
- Replaced the static countdown backdrop with a synchronized `30 → 31` age
  transition. Both oversized layers remain rendered; their opacity, transform,
  and blur derive from the same remaining countdown value as the visible clock
  over its final 72-hour normalized window. The timer remains above the artwork
  and birthday/preview state continues to render the completed `31` reveal.
- Added scoped wish-detail previous/next, keyboard, and horizontal swipe
  navigation, plus subtle accessible desktop previous/next story controls.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, `npm run build`, `npm run test:e2e`, and `git diff --check` passed.
- Vitest: 4 files and 17 tests passed, including normalized age-transition
  calculation coverage.
- Playwright: 12 desktop/mobile browser tests passed, including direct routes,
  browser history, gallery gestures, major-page edge/keyboard navigation,
  reduced-motion particle stillness, and no horizontal overflow at 320, 360,
  375, 390, 414, 430, 768, 1024, 1280, 1440, and 1920px widths.

---

## 2026-08-12 - Playback-aware motion polish

### Implemented

- Added a compact waveform beside wish audio controls. It animates only while
  the underlying audio is playing and remains static when paused.
- Added a slow, restrained active-state pulse to the birthday story progress
  marker.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`,
  `npm run test:e2e`, and `git diff --check` passed.
- Vitest: 4 files and 17 tests passed. Playwright: 12 desktop/mobile browser
  tests passed.

---

## 2026-08-12 - Full-screen scene architecture

### Implemented

- Converted the routed birthday experience into bounded full-screen scene
  compositions with a shared dynamic viewport shell and no page-level scroll.
- Removed all remaining scroll-based route actions, replacing the birthday
  affordance with “begin the story” and keeping replay entirely route-driven.
- Tightened gallery, memories, daughter, final, and route-detail compositions
  around viewport-aware media/content constraints; decorative layers remain
  scene-owned and cannot bleed between routes.
- Added the recurring but scene-specific `31` motif: chapter treatment for
  memories, gallery/wishes watermarks, a subtle detail signature, and quieter
  daughter/final marks.
- Added the small five-tap countdown-heart discovery and a seconds-only pulse;
  all other countdown data remains driven by the existing timer.
- Curated gallery and memories scene payloads to prevent future data growth
  from creating long-scroll pages. Wish cards now open their routed details
  while embedded media controls remain protected.

### Verification

- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, `npm run build`, `npm run test:e2e`, and `git diff --check` passed.
- Vitest: 4 files and 17 tests passed.
- Playwright: 14 desktop/mobile tests passed. The matrix opens every major
  routed scene across 320x568 through 1920x1080 and asserts no document
  vertical/horizontal overflow plus `window.scrollY === 0` after navigation.

---

## 2026-08-12 - Full-scene visual acceptance follow-up

### Implemented

- Corrected the warm-paper wishes scene’s contextual action to use ink text;
  it is now clearly visible without compromising the distinct cream scene.

### Verification

- Re-ran `npm run typecheck`, `npm run lint`, `npm run validate-content`,
  `npm run test`, `npm run build`, `npm run test:e2e`, and `git diff --check`.
  All passed.
- Vitest: 4 files and 17 tests passed. Playwright: 14 desktop/mobile tests
  passed, including the route-by-route no-overflow viewport matrix.
- Visually inspected fresh production screenshots for birthday, gallery,
  gallery detail, wishes, daughter, and final. The wishes scene action is
  readable and its content remains contained.

---

## 2026-08-12 - Gallery index proportional-photo correction

### Implemented

- Reworked the gallery index cards so their geometry is derived from the two
  supplied photographs' actual dimensions (901x1600 and 1158x1544), rather
  than a fixed oversized panel.
- Kept each real image as the primary visible element inside a compact
  Polaroid frame with a small caption strip; the images preserve their full
  aspect ratios using direct image elements and `object-fit: contain`.
- Kept the two-card asymmetric composition, deterministic rotations, the
  subordinate gallery `31`, and the behind-content particle layer. Removed
  the large desktop gallery-index arrows while retaining route detail
  navigation and major edge navigation.
- Added the same ambient particle treatment to the gallery and wishes detail
  routes for continuity with the scene system.

### Verification

- Visually inspected the preview gallery at 390x844, 768x1024, 1366x768, and
  1920x1080. Both supplied photographs are fully visible, proportional, and
  remain inside the viewport without the previous empty oversized panels.
- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, `npm run build`, and `npm run test:e2e` passed.
- Vitest: 4 files / 17 tests passed. Playwright: all 14 desktop/mobile tests
  passed, including direct routing, gallery detail history navigation,
  reduced-motion, edge/keyboard navigation, and the no-overflow viewport
  matrix.

---

## 2026-08-12 - Authoritative Deeps portrait added

### Implemented

- Added the supplied full-body portrait of Deeps as the unmodified source
  asset at `public/media/gallery/deeps-gallery-003.jpeg` (960x1280).
- Registered it as the featured gallery item with a portrait-proportional
  Polaroid treatment; its original file remains available in the routed
  gallery detail view.
- No generated substitute, face/appearance modification, beauty retouching,
  aggressive grading, or fixed landscape crop was introduced.

### Remaining verification

- Re-run the gallery visual viewport audit after the third real portrait is
  included in the compact index composition.

### Verification completed

- Visually inspected the finished gallery at 390x844 and 1366x768: mobile
  shows the featured Deeps portrait plus one supporting photo, while desktop
  shows all three real images. The detail route shows the entire original
  960x1280 portrait with no crop.
- `npm run build`, `npm run typecheck`, `npm run lint`,
  `npm run validate-content`, `npm run test`, and `npm run test:e2e` passed.
- Vitest: 4 files / 17 tests passed. Playwright: 14 desktop/mobile tests
  passed after its gallery-history assertion was updated for the new first
  item and the expanded no-overflow route matrix.

---

## 2026-08-12 - Editable wishes-wall preview content

### Implemented

- Added six text-only, clearly generic draft wishes so the wishes wall and its
  routed detail views can be reviewed with realistic colleague/bestie density.
- Used only editable labels such as `A colleague` and `A bestie`; no names,
  identities, personal media, or claims of authorship were fabricated.
- Each draft is marked in source as visual-only starter content and must be
  replaced with contributor-approved names and wording before publishing.

### Remaining input

- Supply the real contributor names and approved messages (and optional media)
  to replace these draft entries.

### Verification

- Visually inspected the completed index and detail treatment at 390x844 and
  1366x768. The index deliberately shows two notes on mobile and three on
  desktop to preserve the full-screen scene; all six drafts remain reachable
  through wish-detail navigation.
- `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run
  test`, `npm run build`, and `npm run test:e2e` passed.
- Vitest: 4 files / 17 tests passed. Playwright: all 14 desktop/mobile tests
  passed, including the route-by-route no-overflow matrix.

---

## 2026-08-12 - Scattered wishes composition

### Implemented

- Gave the visible wishes a controlled scattered-note composition using stable
  per-card rotations and small vertical offsets. This creates a casual,
  collected feel without random layout shifts or overlap.
- Kept the two-note mobile and three-note desktop scene limits, along with the
  existing detail-route access to every draft wish.

### Verification

- Visually inspected the finished wishes scene at 390x844 and 1366x768.
- `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run test:e2e`
  passed: 17 Vitest tests and 14 desktop/mobile Playwright tests.

---

## 2026-08-12 - Photo-led gallery stack correction

### Implemented

- Removed the oversized rounded Polaroid panels that left each real photograph
  small inside unused cream space.
- Gallery photographs now form a deliberately overlapping, asymmetric stack:
  a thin cream edge and short caption strip remain, but the real images occupy
  nearly all of each card.

### Verification

- Visually checked at 412x915 and 1366x768.
- `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run test:e2e`
  passed: 17 Vitest tests and 14 desktop/mobile Playwright tests.

---

## 2026-08-12 - Scattered gallery composition

### Implemented

- Made all three supplied gallery photographs visible in the index at every
  viewport, including mobile.
- Applied deterministic per-photo vertical offsets on top of the configured
  scrapbook rotations, creating a balanced scattered composition without
  cropping or changing any original photo.

### Verification

- Visually checked at 412x915 and 1366x768.
- `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run test:e2e`
  passed: 17 Vitest tests and 14 desktop/mobile Playwright tests.

---

## 2026-08-12 - Final scene background seam correction

### Implemented

- Fixed the final route's background seam by giving its section explicit
  viewport ownership. The final background now covers the full scene rather
  than ending before the parent viewport and exposing a second dark band.

### Verification

- Visually checked at 412x915 and 1366x768; both render one continuous final
  scene.
- `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run test:e2e`
  passed: 17 Vitest tests and 14 desktop/mobile Playwright tests.

---

## 2026-08-12 - Named editable wishes

### Implemented

- Replaced generic visual-preview labels with the content-owner-supplied names:
  Nikitha, Arun, Rahul, Althaf, Manju, Shabin, Amaya, Muzammil, Rafi, Sinan,
  Asaru, Anshad, Shamil, and Jinshad.
- Kept Deeps out of the sender list. The supporting messages remain editable
  drafts, not claims that a named person wrote or approved that wording.

---

## 2026-08-12 - Sender exclusions

### Implemented

- Removed Shabin and Rafi from all active wish data and current requirement/
  design documentation at the content owner's request. They no longer render
  as wish senders or appear in current contributor lists.
- Earlier audit entries remain unchanged because this root log is append-only.

---

## 2026-08-12 - Corrected wishes scatter layout

### Implemented

- Removed the featured card's desktop two-column span that was causing the
  wishes to stack vertically at tablet/desktop widths.
- The visible wishes now use a true three-column composition with independent,
  deterministic offsets and rotations, making them read as separate scattered
  notes rather than a stacked feed.

### Verification

- Visually checked at 1000x590 and 1366x768.
- `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run test:e2e`
  passed: 17 Vitest tests and 14 desktop/mobile Playwright tests.
