import React from 'react';
import {
  AccessibilityState,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { alpha, radii, type, TypeVariant } from '../theme/tokens';
import { haptic } from '../lib/haptics';
import { Icon } from './Icon';
import type { IconName } from './icons';

// ── Text ─────────────────────────────────────────────────────────────────────
type Tone = 'label' | 'label2' | 'label3' | 'tint' | 'caffeine' | 'good' | 'danger' | 'sleep' | 'onTint';

export function T({
  v = 'body',
  tone = 'label',
  weight,
  center,
  numeric,
  style,
  ...rest
}: TextProps & {
  v?: TypeVariant;
  tone?: Tone;
  weight?: TextStyle['fontWeight'];
  center?: boolean;
  /** Rounded, tabular numerals. */
  numeric?: boolean;
}) {
  const t = useTheme();
  const color = {
    label: t.label,
    label2: t.label2,
    label3: t.label3,
    tint: t.tintText,
    caffeine: t.caffeineText,
    good: t.goodText,
    danger: t.dangerText,
    sleep: t.sleep,
    onTint: t.onTint,
  }[tone];
  return (
    <Text
      {...rest}
      style={[
        type[v],
        { color },
        numeric && type.number,
        weight ? { fontWeight: weight } : null,
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}

// ── Pressable with spring-ish press feedback ────────────────────────────────
export function Touch({
  style,
  pressedStyle,
  scaleTo = 0.97,
  hapticOnPress,
  onPress,
  ...rest
}: PressableProps & {
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
  hapticOnPress?: 'select' | 'light' | 'success' | 'warning';
}) {
  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        if (hapticOnPress) haptic[hapticOnPress]();
        onPress?.(e);
      }}
      style={({ pressed }) => [
        style,
        pressed && { transform: [{ scale: scaleTo }], opacity: 0.88 },
        pressed && pressedStyle,
      ]}
    />
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  style,
  onPress,
  accessibilityLabel,
  padded = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
  padded?: boolean;
}) {
  const t = useTheme();
  const base = [
    styles.card,
    padded && styles.cardPad,
    { backgroundColor: t.card },
    t.scheme === 'dark' && { borderWidth: StyleSheet.hairlineWidth, borderColor: t.separator },
    style,
  ];
  if (onPress) {
    return (
      <Touch onPress={onPress} hapticOnPress="light" scaleTo={0.985} style={base} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
        {children}
      </Touch>
    );
  }
  return <View style={base}>{children}</View>;
}

/** Section title above a group of content (iOS 26 style: bold, sentence case). */
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <T v="title3" weight="700" style={{ flex: 1 }} accessibilityRole="header">
        {title}
      </T>
      {action && onAction ? (
        <Touch onPress={onAction} hitSlop={12} hapticOnPress="light" style={styles.sectionAction} accessibilityRole="button">
          <T v="subhead" tone="tint" weight="600">
            {action}
          </T>
        </Touch>
      ) : null}
    </View>
  );
}

/** Small colored icon tile, like iOS Settings rows. */
export function IconTile({ name, color, size = 30, glyph = 17 }: { name: IconName; color: string; size?: number; glyph?: number }) {
  return (
    <View style={[styles.iconTile, { width: size, height: size, borderRadius: size * 0.28, backgroundColor: color }]}>
      <Icon name={name} size={glyph} color="#FFFFFF" />
    </View>
  );
}

/** Soft tinted icon tile (tinted glyph on a tinted fill). */
export function SoftIcon({ name, color, size = 40, glyph = 20 }: { name: IconName; color: string; size?: number; glyph?: number }) {
  return (
    <View style={[styles.iconTile, { width: size, height: size, borderRadius: size * 0.32, backgroundColor: alpha(color, 0.15) }]}>
      <Icon name={name} size={glyph} color={color} variant="hierarchical" />
    </View>
  );
}

// ── Buttons ──────────────────────────────────────────────────────────────────
export function Button({
  title,
  onPress,
  kind = 'primary',
  icon,
  disabled,
  style,
  haptic: h = 'light',
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'plain' | 'destructive';
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  haptic?: 'select' | 'light' | 'success' | 'warning';
  accessibilityLabel?: string;
}) {
  const t = useTheme();
  const bg =
    kind === 'primary' ? t.tint : kind === 'secondary' ? alpha(t.scheme === 'dark' ? '#3DDCCB' : '#00B3A4', 0.14) : kind === 'destructive' ? alpha('#FF3B30', 0.12) : 'transparent';
  const fg = kind === 'primary' ? t.onTint : kind === 'destructive' ? t.dangerText : t.tintText;
  return (
    <Touch
      onPress={onPress}
      disabled={disabled}
      hapticOnPress={h}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!disabled }}
      style={[styles.button, { backgroundColor: bg, opacity: disabled ? 0.4 : 1 }, style]}
    >
      {icon ? <Icon name={icon} size={17} color={fg} /> : null}
      <Text style={[type.headline, { color: fg }]} numberOfLines={1} maxFontSizeMultiplier={1.4}>
        {title}
      </Text>
    </Touch>
  );
}

/** 44×44 round button (glass-like fill). */
export function RoundButton({
  icon,
  onPress,
  label,
  tone = 'default',
  size = 44,
}: {
  icon: IconName;
  onPress: () => void;
  label: string;
  tone?: 'default' | 'tint';
  size?: number;
}) {
  const t = useTheme();
  return (
    <Touch
      onPress={onPress}
      hapticOnPress="light"
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={[
        styles.round,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: tone === 'tint' ? t.tint : t.fill },
      ]}
    >
      <Icon name={icon} size={size * 0.42} color={tone === 'tint' ? t.onTint : t.label} />
    </Touch>
  );
}

// ── Segmented control ────────────────────────────────────────────────────────
export function Segmented<K extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  return (
    <View style={[styles.seg, { backgroundColor: t.fill }, style]} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => {
              if (!active) haptic.select();
              onChange(o.key);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.segBtn, active && [styles.segActive, { backgroundColor: t.scheme === 'dark' ? '#636366' : '#FFFFFF' }]]}
          >
            <Text style={[type.subhead, { fontWeight: active ? '600' : '500', color: t.label }]} numberOfLines={1} maxFontSizeMultiplier={1.3}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ── Chip ─────────────────────────────────────────────────────────────────────
export function Chip({
  label,
  selected,
  onPress,
  icon,
  accessibilityLabel,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: IconName;
  accessibilityLabel?: string;
}) {
  const t = useTheme();
  const state: AccessibilityState = { selected: !!selected };
  return (
    <Touch
      onPress={onPress}
      hapticOnPress="select"
      accessibilityRole="button"
      accessibilityState={state}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.chip, { backgroundColor: selected ? t.tint : t.fill }]}
    >
      {icon ? <Icon name={icon} size={14} color={selected ? t.onTint : t.label2} /> : null}
      <Text style={[type.subhead, { fontWeight: '600', color: selected ? t.onTint : t.label }]} numberOfLines={1}>
        {label}
      </Text>
    </Touch>
  );
}

export function Pill({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: alpha(color, 0.15) }]}>
      <Text style={[type.caption, { fontWeight: '700', color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function ProgressBar({ pct, color, height = 8 }: { pct: number; color: string; height?: number }) {
  const t = useTheme();
  return (
    <View style={{ height, borderRadius: height, backgroundColor: t.fill, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, pct)) * 100}%`, height: '100%', borderRadius: height, backgroundColor: color }} />
    </View>
  );
}

// ── Grouped list rows (Settings) ─────────────────────────────────────────────
export function Group({ children, footer, header, inset = 58 }: { children: React.ReactNode; footer?: string; header?: string; inset?: number }) {
  const t = useTheme();
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <View>
      {header ? (
        <T v="footnote" tone="label2" style={styles.groupHeader}>
          {header}
        </T>
      ) : null}
      <View style={[styles.group, { backgroundColor: t.card }]}>
        {items.map((c, i) => (
          <View key={i}>
            {c}
            {i < items.length - 1 ? <View style={[styles.rowSep, { marginLeft: inset, backgroundColor: t.separator }]} /> : null}
          </View>
        ))}
      </View>
      {footer ? (
        <T v="footnote" tone="label2" style={styles.groupFooter}>
          {footer}
        </T>
      ) : null}
    </View>
  );
}

export function Row({
  icon,
  iconColor,
  title,
  value,
  onPress,
  accessory = onPress ? 'chevron' : 'none',
  destructive,
  children,
}: {
  icon?: IconName;
  iconColor?: string;
  title: string;
  value?: string;
  onPress?: () => void;
  accessory?: 'chevron' | 'external' | 'check' | 'none';
  destructive?: boolean;
  children?: React.ReactNode;
}) {
  const t = useTheme();
  const body = (
    <View style={styles.row}>
      {icon ? <IconTile name={icon} color={iconColor ?? t.tint} /> : null}
      <Text style={[type.body, { flex: 1, color: destructive ? t.dangerText : t.label }]} numberOfLines={2}>
        {title}
      </Text>
      {children}
      {value ? (
        <Text style={[type.body, { color: t.label2, maxWidth: '50%' }]} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {accessory === 'chevron' ? <Icon name="chevronRight" size={14} color={t.label3} /> : null}
      {accessory === 'external' ? <Icon name="external" size={14} color={t.label3} /> : null}
      {accessory === 'check' ? <Icon name="check" size={17} color={t.tintText} /> : null}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable
      onPress={() => {
        haptic.light();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={value ? `${title}, ${value}` : title}
      accessibilityState={accessory === 'check' ? { selected: true } : undefined}
      style={({ pressed }) => pressed && { backgroundColor: t.fill }}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.lg, borderCurve: 'continuous' },
  cardPad: { padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, marginBottom: 10, marginTop: 6 },
  sectionAction: { minHeight: 44, justifyContent: 'center', paddingLeft: 12 },
  iconTile: { alignItems: 'center', justifyContent: 'center', borderCurve: 'continuous' },
  button: {
    minHeight: 50,
    borderRadius: radii.pill,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  round: { alignItems: 'center', justifyContent: 'center' },
  seg: { flexDirection: 'row', borderRadius: 11, padding: 2, gap: 2 },
  segBtn: { flex: 1, minHeight: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  segActive: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 16, borderRadius: radii.pill },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  group: { borderRadius: radii.lg, borderCurve: 'continuous', overflow: 'hidden' },
  groupHeader: { textTransform: 'uppercase', paddingHorizontal: 16, marginBottom: 6 },
  groupFooter: { paddingHorizontal: 16, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 50, paddingHorizontal: 16, paddingVertical: 10 },
  rowSep: { height: StyleSheet.hairlineWidth },
});
