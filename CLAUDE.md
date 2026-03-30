# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                        # run all Jest tests
npx jest --testNamePattern="X"  # run a single test by name
npx serve .                     # serve locally (no build step)
```

## Architecture

This is a no-build static site — plain HTML, CSS, and JS with no bundler or framework.

**Pages:** `index.html` (About / home), `portfolio.html` (two-column project list), `contact.html` (social links). All share `styles.css`; only `portfolio.html` loads `script.js`.

**Interaction model:** `script.js` drives the two-column layout on `portfolio.html`. Each `.project-row` in the left column has a `data-index` attribute. On `mouseenter`, the row gains `row-active` and the matching `.preview-img[data-index]` in the right pane gains `is-visible`; all others are stripped of those classes. Row 0 is activated by default on load.

**Tests** (`tests/regression.test.js`) use Jest + jsdom to load the raw HTML/CSS/JS files from disk and exercise the DOM directly. They assert structural invariants (13 projects, correct indices, non-empty titles/briefs) and JS behaviour (hover activation, mutual exclusivity, mouseleave stability). When adding or removing projects, update both `portfolio.html` and the count assertions in the test file.
