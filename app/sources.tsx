import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '../src/theme/ThemeProvider';
import { useI18n } from '../src/i18n';
import { openLink } from '../src/lib/links';
import { BRANDS, DATA_CHECKED, DRINKS, SOURCES, SourceId, SourceKind } from '../src/data/drinks';
import { brandName } from '../src/data/drinkText';
import { SheetHeader, SheetScreen } from '../src/ui/chrome';
import { Card, T, Touch } from '../src/ui/primitives';
import { Icon } from '../src/ui/Icon';
import { BrandBadge } from '../src/ui/BrandBadge';
import { useKindColor } from '../src/ui/DrinkPicker';

export default function Sources() {
  const router = useRouter();
  const t = useTheme();
  const { s, fmtDate } = useI18n();
  const kindColor = useKindColor();
  // Opened from the Settings sheet it is presented as a sheet too (see app/_layout.tsx).
  const { sheet } = useLocalSearchParams<{ sheet?: string }>();
  const [y, m, d] = DATA_CHECKED.split('-').map((n) => parseInt(n, 10));

  return (
    <SheetScreen presentation={sheet ? 'sheet' : 'push'} header={<SheetHeader kind="back" onClose={() => router.back()} closeLabel={s.common.back} />}>
      <T v="title1">{s.sources.title}</T>
      <T v="subhead" tone="label2">
        {s.sources.intro(fmtDate(new Date(y, m - 1, d)))}
      </T>

      <Card style={{ gap: 10 }}>
        {(['official', 'secondary', 'estimate'] as SourceKind[]).map((k) => (
          <View key={k} style={styles.legend}>
            <View style={[styles.dot, { backgroundColor: kindColor(k) }]} />
            <T v="subhead" style={{ flex: 1 }}>
              <T v="subhead" weight="700">
                {s.kinds[k]}:{' '}
              </T>
              {s.sources.kindDesc[k]}
            </T>
          </View>
        ))}
      </Card>

      {BRANDS.map((b) => {
        const drinks = DRINKS.filter((x) => x.brand === b.id);
        if (!drinks.length) return null;
        const srcIds = Array.from(new Set(drinks.map((x) => x.src))) as SourceId[];
        const kinds = Array.from(new Set(drinks.map((x) => s.kinds[x.kind]))).join(', ');
        return (
          <Card key={b.id} padded={false}>
            <View style={styles.brandHead}>
              <BrandBadge brand={b.id} size={40} />
              <View style={{ flex: 1 }}>
                <T v="headline">{brandName(b.id, s)}</T>
                <T v="caption" tone="label2">
                  {s.sources.drinksAndKinds(drinks.length, kinds)}
                </T>
              </View>
            </View>
            {srcIds.map((id) => (
              <Touch
                key={id}
                onPress={() => openLink(SOURCES[id].url, s)}
                accessibilityRole="link"
                scaleTo={0.99}
                style={[styles.src, { borderTopColor: t.separator }]}
              >
                <T v="footnote" tone="tint" weight="600" style={{ flex: 1 }}>
                  {SOURCES[id].name}
                </T>
                <Icon name="external" size={13} color={t.tintText} />
              </Touch>
            ))}
          </Card>
        );
      })}

      <T v="caption" tone="label2" style={{ paddingHorizontal: 4 }}>
        {s.sources.disclaimer}
      </T>
    </SheetScreen>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  brandHead: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  src: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 14, paddingVertical: 12, minHeight: 44 },
});
