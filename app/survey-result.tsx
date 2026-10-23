import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '../src/theme/ThemeProvider';
import { alpha, type } from '../src/theme/tokens';
import { useI18n } from '../src/i18n';
import { useAppState } from '../src/state/AppState';
import { MAX_SCORE, scoreTier } from '../src/data/cudq';
import { SheetHeader, SheetScreen } from '../src/ui/chrome';
import { Button, Card, Pill, T } from '../src/ui/primitives';
import { Owl, Ring } from '../src/ui/visuals';

export default function SurveyResult() {
  const router = useRouter();
  const t = useTheme();
  const { s } = useI18n();
  const { state } = useAppState();
  const { score: scoreParam } = useLocalSearchParams<{ score?: string }>();
  const score = scoreParam ? parseInt(scoreParam, 10) : state.survey?.score ?? 0;
  const tierId = scoreTier(score);
  const tier = s.cudq.tiers[tierId];
  const color = tierId === 'low' ? t.goodText : tierId === 'watch' ? t.caffeineText : t.dangerText;
  const ring = tierId === 'low' ? t.good : tierId === 'watch' ? t.caffeine : t.danger;

  return (
    <SheetScreen
      header={<SheetHeader title={s.survey.resultTitle} onClose={() => (router.canGoBack() ? router.back() : router.replace('/'))} closeLabel={s.common.close} />}
      footer={
        <>
          <Button title={s.survey.exploreTools} icon="grid" onPress={() => router.dismissTo('/tools')} />
          <Button kind="plain" title={s.survey.backHome} onPress={() => router.dismissTo('/')} />
        </>
      }
    >
      <Card style={{ alignItems: 'center', gap: 14, paddingVertical: 24 }}>
        <Ring pct={score / MAX_SCORE} from={ring} to={ring} size={140}>
          <Text style={[type.number, { fontSize: 40, lineHeight: 44, color: t.label }]}>{score}</Text>
          <T v="caption" tone="label2" weight="600">
            {s.survey.outOf(MAX_SCORE)}
          </T>
        </Ring>
        <View>
          <Pill label={tier.tier} color={color} />
        </View>
        <T v="body" tone="label2" center>
          {tier.copy}
        </T>
      </Card>
      <View style={[styles.note, { backgroundColor: alpha(t.scheme === 'dark' ? '#7D7AFF' : '#5E5CE6', 0.12) }]}>
        <Owl size={28} />
        <T v="subhead" style={{ flex: 1 }}>
          {s.survey.note}
        </T>
      </View>
    </SheetScreen>
  );
}

const styles = StyleSheet.create({
  note: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 20, borderCurve: 'continuous', alignItems: 'flex-start' },
});
