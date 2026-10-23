import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../src/theme/ThemeProvider';
import { alpha, type } from '../src/theme/tokens';
import { LANGS, useI18n } from '../src/i18n';
import { useAppState } from '../src/state/AppState';
import { DAILY_LIMIT_MG } from '../src/data/drinks';
import { haptic } from '../src/lib/haptics';
import { Ambient } from '../src/ui/chrome';
import { Button, Chip, SoftIcon, T, Touch } from '../src/ui/primitives';
import { BedtimePicker } from '../src/ui/BedtimePicker';
import { BrandBadge } from '../src/ui/BrandBadge';
import { Owl } from '../src/ui/visuals';
import type { IconName } from '../src/ui/icons';

const STEPS = 3;

export default function Onboarding() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { s, lang } = useI18n();
  const { state, updateSettings } = useAppState();
  const [step, setStep] = useState(0);

  const finish = (to: '/' | '/log') => {
    haptic.success();
    updateSettings({ onboarded: true });
    router.replace(to);
  };

  const points: { icon: IconName; color: string; text: string }[] = [
    { icon: 'cup', color: t.caffeine, text: s.onboarding.point1 },
    { icon: 'moon', color: t.sleep, text: s.onboarding.point2 },
    { icon: 'shield', color: t.good, text: s.onboarding.point3 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <Ambient height={520} />
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <View style={styles.dots} accessible accessibilityLabel={s.onboarding.step(step + 1, STEPS)}>
          {Array.from({ length: STEPS }, (_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === step ? t.tint : t.fillStrong, width: i === step ? 22 : 8 }]} />
          ))}
        </View>
        {step < 2 ? (
          <Touch onPress={() => finish('/')} hitSlop={10} accessibilityRole="button" style={styles.skip}>
            <T v="subhead" tone="label2" weight="600">
              {s.common.skip}
            </T>
          </Touch>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {step === 0 ? (
          <>
            <View style={[styles.hero, { backgroundColor: alpha(state.accent || '#00B3A4', 0.14) }]}>
              <Owl size={96} />
            </View>
            <T v="largeTitle" center>
              {s.onboarding.welcomeTitle}
            </T>
            <T v="body" tone="label2" center style={{ maxWidth: 360, alignSelf: 'center' }}>
              {s.onboarding.welcomeBody}
            </T>
            <View style={{ gap: 12, marginTop: 8 }}>
              {points.map((p) => (
                <View key={p.text} style={[styles.point, { backgroundColor: t.card }]}>
                  <SoftIcon name={p.icon} color={p.color} />
                  <T v="headline" style={{ flex: 1 }}>
                    {p.text}
                  </T>
                </View>
              ))}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 2, alignItems: 'center' }} style={{ marginTop: 8, flexGrow: 0 }}>
              {LANGS.map((l) => (
                <Chip key={l.id} label={l.native} selected={lang === l.id} onPress={() => updateSettings({ language: l.id })} />
              ))}
            </ScrollView>
          </>
        ) : step === 1 ? (
          <>
            <T v="largeTitle">{s.onboarding.aboutYouTitle}</T>
            <T v="body" tone="label2">
              {s.onboarding.aboutYouBody}
            </T>
            <View style={{ gap: 8, marginTop: 8 }}>
              <T v="headline">{s.onboarding.nameLabel}</T>
              <TextInput
                value={state.name}
                onChangeText={(v) => updateSettings({ name: v })}
                placeholder={s.settings.namePlaceholder}
                placeholderTextColor={t.label3}
                maxLength={24}
                returnKeyType="done"
                style={[type.title3, styles.input, { color: t.label, backgroundColor: t.card }]}
                accessibilityLabel={s.onboarding.nameLabel}
              />
            </View>
            <View style={{ gap: 10, marginTop: 12 }}>
              <T v="headline">{s.onboarding.bedtimeLabel}</T>
              <BedtimePicker value={state.bedtime} onChange={(v) => updateSettings({ bedtime: v })} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.badges}>
              {(['starbucks', 'boba', 'energy', 'generic'] as const).map((b, i) => (
                <View key={b} style={{ transform: [{ rotate: `${(i - 1.5) * 6}deg` }], marginTop: i % 2 ? 14 : 0 }}>
                  <BrandBadge brand={b} size={68} />
                </View>
              ))}
            </View>
            <T v="largeTitle" center>
              {s.onboarding.readyTitle}
            </T>
            <T v="body" tone="label2" center style={{ maxWidth: 360, alignSelf: 'center' }}>
              {s.onboarding.readyBody(DAILY_LIMIT_MG)}
            </T>
          </>
        )}
      </ScrollView>

      {/* Primary actions: bottom of the screen, in thumb reach. */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {step < 2 ? (
          <>
            <Button title={step === 0 ? s.onboarding.start : s.common.next} onPress={() => setStep(step + 1)} haptic="light" />
            {step === 1 ? <Button kind="plain" title={s.common.back} onPress={() => setStep(0)} /> : null}
          </>
        ) : (
          <>
            <Button title={s.onboarding.logFirst} icon="plus" onPress={() => finish('/log')} />
            <Button kind="plain" title={s.onboarding.explore} onPress={() => finish('/')} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, minHeight: 44 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  skip: { minHeight: 44, minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
  body: { padding: 20, gap: 12, width: '100%', maxWidth: 560, alignSelf: 'center', flexGrow: 1, justifyContent: 'center' },
  hero: { width: 140, height: 140, borderRadius: 44, borderCurve: 'continuous', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  point: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, borderCurve: 'continuous' },
  input: { borderRadius: 16, borderCurve: 'continuous', paddingHorizontal: 16, paddingVertical: 14, minHeight: 56 },
  badges: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 16 },
  footer: { paddingHorizontal: 20, paddingTop: 12, gap: 6, width: '100%', maxWidth: 560, alignSelf: 'center' },
});
