#!/usr/bin/env bash
# Builds the site and publishes dist/ to the gh-pages branch, which GitHub Pages serves.
# Used until the GitHub Actions workflow (docs/deploy-workflow.yml) is installed; after that, merging to main deploys.
# Usage: npm run deploy   (from an up-to-date main)
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/check-content.mjs
npm run build
touch dist/.nojekyll   # Pages must not run Jekyll: it would drop the _astro/ folder
rev=$(git rev-parse --short HEAD)
tmp=$(mktemp -d)
cp -r dist/. "$tmp"
cd "$tmp"
git init -q -b gh-pages
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-$(git -C "$OLDPWD" config user.name)}" -c user.email="${GIT_AUTHOR_EMAIL:-$(git -C "$OLDPWD" config user.email)}" \
  commit -q -m "Deploy $rev"
git push -q -f "$(git -C "$OLDPWD" remote get-url origin)" gh-pages
echo "Deployed $rev to gh-pages."
