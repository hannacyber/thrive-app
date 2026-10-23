import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Keyboard, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../src/theme/ThemeProvider';
import { type } from '../../src/theme/tokens';
import { useI18n } from '../../src/i18n';
import { useAppState } from '../../src/state/AppState';
import { BRANDS, BrandId, Drink, MenuSection, findDrink, groupAll, groupsForBrand, sectionOf, sectionsFor } from '../../src/data/drinks';
import { brandName, drinkFull, entryLabel, isCategory, localizedSearch, sectionLabel } from '../../src/data/drinkText';
import { Glass, Screen, UndoToast, useTabBarSpace } from '../../src/ui/chrome';
import { Button, Card, Chip, Pill, RoundButton, SectionHeader, T, Touch } from '../../src/ui/primitives';
import { BrandHeader, BrandTile, DrinkGroupCard } from '../../src/ui/DrinkPicker';
import { BrandBadge } from '../../src/ui/BrandBadge';
import { Icon } from '../../src/ui/Icon';
import { haptic } from '../../src/lib/haptics';

const BAR_H = 56;

/** Keyboard height (iOS: before it animates in, so the bar moves with it). */
function useKeyboardHeight() {
  const [h, setH] = useState(0);
  useEffect(() => {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const a = Keyboard.addListener(show, (e) => setH(e.endCoordinates.height));
    const b = Keyboard.addListener(hide, () => setH(0));
    return () => {
      a.remove();
      b.remove();
    };
  }, []);
  return h;
}

export default function Log() {
  const t = useTheme();
  const router = useRouter();
  const { s, fmtTime } = useI18n();
  const tabSpace = useTabBarSpace();
  const insets = useSafeAreaInsets();
  const kb = useKeyboardHeight();
  const { todaysEntries, todaysTotal, logDrink, removeEntry, recentDrinks, brandsByUse } = useAppState();

  const [brand, setBrandState] = useState<BrandId | null>(null);
  const [section, setSection] = useState<MenuSection | 'All'>('All');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<{ msg: string; id: string } | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMg, setCustomMg] = useState('');
  const scrollRef = useRef<any>(null);
  const searchRef = useRef<TextInput>(null);

  const setBrand = (b: BrandId | null) => {
    setBrandState(b);
    setSection('All');
    scrollRef.current?.scrollTo?.({ y: 0, animated: true });
  };

  const entries = todaysEntries();
  const recent = recentDrinks(8);
  // Shop tiles: most-logged first (from this person's own logs on this phone).
  const brandOrder = brandsByUse(BRANDS.map((b) => b.id));
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const b of BRANDS) c[b.id] = groupsForBrand(b.id).length;
    return c;
  }, []);

  const searching = query.trim().length > 0;
  const results = useMemo(() => (searching ? groupAll(localizedSearch(query, s)) : []), [query, searching, s]);

  const allGroups = useMemo(() => (brand ? groupsForBrand(brand) : []), [brand]);
  const sections = useMemo(() => (brand && allGroups.length >= 8 && !isCategory(brand) ? sectionsFor(allGroups) : []), [allGroups, brand]);
  const groups = section === 'All' ? allGroups : allGroups.filter((g) => sectionOf(g) === section);

  const done = (name: string, mg: number, id: string) => setToast({ msg: s.common.logged(name, mg), id });
  const pick = (d: Drink) => {
    const label = drinkFull(d, s);
    done(label, d.mg, logDrink(d.id, label, d.mg));
  };

  const customValid = !!customName.trim() && /^\d{1,4}$/.test(customMg) && parseInt(customMg, 10) <= 1000;
  const submitCustom = () => {
    if (!customValid) return;
    haptic.success();
    const mg = parseInt(customMg, 10);
    done(customName.trim(), mg, logDrink('custom', customName.trim(), mg));
    setCustomName('');
    setCustomMg('');
    setCustomOpen(false);
    Keyboard.dismiss();
  };
  const openCustom = (prefill?: string) => {
    setCustomOpen(true);
    if (prefill !== undefined) setCustomName(prefill);
  };

  // Bottom-pinned search / custom panel: sits above the tab bar, rides the keyboard.
  // iOS: the keyboard height is measured from the screen bottom (home indicator
  // included). Android (edge-to-edge, so the window is NOT resized): RN reports the
  // IME height minus the navigation bar, so add the bar inset back.
  const barBottom = kb > 0 ? kb + (Platform.OS === 'android' ? insets.bottom : 0) + 8 : tabSpace;
  const anim = useRef(new Animated.Value(barBottom)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: barBottom, useNativeDriver: false, damping: 22, stiffness: 260, mass: 0.8 }).start();
  }, [barBottom, anim]);

  const bottomPanel = (
    <Animated.View style={[styles.barWrap, { bottom: anim }]} pointerEvents="box-none">
      <Glass style={styles.bar} interactive>
        {customOpen ? (
          <View style={styles.customPanel}>
            <View style={styles.rowBetween}>
              <T v="headline">{s.log.customTitle}</T>
              <RoundButton icon="close" size={36} label={s.common.close} onPress={() => setCustomOpen(false)} />
            </View>
            <TextInput
              value={customName}
              onChangeText={setCustomName}
              placeholder={s.log.customName}
              placeholderTextColor={t.label3}
              maxLength={48}
              autoFocus
              returnKeyType="next"
              style={[type.body, styles.field, { color: t.label, backgroundColor: t.fill }]}
              accessibilityLabel={s.log.customName}
            />
            <View style={styles.customRow}>
              <TextInput
                value={customMg}
                onChangeText={(v) => setCustomMg(v.replace(/[^0-9]/g, ''))}
                placeholder={s.log.customMg}
                placeholderTextColor={t.label3}
                keyboardType="number-pad"
                maxLength={4}
                style={[type.body, styles.field, { flex: 1, minWidth: 0, color: t.label, backgroundColor: t.fill }]}
                accessibilityLabel={s.log.customMg}
              />
              <Button title={s.log.customSubmit} onPress={submitCustom} disabled={!customValid} haptic="select" style={{ minHeight: 48, flexShrink: 0, paddingHorizontal: 18 }} />
            </View>
            <T v="caption" tone="label2">
              {s.log.customHint}
            </T>
          </View>
        ) : (
          <View style={styles.searchRow}>
            <Icon name="search" size={17} color={t.label2} />
            <TextInput
              ref={searchRef}
              value={query}
              onChangeText={setQuery}
              placeholder={s.log.searchPlaceholder}
              placeholderTextColor={t.label3}
              style={[type.body, styles.searchInput, { color: t.label }]}
              returnKeyType="search"
              autoCorrect={false}
              clearButtonMode="never"
              accessibilityLabel={s.log.searchLabel}
            />
            {searching ? (
              <Touch onPress={() => setQuery('')} hitSlop={10} accessibilityRole="button" accessibilityLabel={s.log.clearSearch} style={styles.clearBtn}>
                <Icon name="close" size={14} color={t.label2} />
              </Touch>
            ) : null}
            <RoundButton icon="plus" tone="tint" size={44} label={s.log.customTitle} onPress={() => openCustom()} />
          </View>
        )}
      </Glass>
    </Animated.View>
  );

  return (
    <Screen
      title={s.log.title}
      right={<Pill label={s.log.today(Math.round(todaysTotal()))} color={t.caffeineText} />}
      scrollProps={{ ref: scrollRef } as any}
      overlay={
        <>
          {bottomPanel}
          <UndoToast
            message={toast?.msg ?? null}
            undoLabel={s.common.undo}
            bottom={barBottom + (customOpen ? 230 : BAR_H + 10)}
            onUndo={() => {
              if (toast) removeEntry(toast.id);
              setToast(null);
            }}
            onDone={() => setToast(null)}
          />
        </>
      }
    >
      {searching ? (
        /* ── Search results ─────────────────────────────────────────────── */
        <View style={{ gap: 12 }}>
          <T v="subhead" tone="label2" weight="600" style={{ paddingHorizontal: 4 }}>
            {results.length ? `${s.log.results(results.length)} · ${s.log.tapSize}` : s.log.noResults}
          </T>
          {results.map((g) => (
            <DrinkGroupCard key={g.key} group={g} showBrand onPick={pick} />
          ))}
          <Button kind="secondary" icon="plus" title={s.log.addNamed(query.trim())} onPress={() => openCustom(query.trim())} />
        </View>
      ) : brand ? (
        /* ── Step 2: drinks + sizes for one shop ─────────────────────────── */
        <View style={{ gap: 12 }}>
          <BrandHeader brand={brand} onBack={() => setBrand(null)} />
          {sections.length > 1 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, alignItems: 'center' }}>
              {(['All', ...sections] as (MenuSection | 'All')[]).map((sec) => (
                <Chip key={sec} label={sectionLabel(sec, s)} selected={section === sec} onPress={() => setSection(sec)} />
              ))}
            </ScrollView>
          ) : null}
          {groups.map((g) => (
            <DrinkGroupCard key={g.key} group={g} onPick={pick} />
          ))}
          <Button
            kind="secondary"
            icon="plus"
            title={s.log.notListed}
            onPress={() => openCustom(isCategory(brand) ? '' : `${brandName(brand, s)} `)}
          />
        </View>
      ) : (
        /* ── Step 1: again + shop grid ──────────────────────────────────── */
        <View style={{ gap: 16 }}>
          {recent.length > 0 ? (
            <View>
              <SectionHeader title={s.log.again} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, alignItems: 'center' }}>
                {recent.map((r) => {
                  const d = findDrink(r.drinkId);
                  const label = entryLabel(r, s);
                  return (
                    <Touch
                      key={`${r.drinkId}|${r.name}|${r.mg}`}
                      hapticOnPress="success"
                      onPress={() => done(label, r.mg, logDrink(r.drinkId, label, r.mg))}
                      accessibilityRole="button"
                      accessibilityLabel={s.log.logAgain(label, r.mg)}
                      style={[styles.againChip, { backgroundColor: t.card }]}
                    >
                      {d ? <BrandBadge brand={d.brand} size={36} /> : <View style={[styles.againIcon, { backgroundColor: t.fill }]}><Icon name="cup" size={16} color={t.label2} /></View>}
                      <View style={{ maxWidth: 170 }}>
                        <T v="footnote" weight="600" numberOfLines={1}>
                          {label}
                        </T>
                        <T v="caption" tone="caffeine" weight="700" numeric>
                          {r.mg} {s.common.mg}
                        </T>
                      </View>
                      <Icon name="again" size={14} color={t.label3} />
                    </Touch>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <View>
            <SectionHeader title={s.log.whereFrom} />
            {brandOrder.personalized ? (
              <T v="footnote" tone="label2" style={{ paddingHorizontal: 4, marginTop: -6, marginBottom: 10 }}>
                {s.log.sortedByYou}
              </T>
            ) : null}
            <View style={styles.grid}>
              {brandOrder.order.map((id) => (
                <BrandTile key={id} brand={id} count={counts[id] ?? 0} onPress={() => setBrand(id)} />
              ))}
            </View>
          </View>
        </View>
      )}

      {/* ── Today's list ─────────────────────────────────────────────────── */}
      <View>
        <SectionHeader title={s.log.loggedToday} action={s.log.dataSources} onAction={() => router.push('/sources')} />
        <Card padded={false}>
          {entries.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="cup" size={28} color={t.label3} />
              <T v="subhead" tone="label2" center>
                {s.log.nothingYet}
              </T>
            </View>
          ) : (
            entries.map((e, i) => {
              const d = findDrink(e.drinkId);
              const label = entryLabel(e, s);
              return (
                <View key={e.id} style={[styles.entry, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.separator }]}>
                  {d ? <BrandBadge brand={d.brand} size={40} /> : <View style={[styles.againIcon, { width: 40, height: 40, backgroundColor: t.fill }]}><Icon name="cup" size={18} color={t.label2} /></View>}
                  <View style={{ flex: 1 }}>
                    <T v="subhead" weight="600" numberOfLines={2}>
                      {label}
                    </T>
                    <T v="caption" tone="label2">
                      {fmtTime(e.time)}
                    </T>
                  </View>
                  <T v="headline" numeric>
                    {e.mg}
                    <T v="caption" tone="label2"> {s.common.mg}</T>
                  </T>
                  <Touch
                    onPress={() => {
                      haptic.warning();
                      removeEntry(e.id);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={s.log.deleteEntry(label)}
                    style={styles.trash}
                  >
                    <Icon name="trash" size={16} color={t.dangerText} />
                  </Touch>
                </View>
              );
            })
          )}
        </Card>
      </View>
      {/* Room for the floating search bar (and the keyboard, so the last results can scroll into view). */}
      <View style={{ height: BAR_H + 8 + Math.max(0, barBottom - tabSpace) }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  againChip: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 20, borderCurve: 'continuous', paddingVertical: 8, paddingLeft: 8, paddingRight: 12, minHeight: 52 },
  againIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 28, paddingHorizontal: 24 },
  entry: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10 },
  trash: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  barWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  bar: { width: '100%', maxWidth: 560, borderRadius: 28, borderCurve: 'continuous', overflow: 'hidden' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, height: BAR_H, paddingLeft: 16, paddingRight: 6 },
  searchInput: { flex: 1, minWidth: 0, paddingVertical: 10 },
  clearBtn: { width: 32, height: 44, alignItems: 'center', justifyContent: 'center' },
  customPanel: { padding: 14, gap: 10 },
  customRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  field: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, minHeight: 48 },
});
