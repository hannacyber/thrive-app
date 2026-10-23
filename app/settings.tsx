import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

import { useTheme } from '../src/theme/ThemeProvider';
import { swatches, type } from '../src/theme/tokens';
import { LANGS, useI18n } from '../src/i18n';
import { useAppState } from '../src/state/AppState';
import { openLink } from '../src/lib/links';
import { haptic } from '../src/lib/haptics';
import { SheetHeader, SheetScreen } from '../src/ui/chrome';
import { Card, Group, Row, Segmented, T, Touch } from '../src/ui/primitives';
import { Icon } from '../src/ui/Icon';
import { BedtimePicker } from '../src/ui/BedtimePicker';
import { Owl } from '../src/ui/visuals';

// Must be the SAME URL entered in App Store Connect → App Privacy → Privacy Policy URL.
export const PRIVACY_POLICY_URL = 'https://www.braincarefund.org/thrive-app-privacy';
const SUPPORT_EMAIL = 'info@braincarefund.org';

export default function Settings() {
  const router = useRouter();
  const t = useTheme();
  const { s, lang } = useI18n();
  const { state, updateSettings, resetAllData } = useAppState();
  const [langOpen, setLangOpen] = useState(false);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const confirmReset = () => {
    haptic.warning();
    Alert.alert(s.settings.eraseTitle, s.settings.eraseBody, [
      { text: s.common.cancel, style: 'cancel' },
      {
        text: s.settings.eraseConfirm,
        style: 'destructive',
        // Wiping data also resets `onboarded`; closing the sheet lets the tabs
        // layout redirect to the welcome flow instead of leaving a blank sheet.
        onPress: () => {
          resetAllData();
          close();
        },
      },
    ]);
  };

  const currentLang = state.language === 'system' ? `${s.settings.systemLanguage} · ${LANGS.find((l) => l.id === lang)?.native}` : LANGS.find((l) => l.id === state.language)?.native;

  return (
    <SheetScreen header={<SheetHeader title={s.settings.title} onClose={close} closeLabel={s.common.close} />}>
      {/* Profile */}
      <Card style={styles.profile}>
        <View style={[styles.avatar, { backgroundColor: t.fill }]}>
          <Owl size={44} />
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <T v="footnote" tone="label2" weight="600">
            {s.settings.yourName}
          </T>
          <TextInput
            value={state.name}
            onChangeText={(v) => updateSettings({ name: v })}
            placeholder={s.settings.namePlaceholder}
            placeholderTextColor={t.label3}
            maxLength={24}
            returnKeyType="done"
            style={[type.headline, styles.nameInput, { color: t.label, backgroundColor: t.fill }]}
            accessibilityLabel={s.settings.yourName}
          />
        </View>
      </Card>
      <T v="footnote" tone="label2" style={[styles.note, { marginTop: -8 }]}>
        {s.settings.nameNote}
      </T>

      {/* Sleep */}
      <View>
        <T v="footnote" tone="label2" style={styles.groupHeader}>
          {s.settings.schedule}
        </T>
        <Card>
          <View style={styles.inline}>
            <Icon name="bed" size={18} color={t.sleep} />
            <T v="body" style={{ flex: 1 }}>
              {s.settings.bedtime}
            </T>
          </View>
          <View style={{ marginTop: 12 }}>
            <BedtimePicker value={state.bedtime} onChange={(v) => updateSettings({ bedtime: v })} />
          </View>
        </Card>
        <T v="footnote" tone="label2" style={styles.note}>
          {s.settings.bedtimeNote}
        </T>
      </View>

      {/* Language */}
      <Group header={s.settings.language}>
        <Row icon="globe" iconColor="#2F9BD6" title={s.settings.language} value={currentLang} onPress={() => setLangOpen((v) => !v)} accessory="none" />
        {langOpen ? (
          <View>
            {[{ id: 'system' as const, native: s.settings.systemLanguage }, ...LANGS].map((l) => (
              <Row
                key={l.id}
                title={l.native}
                accessory={state.language === l.id ? 'check' : 'none'}
                onPress={() => {
                  haptic.select();
                  updateSettings({ language: l.id });
                }}
              />
            ))}
          </View>
        ) : null}
      </Group>

      {/* Appearance */}
      <View>
        <T v="footnote" tone="label2" style={styles.groupHeader}>
          {s.settings.appearance}
        </T>
        <Card style={{ gap: 16 }}>
          <Segmented
            options={[
              { key: 'system', label: s.settings.themeSystem },
              { key: 'light', label: s.settings.themeLight },
              { key: 'dark', label: s.settings.themeDark },
            ]}
            value={state.themePreference}
            onChange={(k) => updateSettings({ themePreference: k })}
          />
          <View>
            <T v="subhead" tone="label2" weight="600">
              {s.settings.mascot}
            </T>
            <View style={styles.swatches}>
              {swatches.map((c, i) => {
                const selected = state.accent === c;
                return (
                  <Touch
                    key={c}
                    hapticOnPress="select"
                    onPress={() => updateSettings({ accent: c })}
                    accessibilityRole="button"
                    accessibilityLabel={s.settings.mascotColor(i + 1, swatches.length)}
                    accessibilityState={{ selected }}
                    style={[styles.swatchHit]}
                  >
                    <View style={[styles.swatch, { backgroundColor: c }, selected && { borderWidth: 3, borderColor: t.card}]}>
                      {selected ? <Icon name="check" size={16} color="#FFFFFF" /> : null}
                    </View>
                  </Touch>
                );
              })}
            </View>
          </View>
        </Card>
      </View>

      {/* Privacy */}
      <View>
        <T v="footnote" tone="label2" style={styles.groupHeader}>
          {s.settings.privacy}
        </T>
        <Card style={{ gap: 10 }}>
          {s.settings.privacyLines.map((line) => (
            <View key={line} style={styles.inline}>
              <Icon name="checkCircle" size={18} color={t.good} />
              <T v="subhead" style={{ flex: 1 }}>
                {line}
              </T>
            </View>
          ))}
        </Card>
      </View>

      <Group>
        <Row icon="shield" iconColor="#30B565" title={s.settings.privacyPolicy} accessory="external" onPress={() => openLink(PRIVACY_POLICY_URL, s)} />
        <Row icon="database" iconColor="#64748B" title={s.settings.sources} onPress={() => router.push({ pathname: '/sources', params: { sheet: '1' } })} />
        <Row icon="mail" iconColor="#2F9BD6" title={s.settings.support} value={SUPPORT_EMAIL} accessory="external" onPress={() => openLink(`mailto:${SUPPORT_EMAIL}`, s)} />
      </Group>

      <Group footer={s.settings.version(Constants.expoConfig?.version ?? '')}>
        <Row icon="trash" iconColor="#FF3B30" title={s.settings.erase} destructive onPress={confirmReset} accessory="none" />
      </Group>
    </SheetScreen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  nameInput: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, minHeight: 44 },
  note: { paddingHorizontal: 16, marginTop: 6 },
  groupHeader: { textTransform: 'uppercase', paddingHorizontal: 16, marginBottom: 6 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  swatchHit: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  swatch: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
