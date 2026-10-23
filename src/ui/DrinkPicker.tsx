import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { alpha, type } from '../theme/tokens';
import { useI18n } from '../i18n';
import { BrandId, DRINKS, Drink, DrinkGroup, SourceKind } from '../data/drinks';
import { brandBlurb, brandName, drinkName, sizeParts, isCategory } from '../data/drinkText';
import { BrandBadge } from './BrandBadge';
import { Pill, T, Touch } from './primitives';
import { Icon } from './Icon';

export function useKindColor() {
  const t = useTheme();
  // Hex colors only: Pill tints its background with alpha(), which needs #RRGGBB.
  return (k: SourceKind) => (k === 'official' ? t.goodText : k === 'secondary' ? t.caffeineText : t.scheme === 'dark' ? '#AEAEB2' : '#636366');
}

/** Step 1 — a shop / category tile with an original illustration. */
export function BrandTile({ brand, count, onPress }: { brand: BrandId; count: number; onPress: () => void }) {
  const t = useTheme();
  const { s } = useI18n();
  const name = brandName(brand, s);
  return (
    <Touch
      onPress={onPress}
      hapticOnPress="light"
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${s.log.drinksCount(count)}`}
      style={[styles.tile, { backgroundColor: t.card }]}
    >
      <BrandBadge brand={brand} size={56} />
      <T v="footnote" weight="700" center numberOfLines={2} style={{ marginTop: 8 }}>
        {name}
      </T>
      <T v="caption2" tone="label3" center numberOfLines={1} style={{ marginTop: 2 }}>
        {s.log.drinksCount(count)}
      </T>
    </Touch>
  );
}

/** Header for the selected shop. */
export function BrandHeader({ brand, onBack }: { brand: BrandId; onBack: () => void }) {
  const t = useTheme();
  const { s } = useI18n();
  // Shops that publish no caffeine numbers at all get an explicit note.
  const estimateOnly = DRINKS.filter((d) => d.brand === brand).every((d) => d.kind === 'estimate');
  return (
    <View style={{ gap: 12 }}>
      <Touch
        onPress={onBack}
        hapticOnPress="light"
        accessibilityRole="button"
        accessibilityLabel={s.log.allBrands}
        style={[styles.backChip, { backgroundColor: t.fill }]}
      >
        <Icon name="chevronLeft" size={14} color={t.label} />
        <T v="subhead" weight="600">
          {s.log.allBrands}
        </T>
      </Touch>
      <View style={styles.brandHead}>
        <BrandBadge brand={brand} size={64} />
        <View style={{ flex: 1 }}>
          <T v="title2">{brandName(brand, s)}</T>
          <T v="subhead" tone="label2">
            {isCategory(brand) ? brandBlurb(brand, s) : `${brandBlurb(brand, s)} · ${s.log.tapSize}`}
          </T>
        </View>
      </View>
      {estimateOnly ? (
        <View style={[styles.note, { backgroundColor: t.fill }]}>
          <Icon name="info" size={16} color={t.label2} />
          <T v="footnote" tone="label2" style={{ flex: 1 }}>
            {s.log.estimateOnly}
          </T>
        </View>
      ) : null}
    </View>
  );
}

/** Step 2 — one drink with a big button per size. Tapping a size logs it. */
export function DrinkGroupCard({ group, showBrand = false, onPick }: { group: DrinkGroup; showBrand?: boolean; onPick: (d: Drink) => void }) {
  const t = useTheme();
  const { s } = useI18n();
  const kindColor = useKindColor();
  const kinds = Array.from(new Set(group.sizes.map((x) => x.kind)));
  const name = drinkName(group, s);
  return (
    <View style={[styles.group, { backgroundColor: t.card }]}>
      <View style={styles.groupHead}>
        {showBrand ? <BrandBadge brand={group.brand} size={36} /> : null}
        <View style={{ flex: 1 }}>
          {showBrand ? (
            <T v="caption" tone="label2" weight="600">
              {brandName(group.brand, s)}
            </T>
          ) : null}
          <T v="headline">{name}</T>
        </View>
        <Pill label={kinds.length > 1 ? s.log.mixedSources : s.kinds[kinds[0]]} color={kinds.length > 1 ? t.caffeineText : kindColor(kinds[0])} />
      </View>
      <View style={styles.sizeRow}>
        {group.sizes.map((d) => {
          const [a, b] = sizeParts(d.size, s);
          return (
            <Touch
              key={d.id}
              onPress={() => onPick(d)}
              hapticOnPress="success"
              accessibilityRole="button"
              accessibilityLabel={s.log.logSize(name, `${a} ${b}`.trim(), d.mg)}
              style={[styles.sizeBtn, { backgroundColor: t.fill }]}
              pressedStyle={{ backgroundColor: alpha('#00B3A4', 0.2) }}
            >
              <T v="subhead" weight="700" numberOfLines={1}>
                {a}
              </T>
              {b ? (
                <T v="caption2" tone="label3" numberOfLines={1}>
                  {b}
                </T>
              ) : null}
              <Text style={[type.number, { fontSize: 17, color: t.caffeineText, marginTop: 4 }]} maxFontSizeMultiplier={1.3}>
                {d.mg}
                <Text style={[type.caption2, { color: t.label2 }]}> {s.common.mg}</Text>
              </Text>
            </Touch>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flexBasis: '30%', flexGrow: 1, maxWidth: '33%', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 6, borderRadius: 22, borderCurve: 'continuous' },
  backChip: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', minHeight: 44, paddingHorizontal: 14, borderRadius: 999 },
  note: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', padding: 12, borderRadius: 14 },
  brandHead: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  group: { borderRadius: 22, borderCurve: 'continuous', padding: 14, gap: 12 },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeBtn: { flexGrow: 1, flexBasis: 84, maxWidth: 160, minHeight: 72, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 8, borderRadius: 16, borderCurve: 'continuous' },
});
