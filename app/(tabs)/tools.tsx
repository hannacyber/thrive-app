import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '../../src/theme/ThemeProvider';
import { useI18n } from '../../src/i18n';
import { Screen } from '../../src/ui/chrome';
import { IconTile, T, Touch } from '../../src/ui/primitives';
import type { IconName } from '../../src/ui/icons';

type ToolId = 'alt' | 'breathe' | 'distract' | 'habits' | 'journal' | 'article' | 'sources';

const ITEMS: { id: ToolId; icon: IconName; color: string }[] = [
  { id: 'alt', icon: 'leaf', color: '#30B565' },
  { id: 'breathe', icon: 'wind', color: '#00B3A4' },
  { id: 'distract', icon: 'figure', color: '#FF8A00' },
  { id: 'habits', icon: 'checkCircle', color: '#5E5CE6' },
  { id: 'journal', icon: 'pencil', color: '#FF2D55' },
  { id: 'article', icon: 'lightbulb', color: '#E0A000' },
  { id: 'sources', icon: 'database', color: '#64748B' },
];

export default function Tools() {
  const router = useRouter();
  const t = useTheme();
  const { s } = useI18n();
  return (
    <Screen title={s.tools.title} subtitle={s.tools.subtitle}>
      <View style={styles.grid}>
        {ITEMS.map((item) => {
          const copy = s.tools.items[item.id];
          return (
            <Touch
              key={item.id}
              hapticOnPress="light"
              accessibilityRole="button"
              accessibilityLabel={`${copy.title}. ${copy.desc}`}
              onPress={() => router.push((item.id === 'sources' ? '/sources' : `/tool/${item.id}`) as any)}
              style={[styles.tile, { backgroundColor: t.card }]}
            >
              <IconTile name={item.icon} color={item.color} size={44} glyph={22} />
              <View style={{ gap: 2 }}>
                <T v="headline" numberOfLines={2}>
                  {copy.title}
                </T>
                <T v="footnote" tone="label2" numberOfLines={3}>
                  {copy.desc}
                </T>
              </View>
            </Touch>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { flexBasis: '46%', flexGrow: 1, minHeight: 150, justifyContent: 'space-between', padding: 16, borderRadius: 24, borderCurve: 'continuous', gap: 14 },
});
