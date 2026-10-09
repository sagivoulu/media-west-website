# Media West website

## 👉 View the site: https://sagivoulu.github.io/media-west-website/

This is currently the only place to see the actual website. It's a **preview for the team** - please don't share the link publicly yet. English version: https://sagivoulu.github.io/media-west-website/en/

---

The website of Media West, a volunteer-run West Coast Swing community dancing every Sunday in Ramat Gan.

> **This repository is public, and so is everything on the site.** Never commit phone numbers, emails, internal links, or anything else that shouldn't be public. See [CLAUDE.md](CLAUDE.md#️-this-repository-and-the-site-are-public).

## How it works

- A static site built with [Astro](https://astro.build). No backend.
- All texts, links and data are YAML files in [`content/`](content/); images are in [`public/images/`](public/images/).
- Every push to `main` builds the site and deploys it to GitHub Pages ([workflow](.github/workflows/deploy.yml)).

## Changing content

Edit the files in [`content/`](content/) (or ask Claude Code to), open a pull request, and merge it once the check passes. The site updates about two minutes later. Details: [CLAUDE.md → Editing content](CLAUDE.md#editing-content). The design is described in [docs/design.md](docs/design.md).

## Running locally

```bash
npm ci
npm run dev    # http://localhost:4321/media-west-website/
```
