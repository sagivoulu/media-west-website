// Checks content/*.yaml before a build: valid YAML, both languages present, dates and links well formed,
// referenced images exist, and nothing that looks private (phone numbers, emails) - this repo and site are public.
// Usage: node scripts/check-content.mjs   (exit code 1 on any problem)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

const dir = new URL('../content/', import.meta.url).pathname;
const errors = [];
const load = (f) => {
  try { return YAML.parse(readFileSync(join(dir, f), 'utf8')); }
  catch (e) { errors.push(`${f}: not valid YAML - ${e.message.split('\n')[0]}`); return null; }
};
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const isUrl = (s) => s === '' || /^https:\/\/\S+$/.test(s);
const bi = (v, where) => {
  if (!v || typeof v !== 'object') return errors.push(`${where}: missing`);
  for (const l of ['he', 'en']) if (typeof v[l] !== 'string' || !v[l].trim()) errors.push(`${where}: missing "${l}" text`);
};

// Privacy guard: scan every content file as text.
for (const f of readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
  const text = readFileSync(join(dir, f), 'utf8');
  text.split('\n').forEach((line, i) => {
    if (/^\s*#/.test(line)) return;
    if (/(?:\+?972|\b0)5\d[-\s]?\d{3}[-\s]?\d{4}\b/.test(line)) errors.push(`${f}:${i + 1}: looks like a phone number - the site is public`);
    if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(line)) errors.push(`${f}:${i + 1}: looks like an email address - the site is public`);
    if (/docs\.google\.com\/spreadsheets/.test(line)) errors.push(`${f}:${i + 1}: links to a Google Sheet - internal sheets must not be public`);
  });
}

const site = load('site.yaml');
if (site) {
  if (!isDate(site.address?.new_until)) errors.push('site.yaml: address.new_until must be a YYYY-MM-DD date');
  for (const [k, v] of Object.entries(site.links ?? {})) if (!isUrl(v ?? '')) errors.push(`site.yaml: links.${k} must be an https:// link or ""`);
  for (const k of ['waze', 'google_maps']) if (!isUrl(site.address?.[k] ?? 'x')) errors.push(`site.yaml: address.${k} must be an https:// link`);
}

const texts = load('texts.yaml');
if (texts) {
  const walk = (o, path) => {
    if (o && typeof o === 'object' && ('he' in o || 'en' in o)) return bi(o, `texts.yaml: ${path}`);
    if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${path}[${i}]`));
    if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, path ? `${path}.${k}` : k);
  };
  walk(texts, '');
}

(load('questions.yaml') ?? []).forEach((q, i) => {
  bi(q.q, `questions.yaml #${i + 1} q`); bi(q.a, `questions.yaml #${i + 1} a`);
  if (q.link && !(site?.links && q.link.url_key in site.links)) errors.push(`questions.yaml #${i + 1}: link.url_key "${q.link.url_key}" is not in site.yaml links`);
});

const staff = load('staff.yaml');
if (staff) {
  (staff.teachers ?? []).forEach((p, i) => {
    bi(p, `staff.yaml teachers #${i + 1}`);
    if (p.photo && !existsSync(new URL(`../public/images/staff/${p.photo}`, import.meta.url))) errors.push(`staff.yaml: photo public/images/staff/${p.photo} not found`);
  });
  (staff.djs ?? []).forEach((p, i) => {
    if (!p.name) errors.push(`staff.yaml djs #${i + 1}: missing name`);
    if (p.photo && !existsSync(new URL(`../public/images/staff/${p.photo}`, import.meta.url))) errors.push(`staff.yaml: photo public/images/staff/${p.photo} not found`);
  });
}

(load('dj-sets.yaml') ?? []).forEach((d, i) => {
  if (d.date && !isDate(d.date)) errors.push(`dj-sets.yaml #${i + 1}: date "${d.date}" must be YYYY-MM-DD or ""`);
  if (!d.dj) errors.push(`dj-sets.yaml #${i + 1}: missing dj`);
  if (!d.url || !isUrl(d.url)) errors.push(`dj-sets.yaml #${i + 1}: url must be an https:// link to the playlist`);
  if (d.title) bi(d.title, `dj-sets.yaml #${i + 1} title`);
});

(load('gallery.yaml') ?? []).forEach((g, i) => {
  bi(g, `gallery.yaml #${i + 1}`);
  if (g.image && !existsSync(new URL(`../public/images/gallery/${g.image}`, import.meta.url))) errors.push(`gallery.yaml: image public/images/gallery/${g.image} not found`);
});

(load('banners.yaml') ?? []).forEach((b, i) => {
  bi(b, `banners.yaml #${i + 1}`);
  if (!isDate(b.from) || !isDate(b.to)) errors.push(`banners.yaml #${i + 1}: from/to must be YYYY-MM-DD dates`);
  else if (b.from > b.to) errors.push(`banners.yaml #${i + 1}: "from" is after "to"`);
  if (b.link && !isUrl(b.link)) errors.push(`banners.yaml #${i + 1}: link must be an https:// link`);
});

if (errors.length) {
  console.error(`Content check failed (${errors.length}):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log('Content check passed.');
