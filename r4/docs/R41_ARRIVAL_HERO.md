# ARVO HOTEL R4.1 — Arrival Film × Booking UX

**Status:** DRAFT / public-safe preview, 2026-11-11. This is not hotel publication approval.

## Direction and design decision
Preserve R4 guest-journey sections, 8 room types, filtering and OTA_ONLY booking. Replace only the first fold with a cinematic full-screen arrival film. Use Range-X's full-bleed media + overlay copy + two CTA approach without copying its business content.

Core copy:
- Kicker: SEARCH. ARRIVE. STAY.
- Eye-catcher: 찾던 곳이, 눈앞에.
- H1: 사천에서의 하루, 내 일정에 맞게.
- Lead: 검색하던 숙소가 오늘 머무는 공간이 되는 순간. 이번 일정에 필요한 객실부터 살펴보세요.
- CTA 1: 나에게 맞는 객실 찾기 → #choose
- CTA 2: 예약 채널 확인 → #reserve

## Film editorial storyboard (15 seconds, concept only)
1. 0–3s — International adult traveler looks for accommodation in Sacheon on a phone (staged, no legible fake search results)
2. 3–5s — REAL ARVO exterior entrance *only after approved on-site evidence*; place short eye-catching copy at the upper-left as HTML overlay, not generated pixels
3. 5–9s — Korean adult traveler rolls a suitcase across the entrance threshold (staged cast, not a real customer)
4. 9–12s — Reception check-in, close-up of hands and room key card (staged; no promise of unverified service)
5. 12–15s — Actual ARVO lobby brass sign from approved on-site photography / separate 5s Runway candidate; verify letters and architectural consistency

**Important:** Only the lobby/sign reference is actually available as a real-property visual. The search/suitcase/check-in scene generator is an illustrative cast storyboard and must not falsely depict ARVO's actual building, actual guests or verified procedures. Do not overlay fake UI rankings or fabricated customer reviews. No voice, no fake staff statement.

## Current film sources
- Real ARVO lobby still: 36378.jpg, rights/date/current state NEED VERIFY.
- Prior generated Runway logo motion: task 8f0aa6e3-77e5-4eed-b9cd-3fb26e9a61bd (5s), authenticity/rights NOT APPROVED.
- R4.1 three-scene generated concept: task 58eb6df0-2d7f-403d-a992-3302bdd1690d, status task submitted. Check result manually in Runway. Do not automatically mark approved or published.
- Exact hotel entrance: still/video and filming consent NEED VERIFY.
- Check-in process/desk: real filming and privacy approval NEED VERIFY.

## Build media boundaries
Default `npm --prefix r4 test && npm --prefix r4 run build:preview` makes no video nor hotel source image public.
Once local video and poster are obtained with valid rights for private review, place
`r4/review-media/arrival-film.mp4`, `arrival-poster-1280.webp`, `arrival-poster-1280.avif`, `arrival-poster-640.webp` and other expected R4 source media as needed.
Then `cd r4 && npm run build:review`. This path is local-only and blocked in CI/Netlify/production.
Generated human scenes must be labeled staged in the approval record. Website preview should show a visible editorial fallback if media is unavailable.

## Acceptance QA
- R4 original 8 room types, filters, FAQs, verified accommodation-level OTA links preserved
- First fold mobile 320/390 and desktop 768/1440px; CTA reachable without waiting for movie
- No video autoplay with sound; user can pause; reduced-motion/replay/failure falls back to poster
- No unauthorized photo, fabricated hotel facility, guest testimonial, implied 5-star or unverified check-in conditions
- Final publication requires owner-approved property, media rights, people release, fact mapping, security review, privacy and mobile QA
- Do not merge to main, publish operational site, modify reservations/prices, NOL, Yeogi, Google or Naver accounts.
