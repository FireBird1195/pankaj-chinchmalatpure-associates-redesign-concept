# Pankaj Chinchmalatpure & Associates — redesign concept (unofficial)

**This is an independent, speculative design concept.** It is not the website of Pankaj Chinchmalatpure & Associates, and the practice has not commissioned, endorsed or approved it. Business facts come from the practice's own public website and await its confirmation.

## What it is
A two-page static prototype:
- `index.html` — practice homepage: lineage, a filterable index of work by building type, services, leadership and an enquiry path.
- `case-study-apmc.html` — case study of the practice's work for five Agricultural Produce Market Committees.

No framework, no build step, no backend, no tracking. Fonts (Newsreader, Public Sans, IBM Plex Mono — SIL OFL) are self-hosted. The enquiry form validates locally and **sends and stores nothing**.

## Run locally
Any static server from this folder, e.g. `npx serve .` or `python -m http.server`, then open http://localhost:3000 (or :8000).

## Images
No photographs of the practice's work are included in this repository. Image frames show a drawn placeholder until files are placed in `assets/projects/` (git-ignored). Only after the practice grants permission: `node scripts/fetch-archive-images.mjs`, then convert to JPEG/WebP.

## Deploy (Cloudflare Pages)
Framework preset: None · Build command: (empty) · Output directory: `/`. All links are relative, so it works at any base path. `_headers` sends `X-Robots-Tag: noindex` and a strict CSP; every page also carries `<meta name="robots" content="noindex, nofollow">` and `robots.txt` disallows all.

## QA
`node qa/run.mjs .` (needs Playwright) — checks three viewports for overflow, console errors, broken anchors, noindex, form validation, filter and menu. See `docs/QA-REPORT.md`.
