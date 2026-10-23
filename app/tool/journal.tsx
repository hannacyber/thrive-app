import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '../../src/theme/ThemeProvider';
import { type } from '../../src/theme/tokens';
import { useI18n } from '../../src/i18n';
import { useAppState } from '../../src/state/AppState';
import { SheetHeader, SheetScreen } from '../../src/ui/chrome';
import { T } from '../../src/ui/primitives';
import { Icon } from '../../src/ui/Icon';

export default function Journal() {
  const router = useRouter();
  const t = useTheme();
  const { s } = useI18n();
  const { state, updateSettings } = useAppState();
  const [text, setText] = useState(state.journal);
  const [saved, setSaved] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save any pending edit when leaving the screen (debounce would drop it).
  const latest = useRef(text);
  const dirty = useRef(false);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (dirty.current) updateSettings({ journal: latest.current });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onChange = (v: string) => {
    latest.current = v;
    dirty.current = true;
    setText(v);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      updateSettings({ journal: v });
      dirty.current = false;
      setSaved(true);
    }, 500);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SheetScreen presentation="push" header={<SheetHeader kind="back" onClose={() => router.back()} closeLabel={s.common.back} />}>
        <T v="title1">{s.tools.items.journal.title}</T>
        <View style={styles.meta}>
          <Icon name="shield" size={14} color={t.goodText} />
          <T v="footnote" tone="label2" style={{ flex: 1 }}>
            {s.journal.intro}
          </T>
          <T v="footnote" tone={saved ? 'good' : 'label3'} weight="600">
            {saved ? s.journal.saved : s.journal.saving}
          </T>
        </View>
        <TextInput
          value={text}
          onChangeText={onChange}
          multiline
          placeholder={s.journal.placeholder}
          placeholderTextColor={t.label3}
          style={[type.body, styles.area, { backgroundColor: t.card, color: t.label }]}
          textAlignVertical="top"
          accessibilityLabel={s.tools.items.journal.title}
        />
      </SheetScreen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  area: { minHeight: 280, borderRadius: 22, borderCurve: 'continuous', padding: 16 },
});
