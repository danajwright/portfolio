# Dana J. Wright — Portfolio

Personal portfolio site for Dana J. Wright, Design Lead at Derive.xyz. A minimal, two-column layout showcasing 10+ years of product design work across crypto, fintech, and consumer apps.

## Structure

- `index.html` — Single-page layout with a project list on the left and a live image preview pane on the right
- `styles.css` — All styles, including Söhne web font declarations and responsive layout
- `script.js` — Hover interaction: highlights the active project row and swaps the preview image
- `font/` — Söhne typeface (TTF, multiple weights and styles)
- `images/` — Project thumbnail assets (WebP and GIF)
- `tests/` — Jest regression tests

## Running locally

No build step required. Open `index.html` directly in a browser, or use any static file server:

```bash
npx serve .
```

## Tests

```bash
npm test
```

Tests use Jest and jsdom to verify the hover interaction logic.
