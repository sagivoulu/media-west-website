# Design

## Concept

A small, quiet art gallery. The site should feel calm and confident, and it should be easy to find the one thing you came for.

- **Home is the artwork:** the Media West logo hangs alone on an empty wall, with its "wall text" underneath - the same text as the Facebook cover.
- **Every other page is a room:** a title (and at most one lead sentence) on the start side, the content on the other side as listings on thin rules.
- **One strong color:** the logo. Everything else is ink on a plain wall.
- **Less is the feature.** If a section doesn't help a first-time visitor, it doesn't belong.

## Color

Defined as CSS variables in `src/styles/global.css`. The site follows the visitor's system theme; the "Dark/Light" switch overrides it and is remembered.

| Token | Light (cream) | Dark (midnight) | Use |
|---|---|---|---|
| `--bg` | `#FEFBF4` cream | `#0D0E2B` midnight | the wall |
| `--ink` | `#510032` deep plum | `#FFFFFF` | text |
| `--muted` | `#86576F` mauve | `#B9A9C4` | labels, captions, secondary text |
| `--rule` | plum 16% | peach 18% | thin lines |
| `--accent` | `#D63C68` logo pink | `#FFBFA0` peach glow | hover |
| `--orange` | `#C45C32` logo orange | `#F87746` neon orange | the "new address" mark - the only colored text |
| `--frame` | `#FFFFFF` | `#281E40` indigo | picture frames |

The logo keeps its own colors in both themes (orange `#C45C32` → pink `#D63C68`); in dark mode it gets a soft neon glow (from the dark Facebook cover).

## Type

- **Heebo** (Google Fonts) for everything - Hebrew and Latin in one family. Weight 300 for text and headings, 400 for emphasis.
- Sizes: label `.75rem` (uppercase, tracked), body `1rem`, lead `1.25rem`, big `clamp(2rem, 5.5vw, 3.5rem)`.
- Numbers use tabular figures. Time ranges are isolated left-to-right so they read correctly inside Hebrew.

## Layout

- Max width 1120px; side gutter 20px on phones, 48px from 760px.
- Header: the name "Media West" at the start; language and theme switches at the end; **the menu is always visible** on its own row between two rules and wraps on narrow screens (no hamburger).
- Pages: one column on phones; from 860px a 1:2 grid (title column + content column).
- Listings ("rows"): label · value · end note, separated by thin rules. On phones the label moves above the value.
- Staff: portraits in 4:5 frames, 2 per row on phones, 4 from 620px.
- Gallery: framed pictures in two masonry columns, with a short museum-style caption.

## Pages

| Page | Content |
|---|---|
| Home | Logo; active banners (if any); the wall text: West Coast Swing · day / classes · party times / address / "new address" (until end of 2026) / no partner · no registration · just show up / free entry · donation based |
| Music | One line on the music; sets from past socials (date · evening title if any · DJ · Spotify link), newest first |
| Staff | Teachers, then DJs - portrait and name |
| Gallery | Photos with captions |
| About | One-line description; the spirit of Media West; donations (PayBox, Bit); three questions (incl. birthday circles) |
| Location | Address (big); day and times; Waze, Google Maps, copy address; contact via Messenger on the Facebook page |
| Updates | WhatsApp, Instagram, Facebook |

## Behavior

- **Languages:** Hebrew at `/` (right-to-left), English at `/en/` (left-to-right). The switch keeps you on the same page.
- **Brand icons:** links to WhatsApp, Instagram, Facebook, Messenger, Waze, Google Maps and Spotify show the service's icon in its brand color (from simple-icons, CC0), so they're easy to spot. The icon is decorative; the text next to it names the service.
- **Missing content:** an empty link shows "coming soon" instead of a dead link; placeholder content carries a small dashed "example" tag; a missing photo shows an empty frame.
- **Dates:** banners outside their dates and the "new address" mark after 2026 are removed at build time and re-checked in the browser (Israel time), so nothing goes stale between builds.
- **Preview mode** (`preview: true`): a thin strip at the top says it's a preview, and search engines are asked not to index the site.

## Accessibility and performance

- Real page URLs and headings, `lang`/`dir` on every page, a skip link, visible focus, `prefers-reduced-motion` respected, links to other sites open in a new tab.
- No JavaScript framework. Two tiny inline scripts (theme switch + date check) and one on Location (copy address). Images are lazy-loaded.
