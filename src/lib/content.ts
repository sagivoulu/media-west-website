// Loads the YAML files in content/ at build time and exposes small helpers for the pages.
import YAML from 'yaml';
import siteRaw from '../../content/site.yaml?raw';
import textsRaw from '../../content/texts.yaml?raw';
import questionsRaw from '../../content/questions.yaml?raw';
import staffRaw from '../../content/staff.yaml?raw';
import djSetsRaw from '../../content/dj-sets.yaml?raw';
import galleryRaw from '../../content/gallery.yaml?raw';
import bannersRaw from '../../content/banners.yaml?raw';

export type Lang = 'he' | 'en';
export type Bi = { he: string; en: string; placeholder?: boolean };

export const site = YAML.parse(siteRaw);
export const texts = YAML.parse(textsRaw);
export const questions: { q: Bi; a: Bi; link?: { url_key: string } & Bi }[] = YAML.parse(questionsRaw) ?? [];
export const staff: { teachers: (Bi & { photo?: string })[]; djs: { name: string; photo?: string }[] } = YAML.parse(staffRaw);
export const djSets: { date: string; dj: string; url: string; title?: Bi }[] = YAML.parse(djSetsRaw) ?? [];
export const gallery: (Bi & { date: string; image?: string })[] = YAML.parse(galleryRaw) ?? [];
export const banners: (Bi & { from: string; to: string; link?: string })[] = YAML.parse(bannersRaw) ?? [];

/** Pick the text for a language, falling back to Hebrew. */
export const t = (v: Bi | undefined, lang: Lang): string => (v ? v[lang] || v.he : '');

export const PAGES = ['home', 'music', 'staff', 'gallery', 'about', 'location', 'updates'] as const;
export type Page = (typeof PAGES)[number] | '404';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Site-relative URL of a page in a language: /media-west-website/en/music/ */
export function pageUrl(page: Page, lang: Lang): string {
  const prefix = lang === 'en' ? '/en' : '';
  return `${BASE}${prefix}${page === 'home' ? '' : '/' + page}/`;
}

/** URL of a file in public/. */
export const asset = (path: string) => `${BASE}/${path.replace(/^\//, '')}`;

/** Today in Israel as YYYY-MM-DD (used at build time; the browser re-checks on load). */
export function todayIL(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date());
}

/** "11.10" style date for Hebrew, "11 Oct" for English. */
export function shortDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!d) return iso;
  if (lang === 'he') return `${d}.${m}`;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

/** Static paths for a page in both languages: Hebrew at the root, English under /en. */
export const langPaths = () => [{ params: { lang: undefined } }, { params: { lang: 'en' } }];
export const langOf = (param: string | undefined): Lang => (param === 'en' ? 'en' : 'he');
