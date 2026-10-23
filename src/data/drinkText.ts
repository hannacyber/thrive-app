// Localized display text for drinks. Shop and menu names stay as the brand
// writes them; categories, generic drinks and size words are translated.
import type { Strings } from '../i18n/en';
import { BRANDS, BrandId, Drink, MenuSection, findDrink, matchDrinks, searchDrinks } from './drinks';
import type { Entry } from '../state/AppState';

const CATEGORY: BrandId[] = ['boba', 'energy', 'soda', 'generic'];

export function isCategory(id: BrandId) {
  return CATEGORY.includes(id);
}

export function brandName(id: BrandId, s: Strings): string {
  if (isCategory(id)) return s.brands[id as 'boba' | 'energy' | 'soda' | 'generic'];
  return BRANDS.find((b) => b.id === id)?.label ?? '';
}

export function brandBlurb(id: BrandId, s: Strings): string {
  return s.brandBlurbs[id];
}

export function drinkName(d: Pick<Drink, 'name'>, s: Strings): string {
  return s.drinkNames[d.name] ?? d.name;
}

const OZ_TO_ML = 29.5735;

export function sizeLabel(size: string | undefined, s: Strings): string {
  if (!size) return s.sizeWords.oneSize;
  let out = size
    .replace(/\bSmall\b/, s.sizeWords.Small)
    .replace(/\bMedium\b/, s.sizeWords.Medium)
    .replace(/\bLarge\b/, s.sizeWords.Large)
    .replace(/\bRegular\b/, s.sizeWords.Regular)
    .replace(/\bcan\b/, s.sizeWords.can)
    .replace(/\bcup\b/, s.sizeWords.cup);
  if (s.showMetric) {
    const m = size.match(/(~?)(\d+(?:\.\d+)?) oz/);
    if (m) out = `${out} · ${m[1]}${Math.round((parseFloat(m[2]) * OZ_TO_ML) / 5) * 5} ml`;
  }
  return out;
}

/** Splits "Grande 16 oz" into ["Grande", "16 oz"] for two-line size chips. */
export function sizeParts(size: string | undefined, s: Strings): [string, string] {
  const label = sizeLabel(size, s);
  const m = label.match(/^([^\d~]+?) (~?\d.*)$/);
  return m ? [m[1], m[2]] : [label, ''];
}

/** "Starbucks Caffè Latte · Grande 16 oz" */
export function drinkFull(d: Drink, s: Strings, withSize = true): string {
  const brand = isCategory(d.brand) ? '' : `${brandName(d.brand, s)} `;
  return `${brand}${drinkName(d, s)}${withSize && d.size ? ` · ${sizeLabel(d.size, s)}` : ''}`;
}

/** Display label for a logged entry (re-localized when it's a known drink). */
export function entryLabel(e: Pick<Entry, 'drinkId' | 'name'>, s: Strings): string {
  const d = findDrink(e.drinkId);
  return d ? drinkFull(d, s) : e.name;
}

export function sectionLabel(sec: MenuSection | 'All', s: Strings): string {
  return sec === 'All' ? s.log.allSections : s.sections[sec];
}

/** Search in the person's language: aliases (拿铁 → latte) are expanded first. */
export function localizedSearch(query: string, s: Strings): Drink[] {
  let q = query;
  for (const [k, v] of Object.entries(s.searchAliases)) {
    if (k && q.toLowerCase().includes(k.toLowerCase())) q += ` ${v}`;
  }
  // Remove the non-Latin alias words themselves so they don't block matching.
  const latin = q.replace(/[^\u0000-\u024F’]+/g, ' ');
  if (!latin.trim()) return [];
  const exact = searchDrinks(latin, 'all');
  if (exact.length) return exact;
  // Ranked fuzzy fallback (on-device keyword scoring).
  return matchDrinks(latin, 6);
}
