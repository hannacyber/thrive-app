import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { AppStateProvider, useAppState } from '../src/state/AppState';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';
import { I18nProvider } from '../src/i18n';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Sheets get the native iOS page-sheet with swipe-down-to-dismiss; pushed
// screens keep the native edge-swipe back gesture.
const sheet = { presentation: Platform.OS === 'ios' ? 'modal' : 'card', gestureEnabled: true } as const;
const push = { presentation: 'card', gestureEnabled: true, animation: 'default' } as const;

function RootStack() {
  const t = useTheme();
  const { loaded } = useAppState();

  // System fonts only — nothing to load, so the splash hides as soon as the
  // on-device data has been read.
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) return null;

  return (
    <>
      <StatusBar style={t.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal', gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="settings" options={sheet} />
        <Stack.Screen name="survey" options={sheet} />
        <Stack.Screen name="survey-result" options={sheet} />
        {/* A plain push from inside a sheet would land *under* the sheet on iOS
            (react-native-screens pushes it on the root controller), so the
            Settings entry point presents it as a sheet instead. */}
        <Stack.Screen name="sources" options={({ route }) => ((route.params as { sheet?: string } | undefined)?.sheet ? sheet : push)} />
        <Stack.Screen name="tool/[id]" options={push} />
        <Stack.Screen name="tool/breathe" options={push} />
        <Stack.Screen name="tool/journal" options={push} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <ThemeProvider>
          <I18nProvider>
            <RootStack />
          </I18nProvider>
        </ThemeProvider>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
