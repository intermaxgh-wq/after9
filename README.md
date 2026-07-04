# AFTER9 — Static Site

Static export of the AFTER9 pre-launch page, ready for GitHub Pages.

## Structure
```
index.html
style.css
script.js
assets/img/tee-front.jpg
assets/img/tee-back.jpg
assets/img/about-graphic.jpg
```

## Deploy to GitHub Pages
1. Push this folder's contents to the root of a GitHub repo.
2. In the repo: **Settings → Pages → Build and deployment → Source** → "Deploy from a branch".
3. Pick the `main` branch and `/ (root)` folder, then Save.
4. Your site goes live at `https://<username>.github.io/<repo-name>/` within a minute or two.

(If you'd rather use a `gh-pages` branch instead of `main`, push there and select it in the same Pages settings screen.)

## Before you go live — 3 things carried over from your source file
These aren't things the export changed or broke — they're placeholders already in your original file that only you can fill in:

1. **Paystack public key** — `script.js` line 4 has `PAYSTACK_PUBLIC_KEY = ''`. The checkout modal will show "Payment system did not load" until you paste your real public key from the Paystack dashboard. (The Paystack SDK `<script>` tag itself was missing from the original file — added it to `index.html` so the modal has something to call.)
2. **Formspree form ID** — the "Notify Me" form in `index.html` still points to `https://formspree.io/f/YOUR_FORM_ID`. Swap in your real Formspree endpoint or emails won't be collected.
3. **Coming Soon carousel** — the copy says "Five more pieces landing soon," but `script.js`'s `PRODUCTS` array only has one placeholder entry ("999"). Worth checking whether that's intentional for launch or needs the other four added.

The contact form at the bottom of the page is also front-end only (it just shows "Sent ✓" locally) — connect it to Formspree or similar if you want those messages to actually reach you.
