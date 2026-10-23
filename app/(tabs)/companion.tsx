import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../src/theme/ThemeProvider';
import { alpha, type } from '../../src/theme/tokens';
import { useI18n } from '../../src/i18n';
import { Period, periodOf, useAppState } from '../../src/state/AppState';
import { bedtimeTarget, cutoffTime } from '../../src/lib/caffeine';
import { Drink, QUICK_IDS, SAFE_BEDTIME_MG, findDrink } from '../../src/data/drinks';
import { drinkFull, entryLabel } from '../../src/data/drinkText';
import { Screen } from '../../src/ui/chrome';
import { Card, SectionHeader, Segmented, SoftIcon, T } from '../../src/ui/primitives';
import { Icon } from '../../src/ui/Icon';
import type { IconName } from '../../src/ui/icons';
import { BrandBadge } from '../../src/ui/BrandBadge';
import { BedtimeMeter } from '../../src/ui/visuals';

const PERIOD_ICON: Record<Period, IconName> = { morning: 'sunrise', afternoon: 'sun', evening: 'moon' };

export default function Tonight() {
  const t = useTheme();
  const { s, fmtTime } = useI18n();
  const { state, todaysEntries, activeCaffeineAtBedtime, personalPattern } = useAppState();
  const pattern = personalPattern();
  const [period, setPeriod] = useState<Period>(periodOf(new Date()));

  const bedtime = bedtimeTarget(state.bedtime || '23:00');
  const bedStr = fmtTime(bedtime);
  const active = Math.round(activeCaffeineAtBedtime());
  const budget = SAFE_BEDTIME_MG - active;
  const over = budget <= 0;
  // Same thresholds as the color and the verdict card below, so they never disagree.
  const level = active < SAFE_BEDTIME_MG ? s.tonight.levelLow : active < 100 ? s.tonight.levelModerate : s.tonight.levelHigh;
  const levelColor = active < SAFE_BEDTIME_MG ? t.goodText : active < 100 ? t.caffeineText : t.dangerText;
  const cutoffDrinks = QUICK_IDS.map(findDrink).filter((d): d is Drink => !!d);
  const entries = todaysEntries().slice().reverse();
  const tip = s.content.tips[period];

  return (
    <Screen title={s.tonight.title} subtitle={s.tonight.subtitle(bedStr)}>
      {/* ── Bedtime caffeine ─────────────────────────────────────────────── */}
      <Card>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <T v="footnote" tone="label2" weight="600">
              {s.tonight.atBedtime}
            </T>
            <Text style={[type.number, { fontSize: 48, lineHeight: 54, color: levelColor }]} maxFontSizeMultiplier={1.2}>
              {active}
              <Text style={[type.title3, { color: t.label2 }]}> {s.common.mg}</Text>
            </Text>
            <T v="subhead" weight="600" style={{ color: levelColor }}>
              {level}
            </T>
          </View>
          <SoftIcon name="bed" color={t.sleep} size={56} glyph={28} />
        </View>
        <BedtimeMeter mg={active} goal={SAFE_BEDTIME_MG} />
        <T v="caption" tone="label3" style={{ marginTop: 8 }}>
          {s.tonight.estimate}
        </T>
      </Card>

      {/* ── Verdict + last call ──────────────────────────────────────────── */}
      <Card style={{ backgroundColor: alpha(over ? '#FF3B30' : '#30B565', t.scheme === 'dark' ? 0.16 : 0.1) }}>
        <View style={styles.verdict}>
          <Icon name={over ? 'warning' : 'checkCircle'} size={24} color={over ? t.dangerText : t.goodText} />
          <View style={{ flex: 1, gap: 4 }}>
            <T v="headline">{over ? s.tonight.overTitle(SAFE_BEDTIME_MG) : s.tonight.okTitle}</T>
            <T v="subhead" tone="label2">
              {over ? s.tonight.overDesc(active, bedStr, SAFE_BEDTIME_MG) : s.tonight.okDesc(SAFE_BEDTIME_MG, bedStr)}
            </T>
            {over ? (
              <T v="subhead" weight="600" style={{ marginTop: 4 }}>
                💡 {s.tonight.overTip}
              </T>
            ) : null}
          </View>
        </View>
      </Card>

      {!over ? (
        <View>
          <SectionHeader title={s.tonight.lastCall} />
          <T v="footnote" tone="label2" style={{ paddingHorizontal: 4, marginTop: -4, marginBottom: 10 }}>
            {s.tonight.lastCallDesc}
          </T>
          <Card padded={false}>
            {cutoffDrinks.map((d, i) => {
              const c = cutoffTime(d.mg, budget, bedtime)!;
              const anytime = c.getTime() >= bedtime.getTime();
              const passed = !anytime && c.getTime() < Date.now();
              const color = anytime ? t.goodText : passed ? t.dangerText : t.caffeineText;
              const label = anytime ? s.tonight.fitsAnytime : passed ? s.tonight.windowPassed : s.tonight.by(fmtTime(c));
              return (
                <View key={d.id} style={[styles.cutRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.separator }]}>
                  <BrandBadge brand={d.brand} size={36} />
                  <View style={{ flex: 1 }}>
                    <T v="subhead" weight="600" numberOfLines={1}>
                      {drinkFull(d, s, false)}
                    </T>
                    <T v="caption" tone="label2" numeric>
                      {d.mg} {s.common.mg}
                    </T>
                  </View>
                  <View style={[styles.cutPill, { backgroundColor: alpha(passed ? '#FF3B30' : anytime ? '#30B565' : '#FF8A00', 0.14) }]}>
                    <T v="footnote" weight="700" style={{ color }}>
                      {label}
                    </T>
                  </View>
                </View>
              );
            })}
          </Card>
        </View>
      ) : null}

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <View>
        <SectionHeader title={s.tonight.timeline} />
        <Card>
          {[...entries.map((e) => ({ key: e.id, time: fmtTime(e.time), title: `${entryLabel(e, s)} · ${e.mg} ${s.common.mg}`, desc: '', kind: 'done' as const })),
            { key: 'bed', time: bedStr, title: s.tonight.targetBedtime, desc: over ? s.tonight.stillActive(active) : s.tonight.windDown, kind: over ? ('warn' as const) : ('bed' as const) },
          ].map((it, i, arr) => {
            const color = it.kind === 'done' ? t.caffeine : it.kind === 'warn' ? t.danger : t.sleep;
            return (
              <View key={it.key} style={styles.tlRow}>
                <View style={styles.tlRail}>
                  <View style={[styles.tlDot, { backgroundColor: alpha(color.length === 7 ? color : '#888888', 0.18) }]}>
                    <Icon name={it.kind === 'done' ? 'cup' : 'moon'} size={13} color={color} />
                  </View>
                  {i < arr.length - 1 ? <View style={[styles.tlLine, { backgroundColor: t.separator }]} /> : null}
                </View>
                <View style={{ flex: 1, paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
                  <T v="caption" tone="label2" weight="700" numeric>
                    {it.time}
                  </T>
                  <T v="subhead" weight="600">
                    {it.title}
                  </T>
                  {it.desc ? (
                    <T v="footnote" tone="label2">
                      {it.desc}
                    </T>
                  ) : null}
                </View>
              </View>
            );
          })}
        </Card>
      </View>

      {/* ── Pattern ──────────────────────────────────────────────────────── */}
      <View>
        <SectionHeader title={s.tonight.pattern} />
        <Card style={styles.patternCard}>
          <SoftIcon name={pattern ? PERIOD_ICON[pattern.period] : 'sparkles'} color={t.tint} />
          <T v="subhead" style={{ flex: 1 }}>
            {pattern ? s.tonight.patternResult(pattern.count, pattern.total, s.tonight.periods[pattern.period]) : s.tonight.patternNeedMore}
          </T>
        </Card>
      </View>

      {/* ── Tips (interactive → lower on the screen) ─────────────────────── */}
      <View>
        <SectionHeader title={s.tonight.tipsTitle} />
        <Segmented
          options={(['morning', 'afternoon', 'evening'] as Period[]).map((p) => ({ key: p, label: s.tonight.periodTabs[p] }))}
          value={period}
          onChange={setPeriod}
        />
        <Card style={[styles.patternCard, { marginTop: 10, alignItems: 'flex-start' }]}>
          <SoftIcon name={PERIOD_ICON[period]} color={period === 'evening' ? t.sleep : t.caffeine} />
          <View style={{ flex: 1, gap: 4 }}>
            <T v="headline">{tip.title}</T>
            <T v="subhead" tone="label2">
              {tip.body}
            </T>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  verdict: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  cutRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, minHeight: 56 },
  cutPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  tlRow: { flexDirection: 'row', gap: 12 },
  tlRail: { width: 28, alignItems: 'center' },
  tlDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tlLine: { width: 2, flex: 1, marginTop: 4, borderRadius: 1 },
  patternCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});
