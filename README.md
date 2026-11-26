# Pankaj Chinchmalatpure & Associates — redesign concept (unofficial)

**This is an independent, speculative design concept.** It is not the website of Pankaj Chinchmalatpure & Associates, and the practice has not commissioned, endorsed or approved it. Facts, renderings and photographs come from the practice's own public website and are used with permission obtained by the concept's author. Renderings are design visualisations, not photographs of completed buildings.

## Pages
- `index.html` — homepage: brand-led hero, a filterable archive of 63 projects with a lightbox, selected work, interiors, services, leadership, clients, enquiry.
- `case-study-apmc.html` — case study of three designs for A.P.M.C. Nagpur.

## Stack
Static HTML, CSS and vanilla JS. No build step, no backend, no tracking, no cookies. Fonts (Archivo, Public Sans, IBM Plex Mono; SIL OFL) are self-hosted. Archive data lives in `js/projects.js`. The enquiry form validates locally and **sends and stores nothing**.

## Images
`assets/img/` holds web-sized WebP copies (full size plus `-sm` thumbnails). Regenerate them from the practice's originals with `python3 scripts/process_images.py <source-dir> assets/img` (needs Pillow).

## Run locally
`npx serve .` or `python -m http.server` in this folder.

## Deploy
- **GitHub Pages:** Settings → Pages → deploy from `main` / root. Links are relative, so the `/repo-name/` base path works.
- **Cloudflare Pages:** preset None, no build command, output `/`. `_headers` adds `X-Robots-Tag: noindex` and a CSP.

Every page carries `noindex, nofollow`; `robots.txt` disallows crawling.

## QA
`node qa/run.mjs .` (Playwright). See `docs/QA-REPORT.md` and `docs/VERIFICATION.md`.
