import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Defs, RadialGradient, Circle, Stop } from 'react-native-svg';

import { useTheme } from '../../src/theme/ThemeProvider';
import { useI18n } from '../../src/i18n';
import { haptic } from '../../src/lib/haptics';
import { SheetHeader, SheetScreen } from '../../src/ui/chrome';
import { Button, T } from '../../src/ui/primitives';

type Phase = 'in' | 'hold' | 'out';
const SEQUENCE: [Phase, number, number][] = [
  ['in', 4000, 1.3],
  ['hold', 4000, 1.3],
  ['out', 6000, 0.82],
];

export default function Breathe() {
  const router = useRouter();
  const t = useTheme();
  const { s } = useI18n();
  const scale = useRef(new Animated.Value(0.82)).current;
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase | null>(null);
  const stepRef = useRef(0);
  const active = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      active.current = false;
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const step = () => {
    if (!active.current) return;
    const [p, duration, target] = SEQUENCE[stepRef.current % SEQUENCE.length];
    setPhase(p);
    haptic.light();
    Animated.timing(scale, { toValue: target, duration: duration - 150, easing: Easing.inOut(Easing.sin), useNativeDriver: true }).start();
    stepRef.current += 1;
    timer.current = setTimeout(step, duration);
  };

  const toggle = () => {
    if (running) {
      active.current = false;
      if (timer.current) clearTimeout(timer.current);
      setRunning(false);
      setPhase(null);
      scale.stopAnimation();
      Animated.spring(scale, { toValue: 0.82, useNativeDriver: true }).start();
      return;
    }
    active.current = true;
    setRunning(true);
    stepRef.current = 0;
    step();
  };

  const word = phase ? s.breathe[phase] : s.breathe.ready;

  return (
    <SheetScreen
      presentation="push"
      header={<SheetHeader kind="back" onClose={() => router.back()} closeLabel={s.common.back} />}
      contentStyle={{ flexGrow: 1 }}
      footer={<Button title={running ? s.breathe.stop : s.breathe.start} icon={running ? 'close' : 'wind'} onPress={toggle} kind={running ? 'secondary' : 'primary'} />}
    >
      <T v="title1">{s.tools.items.breathe.title}</T>
      <T v="subhead" tone="label2">
        {s.breathe.intro}
      </T>
      <View style={styles.stage}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Svg width={220} height={220}>
            <Defs>
              <RadialGradient id="orb" cx="40%" cy="35%" r="70%">
                <Stop offset="0" stopColor={t.scheme === 'dark' ? '#7FF0E2' : '#5FE3D3'} />
                <Stop offset="0.6" stopColor={t.tint} />
                <Stop offset="1" stopColor={t.sleep} />
              </RadialGradient>
            </Defs>
            <Circle cx={110} cy={110} r={100} fill="url(#orb)" />
          </Svg>
        </Animated.View>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.wordWrap}>
            <T v="title2" style={{ color: '#FFFFFF' }} accessibilityLiveRegion="polite">
              {word}
            </T>
          </View>
        </View>
      </View>
    </SheetScreen>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, minHeight: 300, alignItems: 'center', justifyContent: 'center' },
  wordWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
