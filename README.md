# CIVILMERC Website

Official website for **CivilMerc**.

This repository holds the source code for the CivilMerc public website.

## Brand assets

Logos and brand PDFs live under `assets/brand/`:

- `logo-horizontal.png` — header and footer
- `logo-stacked.png` — vertical lockup
- `logo-icon.png` — favicon and compact marks
- `docs/` — brand guidbook and company profile (PDF)

## JavaScript (`assets/js/`)

- `main2.js` — jQuery (vendored locally)
- `main.js` — Webflow site runtime (vendored; badge removed)

All pages load `main2.js` then `main.js` (use `../assets/js/` under `projects/`).
