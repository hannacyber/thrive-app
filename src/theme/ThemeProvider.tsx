import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { palettes, ThemeTokens } from './tokens';
import { useAppState } from '../state/AppState';

const ThemeContext = createContext<ThemeTokens>(palettes.light);

/**
 * Resolves the effective palette from the user's `themePreference`
 * ('system' | 'light' | 'dark') set in Settings, falling back to the
 * device's own color scheme — mirrors the prefers-color-scheme /
 * data-theme cascade used on the web prototype.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const { state } = useAppState();

  const effective = state.themePreference === 'system' ? system ?? 'light' : state.themePreference;
  const tokens = useMemo(() => (effective === 'dark' ? palettes.dark : palettes.light), [effective]);

  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
