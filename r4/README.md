# ARVO HOTEL R4

Working HTML/CSS/JS guest website. Eight room types, purpose filters, native FAQ,
mobile menu, manual media playback, and accommodation-level OTA outbound links.
Booking state is OTA_ONLY. There is no payment, inventory, PMS or analytics service.

## Run

Node.js 18 or later, with no npm dependencies:

    cd r4
    npm test
    npm run build:preview

Open dist/index.html directly, or serve dist with a static server.
The public preview excludes all unapproved photographs and video even when the
files exist locally. HTML and Netlify response headers specify noindex.
Noindex is not access control.

## Real-media owner review

The original 9 JPEGs and HEVC video remain in the owner's supplied
ARVO_WORK_R4_READY_PACK_20261028 archive. They are intentionally absent from this
public GitHub repository. To reproduce the real-media version from that archive:

    python scripts/process-media.py /absolute/path/to/04_MEDIA
    npm run build:review

Requires Pillow with WebP/AVIF and ffmpeg for media processing. Open
dist-review/index.html after generation. That directory must not be uploaded to
public hosting while asset rights remain unapproved. The private-media command
refuses to run in CI, Netlify or production.

The processing script creates 30 image derivatives (including the film poster),
the 3-second H.264 web film, comparison sheets, a 90-frame contact sheet and a
processing log. It checks image decoding and preserves input SHA-256 hashes.
No exposure, wall/room geometry, fixture, warning sign or person is generated or
retouched. Only orientation, proportional resize and encoding are applied.
The film uses 17.500–20.500 s from the source, removes audio, and uses H.264
1080×1080 yuv420p with faststart. Public use still requires rights and room mapping.

## Source layout

- src/index.html: semantic HTML template and ordered guest journey.
- assets/css/style.css: warm charcoal, terracotta and cream; mobile breakpoints.
- assets/js/site.js: filters, mobile menu, manual video and fallback.
- site.data.json: room IDs, fact approvals and booking configuration.
- media-manifest.json: per-asset rights, content, room ID and Runway decision.
- scripts/build.mjs: deterministic safe/private builds and publication gate.
- scripts/booking.mjs: OTA destination verification and future state boundaries.
- scripts/process-media.py: reproducible private media processing.
- scripts/test.mjs: 14 automated checks, including client interactions in a VM.
- docs/QA_REPORT.md: exact completed and incomplete validation.
- docs/RELEASE_CHECKLIST.md: outstanding approvals and next three actions.

## Preservation and deployment

Legacy root index.html and README.md remain unchanged from main
502ea2be3be570484e7d8b2afd4ef00a0648d8be. R4 lives in a separate subtree.
Root netlify.toml builds the public-safe preview only for PR/branch contexts.
Production fails until hotel operating, media and editorial approval gates pass.
The existing production deploy, account configuration, DNS, GBP and OTA
prices/inventory are outside this draft and have not been changed.

Do not merge this draft or deploy production without separate authorization.
Before release, replace remaining review copy with approved wording, provide
room-wide hero/room photographs, and repeat browser QA on the final commit.

## Reservation and factual boundaries

NOL 1000099461 and Yeogi 57753 are accommodation-level destinations.
A room card does not promise a preselected room, price, date or availability.
No unverified phone, check-in time, bed/occupancy count, review, breakfast promise
or lodging JSON-LD is published.

VENDIT_READY_FOR_QA and DIRECT_BOOKING_LIVE are recognized future states but are
intentionally rejected. An independently approved integration must be built and
reviewed later. API, webhook, iframe, fee and inventory support are not assumed.

## Media decisions

Private review placement: 36378 lobby sign as explicitly temporary hero and
brand detail; 36375 arch lamp as still detail; 36453 sauna stones and 36459
planting/basin scene as independent images with room/condition verification notes.
The other five photographs are optimized and retained for review but not placed.
No OTA image is copied.

Runway task 0b7e39da-842b-42d6-bf01-c90d5dab42a9 was inspected and rejected:
the lamp duplicates/ghosts around 1 s, and the later arch/wall texture and geometry
diverge from the original. The real still photograph is used instead.
