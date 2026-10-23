// Caffeine reference data for drinks commonly bought in California.
//
// Every number below comes from a named source in SOURCES, and every drink is
// tagged with how much to trust it:
//   official  – published by the brand itself (menu data, label, nutrition PDF, FAQ)
//   secondary – reported by a third party (usually citing the brand's customer
//               service) because the brand does not publish a per-drink number
//   estimate  – no brand figure exists; derived from lab measurements of the
//               drink category (e.g. boba milk tea)
//
// Data checked: DATA_CHECKED (see below). Recipes change — re-verify before each
// release. THRIVE is not affiliated with, sponsored or endorsed by any brand
// named here; names are used only to identify the drinks.

export const DATA_CHECKED = '2026-09-30';

export type SourceKind = 'official' | 'secondary' | 'estimate';
export type DrinkIcon = 'coffee' | 'zap' | 'droplet';

export type BrandId =
  | 'generic'
  | 'starbucks'
  | 'peets'
  | 'dutch'
  | 'dunkin'
  | 'mcd'
  | 'panera'
  | 'bluebottle'
  | 'cbtl'
  | 'happylemon'
  | 'chicha'
  | 'tigersugar'
  | 'kungfu'
  | 'gongcha'
  | 'boba'
  | 'energy'
  | 'soda';

export type BrandMeta = { id: BrandId; label: string; blurb: string };

// Brand tiles use THRIVE's own drink illustrations (src/ui/BrandBadge.tsx) in
// THRIVE's own colors — no logos, brand colors or trade dress (Guideline 5.2).
// `label`/`blurb` here are the English fallbacks; UI text comes from src/i18n.
export const BRANDS: BrandMeta[] = [
  { id: 'starbucks', label: 'Starbucks', blurb: 'Coffee & refreshers' },
  { id: 'peets', label: 'Peet’s', blurb: 'Coffee' },
  { id: 'dutch', label: 'Dutch Bros', blurb: 'Coffee & Rebel' },
  { id: 'dunkin', label: 'Dunkin’', blurb: 'Coffee' },
  { id: 'mcd', label: 'McDonald’s', blurb: 'McCafé & tea' },
  { id: 'panera', label: 'Panera', blurb: 'Coffee & tea' },
  { id: 'bluebottle', label: 'Blue Bottle', blurb: 'Cans & cartons' },
  { id: 'cbtl', label: 'Coffee Bean', blurb: 'Coffee' },
  { id: 'happylemon', label: 'Happy Lemon', blurb: 'Milk tea & fruit tea' },
  { id: 'chicha', label: 'Chicha San Chen', blurb: 'Fresh-brewed tea' },
  { id: 'tigersugar', label: 'Tiger Sugar', blurb: 'Brown sugar boba' },
  { id: 'kungfu', label: 'Kung Fu Tea', blurb: 'Milk tea & fruit tea' },
  { id: 'gongcha', label: 'Gong Cha', blurb: 'Milk tea & milk foam' },
  { id: 'boba', label: 'Boba / milk tea', blurb: 'Any boba shop' },
  { id: 'energy', label: 'Energy drinks', blurb: 'Cans' },
  { id: 'soda', label: 'Soda & bottled', blurb: 'Cans & bottles' },
  { id: 'generic', label: 'Made at home', blurb: 'Coffee & tea' },
];

export function brandLabel(id: BrandId): string {
  return BRANDS.find((b) => b.id === id)?.label ?? '';
}

export type SourceId =
  | 'sbux'
  | 'sbux_ci'
  | 'peets_faq'
  | 'peets_ci'
  | 'bluebottle'
  | 'cbtl_ci'
  | 'mcd_ci'
  | 'dunkin_blog'
  | 'dunkin_ci'
  | 'dunkin_tt'
  | 'dutch'
  | 'panera'
  | 'fda'
  | 'usda_espresso'
  | 'hk_cfs'
  | 'tea_ci'
  | 'greentea_ci'
  | 'oolong_ci'
  | 'ts_menu'
  | 'gc_menu'
  | 'redbull'
  | 'monster'
  | 'celsius'
  | 'alani'
  | 'ghost'
  | 'c4'
  | 'bang'
  | 'prime'
  | 'rockstar_ci'
  | 'reign'
  | 'coke'
  | 'pepsi_ci'
  | 'drpepper'
  | 'arizona'
  | 'sbux_rtd_ci';

export const SOURCES: Record<SourceId, { name: string; url: string }> = {
  sbux: { name: 'Starbucks menu nutrition data (starbucks.com)', url: 'https://www.starbucks.com/menu' },
  sbux_ci: { name: 'Caffeine Informer — Starbucks brewed coffee (Venti only)', url: 'https://www.caffeineinformer.com/caffeine-content/starbucks-grande-coffee' },
  peets_faq: { name: 'Peet’s Coffee FAQ — Coffeebar beverages', url: 'https://faq.peets.com/hc/en-us/articles/53401935275028-Coffeebar-Beverages' },
  peets_ci: { name: 'Caffeine Informer — Peet’s (citing Peet’s customer service)', url: 'https://www.caffeineinformer.com/caffeine-content/peets-latte' },
  bluebottle: { name: 'Blue Bottle Coffee support — Caffeine', url: 'https://support.bluebottlecoffee.com/hc/en-us/articles/15241685821339-Caffeine' },
  cbtl_ci: { name: 'Caffeine Informer — Coffee Bean & Tea Leaf', url: 'https://www.caffeineinformer.com/caffeine-content/coffee-bean-tea-leaf-coffee' },
  mcd_ci: { name: 'Caffeine Informer — McCafé (citing McDonald’s customer service)', url: 'https://www.caffeineinformer.com/mccafe-coffee-caffeine-content' },
  dunkin_blog: { name: 'Dunkin’ newsroom — top coffee questions', url: 'https://news.dunkindonuts.com/blog/top-coffee-questions-national-coffee-day' },
  dunkin_ci: { name: 'Caffeine Informer — Dunkin’ guide', url: 'https://www.caffeineinformer.com/complete-guide-to-dunkin-donuts-caffeine-content' },
  dunkin_tt: { name: 'Tasting Table — Dunkin’ Refreshers caffeine', url: 'https://www.tastingtable.com/1795234/how-much-caffeine-in-dunkin-refreshers' },
  dutch: { name: 'Dutch Bros nutritional guide (PDF)', url: 'https://files.dutchbros.com/website/menu/nutritional-guide.pdf' },
  panera: { name: 'Panera Beverage Caffeine Guide (PDF, 3/2026)', url: 'https://www.panerabread.com/content/dam/panerabread/documents/c3-26-beverage-caffeine-guide.pdf' },
  fda: { name: 'U.S. FDA — Spilling the Beans: How Much Caffeine Is Too Much?', url: 'https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much' },
  usda_espresso: { name: 'USDA FoodData Central — espresso', url: 'https://fdc.nal.usda.gov/' },
  hk_cfs: { name: 'Hong Kong Centre for Food Safety — caffeine in milk tea (lab study)', url: 'https://www.cfs.gov.hk/english/programme/programme_rafs/programme_rafs_fci_01_04.html' },
  tea_ci: { name: 'Caffeine Informer — brewed black tea', url: 'https://www.caffeineinformer.com/caffeine-content/tea-brewed' },
  greentea_ci: { name: 'Caffeine Informer — green tea', url: 'https://www.caffeineinformer.com/caffeine-content/green-tea' },
  ts_menu: { name: 'Tiger Sugar US online menu — this drink lists milk and brown sugar, no tea or coffee (0 mg assumed)', url: 'https://order.online/store/-24068235' },
  gc_menu: { name: 'Gong Cha US online menu — this drink lists no tea or coffee (0 mg assumed)', url: 'https://order.online/store/-25111351' },
  oolong_ci: { name: 'Caffeine Informer — oolong tea', url: 'https://www.caffeineinformer.com/caffeine-content/oolong-tea' },
  redbull: { name: 'Red Bull — caffeine per can', url: 'https://www.redbull.com/us-en/energydrink/questions/how-much-caffeine-is-in-a-can-of-red-bull-energy-drink' },
  monster: { name: 'Monster Energy product pages', url: 'https://www.monsterenergy.com/en-us/energy-drinks/' },
  celsius: { name: 'Celsius — essential facts', url: 'https://www.celsius.com/essential-facts/' },
  alani: { name: 'Alani Nu FAQ', url: 'https://www.alaninu.com/pages/faq' },
  ghost: { name: 'GHOST Energy label (retail listing)', url: 'https://www.target.com/p/ghost-energy-drink-original-single-16-fl-oz/-/A-95024723' },
  c4: { name: 'Cellucor — C4 Original Carbonated', url: 'https://cellucor.com/products/c4-original-carbonated' },
  bang: { name: 'Bang Energy product page', url: 'https://www.bangenergy.com/en-us/products/blue-razz/' },
  prime: { name: 'PRIME Energy product page', url: 'https://drinkprime.com/products/energy-original' },
  rockstar_ci: { name: 'Caffeine Informer — Rockstar', url: 'https://www.caffeineinformer.com/caffeine-content/rockstar' },
  reign: { name: 'REIGN Total Body Fuel', url: 'https://www.reignbodyfuel.com/' },
  coke: { name: 'The Coca-Cola Company — caffeine FAQ', url: 'https://www.coca-colacompany.com/about-us/faq/what-is-caffeine' },
  pepsi_ci: { name: 'Caffeine Informer — PepsiCo beverages (citing PepsiCo Beverage Facts)', url: 'https://www.caffeineinformer.com/caffeine-content/pepsi-cola' },
  drpepper: { name: 'Dr Pepper FAQ', url: 'https://www.drpepper.com/en/faq' },
  arizona: { name: 'AriZona Beverages FAQ', url: 'https://drinkarizona.com/pages/faq' },
  sbux_rtd_ci: { name: 'Caffeine Informer — Starbucks bottled & canned drinks', url: 'https://www.caffeineinformer.com/caffeine-content/starbucks-bottled-frappucino' },
};

export type Drink = {
  id: string;
  brand: BrandId;
  name: string;
  size?: string;
  mg: number;
  icon: DrinkIcon;
  kind: SourceKind;
  src: SourceId;
  /** Extra search words (e.g. nicknames). */
  tags?: string;
};

const C: DrinkIcon = 'coffee';
const Z: DrinkIcon = 'zap';
const D: DrinkIcon = 'droplet';

function d(
  id: string,
  brand: BrandId,
  name: string,
  size: string | undefined,
  mg: number,
  icon: DrinkIcon,
  kind: SourceKind,
  src: SourceId,
  tags?: string
): Drink {
  return { id, brand, name, size, mg, icon, kind, src, tags };
}

/**
 * One drink in several sizes. Each size becomes its own Drink with id
 * `${prefix}-${suffix}` — the same brand + name groups them in the picker.
 * A size can override kind/src when its number comes from a different source.
 */
function sized(
  prefix: string,
  brand: BrandId,
  name: string,
  icon: DrinkIcon,
  kind: SourceKind,
  src: SourceId,
  tags: string,
  sizes: [suffix: string, size: string, mg: number, kind?: SourceKind, src?: SourceId][]
): Drink[] {
  return sizes.map(([suffix, size, mg, k, sr]) => d(`${prefix}-${suffix}`, brand, name, size, mg, icon, k ?? kind, sr ?? src, tags));
}

const SB = 'starbucks' as const;

export const DRINKS: Drink[] = [
  // ── Starbucks (official: starbucks.com menu nutrition data) ─────────────────
  ...sized('sbux-pike', SB, 'Pike Place Roast', C, 'official', 'sbux', 'brewed drip coffee hot', [
    ['tall', 'Tall 12 oz', 235], ['grande', 'Grande 16 oz', 315], ['venti', 'Venti 20 oz', 410, 'secondary', 'sbux_ci'],
  ]),
  ...sized('sbux-blonde', SB, 'Blonde Roast (Sunsera)', C, 'official', 'sbux', 'brewed drip coffee hot blonde', [
    ['tall', 'Tall 12 oz', 235], ['grande', 'Grande 16 oz', 315], ['venti', 'Venti 20 oz', 390],
  ]),
  ...sized('sbux-decaf', SB, 'Decaf Pike Place', C, 'official', 'sbux', 'decaf brewed coffee', [
    ['tall', 'Tall 12 oz', 20], ['grande', 'Grande 16 oz', 25], ['venti', 'Venti 20 oz', 30],
  ]),
  ...sized('sbux-latte', SB, 'Caffè Latte', C, 'official', 'sbux', 'latte hot', [
    ['tall', 'Tall 12 oz', 75], ['grande', 'Grande 16 oz', 150], ['venti', 'Venti 20 oz', 150],
  ]),
  ...sized('sbux-icedlatte', SB, 'Iced Caffè Latte', C, 'official', 'sbux', 'latte iced', [
    ['tall', 'Tall 12 oz', 75], ['grande', 'Grande 16 oz', 150], ['venti', 'Venti 24 oz', 225],
  ]),
  ...sized('sbux-cappuccino', SB, 'Cappuccino', C, 'official', 'sbux', '', [
    ['tall', 'Tall 12 oz', 75], ['grande', 'Grande 16 oz', 150], ['venti', 'Venti 20 oz', 150],
  ]),
  ...sized('sbux-flatwhite', SB, 'Flat White', C, 'official', 'sbux', '', [
    ['tall', 'Tall 12 oz', 130], ['grande', 'Grande 16 oz', 195],
  ]),
  ...sized('sbux-americano', SB, 'Caffè Americano', C, 'official', 'sbux', 'americano', [
    ['short', 'Short 8 oz', 75], ['tall', 'Tall 12 oz', 150], ['grande', 'Grande 16 oz', 225],
  ]),
  ...sized('sbux-mocha', SB, 'Caffè Mocha', C, 'official', 'sbux', 'mocha chocolate', [
    ['tall', 'Tall 12 oz', 95], ['grande', 'Grande 16 oz', 175],
  ]),
  ...sized('sbux-icedcaramel', SB, 'Iced Caramel Macchiato', C, 'official', 'sbux', 'caramel macchiato', [
    ['tall', 'Tall 12 oz', 75], ['grande', 'Grande 16 oz', 150], ['venti', 'Venti 24 oz', 225],
  ]),
  ...sized('sbux-espresso', SB, 'Espresso', C, 'official', 'sbux', 'shot', [
    ['solo', 'Solo', 75], ['doppio', 'Doppio', 150],
  ]),
  ...sized('sbux-coldbrew', SB, 'Cold Brew', C, 'official', 'sbux', 'cold brew iced', [
    ['tall', 'Tall 12 oz', 155], ['grande', 'Grande 16 oz', 205], ['venti', 'Venti 24 oz', 310],
  ]),
  ...sized('sbux-nitro', SB, 'Nitro Cold Brew', C, 'official', 'sbux', 'nitro cold brew', [
    ['tall', 'Tall 12 oz', 215], ['grande', 'Grande 16 oz', 280],
  ]),
  ...sized('sbux-icedcoffee', SB, 'Iced Coffee', C, 'official', 'sbux', 'iced coffee', [
    ['tall', 'Tall 12 oz', 135], ['grande', 'Grande 16 oz', 185], ['venti', 'Venti 24 oz', 265],
  ]),
  ...sized('sbux-shaken', SB, 'Iced Shaken Espresso', C, 'official', 'sbux', 'shaken espresso', [
    ['tall', 'Tall 12 oz', 150], ['grande', 'Grande 16 oz', 225], ['venti', 'Venti 24 oz', 300],
  ]),
  ...sized('sbux-bsoe', SB, 'Iced Brown Sugar Oatmilk Shaken Espresso', C, 'official', 'sbux', 'brown sugar oat shaken espresso bsoe', [
    ['tall', 'Tall 12 oz', 170], ['grande', 'Grande 16 oz', 255], ['venti', 'Venti 24 oz', 340],
  ]),
  ...sized('sbux-frapp-coffee', SB, 'Coffee Frappuccino', C, 'official', 'sbux', 'frappuccino frap blended', [
    ['tall', 'Tall 12 oz', 65], ['grande', 'Grande 16 oz', 95], ['venti', 'Venti 24 oz', 125],
  ]),
  ...sized('sbux-frapp-mocha', SB, 'Mocha Frappuccino', C, 'official', 'sbux', 'frappuccino frap blended mocha', [
    ['tall', 'Tall 12 oz', 70], ['grande', 'Grande 16 oz', 100], ['venti', 'Venti 24 oz', 130],
  ]),
  ...sized('sbux-frapp-caramel', SB, 'Caramel Frappuccino', C, 'official', 'sbux', 'frappuccino frap blended caramel', [
    ['tall', 'Tall 12 oz', 60], ['grande', 'Grande 16 oz', 90], ['venti', 'Venti 24 oz', 120],
  ]),
  ...sized('sbux-matcha', SB, 'Iced Matcha Latte', D, 'official', 'sbux', 'matcha green tea latte', [
    ['tall', 'Tall 12 oz', 40], ['grande', 'Grande 16 oz', 65], ['venti', 'Venti 24 oz', 85],
  ]),
  ...sized('sbux-chai', SB, 'Chai Latte', D, 'official', 'sbux', 'chai tea latte hot', [
    ['tall', 'Tall 12 oz', 35], ['grande', 'Grande 16 oz', 55],
  ]),
  ...sized('sbux-icedchai', SB, 'Iced Chai Latte', D, 'official', 'sbux', 'chai tea latte iced', [
    ['tall', 'Tall 12 oz', 45], ['grande', 'Grande 16 oz', 60], ['venti', 'Venti 24 oz', 90],
  ]),
  ...sized('sbux-straw', SB, 'Strawberry Açaí Refresher', D, 'official', 'sbux', 'refresher strawberry acai', [
    ['tall', 'Tall 12 oz', 25], ['grande', 'Grande 16 oz', 50], ['venti', 'Venti 24 oz', 75],
  ]),
  ...sized('sbux-mango', SB, 'Mango Dragonfruit Refresher', D, 'official', 'sbux', 'refresher mango dragonfruit dragon drink', [
    ['tall', 'Tall 12 oz', 25], ['grande', 'Grande 16 oz', 50], ['venti', 'Venti 24 oz', 75],
  ]),
  ...sized('sbux-pink', SB, 'Pink Drink', D, 'official', 'sbux', 'pink drink refresher', [
    ['tall', 'Tall 12 oz', 25], ['grande', 'Grande 16 oz', 50], ['venti', 'Venti 24 oz', 75],
  ]),
  ...sized('sbux-blacktea', SB, 'Iced Black Tea', D, 'official', 'sbux', 'iced tea black', [
    ['tall', 'Tall 12 oz', 20], ['grande', 'Grande 16 oz', 25], ['venti', 'Venti 24 oz', 40], ['trenta', 'Trenta 30 oz', 55],
  ]),
  ...sized('sbux-greentea', SB, 'Iced Green Tea', D, 'official', 'sbux', 'iced tea green', [
    ['tall', 'Tall 12 oz', 20], ['grande', 'Grande 16 oz', 25], ['venti', 'Venti 24 oz', 40], ['trenta', 'Trenta 30 oz', 55],
  ]),

  // ── Peet's (official: espresso; other drinks via Peet's customer service) ──
  d('peets-espresso', 'peets', 'Espresso', 'Single shot', 70, C, 'official', 'peets_faq', 'shot'),
  d('peets-brewed-16', 'peets', 'Brewed Coffee', 'Medium 16 oz', 267, C, 'secondary', 'peets_ci', 'drip brewed coffee'),
  ...sized('peets-latte', 'peets', 'Caffè Latte (hot or iced)', C, 'secondary', 'peets_ci', 'latte iced', [
    ['12', 'Small 12 oz', 70], ['16', 'Medium 16 oz', 140], ['20', 'Large 20 oz', 210],
  ]),
  ...sized('peets-cappuccino', 'peets', 'Cappuccino', C, 'secondary', 'peets_ci', '', [
    ['12', 'Small 12 oz', 70], ['16', 'Medium 16 oz', 140], ['20', 'Large 20 oz', 210],
  ]),
  ...sized('peets-mocha', 'peets', 'Caffè Mocha', C, 'secondary', 'peets_ci', 'mocha', [
    ['12', 'Small 12 oz', 85], ['16', 'Medium 16 oz', 165], ['20', 'Large 20 oz', 240],
  ]),
  ...sized('peets-iced', 'peets', 'Iced Coffee', C, 'secondary', 'peets_ci', 'iced coffee', [
    ['12', 'Small 12 oz', 113], ['16', 'Medium 16 oz', 150], ['20', 'Large 20 oz', 187],
  ]),

  // ── Dutch Bros (official nutritional guide; sizes S/M/L) ───────────────────
  ...sized('dutch-rebel', 'dutch', 'Rebel Energy (iced)', Z, 'official', 'dutch', 'rebel energy', [
    ['s', 'Small', 76], ['m', 'Medium', 114], ['l', 'Large', 151],
  ]),
  ...sized('dutch-rebelblend', 'dutch', 'Rebel Energy (blended)', Z, 'official', 'dutch', 'rebel energy blended', [
    ['s', 'Small', 80], ['m', 'Medium', 120], ['l', 'Large', 160],
  ]),
  ...sized('dutch-golden', 'dutch', 'Golden Eagle (hot or iced)', C, 'official', 'dutch', 'golden eagle breve', [
    ['s', 'Small', 95], ['m', 'Medium', 95], ['l', 'Large', 190],
  ]),
  ...sized('dutch-coldbrew', 'dutch', 'Cold Brew', C, 'official', 'dutch', 'cold brew', [
    ['s', 'Small', 151], ['m', 'Medium', 226], ['l', 'Large', 301],
  ]),
  d('dutch-nitro-m', 'dutch', 'Nitro Cold Brew', 'Medium', 295, C, 'official', 'dutch', 'nitro'),
  ...sized('dutch-americano', 'dutch', 'Americano', C, 'official', 'dutch', '', [
    ['s', 'Small', 96], ['m', 'Medium', 96], ['l', 'Large', 192],
  ]),
  ...sized('dutch-matchalem', 'dutch', 'Matcha Lemonade', D, 'official', 'dutch', 'matcha', [
    ['s', 'Small', 55], ['m', 'Medium', 105], ['l', 'Large', 160],
  ]),
  d('dutch-911', 'dutch', '9-1-1 (hot)', 'Any size', 288, C, 'official', 'dutch', '911 nine one one'),

  // ── Dunkin' ────────────────────────────────────────────────────────────────
  ...sized('dunkin-hot', 'dunkin', 'Hot Coffee', C, 'secondary', 'dunkin_ci', 'hot brewed coffee', [
    ['s', 'Small 10 oz', 180, 'official', 'dunkin_blog'], ['m', 'Medium 14 oz', 210], ['l', 'Large 20 oz', 270], ['xl', 'XL 24 oz', 330, 'official', 'dunkin_blog'],
  ]),
  ...sized('dunkin-iced', 'dunkin', 'Iced Coffee', C, 'secondary', 'dunkin_ci', 'iced coffee', [
    ['s', 'Small 16 oz', 198, 'official', 'dunkin_blog'], ['m', 'Medium 24 oz', 297], ['l', 'Large 32 oz', 398, 'official', 'dunkin_blog'],
  ]),
  d('dunkin-coldbrew-m', 'dunkin', 'Cold Brew', 'Medium', 260, C, 'secondary', 'dunkin_ci', 'cold brew'),
  d('dunkin-latte-m', 'dunkin', 'Latte (hot or iced)', 'Medium', 166, C, 'secondary', 'dunkin_ci', 'latte cappuccino'),
  d('dunkin-americano-m', 'dunkin', 'Americano', 'Medium 14 oz', 284, C, 'secondary', 'dunkin_ci'),
  d('dunkin-refresher-m', 'dunkin', 'Dunkin’ Refresher', 'Medium', 99, D, 'secondary', 'dunkin_tt', 'refresher'),

  // ── McDonald's (no official per-drink figures; via customer service) ─────────
  ...sized('mcd-coffee', 'mcd', 'McCafé Premium Roast Coffee', C, 'secondary', 'mcd_ci', 'mccafe brewed coffee hot', [
    ['s', 'Small', 109], ['m', 'Medium', 145], ['l', 'Large', 180],
  ]),
  ...sized('mcd-iced', 'mcd', 'Iced Coffee', C, 'secondary', 'mcd_ci', 'mccafe iced coffee', [
    ['s', 'Small', 133], ['m', 'Medium', 200], ['l', 'Large', 320],
  ]),
  ...sized('mcd-latte', 'mcd', 'Latte / Cappuccino (hot or iced)', C, 'secondary', 'mcd_ci', 'mccafe latte cappuccino americano caramel macchiato', [
    ['s', 'Small', 71], ['m', 'Medium', 142], ['l', 'Large', 178],
  ]),
  ...sized('mcd-mocha', 'mcd', 'Mocha (hot or iced)', C, 'secondary', 'mcd_ci', 'mccafe mocha', [
    ['s', 'Small', 86], ['m', 'Medium', 167], ['l', 'Large', 200],
  ]),
  ...sized('mcd-frappe', 'mcd', 'Caramel Frappé', C, 'secondary', 'mcd_ci', 'mccafe frappe blended', [
    ['s', 'Small', 75], ['m', 'Medium', 90], ['l', 'Large', 130],
  ]),
  ...sized('mcd-sweettea', 'mcd', 'Sweet Tea', D, 'secondary', 'mcd_ci', 'iced tea sweet', [
    ['s', 'Small', 50], ['m', 'Medium', 66], ['l', 'Large', 100],
  ]),

  // ── Panera (official Beverage Caffeine Guide, 3/2026) ───────────────────────
  ...sized('panera-coffee', 'panera', 'Light or Dark Roast Coffee', C, 'official', 'panera', 'brewed coffee', [
    ['16', '16 oz', 189], ['20', '20 oz', 237],
  ]),
  d('panera-latte', 'panera', 'Caffè Latte (hot or iced)', '16–20 oz', 126, C, 'official', 'panera', 'latte cappuccino americano'),
  ...sized('panera-tea', 'panera', 'Unsweetened Iced Tea', D, 'official', 'panera', 'iced tea', [
    ['20', '20 oz', 120], ['30', '30 oz', 180],
  ]),
  ...sized('panera-refresher', 'panera', 'Energy Refresher', D, 'official', 'panera', 'refresher dragonfruit passionfruit', [
    ['20', '20 oz', 28], ['30', '30 oz', 42],
  ]),

  // ── Blue Bottle (official, packaged drinks only) ───────────────────────────
  d('bb-nola', 'bluebottle', 'New Orleans (NOLA) carton', '10.66 oz', 179, C, 'official', 'bluebottle', 'nola cold brew'),
  d('bb-icedlatte', 'bluebottle', 'Iced Latte carton', '1 carton', 198, C, 'official', 'bluebottle', 'latte'),
  d('bb-bright', 'bluebottle', 'Bright cold brew can', '1 can', 170, C, 'official', 'bluebottle', 'cold brew'),
  d('bb-bold', 'bluebottle', 'Bold cold brew can', '1 can', 234, C, 'official', 'bluebottle', 'cold brew'),

  // ── The Coffee Bean & Tea Leaf ─────────────────────────────────────────────
  ...sized('cbtl-brewed', 'cbtl', 'Brewed Coffee', C, 'secondary', 'cbtl_ci', 'brewed coffee', [
    ['12', 'Small 12 oz', 250], ['16', 'Regular 16 oz', 333], ['20', 'Large 20 oz', 416],
  ]),

  // ── Boba / milk tea (chains don't publish mg — lab-based estimates) ─────────
  ...sized('boba-black', 'boba', 'Black milk tea (boba)', D, 'estimate', 'hk_cfs', 'boba milk tea bubble tea classic pearl', [
    ['16', '16 oz', 150], ['24', '24 oz', 225],
  ]),

  // ── Boba chains: Happy Lemon, Chicha San Chen, Tiger Sugar, Kung Fu Tea, Gong Cha ──
  // None of these shops publishes caffeine amounts, and cup volumes are approximate
  // ("~"), so every number here is an ESTIMATE by drink type:
  //   milk teas (black / oolong base) – Taiwanese-style milk tea lab mean,
  //     ~320 mg/L (hk_cfs) → ~150 mg / 16 oz, ~225 mg / 24 oz
  //   green-tea milk tea – the milk-tea figure × green/black brewed ratio (18/42)
  //   plain / fruit teas – brewed-tea value per oz × cup size (an upper bound,
  //     since ice and fruit replace some tea): black 42, oolong 37, green 18 mg / 8 oz
  //   milk drinks the menu lists with no tea or coffee – 0 mg
  // Menu names checked against each chain's US online menu (Oct 2026).
  ...sized('hl-boba', 'happylemon', 'Boba Milk Tea', D, 'estimate', 'hk_cfs', 'boba milk tea pearl', [
    ['m', 'Medium ~16 oz', 150], ['l', 'Large ~24 oz', 225],
  ]),
  ...sized('hl-saltedcheese', 'happylemon', 'Milk Tea with Salted Cheese', D, 'estimate', 'hk_cfs', 'cheese foam milk tea', [
    ['m', 'Medium ~16 oz', 150], ['l', 'Large ~24 oz', 225],
  ]),
  ...sized('hl-milkgreen', 'happylemon', 'Milk Green Tea', D, 'estimate', 'hk_cfs', 'green milk tea', [
    ['m', 'Medium ~16 oz', 65], ['l', 'Large ~24 oz', 95],
  ]),
  ...sized('hl-blackcheese', 'happylemon', 'Black Tea with Salted Cheese', D, 'estimate', 'tea_ci', 'cheese foam black tea', [
    ['m', 'Medium ~16 oz', 85], ['l', 'Large ~24 oz', 125],
  ]),
  ...sized('hl-lemongreen', 'happylemon', 'Fresh Lemon Green Tea', D, 'estimate', 'greentea_ci', 'lemon green tea fruit', [
    ['m', 'Medium ~16 oz', 35], ['l', 'Large ~24 oz', 55],
  ]),
  ...sized('hl-yakultgreen', 'happylemon', 'Yakult Green Tea', D, 'estimate', 'greentea_ci', 'yakult green tea', [
    ['m', 'Medium ~16 oz', 35], ['l', 'Large ~24 oz', 55],
  ]),
  ...sized('hl-passion', 'happylemon', 'Passion Fruit Green Tea', D, 'estimate', 'greentea_ci', 'passion fruit green tea', [
    ['m', 'Medium ~16 oz', 35], ['l', 'Large ~24 oz', 55],
  ]),
  ...sized('cc-boba', 'chicha', 'Boba Milk Tea', D, 'estimate', 'hk_cfs', 'boba milk tea pearl', [
    ['r', 'Regular ~16 oz', 150],
  ]),
  ...sized('cc-dongding-latte', 'chicha', 'Dong Ding Oolong Tea Latte', D, 'estimate', 'hk_cfs', 'oolong milk tea latte fresh milk', [
    ['r', 'Regular ~16 oz', 150],
  ]),
  ...sized('cc-dongding', 'chicha', 'Dong Ding Oolong Tea', D, 'estimate', 'oolong_ci', 'oolong pure tea', [
    ['r', 'Regular ~16 oz', 75],
  ]),
  ...sized('cc-osmanthus', 'chicha', 'Honey Osmanthus Oolong Tea', D, 'estimate', 'oolong_ci', 'osmanthus oolong honey', [
    ['r', 'Regular ~16 oz', 75],
  ]),
  ...sized('cc-black', 'chicha', 'Black Tea', D, 'estimate', 'tea_ci', 'black tea pure', [
    ['r', 'Regular ~16 oz', 85],
  ]),
  ...sized('cc-passion', 'chicha', 'Passion Green Tea', D, 'estimate', 'greentea_ci', 'passion fruit green tea', [
    ['r', 'Regular ~16 oz', 35],
  ]),
  ...sized('cc-fruit', 'chicha', 'Classic Fruit Tea', D, 'estimate', 'greentea_ci', 'fruit tea', [
    ['r', 'Regular ~16 oz', 35],
  ]),

  // Tiger Sugar — its signature brown-sugar boba milk has no tea or coffee.
  ...sized('ts-milk', 'tigersugar', 'Black Sugar Boba + Pearl Milk with Cream Mousse', D, 'estimate', 'ts_menu', 'brown sugar boba fresh milk caffeine free no tea', [
    ['r', 'Regular ~16 oz', 0],
  ]),
  ...sized('ts-blacklatte', 'tigersugar', 'Black Sugar Boba Black Tea Latte with Cream Mousse', D, 'estimate', 'hk_cfs', 'brown sugar boba milk tea black', [
    ['r', 'Regular ~16 oz', 150],
  ]),
  ...sized('ts-oolonglatte', 'tigersugar', 'Black Sugar Boba Oolong Tea Latte with Cream Mousse', D, 'estimate', 'hk_cfs', 'brown sugar boba oolong milk tea', [
    ['r', 'Regular ~16 oz', 150],
  ]),
  ...sized('ts-greenlatte', 'tigersugar', 'Black Sugar Boba Green Tea Latte with Cream Mousse', D, 'estimate', 'hk_cfs', 'brown sugar boba green milk tea', [
    ['r', 'Regular ~16 oz', 65],
  ]),
  ...sized('ts-blackcheese', 'tigersugar', 'Black Tea with Cheese Mousse', D, 'estimate', 'tea_ci', 'cheese foam black tea', [
    ['r', 'Regular ~16 oz', 85],
  ]),
  ...sized('ts-oolongcheese', 'tigersugar', 'Golden Oolong Tea with Cheese Mousse', D, 'estimate', 'oolong_ci', 'cheese foam oolong', [
    ['r', 'Regular ~16 oz', 75],
  ]),
  ...sized('ts-passion', 'tigersugar', 'Passion Fruit Green Tea', D, 'estimate', 'greentea_ci', 'passion fruit green tea', [
    ['r', 'Regular ~16 oz', 35],
  ]),

  // Kung Fu Tea
  ...sized('kft-black', 'kungfu', 'Black Milk Tea', D, 'estimate', 'hk_cfs', 'boba milk tea classic pearl kung fu', [
    ['m', 'Medium ~16 oz', 150], ['l', 'Large ~24 oz', 225],
  ]),
  ...sized('kft-oolong', 'kungfu', 'Oolong Milk Tea', D, 'estimate', 'hk_cfs', 'oolong milk tea', [
    ['m', 'Medium ~16 oz', 150], ['l', 'Large ~24 oz', 225],
  ]),
  ...sized('kft-thai', 'kungfu', 'Thai Milk Tea', D, 'estimate', 'hk_cfs', 'thai tea milk tea', [
    ['m', 'Medium ~16 oz', 150], ['l', 'Large ~24 oz', 225],
  ]),
  ...sized('kft-green', 'kungfu', 'Green Milk Tea', D, 'estimate', 'hk_cfs', 'green milk tea jasmine', [
    ['m', 'Medium ~16 oz', 65], ['l', 'Large ~24 oz', 95],
  ]),
  ...sized('kft-peach', 'kungfu', 'Peach Oolong Tea', D, 'estimate', 'oolong_ci', 'peach oolong fruit tea', [
    ['m', 'Medium ~16 oz', 75], ['l', 'Large ~24 oz', 110],
  ]),
  ...sized('kft-passion', 'kungfu', 'Passion Fruit Green Tea', D, 'estimate', 'greentea_ci', 'passion fruit green tea', [
    ['m', 'Medium ~16 oz', 35], ['l', 'Large ~24 oz', 55],
  ]),

  // Gong Cha
  ...sized('gc-pearl', 'gongcha', 'Black Milk Tea with Pearls', D, 'estimate', 'hk_cfs', 'boba pearl milk tea classic', [
    ['m', 'Medium ~16 oz', 150], ['l', 'Large ~24 oz', 225],
  ]),
  ...sized('gc-brownsugar', 'gongcha', 'Brown Sugar Milk Tea with Pearls', D, 'estimate', 'hk_cfs', 'brown sugar boba milk tea', [
    ['m', 'Medium ~16 oz', 150], ['l', 'Large ~24 oz', 225],
  ]),
  ...sized('gc-oolong', 'gongcha', 'Oolong Milk Tea', D, 'estimate', 'hk_cfs', 'oolong milk tea', [
    ['m', 'Medium ~16 oz', 150], ['l', 'Large ~24 oz', 225],
  ]),
  ...sized('gc-earlgrey', 'gongcha', 'Earl Grey Milk Tea', D, 'estimate', 'hk_cfs', 'earl grey milk tea', [
    ['m', 'Medium ~16 oz', 150], ['l', 'Large ~24 oz', 225],
  ]),
  ...sized('gc-green', 'gongcha', 'Green Milk Tea', D, 'estimate', 'hk_cfs', 'green milk tea', [
    ['m', 'Medium ~16 oz', 65], ['l', 'Large ~24 oz', 95],
  ]),
  ...sized('gc-foamgreen', 'gongcha', 'Milk Foam Green Tea', D, 'estimate', 'greentea_ci', 'milk foam cheese foam green tea', [
    ['m', 'Medium ~16 oz', 35], ['l', 'Large ~24 oz', 55],
  ]),
  ...sized('gc-taro', 'gongcha', 'Taro Milk Drink', D, 'estimate', 'gc_menu', 'taro milk caffeine free no tea', [
    ['m', 'Medium ~16 oz', 0], ['l', 'Large ~24 oz', 0],
  ]),

  // ── Energy drinks (label values) ────────────────────────────────────────────
  ...sized('redbull', 'energy', 'Red Bull', Z, 'official', 'redbull', '', [
    ['8', '8.4 oz can', 80], ['12', '12 oz can', 114], ['16', '16 oz can', 151],
  ]),
  d('monster-16', 'energy', 'Monster Energy', '16 oz can', 160, Z, 'official', 'monster'),
  d('monster-ultra-16', 'energy', 'Monster Zero Ultra', '16 oz can', 150, Z, 'official', 'monster', 'white monster ultra'),
  d('celsius-12', 'energy', 'Celsius', '12 oz can', 200, Z, 'official', 'celsius'),
  d('alani-12', 'energy', 'Alani Nu Energy', '12 oz can', 200, Z, 'official', 'alani', 'alani'),
  d('ghost-16', 'energy', 'GHOST Energy', '16 oz can', 200, Z, 'secondary', 'ghost'),
  d('c4-16', 'energy', 'C4 Energy', '16 oz can', 200, Z, 'official', 'c4'),
  d('prime-16', 'energy', 'PRIME Energy', '16 oz can', 200, Z, 'official', 'prime'),
  d('bang-16', 'energy', 'Bang Energy', '16 oz can', 300, Z, 'official', 'bang'),
  d('reign-16', 'energy', 'REIGN', '16 oz can', 300, Z, 'official', 'reign'),
  d('rockstar-16', 'energy', 'Rockstar', '16 oz can', 160, Z, 'secondary', 'rockstar_ci'),

  // ── Soda & bottled drinks ──────────────────────────────────────────────────
  d('coke-12', 'soda', 'Coca-Cola', '12 oz can', 34, D, 'official', 'coke', 'coke cola'),
  d('dietcoke-12', 'soda', 'Diet Coke', '12 oz can', 46, D, 'official', 'coke', 'diet coke'),
  d('cokezero-12', 'soda', 'Coca-Cola Zero Sugar', '12 oz can', 34, D, 'official', 'coke', 'coke zero'),
  d('pepsi-12', 'soda', 'Pepsi', '12 oz can', 38, D, 'secondary', 'pepsi_ci', 'cola'),
  d('mtndew-12', 'soda', 'Mountain Dew', '12 oz can', 54, D, 'secondary', 'pepsi_ci', 'mtn dew'),
  d('drpepper-12', 'soda', 'Dr Pepper', '12 oz can', 42, D, 'official', 'drpepper', 'dr pepper'),
  d('arizona-green-12', 'soda', 'AriZona Green Tea', '12 oz', 10, D, 'official', 'arizona', 'arizona green tea'),
  d('sbux-doubleshot-15', 'soda', 'Starbucks Doubleshot Energy (can)', '15 oz', 135, Z, 'secondary', 'sbux_rtd_ci', 'doubleshot'),
  d('sbux-frappbottle', 'soda', 'Starbucks Frappuccino bottle (Coffee)', '13.7 oz', 130, C, 'secondary', 'sbux_rtd_ci', 'bottled frappuccino'),

  // ── Made at home / generic ─────────────────────────────────────────────────
  d('gen-coffee-8', 'generic', 'Brewed coffee', '8 oz cup', 95, C, 'estimate', 'fda', 'home coffee drip cup'),
  d('gen-espresso', 'generic', 'Espresso shot', '1 oz', 63, C, 'estimate', 'usda_espresso', 'shot'),
  d('gen-blacktea-8', 'generic', 'Brewed black tea', '8 oz cup', 42, D, 'estimate', 'tea_ci', 'tea black'),
  d('gen-greentea-8', 'generic', 'Brewed green tea', '8 oz cup', 18, D, 'estimate', 'greentea_ci', 'tea green jasmine'),
];

export type DrinkGroup = { key: string; brand: BrandId; name: string; icon: DrinkIcon; sizes: Drink[] };

/** Drinks of one brand, with sizes of the same drink grouped together (menu order kept). */
export function groupsForBrand(brand: BrandId, pool: Drink[] = DRINKS): DrinkGroup[] {
  const out: DrinkGroup[] = [];
  const byKey: Record<string, DrinkGroup> = {};
  for (const x of pool) {
    if (x.brand !== brand) continue;
    const key = `${x.brand}|${x.name}`;
    if (!byKey[key]) {
      byKey[key] = { key, brand: x.brand, name: x.name, icon: x.icon, sizes: [] };
      out.push(byKey[key]);
    }
    byKey[key].sizes.push(x);
  }
  return out;
}

/** All groups (every brand) from a pool — used for search results. */
export function groupAll(pool: Drink[]): DrinkGroup[] {
  return BRANDS.flatMap((b) => groupsForBrand(b.id, pool));
}


/** Shown as one-tap chips on Home and in the Companion cutoff window. */
export const QUICK_IDS = ['gen-coffee-8', 'sbux-latte-grande', 'sbux-coldbrew-grande', 'boba-black-16', 'dutch-rebel-m', 'redbull-8'];

export const DAILY_LIMIT_MG = 100; // common guidance for teens 12–18 (≤100mg/day)
export const HALF_LIFE_HOURS = 5;

// Safe residual threshold used by the "Cutoff Window" reverse calculation: how
// much caffeine (mg) is okay to still be active at bedtime.
export const SAFE_BEDTIME_MG = 20;

export function findDrink(id: string): Drink | undefined {
  return DRINKS.find((x) => x.id === id);
}

/** "Starbucks Caffè Latte · Grande 16 oz" */
export function drinkLabel(x: Drink): string {
  const brand = x.brand === 'generic' || x.brand === 'energy' || x.brand === 'soda' || x.brand === 'boba' ? '' : `${brandLabel(x.brand)} `;
  return `${brand}${x.name}${x.size ? ` · ${x.size}` : ''}`;
}

export const KIND_LABEL: Record<SourceKind, string> = {
  official: 'Brand-published',
  secondary: 'Third-party report',
  estimate: 'Estimate',
};

// ── Search & free-text matching (on-device keyword scoring, no AI / network) ──

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’'`]/g, '')
    .replace(/[^a-z0-9. ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const BRAND_ALIASES: [BrandId, RegExp][] = [
  ['starbucks', /\b(starbucks|sbux|starbs)\b/],
  ['peets', /\bpeets?\b/],
  ['dutch', /\bdutch( bros)?\b/],
  ['dunkin', /\b(dunkin|dunkin donuts|dd)\b/],
  ['mcd', /\b(mcdonalds|mcd|mcds|mccafe|mickey d)\b/],
  ['panera', /\bpanera\b/],
  ['bluebottle', /\bblue bottle\b/],
  ['cbtl', /\b(coffee bean|cbtl)\b/],
  ['happylemon', /\bhappy lemon\b/],
  ['chicha', /\b(chicha|chicha san chen)\b/],
  ['tigersugar', /\btiger sugar\b/],
  ['kungfu', /\bkung ?fu( tea)?\b/],
  ['gongcha', /\bgong ?cha\b/],
  ['boba', /\b(boba|bubble tea|milk tea|sharetea|7 leaves|chatime|omomo|tastea|yi fang|tp tea)\b/],
];

const SIZE_WORDS: [RegExp, string[]][] = [
  [/\bshort\b/, ['short', '8 oz']],
  [/\btall\b/, ['tall', '12 oz']],
  [/\bgrande\b/, ['grande', '16 oz']],
  [/\bventi\b/, ['venti', '24 oz', '20 oz']],
  [/\b(small|sm)\b/, ['small']],
  [/\b(medium|med|regular)\b/, ['medium', 'regular']],
  [/\b(large|lg|big)\b/, ['large']],
  [/\b(single|solo)\b/, ['solo', 'single']],
  [/\b(double|doppio)\b/, ['doppio']],
];

const STOP = new Set(['a', 'an', 'the', 'and', 'of', 'with', 'from', 'had', 'i', 'my', 'some', 'cup', 'oz', 'can', 'drink', 'at', 'just']);

function tokens(s: string): string[] {
  return norm(s)
    .split(' ')
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function haystack(x: Drink): string {
  return norm(`${brandLabel(x.brand)} ${x.name} ${x.size ?? ''} ${x.tags ?? ''}`);
}

export function detectBrand(text: string): BrandId | null {
  const t = norm(text);
  for (const [id, re] of BRAND_ALIASES) if (re.test(t)) return id;
  return null;
}

/** Ranked matches for free text like "grande cold brew from starbucks". */
export function matchDrinks(text: string, limit = 3): Drink[] {
  const t = norm(text);
  if (!t) return [];
  const brand = detectBrand(t);
  const words = tokens(t);
  const ozMatch = t.match(/(\d+(?:\.\d+)?) ?(?:oz|fl oz|ounce)/);
  const sizeHints: string[] = [];
  for (const [re, hints] of SIZE_WORDS) if (re.test(t)) sizeHints.push(...hints);
  if (ozMatch) sizeHints.push(`${ozMatch[1]} oz`);

  const scored = DRINKS.map((x) => {
    const hay = haystack(x);
    let score = 0;
    let hits = 0;
    if (brand) score += x.brand === brand ? 6 : -4;
    for (const w of words) if (hay.includes(w)) {
      score += 2;
      hits += 1;
    }
    const size = norm(x.size ?? '');
    for (const h of sizeHints) if (size.includes(h)) score += 3;
    return { x, score, hits };
  })
    // Every suggestion must share at least one real word with what was typed.
    .filter((s) => s.hits > 0 && s.score >= 2)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return [];
  const best = scored[0].score;
  return scored.filter((s) => s.score >= best - 4).slice(0, limit).map((s) => s.x);
}

/** Filter for the Log screen's search box + brand chips. */
export function searchDrinks(query: string, brand: BrandId | 'all'): Drink[] {
  const pool = brand === 'all' ? DRINKS : DRINKS.filter((x) => x.brand === brand);
  const words = tokens(query);
  if (!words.length) return pool;
  return pool.filter((x) => {
    const hay = haystack(x);
    return words.every((w) => hay.includes(w));
  });
}

// ── Menu sections inside a brand (Step 2 filter chips) ──────────────────────
export type MenuSection = 'Brewed' | 'Cold brew & iced' | 'Espresso drinks' | 'Blended' | 'Tea & refreshers' | 'Energy';

export function sectionOf(g: DrinkGroup): MenuSection {
  const n = `${g.name} ${g.sizes[0]?.tags ?? ''}`.toLowerCase();
  if (/rebel|energy/.test(n)) return 'Energy';
  if (/frapp|frappé|frappe|blended/.test(n)) return 'Blended';
  if (/tea|chai|matcha|refresher|pink drink|lemonade/.test(n)) return 'Tea & refreshers';
  if (/cold brew|nitro|iced coffee/.test(n)) return 'Cold brew & iced';
  if (/latte|cappuccino|flat white|americano|mocha|macchiato|espresso|golden eagle|9-1-1/.test(n)) return 'Espresso drinks';
  return 'Brewed';
}

const SECTION_ORDER: MenuSection[] = ['Brewed', 'Cold brew & iced', 'Espresso drinks', 'Blended', 'Tea & refreshers', 'Energy'];

/** Sections that actually have drinks for this brand, in a fixed order. */
export function sectionsFor(groups: DrinkGroup[]): MenuSection[] {
  const present = new Set(groups.map(sectionOf));
  return SECTION_ORDER.filter((s) => present.has(s));
}
