// Navigation-layer chrome: Liquid Glass surfaces, screens with large titles,
// the floating tab bar, sheet headers and the Undo toast.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Keyboard,
  Platform,
  Pressable,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import type { Tabs } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import { alpha, radii, type } from '../theme/tokens';
import { haptic } from '../lib/haptics';
import { Icon } from './Icon';
import type { IconName } from './icons';
import { T } from './primitives';

type BottomTabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

const LIQUID = Platform.OS === 'ios' && safeLiquid();
function safeLiquid() {
  try {
    return isLiquidGlassAvailable();
  } catch {
    return false;
  }
}

function useReduceTransparency() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AccessibilityInfo.isReduceTransparencyEnabled().then(setOn).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setOn);
    return () => sub.remove();
  }, []);
  return on;
}

/**
 * Liquid Glass on iOS 26+, system material blur on older iOS / web, and a
 * translucent solid on Android or when "Reduce Transparency" is on.
 */
export function Glass({
  children,
  style,
  interactive,
  noLiquid,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  interactive?: boolean;
  /** Use the material blur even on iOS 26 — Liquid Glass doesn't render under an ancestor with animated opacity. */
  noLiquid?: boolean;
}) {
  const t = useTheme();
  const reduce = useReduceTransparency();
  if (reduce || Platform.OS === 'android') {
    return (
      <View style={[style, { backgroundColor: reduce ? t.cardRaised : t.glassFallback, borderColor: t.glassBorder, borderWidth: StyleSheet.hairlineWidth }]}>
        {children}
      </View>
    );
  }
  if (LIQUID && !noLiquid) {
    return (
      <GlassView style={style} glassEffectStyle="regular" isInteractive={interactive} colorScheme={t.scheme}>
        {children}
      </GlassView>
    );
  }
  return (
    <BlurView
      intensity={Platform.OS === 'web' ? 85 : 90}
      tint={t.scheme === 'dark' ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
      style={[style, { overflow: 'hidden', borderColor: t.glassBorder, borderWidth: StyleSheet.hairlineWidth }]}
    >
      {children}
    </BlurView>
  );
}

/** Soft mint/indigo light behind the content — gives the glass something to refract. */
export function Ambient({ height = 360 }: { height?: number }) {
  const t = useTheme();
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { height }]}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="ga" cx="15%" cy="0%" rx="75%" ry="80%">
            <Stop offset="0" stopColor={t.glowA} stopOpacity={1} />
            <Stop offset="1" stopColor={t.glowA} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="gb" cx="95%" cy="10%" rx="65%" ry="70%">
            <Stop offset="0" stopColor={t.glowB} stopOpacity={1} />
            <Stop offset="1" stopColor={t.glowB} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#ga)" />
        <Rect width="100%" height="100%" fill="url(#gb)" />
      </Svg>
    </View>
  );
}

// ── Tab bar ──────────────────────────────────────────────────────────────────
export const TAB_BAR_HEIGHT = 64;

function tabBarBottom(insetBottom: number) {
  return insetBottom > 0 ? Math.max(insetBottom - 10, 8) : 12;
}

/** Space to leave under scroll content / above floating controls on tab screens. */
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + tabBarBottom(insets.bottom) + 12;
}

const TAB_ICONS: Record<string, IconName> = {
  index: 'home',
  log: 'cup',
  companion: 'moon',
  progress: 'chart',
  tools: 'grid',
};

export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [kb, setKb] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const a = Keyboard.addListener('keyboardDidShow', () => setKb(true));
    const b = Keyboard.addListener('keyboardDidHide', () => setKb(false));
    return () => {
      a.remove();
      b.remove();
    };
  }, []);
  if (kb) return null;

  return (
    <View pointerEvents="box-none" style={[styles.tabWrap, { bottom: tabBarBottom(insets.bottom) }]}>
      <View style={styles.tabShadow}>
      <Glass style={styles.tabBar} interactive>
        <View style={styles.tabRow} accessibilityRole="tablist">
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const { options } = descriptors[route.key];
            const label = (options.title ?? route.name) as string;
            const color = focused ? t.tintText : t.label;
            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) {
                haptic.select();
                navigation.navigate(route.name, route.params);
              }
            };
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={label}
                style={styles.tabItem}
              >
                <View style={[styles.tabLens, focused && { backgroundColor: alpha(t.scheme === 'dark' ? '#FFFFFF' : '#000000', t.scheme === 'dark' ? 0.12 : 0.06) }]}>
                  <Icon name={TAB_ICONS[route.name] ?? 'circle'} size={22} color={color} />
                  <Text
                    style={[type.caption2, { color, fontWeight: focused ? '700' : '600', marginTop: 3 }]}
                    numberOfLines={1}
                    maxFontSizeMultiplier={1.15}
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Glass>
      </View>
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────
export function Screen({
  title,
  subtitle,
  right,
  children,
  mode = 'tab',
  overlay,
  scrollProps,
  ambient = true,
  contentStyle,
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  /** 'tab' leaves room for the floating tab bar; 'stack' for pushed screens. */
  mode?: 'tab' | 'stack';
  /** Floating elements rendered above the scroll view (toast, bottom search). */
  overlay?: React.ReactNode;
  scrollProps?: ScrollViewProps;
  ambient?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const tabSpace = useTabBarSpace();
  const y = useRef(new Animated.Value(0)).current;
  const barOpacity = y.interpolate({ inputRange: [24, 56], outputRange: [0, 1], extrapolate: 'clamp' });
  const bottom = mode === 'tab' ? tabSpace + 12 : insets.bottom + 32;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {ambient ? <Ambient /> : null}
      <Animated.ScrollView
        {...scrollProps}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: bottom }, contentStyle]}
      >
        {title ? (
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              {subtitle ? (
                <T v="subhead" tone="label2" weight="600">
                  {subtitle}
                </T>
              ) : null}
              <T v="largeTitle" accessibilityRole="header">
                {title}
              </T>
            </View>
            {right}
          </View>
        ) : null}
        {children}
      </Animated.ScrollView>

      {title ? (
        // Inline title that fades in once the large title scrolls away (iOS behavior).
        <Animated.View pointerEvents="none" style={[styles.inlineBar, { height: insets.top + 44, opacity: barOpacity }]}>
          <Glass style={StyleSheet.absoluteFill} noLiquid />
          <View style={[styles.inlineTitle, { paddingTop: insets.top }]}>
            <T v="headline" numberOfLines={1}>
              {title}
            </T>
          </View>
        </Animated.View>
      ) : null}
      {overlay}
    </View>
  );
}

/** Header for screens presented as sheets / pushed cards: grabber + title + close/back. */
export function SheetHeader({
  title,
  onClose,
  kind = 'close',
  closeLabel,
}: {
  title?: string;
  onClose: () => void;
  kind?: 'close' | 'back';
  closeLabel: string;
}) {
  const t = useTheme();
  const isSheet = kind === 'close' && Platform.OS === 'ios';
  return (
    <View style={styles.sheetHead}>
      {isSheet ? <View style={[styles.grabber, { backgroundColor: t.fillStrong }]} /> : null}
      <View style={styles.sheetRow}>
        <Pressable
          onPress={() => {
            haptic.light();
            onClose();
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          style={({ pressed }) => [styles.sheetBtn, { backgroundColor: t.fill, opacity: pressed ? 0.6 : 1 }]}
        >
          <Icon name={kind === 'close' ? 'close' : 'chevronLeft'} size={17} color={t.label} />
        </Pressable>
        {title ? (
          <T v="headline" numberOfLines={1} style={{ flex: 1, textAlign: 'center', marginRight: 44 }}>
            {title}
          </T>
        ) : null}
      </View>
    </View>
  );
}

/** Scrollable body for sheet/stack screens (no large title, no tab bar). */
export function SheetScreen({
  header,
  children,
  footer,
  contentStyle,
  presentation = 'sheet',
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  /**
   * 'sheet' = iOS page-sheet modal (starts below the status bar, so no top inset);
   * 'push' = full-screen card, which must clear the status bar / Dynamic Island.
   */
  presentation?: 'sheet' | 'push';
  /** Pinned bottom area — primary actions live here, in the thumb zone. */
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const top = Platform.OS === 'ios' && presentation === 'sheet' ? 8 : insets.top + 4;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: top }}>
      {header}
      <Animated.ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: 8, paddingBottom: footer ? 24 : insets.bottom + 32 }, contentStyle]}
      >
        {children}
      </Animated.ScrollView>
      {footer ? <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>{footer}</View> : null}
    </View>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────────
export function UndoToast({
  message,
  onUndo,
  onDone,
  undoLabel,
  bottom,
}: {
  message: string | null;
  onUndo: () => void;
  onDone: () => void;
  undoLabel: string;
  bottom: number;
}) {
  const t = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!message) return;
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, damping: 16, stiffness: 180, mass: 0.9 }).start();
    AccessibilityInfo.announceForAccessibility?.(message);
    const timer = setTimeout(onDone, 4500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
  const translateY = useMemo(() => anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }), [anim]);
  if (!message) return null;
  return (
    <Animated.View pointerEvents="box-none" style={[styles.toastWrap, { bottom, opacity: anim, transform: [{ translateY }] }]}>
      <Glass style={styles.toast}>
        <View style={styles.toastRow} accessibilityLiveRegion="polite">
          <Icon name="checkCircle" size={20} color={t.good} />
          <T v="subhead" weight="600" style={{ flex: 1 }} numberOfLines={2}>
            {message}
          </T>
          <Pressable
            onPress={() => {
              haptic.light();
              onUndo();
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={undoLabel}
            style={({ pressed }) => [styles.undoBtn, { backgroundColor: t.fill, opacity: pressed ? 0.6 : 1 }]}
          >
            <T v="subhead" tone="tint" weight="700">
              {undoLabel}
            </T>
          </Pressable>
        </View>
      </Glass>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, gap: 16, width: '100%', maxWidth: 680, alignSelf: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 2, paddingHorizontal: 4 },
  inlineBar: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
  inlineTitle: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 60 },
  tabWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 16 },
  // Shadow lives on a wrapper: overflow:'hidden' on the glass would clip it.
  tabShadow: { width: '100%', maxWidth: 520, borderRadius: TAB_BAR_HEIGHT / 2, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  tabBar: { width: '100%', height: TAB_BAR_HEIGHT, borderRadius: TAB_BAR_HEIGHT / 2, borderCurve: 'continuous', overflow: 'hidden' },
  tabRow: { flex: 1, flexDirection: 'row', paddingHorizontal: 6, alignItems: 'center' },
  tabItem: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
  tabLens: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 24, minWidth: 58 },
  sheetHead: { paddingHorizontal: 16, paddingBottom: 4 },
  grabber: { alignSelf: 'center', width: 36, height: 5, borderRadius: 3, marginBottom: 6 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  sheetBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 16, paddingTop: 12, gap: 10, width: '100%', maxWidth: 680, alignSelf: 'center' },
  toastWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  toast: { width: '100%', maxWidth: 520, borderRadius: radii.xl, borderCurve: 'continuous', overflow: 'hidden' },
  toastRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 16, paddingRight: 8, paddingVertical: 8, minHeight: 56 },
  undoBtn: { minHeight: 40, minWidth: 64, paddingHorizontal: 14, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
