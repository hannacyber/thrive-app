import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '../../src/theme/ThemeProvider';
import { alpha, type } from '../../src/theme/tokens';
import { useI18n } from '../../src/i18n';
import { useAppState, DAILY_LIMIT_MG } from '../../src/state/AppState';
import { QUICK_IDS, SAFE_BEDTIME_MG, findDrink } from '../../src/data/drinks';
import { brandName, drinkFull, drinkName, isCategory, sizeLabel } from '../../src/data/drinkText';
import { rankFor } from '../../src/data/ranks';
import { CUDQ_QUESTIONS } from '../../src/data/cudq';
import { Screen, UndoToast, useTabBarSpace } from '../../src/ui/chrome';
import { Card, Pill, ProgressBar, RoundButton, SectionHeader, SoftIcon, T, Touch } from '../../src/ui/primitives';
import { Icon } from '../../src/ui/Icon';
import { BrandBadge } from '../../src/ui/BrandBadge';
import { Owl, Ring } from '../../src/ui/visuals';
import { haptic } from '../../src/lib/haptics';

const SLEEP_FACES = ['😫', '😕', '😐', '🙂', '😴'];

export default function Home() {
  const t = useTheme();
  const router = useRouter();
  const { s } = useI18n();
  const tabSpace = useTabBarSpace();
  const { state, todaysTotal, activeCaffeineAtBedtime, sleepToday, setSleepToday, logDrink, removeEntry, currentStreak } = useAppState();
  const [toast, setToast] = useState<{ msg: string; id: string } | null>(null);

  const total = Math.round(todaysTotal());
  const over = total > DAILY_LIMIT_MG;
  const bedtimeMg = Math.round(activeCaffeineAtBedtime());
  const bedtimeOk = bedtimeMg < SAFE_BEDTIME_MG;
  const streak = currentStreak();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? s.home.morning : h < 18 ? s.home.afternoon : s.home.evening;
  }, [s]);

  const { current, next } = rankFor(state.xp);
  const xpPct = next ? (state.xp - current.min) / (next.min - current.min) : 1;

  const quick = QUICK_IDS.map(findDrink).filter((d): d is NonNullable<ReturnType<typeof findDrink>> => !!d);

  return (
    <Screen
      subtitle={greeting}
      title={state.name.trim() ? s.home.hey(state.name.trim()) : s.home.heyThere}
      right={<RoundButton icon="gear" label={s.home.settings} onPress={() => router.push('/settings')} />}
      overlay={
        <UndoToast
          message={toast?.msg ?? null}
          undoLabel={s.common.undo}
          bottom={tabSpace}
          onUndo={() => {
            if (toast) removeEntry(toast.id);
            setToast(null);
          }}
          onDone={() => setToast(null)}
        />
      }
    >
      {/* ── Today: passive info (top of screen) ─────────────────────────── */}
      <Card style={styles.hero}>
        <Ring
          pct={total / DAILY_LIMIT_MG}
          from={over ? '#FF6B3D' : t.scheme === 'dark' ? '#3DDCCB' : '#00C7B5'}
          to={over ? t.danger : t.caffeine}
        >
          <Text style={[type.number, { fontSize: 40, lineHeight: 44, color: t.label }]} maxFontSizeMultiplier={1.2}>
            {total}
          </Text>
          <T v="caption" tone="label2" weight="600" maxFontSizeMultiplier={1.2}>
            {s.home.ofGoal(DAILY_LIMIT_MG)}
          </T>
        </Ring>
        <View style={styles.heroSide}>
          <T v="footnote" tone="label2" weight="600">
            {s.home.todaySoFar}
          </T>
          <T v="headline" tone={over ? 'danger' : 'label'} style={{ marginTop: 2 }}>
            {over ? s.home.overGoal(total - DAILY_LIMIT_MG) : s.home.leftToday(DAILY_LIMIT_MG - total)}
          </T>
          <Touch
            onPress={() => router.push('/companion')}
            hapticOnPress="light"
            accessibilityRole="button"
            style={[styles.bedtimeChip, { backgroundColor: alpha(bedtimeOk ? '#30B565' : '#FF8A00', 0.14) }]}
          >
            <Icon name={bedtimeOk ? 'moon' : 'warning'} size={15} color={bedtimeOk ? t.goodText : t.caffeineText} />
            <View style={{ flex: 1 }}>
              <T v="caption" tone="label2" weight="600">
                {s.home.bedtimeTitle}
              </T>
              <T v="footnote" weight="700" tone={bedtimeOk ? 'good' : 'caffeine'} numberOfLines={2}>
                {bedtimeOk ? s.home.bedtimeOk : s.home.bedtimeWarn(bedtimeMg)}
              </T>
            </View>
          </Touch>
        </View>
      </Card>

      {/* ── Streak + rank (compact) ──────────────────────────────────────── */}
      <Card onPress={() => router.push('/progress')} style={styles.streakCard}>
        <SoftIcon name="flame" color={t.caffeine} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={styles.rowBetween}>
            <T v="headline">
              {s.home.streak} · {s.home.streakDays(streak)}
            </T>
            <Owl size={26} />
          </View>
          <ProgressBar pct={xpPct} color={t.sleep} height={6} />
          <T v="caption" tone="label2">
            {next ? s.home.xpTo(next.min - state.xp, s.ranks[next.name as keyof typeof s.ranks]) : s.home.maxRank}
          </T>
        </View>
      </Card>

      {/* ── Quick log: the main action, sits in the thumb zone ─────────── */}
      <View>
        <SectionHeader title={s.home.quickLog} action={s.home.more} onAction={() => router.push('/log')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}
          style={styles.bleed}
        >
          {quick.map((d) => (
            <Touch
              key={d.id}
              hapticOnPress="success"
              onPress={() => {
                const label = drinkFull(d, s);
                const id = logDrink(d.id, label, d.mg);
                setToast({ msg: s.common.logged(label, d.mg), id });
              }}
              accessibilityRole="button"
              accessibilityLabel={s.log.logSize(drinkFull(d, s, false), sizeLabel(d.size, s), d.mg)}
              style={[styles.quickTile, { backgroundColor: t.card }]}
            >
              <BrandBadge brand={d.brand} size={52} />
              <View style={{ minHeight: 50 }}>
                <T v="caption2" tone="label2" weight="600" numberOfLines={1}>
                  {isCategory(d.brand) ? sizeLabel(d.size, s) : brandName(d.brand, s)}
                </T>
                <T v="footnote" weight="600" numberOfLines={2}>
                  {drinkName(d, s)}
                </T>
              </View>
              <View style={[styles.mgPill, { backgroundColor: t.fill }]}>
                <Icon name="plus" size={11} color={t.label2} />
                <T v="caption" tone="label2" weight="700" numeric>
                  {d.mg} {s.common.mg}
                </T>
              </View>
            </Touch>
          ))}
        </ScrollView>
        <T v="caption" tone="label3" style={{ paddingHorizontal: 4, marginTop: 8 }}>
          {s.home.quickLogHint}
        </T>
      </View>

      {/* ── Sleep rating ─────────────────────────────────────────────────── */}
      <Card>
        <View style={styles.rowBetween}>
          <T v="headline">{s.home.sleepTitle}</T>
          {sleepToday ? <Pill label={s.home.sleepSaved} color={t.goodText} /> : null}
        </View>
        <View style={styles.sleepRow}>
          {s.home.sleepLabels.map((label, i) => {
            const n = i + 1;
            const active = sleepToday === n;
            return (
              <Touch
                key={label}
                onPress={() => {
                  haptic.select();
                  setSleepToday(n);
                }}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: active }}
                style={[
                  styles.sleepBtn,
                  { backgroundColor: active ? alpha(t.scheme === 'dark' ? '#7D7AFF' : '#5E5CE6', 0.18) : t.fill },
                  active && { borderColor: t.sleep, borderWidth: 2 },
                ]}
              >
                <Text style={styles.face} maxFontSizeMultiplier={1.2}>
                  {SLEEP_FACES[i]}
                </Text>
                <T v="caption2" tone={active ? 'sleep' : 'label2'} weight="700" numberOfLines={1} maxFontSizeMultiplier={1.2}>
                  {label}
                </T>
              </Touch>
            );
          })}
        </View>
      </Card>

      {/* ── Check-in ─────────────────────────────────────────────────────── */}
      <Card onPress={() => router.push('/survey')} accessibilityLabel={s.home.checkInTitle} style={styles.checkIn}>
        <SoftIcon name="book" color={t.sleep} size={48} glyph={22} />
        <View style={{ flex: 1, gap: 3 }}>
          <T v="headline">{s.home.checkInTitle}</T>
          <T v="footnote" tone="label2">
            {s.home.checkInDesc}
          </T>
          {state.survey ? (
            <View style={{ marginTop: 4 }}>
              <Pill label={s.home.checkInLast(state.survey.score, CUDQ_QUESTIONS.length * 4)} color={t.goodText} />
            </View>
          ) : null}
        </View>
        <Icon name="chevronRight" size={15} color={t.label3} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 20 },
  heroSide: { flex: 1, gap: 4 },
  bedtimeChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, marginTop: 10, minHeight: 44 },
  streakCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  bleed: { marginHorizontal: -16, flexGrow: 0 },
  quickRow: { paddingHorizontal: 16, gap: 10 },
  quickTile: { width: 124, borderRadius: 22, borderCurve: 'continuous', padding: 12, gap: 8 },
  mgPill: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  sleepRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  sleepBtn: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 10, borderRadius: 16, borderCurve: 'continuous', borderWidth: 2, borderColor: 'transparent', minHeight: 64 },
  face: { fontSize: 26, lineHeight: 32 },
  checkIn: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});
