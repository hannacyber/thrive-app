import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useI18n } from '../../src/i18n';
import { useAppState } from '../../src/state/AppState';
import { GlassTabBar } from '../../src/ui/chrome';

export default function TabsLayout() {
  const t = useTheme();
  const { s } = useI18n();
  const { state } = useAppState();

  // First launch: a short, skippable welcome. Nothing is hidden behind it —
  // every feature is reachable from these 5 tabs either way.
  if (!state.onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: t.bg },
        animation: 'shift',
      }}
    >
      <Tabs.Screen name="index" options={{ title: s.tabs.home }} />
      <Tabs.Screen name="log" options={{ title: s.tabs.log }} />
      <Tabs.Screen name="companion" options={{ title: s.tabs.tonight }} />
      <Tabs.Screen name="progress" options={{ title: s.tabs.progress }} />
      <Tabs.Screen name="tools" options={{ title: s.tabs.tools }} />
    </Tabs>
  );
}
