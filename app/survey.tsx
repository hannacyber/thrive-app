import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '../src/theme/ThemeProvider';
import { alpha } from '../src/theme/tokens';
import { useI18n } from '../src/i18n';
import { useAppState } from '../src/state/AppState';
import { QUESTION_COUNT } from '../src/data/cudq';
import { haptic } from '../src/lib/haptics';
import { SheetHeader, SheetScreen } from '../src/ui/chrome';
import { Button, ProgressBar, T, Touch } from '../src/ui/primitives';
import { Icon } from '../src/ui/Icon';

/** One question per screen, big answer buttons in the thumb zone, auto-advance. */
export default function Survey() {
  const router = useRouter();
  const t = useTheme();
  const { s } = useI18n();
  const { submitSurvey } = useAppState();
  const [answers, setAnswers] = useState<number[]>(Array(QUESTION_COUNT).fill(0));
  const [i, setI] = useState(0);

  const complete = answers.every((a) => a > 0);
  const last = i === QUESTION_COUNT - 1;

  const choose = (v: number) => {
    haptic.select();
    const next = answers.slice();
    next[i] = v;
    setAnswers(next);
    if (!last) setTimeout(() => setI((x) => Math.min(QUESTION_COUNT - 1, x + 1)), 220);
  };

  const finish = () => {
    const total = answers.reduce((a, b) => a + b, 0);
    haptic.success();
    submitSurvey(total);
    router.replace({ pathname: '/survey-result', params: { score: String(total) } });
  };

  return (
    <SheetScreen
      header={<SheetHeader title={s.survey.title} onClose={() => router.back()} closeLabel={s.common.close} />}
      contentStyle={{ flexGrow: 1 }}
      footer={
        <View style={{ gap: 10 }}>
          {s.cudq.options.map((label, vi) => {
            const v = vi + 1;
            const selected = answers[i] === v;
            return (
              <Touch
                key={label}
                onPress={() => choose(v)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={label}
                style={[
                  styles.option,
                  { backgroundColor: selected ? alpha(t.scheme === 'dark' ? '#3DDCCB' : '#00B3A4', 0.16) : t.card, borderColor: selected ? t.tint : 'transparent' },
                ]}
              >
                <View style={[styles.radio, { borderColor: selected ? t.tint : t.label3, backgroundColor: selected ? t.tint : 'transparent' }]}>
                  {selected ? <Icon name="check" size={13} color={t.onTint} /> : null}
                </View>
                <T v="headline" style={{ flex: 1 }}>
                  {label}
                </T>
              </Touch>
            );
          })}
          <View style={styles.navRow}>
            <Button kind="plain" title={s.survey.prev} icon="chevronLeft" disabled={i === 0} onPress={() => setI((x) => Math.max(0, x - 1))} style={{ flex: 1 }} />
            {last ? (
              <Button title={s.survey.finish} disabled={!complete} onPress={finish} style={{ flex: 1.4 }} haptic="success" />
            ) : (
              <Button kind="secondary" title={s.common.next} disabled={!answers[i]} onPress={() => setI((x) => x + 1)} style={{ flex: 1.4 }} />
            )}
          </View>
        </View>
      }
    >
      {i === 0 ? (
        <T v="subhead" tone="label2">
          {s.survey.intro}
        </T>
      ) : null}
      <View style={{ gap: 8 }}>
        <T v="footnote" tone="tint" weight="700">
          {s.survey.question(i + 1, QUESTION_COUNT)}
        </T>
        <ProgressBar pct={(i + (answers[i] ? 1 : 0)) / QUESTION_COUNT} color={t.tint} height={6} />
      </View>
      <T v="title2" accessibilityRole="header" style={{ marginTop: 8 }}>
        {s.cudq.questions[i]}
      </T>
    </SheetScreen>
  );
}

const styles = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingHorizontal: 16, borderRadius: 18, borderCurve: 'continuous', borderWidth: 2 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  navRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
});
