import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';
import { alpha, type } from '../theme/tokens';
import { useAppState } from '../state/AppState';

/** Activity-style ring with a gradient stroke. Goes coral once over the goal. */
export function Ring({
  pct,
  size = 148,
  stroke = 16,
  from,
  to,
  children,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  from: string;
  to: string;
  children?: React.ReactNode;
}) {
  const t = useTheme();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, pct));
  const id = `ring-${from}-${to}`.replace(/[^a-z0-9-]/gi, '');
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={alpha(from.length === 7 ? from : '#888888', t.scheme === 'dark' ? 0.22 : 0.16)} strokeWidth={stroke} fill="none" />
        {p > 0 ? (
          <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={`url(#${id})`}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${c * p} ${c}`}
            />
          </G>
        ) : null}
      </Svg>
      {children}
    </View>
  );
}

/** Seven rounded bars with a dashed goal line. */
export function WeekBars({
  values,
  labels,
  goal,
  todayIndex,
}: {
  values: number[];
  labels: string[];
  goal: number;
  todayIndex: number;
}) {
  const t = useTheme();
  const H = 132;
  const max = Math.max(goal * 1.35, ...values);
  const goalY = H - (goal / max) * H;
  return (
    <View style={{ marginTop: 14 }}>
      <View style={{ height: H }}>
        <View style={[styles.goalLine, { top: goalY, borderColor: alpha('#FF3B30', 0.55) }]} pointerEvents="none" />
        <View style={styles.barsRow}>
          {values.map((v, i) => {
            const h = v > 0 ? Math.max(6, (v / max) * H) : 0;
            const over = v > goal;
            const today = i === todayIndex;
            return (
              <View key={i} style={styles.barCol} accessible accessibilityLabel={`${labels[i]}: ${v} mg`}>
                <View style={[styles.barTrack, { backgroundColor: t.fill }]}>
                  {h > 0 ? (
                    <View
                      style={{
                        height: h,
                        width: '100%',
                        borderRadius: 8,
                        backgroundColor: over ? t.danger : today ? t.tint : alpha(t.scheme === 'dark' ? '#3DDCCB' : '#00B3A4', 0.55),
                      }}
                    />
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View style={[styles.labelsRow, { marginTop: 8 }]}>
        {labels.map((l, i) => (
          <Text
            key={i}
            style={[type.caption2, styles.barLabel, { color: i === todayIndex ? t.tintText : t.label3, fontWeight: i === todayIndex ? '700' : '600' }]}
            maxFontSizeMultiplier={1.2}
            numberOfLines={1}
          >
            {labels[i]}
          </Text>
        ))}
      </View>
    </View>
  );
}

/**
 * Horizontal "bedtime meter": green → yellow → orange → red track with a
 * marker for the projected caffeine at bedtime (0–150 mg scale).
 */
export function BedtimeMeter({ mg, goal }: { mg: number; goal: number }) {
  const t = useTheme();
  const SCALE = 150;
  const pos = Math.max(0, Math.min(1, mg / SCALE));
  const goalPos = goal / SCALE;
  return (
    <View style={{ marginTop: 14 }}>
      <View style={{ height: 14, justifyContent: 'center' }}>
        <Svg width="100%" height={10}>
          <Defs>
            <LinearGradient id="meter" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={t.good} />
              <Stop offset="0.3" stopColor={t.warn} />
              <Stop offset="0.65" stopColor={t.caffeine} />
              <Stop offset="1" stopColor={t.danger} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="10" rx="5" fill="url(#meter)" />
        </Svg>
        <View style={[styles.goalTick, { left: `${goalPos * 100}%`, backgroundColor: t.label2 }]} />
        <View style={[styles.marker, { left: `${pos * 100}%`, borderColor: t.card, backgroundColor: t.label, shadowColor: '#000' }]} />
      </View>
    </View>
  );
}

/** The THRIVE mascot (Sage the owl). Color is the "Mascot color" in Settings. */
export function Owl({ size = 28, color: override }: { size?: number; color?: string }) {
  const { state } = useAppState();
  const color = override ?? state.accent ?? '#00B3A4';
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx={24} cy={21} r={14} fill={alpha(color, 0.14)} stroke={color} strokeWidth={2.6} />
      <Circle cx={17.5} cy={20} r={5} fill="#FFFFFF" stroke={color} strokeWidth={2.2} />
      <Circle cx={30.5} cy={20} r={5} fill="#FFFFFF" stroke={color} strokeWidth={2.2} />
      <Circle cx={17.5} cy={20} r={2} fill="#1C1C1E" />
      <Circle cx={30.5} cy={20} r={2} fill="#1C1C1E" />
      <Path d="M22 25.5l2 3 2-3z" fill={color} stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M12 11.5l4.5 3.5M36 11.5l-4.5 3.5" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
      <Path d="M16 35c3 3.2 13 3.2 16 0" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  goalLine: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1.5, borderStyle: 'dashed' },
  barsRow: { flexDirection: 'row', gap: 10, height: '100%', alignItems: 'flex-end' },
  labelsRow: { flexDirection: 'row', gap: 10 },
  barCol: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  barTrack: { width: '100%', maxWidth: 30, height: '100%', borderRadius: 8, overflow: 'hidden', justifyContent: 'flex-end' },
  barLabel: { flex: 1, textAlign: 'center' },
  goalTick: { position: 'absolute', width: 2, height: 18, marginLeft: -1, borderRadius: 1 },
  marker: {
    position: 'absolute',
    width: 22,
    height: 22,
    marginLeft: -11,
    borderRadius: 11,
    borderWidth: 3,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
