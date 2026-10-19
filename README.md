# Goinggly.in

Website for **goinggly.in** (static site, hosted on GitHub Pages).

## What is where

| Path | What it is |
|---|---|
| `index.html`, `about.html`, `bangkok.html`, `pattaya.html`, `phuket.html`, `krabi.html`, `shimla.html`, `manali.html`, `404.html` | The pages (generated — do not edit by hand, see below) |
| `styles.css`, `main.js` | Look and behaviour (styles, popup form, menu) |
| `images/` | **All photos used on the site**, resized and compressed (JPG). Nothing is hot-linked from other websites. |
| `_source/` | The files the pages are built from (package names/prices, reviews, destination text). Not published on the website. |
| `sitemap.xml`, `robots.txt`, `CNAME` | SEO files and the domain name |

## Images

- Every image lives in `images/` with a fixed name, e.g. `bangkok-hero.jpg`, `pkg-all4.jpg`, `shimla-spot-3.jpg`.
- To replace a photo, save the new one with the **same file name** in `images/`, then rebuild.
- Sizes: hero **1600x900**, cards / highlights / packages **800x600** (JPG, under ~200 KB).
- Large original files (PNG, etc.) are kept outside the website folder, e.g. `Himachal Image/` and the OneDrive "Thailand Website Images" folder.

## Changing content

Content is in `_source/`:

- `_source/packages.js` — package names, routes, highlights, prices (`CARD` section at the bottom)
- `_source/reviews.js` — Google reviews and where each one appears
- `_source/data.js` — destination text (headlines, facts, FAQs)
- `_source/build.js` — builds all pages

Rebuild all pages (needs Node.js):

```
node _source/build.js
```

## Not connected yet

- The enquiry form is not connected to the CRM yet (it opens the visitor's email app).
- No analytics / ad tracking tags yet.
