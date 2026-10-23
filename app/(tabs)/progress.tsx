import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../src/theme/ThemeProvider';
import { alpha, type } from '../../src/theme/tokens';
import { useI18n } from '../../src/i18n';
import { useAppState, DAILY_LIMIT_MG } from '../../src/state/AppState';
import { dateKey } from '../../src/lib/caffeine';
import { RANKS, rankFor } from '../../src/data/ranks';
import { Screen } from '../../src/ui/chrome';
import { Card, Pill, ProgressBar, SectionHeader, T } from '../../src/ui/primitives';
import { Icon } from '../../src/ui/Icon';
import { Owl, WeekBars } from '../../src/ui/visuals';

export default function Progress() {
  const t = useTheme();
  const { s, weekday } = useI18n();
  const { state, dailyTotals, currentStreak } = useAppState();

  // Built only from real, dated log entries — days with nothing logged show 0.
  const week = dailyTotals(7);
  const values = week.map((w) => w.mg);
  const labels = week.map((w) => weekday(w.date));
  const logged = week.filter((w) => w.mg > 0);
  const avg = logged.length ? Math.round(logged.reduce((a, b) => a + b.mg, 0) / logged.length) : null;
  const underPct = logged.length ? Math.round((logged.filter((w) => w.mg <= DAILY_LIMIT_MG).length / logged.length) * 100) : null;
  const sleeps = week.map((w) => state.sleepByDay[w.key]).filter((v): v is number => v != null);
  const avgSleep = sleeps.length ? (sleeps.reduce((a, b) => a + b, 0) / sleeps.length).toFixed(1) : null;
  const streak = currentStreak();

  const cells = useMemo(() => {
    const now = new Date();
    const out: { day: number; filled: boolean; today: boolean }[] = [];
    for (let j = 13; j >= 0; j--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - j, 12);
      out.push({ day: d.getDate(), filled: !!state.streakDays[dateKey(d)], today: j === 0 });
    }
    return out;
  }, [state.streakDays]);

  const { current, next } = rankFor(state.xp);
  const xpPct = next ? (state.xp - current.min) / (next.min - current.min) : 1;
  const rankName = (n: string) => s.ranks[n as keyof typeof s.ranks] ?? n;

  return (
    <Screen title={s.progress.title} subtitle={s.progress.subtitle}>
      <Card>
        <View style={styles.rowBetween}>
          <T v="headline">{s.progress.week}</T>
          <Pill label={s.progress.dailyGoal(DAILY_LIMIT_MG)} color={t.dangerText} />
        </View>
        <WeekBars values={values} labels={labels} goal={DAILY_LIMIT_MG} todayIndex={values.length - 1} />
      </Card>

      <View style={styles.stats}>
        <Stat value={avg != null ? String(avg) : '—'} label={s.progress.avgPerDay} color={t.caffeineText} />
        <Stat value={underPct != null ? `${underPct}%` : '—'} label={s.progress.underGoal} color={t.goodText} />
        <Stat value={avgSleep ? `${avgSleep}` : '—'} label={s.progress.avgSleep} color={t.sleep} suffix={avgSleep ? '/5' : ''} />
      </View>

      <View>
        <SectionHeader title={s.progress.streakTitle} />
        <Card>
          <View style={styles.streakHead}>
            <Icon name="flame" size={22} color={t.caffeine} />
            <T v="headline">{s.progress.streakDesc(streak)}</T>
          </View>
          <View style={styles.cal}>
            {cells.map((c, i) => (
              <View
                key={i}
                style={[
                  styles.cell,
                  { backgroundColor: c.filled ? t.caffeine : t.fill },
                  c.today && { borderWidth: 2, borderColor: t.tint },
                ]}
                accessible
                accessibilityLabel={`${c.day}${c.filled ? ' ✓' : ''}`}
              >
                <Text style={[type.caption, type.number, { fontSize: 13, color: c.filled ? '#FFFFFF' : t.label3 }]} maxFontSizeMultiplier={1.1}>
                  {c.day}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View>
        <SectionHeader title={s.progress.rankTitle} />
        <Card>
          <View style={styles.rankHead}>
            <View style={[styles.owlBadge, { backgroundColor: alpha(state.accent || '#00B3A4', 0.14) }]}>
              <Owl size={40} />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <T v="title3" weight="700">
                {rankName(current.name)}
              </T>
              <ProgressBar pct={xpPct} color={t.sleep} />
              <T v="caption" tone="label2">
                {next ? s.home.xpTo(next.min - state.xp, rankName(next.name)) : s.home.maxRank}
              </T>
            </View>
          </View>
          <View style={styles.tiers}>
            {RANKS.map((r) => {
              const reached = state.xp >= r.min;
              return (
                <View key={r.name} style={[styles.tier, { backgroundColor: reached ? alpha('#5E5CE6', 0.16) : t.fill }]}>
                  {reached ? <Icon name="check" size={11} color={t.sleep} /> : null}
                  <T v="caption" weight="700" style={{ color: reached ? t.sleep : t.label3 }}>
                    {rankName(r.name)}
                  </T>
                </View>
              );
            })}
          </View>
          <T v="caption" tone="label2" style={{ marginTop: 12 }}>
            {s.progress.rankNote}
          </T>
        </Card>
      </View>
    </Screen>
  );
}

function Stat({ value, label, color, suffix }: { value: string; label: string; color: string; suffix?: string }) {
  const t = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: t.card }]} accessible accessibilityLabel={`${label}: ${value}${suffix ?? ''}`}>
      <Text style={[type.number, { fontSize: 26, lineHeight: 30, color }]} maxFontSizeMultiplier={1.2} numberOfLines={1} adjustsFontSizeToFit>
        {value}
        {suffix ? <Text style={[type.footnote, { color: t.label2 }]}>{suffix}</Text> : null}
      </Text>
      <T v="caption" tone="label2" center numberOfLines={2} style={{ marginTop: 4 }}>
        {label}
      </T>
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8, borderRadius: 22, borderCurve: 'continuous' },
  streakHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cal: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 },
  cell: { width: '12.4%', aspectRatio: 1, borderRadius: 10, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  rankHead: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  owlBadge: { width: 64, height: 64, borderRadius: 20, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  tiers: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 },
  tier: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
});
