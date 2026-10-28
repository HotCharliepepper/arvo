# R4 QA evidence and limits

Date: 2026-10-28 KST. No production deployment or hotel operating certification.

## Executed before the environment disconnected

- Original R3: nine static checks, simulated DOM interactions and optional media
  test passed.
- Local R4 baseline: 13 Node checks passed; public-safe preview and real-media
  review builds succeeded.
- Main-era root index.html and README.md had no diff.
- Nine original photographs were read, compared, resized and encoded. After
  empty derivative failures were found and repaired, all 30 WebP/AVIF images
  decoded successfully. Processing now uses atomic image writes and validates
  each output; original inputs remain untouched.
- Web film: H.264, yuv420p, 1080×1080, 3.000 s, 90 frames, no audio,
  1,148,517 bytes in the local baseline. All 90 frames were visually screened in
  a contact sheet; no person was observed in the chosen 17.500–20.500 s segment.
  This screening does not establish publication rights or a room mapping.
- Runway candidate: retrieved successfully; sampled frames showed ghosted/
  duplicated lamp and changed arch/wall geometry. Rejected, still used instead.
- Real Chromium served URL opened successfully. Native accessibility tree
  exposed eight cards, all purpose filters, FAQ, mobile-menu controls and OTA
  actions.
- Browser caught an initial empty-video-source error. Handler was changed to
  report failure only after an actual source had been assigned.
- A same-origin iframe with 1440 CSS px layout reported clientWidth 1440,
  scrollWidth 1440, height 8089 and no overflowing visible elements. The lobby
  image decoded at naturalWidth 1280. Other off-screen lazy images were not all
  loaded at that moment. Initial video currentSrc remained empty.
- Full-page screenshot capture timed out. The browser and execution environment
  then disconnected. No final screenshot file was successfully captured.

## Final recovered source

The recorded source was recovered into GitHub after the environment became
unavailable. The builder and template are now separate files. Fourteen Node tests
are included, with an additional VM test of the actual client filter/menu code.
Use the PR/CI checks and Netlify deploy status for the recovered commit's result.
Earlier local test passes are not a substitute for final-commit verification.

## Not completed — do not mark as passed

- 320 / 390 / 768 px real-browser layout and interaction QA.
- Final recovered commit's 1440 px visual verification.
- Final desktop/mobile screenshot export.
- Real browser video playback, pause/replay, timeout/failure and reduced-motion
  scenario verification.
- All lazy images loaded at each viewport, touch cropping and final contrast QA.
- Keyboard traversal of the complete final page or assistive-technology testing.
- End-to-end OTA mobile navigation beyond destination identity/text retrieval.
- Lighthouse/Core Web Vitals/CLS measurements, actual devices, Safari/iOS.
- Private source ZIP and evidence export after environment interruption.

## Reproduce the remaining browser checks

1. Build the private review from the owner's originals (README).
2. At 320, 390, 768 and 1440 CSS px confirm no document overflow and inspect all
   image crops; preserve screenshots.
3. Purpose filters should show work 3 / together 4 / rest 4 / all 8 types.
4. Test menu open/close, Escape focus, FAQ keyboard toggles and room disclosures.
5. Video must remain unloaded before play; test play, pause, ended/replay,
   offline failure, slow-load timeout, tab visibility and reduced-motion change.
6. Check OTA accommodation IDs, new-window protection and explicit external
   reservation wording. Do not make a test reservation or payment.
7. Confirm noindex in HTML/headers, media exclusion in public build, and
   production/CI private-profile rejection before requesting any release.
