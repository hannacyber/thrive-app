import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '../../src/theme/ThemeProvider';
import { useI18n } from '../../src/i18n';
import { SheetHeader, SheetScreen } from '../../src/ui/chrome';
import { Card, T } from '../../src/ui/primitives';

export default function ToolDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const t = useTheme();
  const { s } = useI18n();
  const header = <SheetHeader kind="back" onClose={() => router.back()} closeLabel={s.common.back} />;

  if (id === 'article') {
    return (
      <SheetScreen presentation="push" header={header}>
        <T v="title1">{s.content.article.title}</T>
        {s.content.article.paragraphs.map((p, i) => (
          <T key={i} v="body">
            {p}
          </T>
        ))}
        <T v="caption" tone="label2" style={[styles.cite, { borderTopColor: t.separator }]}>
          Drake, C., et al. (2013). Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed. Journal of Clinical Sleep Medicine, 9(11),
          1195–1200.
        </T>
      </SheetScreen>
    );
  }

  const lists: Record<string, { title: string; items: string[] }> = {
    alt: { title: s.tools.items.alt.title, items: s.content.alternatives },
    distract: { title: s.tools.items.distract.title, items: s.content.distractions },
    habits: { title: s.tools.items.habits.title, items: s.content.habits },
  };
  const list = lists[id as string];

  if (!list) {
    return (
      <SheetScreen presentation="push" header={header}>
        <T v="body" tone="label2">
          {s.notFound.title}
        </T>
      </SheetScreen>
    );
  }

  return (
    <SheetScreen presentation="push" header={header}>
      <T v="title1">{list.title}</T>
      {list.items.map((item, i) => {
        const [head, ...rest] = item.split(' — ');
        return (
          <Card key={i} style={styles.item}>
            <View style={[styles.num, { backgroundColor: t.fill }]}>
              <T v="subhead" weight="800" tone="tint" numeric>
                {i + 1}
              </T>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T v="headline">{head}</T>
              {rest.length ? (
                <T v="subhead" tone="label2">
                  {rest.join(' — ')}
                </T>
              ) : null}
            </View>
          </Card>
        );
      })}
    </SheetScreen>
  );
}

const styles = StyleSheet.create({
  cite: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12 },
  item: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  num: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
