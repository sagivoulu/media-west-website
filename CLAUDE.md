# Media West website

The website of **Media West**, a volunteer-run West Coast Swing (WCS) community with a weekly Sunday social in Ramat Gan.

**Live preview:** https://sagivoulu.github.io/media-west-website/ (English: `/en/`). GitHub Pages serves the `gh-pages` branch - see Deploying below.

## ⚠️ This repository and the site are PUBLIC

Everything committed here - code, content, images, commit messages, PR text - is public, and everything in `content/` ends up on a public website. Before committing, check that nothing internal slips in:

- **No personal details:** phone numbers, emails, home addresses, private social profiles.
- **No internal links or IDs:** Google Sheets/Drive links, WhatsApp staff-group names or IDs, bot or API details, anything from the internal operations repo that isn't already public.
- **No internal discussions:** money, pay, staffing problems, availability, who-said-what.
- **People:** only list teachers and DJs who agreed to appear, and only use photos where the people in them agreed.
- When unsure whether something is public, ask - don't commit it.

`scripts/check-content.mjs` blocks phone numbers, emails and Google Sheets links in `content/` (it runs in CI), but it can't catch everything.

The internal operations of Media West (schedules, sheets, WhatsApp automation, the weekly promo) live in a separate **private** repo, `sagivoulu/media_west_social`. Don't copy internal material from it into this repo.

## What the site is for

An experiment agreed in the staff group (October 2026): a simple site with our details, to see whether people visit it and how they find us. It's meant for people who don't know Media West yet. Regulars get their updates in WhatsApp and Instagram.

- **Home shows only the essence** - the same text as the Facebook cover: West Coast Swing · Every Sunday / Classes 20:30 · Party 21:40 / Jabotinsky 53, Ramat Gan / No partner needed · No registration · Just show up / Free entry · Donation based.
- **Minimal on purpose.** Keep only what helps a visitor find the info. Don't add sections, decoration or text "just because" - every page should stay short.
- **No weekly lineup** (who teaches, theme nights) - it would be one more place to update every week. The Updates page links to WhatsApp, Instagram and Facebook instead. That includes the DJ schedule: the Music page lists only **past** sets (date, DJ, playlist link), which never need updating once added.
- **No class-level details** (Level 1-3, Technique). The site says classes are for every level, including zero experience.

Pages: Home, Music, Staff, Gallery, About, Location, Updates (the menu is always visible), in Hebrew (default, `/`) and English (`/en/`).

## Stack

| Part | Choice |
|---|---|
| Site | [Astro](https://astro.build), fully static (`astro build` → `dist/`). No backend, no client framework. |
| Content | YAML files in `content/`, read at build time (`src/lib/content.ts`). |
| Hosting now | GitHub Pages (see Deploying). |
| Hosting later | Cloudflare (free plan, custom domain, Cloudflare Web Analytics) - not set up yet. |
| Content updates | Pull requests: people editing through Claude Code, and scheduled routines if any are added later. |

Date-based content (banners, the "new address" tag) is filtered at build time **and** re-checked in the browser on load (inline script in `src/layouts/Base.astro`), so it stays correct between builds.

## Editing content

All copy and data live in `content/` - editors should only need to touch these files and `public/images/`:

| File | What |
|---|---|
| `content/site.yaml` | Times, address, map links, social and donation links, `preview` flag |
| `content/texts.yaml` | The copy of every page, Hebrew and English |
| `content/questions.yaml` | Questions on the About page |
| `content/staff.yaml` | Teachers and DJs (+ optional photo in `public/images/staff/`) |
| `content/dj-sets.yaml` | Sets from past socials on the Music page: date, DJ, playlist link, optional evening title |
| `content/gallery.yaml` | Gallery photos (files in `public/images/gallery/`) |
| `content/banners.yaml` | Dated announcements on Home (e.g. a theme night) |

Conventions:
- Every text has `he` and `en`. Both are required (the check fails otherwise).
- A link left `""` shows as "coming soon". `placeholder: true` shows a small "example" tag - remove it when the real content is in.
- Dates are `YYYY-MM-DD`.
- `site.yaml` → `preview: true` shows the "preview version" strip and adds `noindex`. Set it to `false` only when the site goes public for real.

## Voice and wording

- Say **West Coast Swing / WCS / "West"** - never just "swing" (that's a different dance community).
- Say **classes** (שיעורים), never "lessons".
- **Gender-neutral Hebrew:** neutral phrasing ("נשמח", "למלא את הטופס"); when a gendered form is unavoidable, write both.
- Regular hyphen `-`, never an em dash `—`.
- Short, plain, friendly. No marketing fluff.
- **Never make things up.** If a fact isn't known (prices, parking, a link), leave it empty / "coming soon" and ask.

## Design

The full spec is in `docs/design.md`. In short: a quiet art-gallery look - one light typeface (Heebo), thin rules, lots of space, the logo hung alone on Home like an artwork. Light theme = cream, dark theme = midnight (from the Media West palette). **The logo's colors never change** (`src/assets/wordmark.svg`, `public/favicon.svg`).

## Working in this repo

```bash
npm ci                          # install
npm run dev                     # local preview at http://localhost:4321/media-west-website/
node scripts/check-content.mjs  # validate content/ (also runs in CI)
npm run build                   # build to dist/
```

- Work on a branch and open a PR. Run `node scripts/check-content.mjs` and `npm run build` before pushing; once the CI workflow is installed it runs them on every PR and must pass before merging.
- After a deploy, open the live preview and check the pages you changed (both languages, phone width, light and dark).

## Deploying

**Now:** GitHub Pages serves the `gh-pages` branch (Settings → Pages → "Deploy from a branch", `gh-pages` / root). After merging to `main`, run from an up-to-date `main`:

```bash
npm run deploy   # check content, build, push dist/ to gh-pages (with .nojekyll)
```

Pages publishes it within a minute or two (the "pages build and deployment" run in the Actions tab).

**Target:** automatic deploy on every merge, by the workflow in `docs/deploy-workflow.yml`. Claude's GitHub access here can't create files in `.github/workflows/` (GitHub requires a separate "workflow" permission), so a person installs it once:
1. Create `.github/workflows/deploy.yml` on GitHub (Add file → Create new file) with the contents of `docs/deploy-workflow.yml`, and commit to `main`.
2. Settings → Pages → Source: **GitHub Actions**.
3. From then on every merge to `main` deploys, every PR gets a build check, and `npm run deploy` / the `gh-pages` branch are no longer needed.

Note: cloud sessions may not be able to open `*.github.io` (network policy). To verify a deploy there, clone the `gh-pages` branch and serve it locally under `/media-west-website/`.
- Commit messages and PR text are public too - keep them free of internal details.

## Not decided / not done yet

- Real links: PayBox, Bit - and their logos, which the icon set (simple-icons) doesn't have; add SVGs to `src/components/Icon.astro` when the links exist.
- Photos: staff portraits (with consent; only Sagiv / DJ Sagbot has one so far), gallery.
- The "spirit of Media West" text on About (current text is a placeholder).
- Dates of the three DJ Sagbot sets in `content/dj-sets.yaml` (they're in the Spotify playlist titles). More past sets from other DJs.
- Moving to Cloudflare, a custom domain, analytics.
