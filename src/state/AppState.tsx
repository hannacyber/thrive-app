import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAILY_LIMIT_MG, findDrink } from '../data/drinks';
import { bedtimeTarget, dateKey, decayedMg, isToday } from '../lib/caffeine';
import { swatches } from '../theme/tokens';

export type Entry = { id: string; drinkId: string; mg: number; name: string; time: string };
export type SurveyResult = { score: number; date: string };
export type ThemePreference = 'system' | 'light' | 'dark';
export type LanguagePreference = 'system' | 'en' | 'zh-Hans' | 'zh-Hant' | 'es' | 'ja' | 'ko';
export type Period = 'morning' | 'afternoon' | 'evening';

export type AppData = {
  name: string;
  xp: number;
  accent: string;
  bedtime: string;
  themePreference: ThemePreference;
  /** 'system' follows the phone's language list. */
  language: LanguagePreference;
  /** First-run welcome has been completed or skipped. */
  onboarded: boolean;
  entries: Entry[];
  /** Days (dateKey) on which the person actually did something in the app. */
  streakDays: Record<string, boolean>;
  /** Self-rated sleep quality 1–5, keyed by dateKey of the morning it was rated. */
  sleepByDay: Record<string, number>;
  survey: SurveyResult | null;
  journal: string;
};

const STORAGE_KEY = 'thrive-native-v1';
const KEEP_DAYS = 60; // entries older than this are pruned so storage stays small
const XP_PER_LOG = 4;
const XP_PER_SURVEY = 15;

const todayKey = () => dateKey(new Date());

/** A genuinely empty starting state — no pre-populated drinks, history, streak, or name. */
function seedState(): AppData {
  return {
    name: '',
    xp: 0,
    accent: swatches[0],
    bedtime: '23:00',
    themePreference: 'system',
    language: 'system',
    onboarded: false,
    entries: [],
    streakDays: {},
    sleepByDay: {},
    survey: null,
    journal: '',
  };
}

export function periodOf(d: Date): Period {
  const h = d.getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

type Ctx = {
  state: AppData;
  loaded: boolean;
  /** Logs a drink and returns the new entry id (for Undo). */
  logDrink: (drinkId: string, customName?: string, customMg?: number) => string;
  /** Most recently logged distinct drinks, newest first — for one-tap re-logging. */
  recentDrinks: (n: number) => { drinkId: string; name: string; mg: number }[];
  removeEntry: (id: string) => void;
  /**
   * Shops/categories ordered by how often the person logs them (stored logs,
   * up to 60 days), most-logged first; ties go to the most recent, then the
   * default order. Computed on device from their own logs only.
   */
  brandsByUse: <T extends string>(defaultOrder: T[]) => { order: T[]; personalized: boolean };
  sleepToday: number | null;
  setSleepToday: (n: number) => void;
  submitSurvey: (score: number) => void;
  updateSettings: (partial: Partial<AppData>) => void;
  resetAllData: () => void;
  todaysEntries: () => Entry[];
  todaysTotal: () => number;
  activeCaffeineAtBedtime: () => number;
  /** mg totals for the last `n` days, oldest first, ending today. */
  dailyTotals: (n: number) => { key: string; date: Date; mg: number }[];
  /** Consecutive tracked days ending today (or yesterday, if today isn't tracked yet). */
  currentStreak: () => number;
  /** Real pattern from the person's own logs, or null if there isn't enough data yet. */
  personalPattern: () => { period: Period; count: number; total: number } | null;
};

const AppStateContext = createContext<Ctx | null>(null);

function prune(entries: Entry[]): Entry[] {
  const cutoff = Date.now() - KEEP_DAYS * 86400000;
  return entries.filter((e) => +new Date(e.time) >= cutoff);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppData>(seedState);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppData> & Record<string, unknown>;
          // Drop fields from older builds (history / sleepToday) — they were never
          // tied to real dates, so they can't be shown honestly.
          const { history: _h, sleepToday: _s, schoolTime: _st, ...rest } = parsed as any;
          setState((prev) => ({
            ...prev,
            ...rest,
            // People upgrading from an earlier build already know the app.
            onboarded: parsed.onboarded ?? true,
            accent: parsed.accent && swatches.includes(parsed.accent) ? parsed.accent : swatches[0],
            language: parsed.language ?? 'system',
            entries: prune(Array.isArray(parsed.entries) ? parsed.entries : []),
            streakDays: parsed.streakDays ?? {},
            sleepByDay: parsed.sleepByDay ?? {},
          }));
        }
      } catch {
        // corrupt/unavailable storage — fall back to seed state
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 250);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, loaded]);

  const todaysEntries = () =>
    state.entries.filter((e) => isToday(e.time)).sort((a, b) => +new Date(b.time) - +new Date(a.time));

  const todaysTotal = () => todaysEntries().reduce((s, e) => s + e.mg, 0);

  const activeCaffeineAtBedtime = () => {
    const bedtime = bedtimeTarget(state.bedtime || '23:00');
    const now = new Date();
    const target = bedtime > now ? bedtime : now;
    // Everything from the last 36 hours still counts (decay does the rest) — so a
    // 10 PM drink doesn't "vanish" at midnight.
    const from = +now - 36 * 3600000;
    return state.entries
      .filter((e) => +new Date(e.time) >= from && +new Date(e.time) <= +target)
      .reduce((total, e) => total + decayedMg(e.mg, (+target - +new Date(e.time)) / 3600000), 0);
  };

  const dailyTotals: Ctx['dailyTotals'] = (n) => {
    const byDay: Record<string, number> = {};
    for (const e of state.entries) {
      const k = dateKey(new Date(e.time));
      byDay[k] = (byDay[k] ?? 0) + e.mg;
    }
    const out: { key: string; date: Date; mg: number }[] = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 12);
      const key = dateKey(date);
      out.push({ key, date, mg: byDay[key] ?? 0 });
    }
    return out;
  };

  const currentStreak = () => {
    const now = new Date();
    let offset = state.streakDays[todayKey()] ? 0 : 1;
    let count = 0;
    for (;;) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset, 12);
      if (!state.streakDays[dateKey(d)]) break;
      count += 1;
      offset += 1;
    }
    return count;
  };

  const personalPattern: Ctx['personalPattern'] = () => {
    const cutoff = Date.now() - 14 * 86400000;
    const recent = state.entries.filter((e) => +new Date(e.time) >= cutoff);
    if (recent.length < 5) return null;
    const counts: Record<Period, number> = { morning: 0, afternoon: 0, evening: 0 };
    for (const e of recent) counts[periodOf(new Date(e.time))] += 1;
    const period = (Object.keys(counts) as Period[]).sort((a, b) => counts[b] - counts[a])[0];
    return { period, count: counts[period], total: recent.length };
  };

  /** Streak credit is earned, not given: only called from an action the person took. */
  const markTrackedToday = (prev: AppData): AppData['streakDays'] => ({ ...prev.streakDays, [todayKey()]: true });

  const logDrink: Ctx['logDrink'] = (drinkId, customName, customMg) => {
    const preset = findDrink(drinkId);
    const entry: Entry = {
      id: `e${Date.now()}${Math.floor(Math.random() * 1000)}`,
      drinkId: drinkId || 'custom',
      mg: Math.max(0, Math.round(customMg ?? preset?.mg ?? 0)),
      name: customName || preset?.name || 'Drink',
      time: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      entries: prune([...prev.entries, entry]),
      streakDays: markTrackedToday(prev),
      xp: prev.xp + XP_PER_LOG,
    }));
    return entry.id;
  };

  const recentDrinks: Ctx['recentDrinks'] = (n) => {
    const seen = new Set<string>();
    const out: { drinkId: string; name: string; mg: number }[] = [];
    const sorted = state.entries.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time));
    for (const e of sorted) {
      // Known drinks dedupe by id: the stored name is the label in whatever
      // language was active when it was logged, so it can differ for the same drink.
      const k = findDrink(e.drinkId) ? e.drinkId : `${e.drinkId}|${e.name}|${e.mg}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ drinkId: e.drinkId, name: e.name, mg: e.mg });
      if (out.length >= n) break;
    }
    return out;
  };

  const brandsByUse: Ctx['brandsByUse'] = (defaultOrder) => {
    const count: Record<string, number> = {};
    const last: Record<string, number> = {};
    for (const e of state.entries) {
      const b = findDrink(e.drinkId)?.brand;
      if (!b) continue; // custom drinks have no shop
      count[b] = (count[b] ?? 0) + 1;
      last[b] = Math.max(last[b] ?? 0, +new Date(e.time));
    }
    const idx = new Map(defaultOrder.map((b, i) => [b, i] as const));
    const order = defaultOrder
      .slice()
      .sort((a, b) => (count[b] ?? 0) - (count[a] ?? 0) || (last[b] ?? 0) - (last[a] ?? 0) || idx.get(a)! - idx.get(b)!);
    return { order, personalized: Object.keys(count).length > 0 };
  };

  const removeEntry: Ctx['removeEntry'] = (id) => {
    // Removing a log also gives back the XP it earned, so XP only reflects real logs.
    setState((prev) => {
      if (!prev.entries.some((e) => e.id === id)) return prev;
      const entries = prev.entries.filter((e) => e.id !== id);
      // If that was the only thing done today, today no longer counts toward the streak.
      const k = todayKey();
      const stillActive =
        entries.some((e) => isToday(e.time)) || prev.sleepByDay[k] != null || prev.survey?.date === k;
      const streakDays = { ...prev.streakDays };
      if (!stillActive) delete streakDays[k];
      return { ...prev, entries, streakDays, xp: Math.max(0, prev.xp - XP_PER_LOG) };
    });
  };

  const setSleepToday: Ctx['setSleepToday'] = (n) => {
    setState((prev) => ({
      ...prev,
      sleepByDay: { ...prev.sleepByDay, [todayKey()]: n },
      streakDays: markTrackedToday(prev),
    }));
  };

  const submitSurvey: Ctx['submitSurvey'] = (score) => {
    setState((prev) => ({
      ...prev,
      survey: { score, date: todayKey() },
      // Check-in XP counts once per day, so retaking it can't inflate rank.
      xp: prev.survey?.date === todayKey() ? prev.xp : prev.xp + XP_PER_SURVEY,
      streakDays: markTrackedToday(prev),
    }));
  };

  const updateSettings: Ctx['updateSettings'] = (partial) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  const resetAllData = () => {
    // Keep language/appearance so the app doesn't suddenly switch language.
    setState((prev) => ({ ...seedState(), language: prev.language, themePreference: prev.themePreference }));
  };

  const sleepToday = state.sleepByDay[todayKey()] ?? null;

  const value = useMemo<Ctx>(
    () => ({
      state,
      loaded,
      logDrink,
      recentDrinks,
      removeEntry,
      brandsByUse,
      sleepToday,
      setSleepToday,
      submitSurvey,
      updateSettings,
      resetAllData,
      todaysEntries,
      todaysTotal,
      activeCaffeineAtBedtime,
      dailyTotals,
      currentStreak,
      personalPattern,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, loaded]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

export { DAILY_LIMIT_MG };
