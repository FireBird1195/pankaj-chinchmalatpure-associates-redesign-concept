# QA report — candidate: initial commit of this repository, 26 Nov 2026

Method: `qa/run.mjs` (Playwright/Chromium, local static server) + manual review of full-page screenshots. Raw output: `qa/results.json`. Run by the builder — **not an independent audit**; the Skill's independent `website-qa-auditor` agent was not available in this Cowork session (NOT_RUN).

| Check | Result | Evidence |
|---|---|---|
| Layout at 390 / 768 / 1440 px, both pages | PASS | 0 px horizontal overflow on all 6; screenshots reviewed at 390 and 1440; two layout defects found and fixed (section header grid collapse; figure margin) |
| Console / page errors | PASS | None, excluding expected 404s for not-yet-supplied images in `assets/projects/` |
| Failed requests (other than images) | PASS | None |
| In-page anchors | PASS | All `#` targets exist on both pages |
| Internal links | PASS | `index.html`, `case-study-apmc.html`, css/fonts/favicon all resolve |
| External links | NOT_RUN | Official site, Instagram, Facebook not fetched from the test runner (network blocked); URLs copied from the official site |
| `noindex` | PASS | meta robots on both pages; `X-Robots-Tag` in `_headers` (header only effective once deployed — NOT_RUN); `robots.txt` disallow all |
| Form: empty submit | PASS | 4 errors shown, focus moves to first invalid field |
| Form: bad phone | PASS | Specific message shown |
| Form: valid submit | PASS | Confirmation panel shown and focused; "start another" restores form. Code contains no fetch/XHR/storage |
| Typology filter | PASS | "Homes" shows 2 rows; live status for screen readers |
| Mobile menu | PASS | Opens, closes on Escape, `aria-expanded` updated |
| Keyboard | PASS (partial) | First Tab = skip link; visible focus ring styled. Full tab-order walk not scripted |
| Reduced motion | PASS | Only motion is smooth anchor scroll, gated by `prefers-reduced-motion` |
| Contrast | PASS (calculated) | Ink-2 on paper ≈ 8:1; laterite on paper ≈ 5.6:1; white on laterite ≈ 6.4:1 |
| Automated a11y (axe) | NOT_RUN | axe not installed in environment |
| Lighthouse / Web Vitals | NOT_RUN | Total shipped weight ≈ 232 KB incl. all 7 font files; no images yet |
| Real images, crops, fallbacks | BLOCKED (fallback PASS) | Archive images could not be downloaded; fallback frame verified. Crops must be reviewed once images are supplied |
| Real devices / Safari / Firefox | NOT_RUN | Chromium only |
| Deployed preview | NOT_RUN | Not published, pending permission |

## Known limitations
- Without photographs the concept leans on typography and diagrams; with the archive images it will look substantially richer. That is also the main ask of the practice.
- Wordmark is set in type; the practice's logo file was not used (could not be retrieved, and permission is pending).
- The case-study map is schematic (directions approximate, not to scale) and labelled as such.
