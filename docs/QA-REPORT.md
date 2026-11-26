# QA report — v3 (26 Nov 2026)

Candidate: commit "v3: Measured from Zero Mile" on `main`. Method: `qa/run.mjs` (Playwright + Chromium, local static server), axe-core 4 scan, and full-page screenshots reviewed at 1440 and 390 px. Raw output: `qa/results.json`. **Builder-run, not an independent audit**: the Skill's separate QA agent cannot run in this environment (NOT_RUN).

| Check | Result | Evidence |
|---|---|---|
| Layout at 390 / 768 / 1440, both pages | PASS | 0 px horizontal overflow ×6; screenshots reviewed; fixed: hero mosaic gap, feature-image caption blocks, oversized case-study hero image, over-long headings |
| Console and page errors | PASS | None |
| Failed requests | PASS | None |
| Archive images (63 × 2 sizes) | PASS | All 126 files load |
| Archive counts | PASS | Index rows by chapter: Market 3, School 1, City 29, Home 30 = 63; filter labels agree |
| Zero Mile map | PASS | Selecting Saoner shows its 2 clients and links to the Market and Mill chapters; SVG towns work as keyboard buttons (Enter/Space); labels reviewed at desktop and mobile for collisions (2 fixed) |
| Enquiry layout shift | FIXED | Error lines now reserve their height, so the submit button no longer moves while it is being clicked (this was found by the automated test) |
| Index filters | PASS | "घर Home" shows 30; capped "All" view with "Show all 63"; live region announces count |
| Lightbox | PASS | Opens as a modal `<dialog>`; ←/→ move within the filter; Esc closes and returns focus to the tile |
| Jump links (hero ledger, "See all …") | PASS (manual code review) | Filter and scroll to the archive |
| Enquiry form | PASS | Empty submit → 4 errors with focus on the first; bad phone message; valid → confirmation focused; reset works; no network or storage code |
| Mobile menu | PASS | Opens and closes; Esc closes; `aria-expanded` updated |
| Keyboard | PASS (partial) | Skip link first; visible coral focus ring; full tab-order walk not scripted |
| axe-core (WCAG 2 A/AA + best practice) | PASS | 0 violations on both pages at 1440 and 390, after fixing 3 contrast issues on the dark case-study hero |
| Contrast (calculated) | PASS | Body on paper 5.0:1+; coral on charcoal 4.98:1; charcoal on coral button 4.98:1; dark coral on paper 5.6:1 |
| Reduced motion | PASS | Reveal animation and smooth scroll are disabled under `prefers-reduced-motion`; content is visible without JS |
| Performance (local, unthrottled lab) | INDICATIVE | Home: LCP 124–188 ms, CLS 0.002, initial transfer about 90 KB (the Devanagari fonts load only when Devanagari appears); case study about 176 KB. Throttled mobile and Lighthouse NOT_RUN |
| noindex | PASS | `<meta name="robots" content="noindex, nofollow">` on both pages; `robots.txt` disallows all. GitHub Pages ignores `_headers` |
| Real devices, Safari, Firefox | NOT_RUN | |
| Deployed GitHub Pages build | NOT_RUN | Re-check after you push |

## Known limitations
- Source images are about 500–1000 px, so they look soft on large retina screens. The design keeps them at moderate sizes; production needs the practice's originals.
- The archive is rendered by JavaScript (with a `<noscript>` note). That is fine for a noindex concept; production should render it server-side or statically for SEO.
- Room names for interiors and anonymised bungalow labels were written by the concept author.

## Live inspection of the deployed GitHub Pages build (26 Nov 2026)
Checked https://firebird1195.github.io/pankaj-chinchmalatpure-associates-redesign-concept/ in a real browser (Chromium, about 1024 px wide).
- **PASS:** v3 is deployed; title, `noindex`, all 63 index rows and the map data are present; no failed requests or console errors; no horizontal overflow.
- **FIXED, body font never loaded:** Mukta's Devanagari face declared a weight range (`400 600`) that captured all weight-400 matching, so Latin body text fell back to the system font (Inter/Segoe). Each face now has a single weight. Confirmed by checking which font each node actually renders with.
- **FIXED, layout at 1024 px:** the title block was squeezed in the Market chapter (now stacked), the chain bar could highlight the wrong chapter (now computed from scroll position), Market images were not filling their column, and the township images were unequal heights.
- **FIXED:** removed a `data:,` placeholder image in the lightbox that showed up as a broken image.
- A 1024 × 768 viewport was added to the automated run; all 8 page × viewport runs pass.

## Hero revision (26 Nov 2026)
- All 8 page × viewport runs pass, with no overflow, console errors or failed requests. Form, index, lightbox, map (now in the Market chapter) and menu checks pass.
- axe: 0 violations on both pages at 1440 and 390, after replacing an ARIA list role on the links with a `<nav>`.
- Hover and focus widening of the milestones was checked in screenshots. On phones the stones scroll horizontally with snap points and their descriptions are always visible.
- Home page, local lab measurements: LCP 164–236 ms, CLS ≤ 0.017.
