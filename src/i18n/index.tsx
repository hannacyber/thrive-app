import React, { createContext, useContext, useMemo } from 'react';
import { getLocales } from 'expo-localization';
import en, { Strings } from './en';
import zhHans from './zh-Hans';
import zhHant from './zh-Hant';
import es from './es';
import ja from './ja';
import ko from './ko';
import { useAppState } from '../state/AppState';

export type Lang = 'en' | 'zh-Hans' | 'zh-Hant' | 'es' | 'ja' | 'ko';
export type LangPreference = 'system' | Lang;

/** Shown in each language's own name, so anyone can find theirs. */
export const LANGS: { id: Lang; native: string }[] = [
  { id: 'en', native: 'English' },
  { id: 'zh-Hans', native: '简体中文' },
  { id: 'zh-Hant', native: '繁體中文' },
  { id: 'es', native: 'Español' },
  { id: 'ja', native: '日本語' },
  { id: 'ko', native: '한국어' },
];

const TABLES: Record<Lang, Strings> = { en, 'zh-Hans': zhHans, 'zh-Hant': zhHant, es, ja, ko };

/** BCP-47 tags used for Intl date/time formatting. */
const INTL_TAG: Record<Lang, string> = {
  en: 'en-US',
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-TW',
  es: 'es',
  ja: 'ja-JP',
  ko: 'ko-KR',
};

/** Picks the first supported language from the phone's preferred-language list. */
export function detectLang(): Lang {
  try {
    for (const l of getLocales()) {
      const code = (l.languageCode ?? '').toLowerCase();
      const tag = (l.languageTag ?? '').toLowerCase();
      if (code === 'zh') {
        const region = (l.regionCode ?? '').toUpperCase();
        return tag.includes('hant') || ['TW', 'HK', 'MO'].includes(region) ? 'zh-Hant' : 'zh-Hans';
      }
      if (code === 'en' || code === 'es' || code === 'ja' || code === 'ko') return code;
    }
  } catch {
    // fall through
  }
  return 'en';
}

type I18n = {
  s: Strings;
  lang: Lang;
  /** "9:30 PM" / "21:30" / "下午9:30" — follows the language's conventions. */
  fmtTime: (d: Date | string) => string;
  /** One- or two-letter weekday ("M", "一", "月"). */
  weekday: (d: Date) => string;
  fmtDate: (d: Date) => string;
};

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { state } = useAppState();
  const pref = (state.language ?? 'system') as LangPreference;
  const lang: Lang = pref === 'system' || !TABLES[pref] ? detectLang() : pref;

  const value = useMemo<I18n>(() => {
    const tag = INTL_TAG[lang];
    const fmtTime = (d: Date | string) => {
      const date = typeof d === 'string' ? new Date(d) : d;
      try {
        return date.toLocaleTimeString(tag, { hour: 'numeric', minute: '2-digit' });
      } catch {
        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      }
    };
    const weekday = (d: Date) => {
      try {
        const w = d.toLocaleDateString(tag, { weekday: lang === 'en' || lang === 'es' ? 'short' : 'narrow' });
        return lang === 'en' || lang === 'es' ? w.replace('.', '').slice(0, 2) : w;
      } catch {
        return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()];
      }
    };
    const fmtDate = (d: Date) => {
      try {
        return d.toLocaleDateString(tag, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch {
        return d.toDateString();
      }
    };
    return { s: TABLES[lang], lang, fmtTime, weekday, fmtDate };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export type { Strings };
