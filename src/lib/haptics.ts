import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Context-aware haptics (UI_UX_ERGONOMICS_GUIDE §4). Never throws, no-op on web.
const safe = (fn: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  fn().catch(() => {});
};

export const haptic = {
  /** Selection changes: segments, chips, tab switches. */
  select: () => safe(() => Haptics.selectionAsync()),
  /** Light tap: opening things, toggles. */
  light: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** A completed positive action (drink logged, check-in done). */
  success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  /** Over a goal, destructive confirmation. */
  warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};
