# QA report — v2 (26 Nov 2026)

Candidate: commit "v2: archive-led redesign" on `main`. Method: `qa/run.mjs` (Playwright + Chromium, local static server), axe-core 4 scan, and full-page screenshots reviewed at 1440 and 390 px. Raw output: `qa/results.json`. **Builder-run, not an independent audit**: the Skill's separate QA agent cannot run in this environment (NOT_RUN).

| Check | Result | Evidence |
|---|---|---|
| Layout at 390 / 768 / 1440, both pages | PASS | 0 px horizontal overflow ×6; screenshots reviewed; fixed: hero mosaic gap, feature-image caption blocks, oversized case-study hero image, over-long headings |
| Console and page errors | PASS | None |
| Failed requests | PASS | None |
| Archive images (63 × 2 sizes) | PASS | All 126 files load |
| Archive counts | PASS | Data, tabs and hero ledger agree: 63 = 15 + 17 + 10 + 3 + 3 + 15 |
| Filter tabs | PASS | "Interiors" shows 15; arrow-key tab switching; live region announces count |
| "Show all 63" | PASS | Expands from the curated 18 to 63 |
| Lightbox | PASS | Opens as a modal `<dialog>`; ←/→ move within the filter; Esc closes and returns focus to the tile |
| Jump links (hero ledger, "See all …") | PASS (manual code review) | Filter and scroll to the archive |
| Enquiry form | PASS | Empty submit → 4 errors with focus on the first; bad phone message; valid → confirmation focused; reset works; no network or storage code |
| Mobile menu | PASS | Opens and closes; Esc closes; `aria-expanded` updated |
| Keyboard | PASS (partial) | Skip link first; visible coral focus ring; full tab-order walk not scripted |
| axe-core (WCAG 2 A/AA + best practice) | PASS | 0 violations on both pages at 1440 and 390, after fixing 4 issues (tabpanel role, muted text contrast in dark sections, crumb link, notice landmark) |
| Contrast (calculated) | PASS | Body on paper 5.0:1+; coral on charcoal 4.98:1; charcoal on coral button 4.98:1; dark coral on paper 5.6:1 |
| Reduced motion | PASS | Reveal animation and smooth scroll are disabled under `prefers-reduced-motion`; content is visible without JS |
| Performance (local, unthrottled lab) | INDICATIVE | Home desktop LCP 188 ms, CLS 0.000; mobile CLS 0.015; initial transfer about 150–250 KB. Throttled mobile and Lighthouse NOT_RUN |
| noindex | PASS | `<meta name="robots" content="noindex, nofollow">` on both pages; `robots.txt` disallows all. GitHub Pages ignores `_headers` |
| Real devices, Safari, Firefox | NOT_RUN | |
| Deployed GitHub Pages build | NOT_RUN | Re-check after you push |

## Known limitations
- Source images are about 500–1000 px, so they look soft on large retina screens. The design keeps them at moderate sizes; production needs the practice's originals.
- The archive is rendered by JavaScript (with a `<noscript>` note). That is fine for a noindex concept; production should render it server-side or statically for SEO.
- Room names for interiors and anonymised bungalow labels were written by the concept author.
