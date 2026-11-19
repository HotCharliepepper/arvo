# R4 source and risk record

Snapshot: 2026-10-28 KST. Implementation review, not publication approval.

| Source | Observed state | Treatment |
| --- | --- | --- |
| GitHub main | 502ea2be3be570484e7d8b2afd4ef00a0648d8be, 2026-10-20; 1,836,868-byte index.html is a partnership proposal | Preserve root index.html and README.md; add r4/ |
| Branches and PRs at intake | main only after all branch pages; no open PRs | New work/r4-visual-booking-review-20261028 branch |
| Netlify | sacheon-arvo; current production 6ad71ed87994dfa29d18c874 at the same main commit; no password or team-login protection | No account settings changes; exclude unapproved assets from public preview |
| Netlify environment variables | Site-level list returned empty | No variables added or changed; shared variables and complete dashboard build settings not independently inspected |
| Supplied R3 | Eight types, intent filters, FAQ and release gates | Preserve data identity and behavior; warm visual redesign; stronger media/schema gates |
| Project sources | Required facts, scope, channel SOP and decision ledger matched the R4 package | Operating approval flags remain false; no private contract content republished |
| Original media | Nine JPEGs plus 23.052 s, 1440×1440 HEVC | CONFIRMED / FILE RECEIVED; rights, capture date and room mapping NEED VERIFY |
| OTA destinations | NOL 1000099461 and Yeogi 57753 displayed ARVO on retrieval | CONFIRMED / DISPLAYED, not approved operation, room assignment or availability |
| Palette from lobby photograph | Warm charcoal, wood, terracotta and cream | RECOMMENDATION, not approved brand standard |
| Image-first design helps guest decisions | No experiment measured | HYPOTHESIS |

## Controls

- Public GitHub and ordinary Netlify previews are not private review storage.
  Private media, source contracts and review evidence are gitignored.
- Default build uses an allowlist and individual boolean approvals, not recursive
  media-folder copying. Unapproved files remain excluded even if locally present.
- R3's unapproved lodging schema and OTA operating times are omitted.
- The legacy proposal's contract amounts, questionnaire and embedded images are
  not reused in the guest site.
- OTA clicks are outbound navigation only. No cookies, tracking or reservation
  success state is implemented.
- Production and private-profile CI builds fail closed.

## Recovery provenance

The execution environment disconnected during full-page browser capture.
The implementation was recovered from the recorded source edits into this
branch through the connected GitHub tools. The HTML template was separated from
the builder during recovery. The final recovered commit therefore requires its
own automated build and browser verification; the earlier local results are
recorded as baseline evidence, not automatically attributed to this commit.
