// THRIVE design tokens — iOS 26 "Liquid Glass" direction.
// System grouped backgrounds + white/graphite cards, a fresh mint tint for
// interaction, sunset orange for caffeine, indigo for sleep. Content sits on
// solid cards; glass is reserved for the navigation layer (tab bar, floating
// search, toasts), as in Apple's HIG.
import { Platform, TextStyle } from 'react-native';

export type ThemeTokens = {
  scheme: 'light' | 'dark';
  bg: string;
  card: string;
  cardRaised: string;
  fill: string;
  fillStrong: string;
  separator: string;
  label: string;
  label2: string;
  label3: string;
  tint: string;
  tintText: string;
  onTint: string;
  caffeine: string;
  caffeineText: string;
  sleep: string;
  good: string;
  goodText: string;
  warn: string;
  danger: string;
  dangerText: string;
  glowA: string;
  glowB: string;
  glassFallback: string;
  glassBorder: string;
};

const light: ThemeTokens = {
  scheme: 'light',
  bg: '#F2F2F7',
  card: '#FFFFFF',
  cardRaised: '#FFFFFF',
  fill: 'rgba(118,118,128,0.12)',
  fillStrong: 'rgba(118,118,128,0.2)',
  separator: 'rgba(60,60,67,0.16)',
  label: '#0B0B10',
  label2: 'rgba(60,60,67,0.78)',
  label3: 'rgba(60,60,67,0.5)',
  tint: '#008577',
  tintText: '#00796F',
  onTint: '#FFFFFF',
  caffeine: '#FF8A00',
  caffeineText: '#B85A00',
  sleep: '#5E5CE6',
  good: '#30B565',
  goodText: '#1B7F42',
  warn: '#FFB300',
  danger: '#FF3B30',
  dangerText: '#D70015',
  glowA: 'rgba(0,199,182,0.22)',
  glowB: 'rgba(94,92,230,0.16)',
  glassFallback: 'rgba(250,250,252,0.82)',
  glassBorder: 'rgba(255,255,255,0.7)',
};

const dark: ThemeTokens = {
  scheme: 'dark',
  bg: '#000000',
  card: '#1C1C1E',
  cardRaised: '#2C2C2E',
  fill: 'rgba(118,118,128,0.24)',
  fillStrong: 'rgba(118,118,128,0.36)',
  separator: 'rgba(84,84,88,0.55)',
  label: '#FFFFFF',
  label2: 'rgba(235,235,245,0.72)',
  label3: 'rgba(235,235,245,0.42)',
  tint: '#3DDCCB',
  tintText: '#3DDCCB',
  onTint: '#00201D',
  caffeine: '#FF9F0A',
  caffeineText: '#FFB340',
  sleep: '#7D7AFF',
  good: '#30D158',
  goodText: '#30D158',
  warn: '#FFD60A',
  danger: '#FF453A',
  dangerText: '#FF6961',
  glowA: 'rgba(61,220,203,0.18)',
  glowB: 'rgba(125,122,255,0.2)',
  glassFallback: 'rgba(28,28,30,0.78)',
  glassBorder: 'rgba(255,255,255,0.12)',
};

export const palettes = { light, dark };

/** Mascot colors the person can pick in Settings. */
export const swatches = ['#00B3A4', '#FF8A00', '#5E5CE6', '#FF2D55', '#30B565', '#AF52DE'];

/** Adds alpha to a #RRGGBB color (other formats are returned unchanged — pass hex). */
export function alpha(hex: string, a: number): string {
  if (!hex.startsWith('#') || hex.length !== 7) return hex;
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export const radii = { sm: 12, md: 16, lg: 22, xl: 28, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };

// System font (SF Pro on iOS, Roboto on Android). No letterSpacing: SF Pro
// already applies Apple's optical tracking per size; adding it would double it.
// No bundled font files;
// CJK text falls back to PingFang / Hiragino / Apple SD Gothic automatically.
const rounded = Platform.select<string | undefined>({ ios: 'ui-rounded', default: undefined });

export const type = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700' },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: '500' },
  /** Big rounded numerals (Fitness-style). */
  number: { fontFamily: rounded, fontWeight: '700', fontVariant: ['tabular-nums'] },
} satisfies Record<string, TextStyle>;

export type TypeVariant = Exclude<keyof typeof type, 'number'>;
