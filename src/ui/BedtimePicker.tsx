import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../theme/ThemeProvider';
import { useI18n } from '../i18n';
import { timeToday } from '../lib/caffeine';
import { Button, Chip } from './primitives';

const PRESETS = ['21:30', '22:00', '22:30', '23:00', '23:30', '00:00'];

function toHHMM(d: Date) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** One-tap bedtime chips (teen-friendly), with the system wheel for anything else. */
export function BedtimePicker({ value, onChange }: { value: string; onChange: (hhmm: string) => void }) {
  const t = useTheme();
  const { s, fmtTime } = useI18n();
  const [custom, setCustom] = useState(false);
  const isPreset = PRESETS.includes(value);

  return (
    <View style={{ gap: 10 }}>
      <View style={styles.chips}>
        {PRESETS.map((p) => (
          <Chip key={p} label={fmtTime(timeToday(p))} selected={value === p} onPress={() => onChange(p)} />
        ))}
        <Chip
          label={!isPreset ? fmtTime(timeToday(value)) : s.common.other}
          selected={!isPreset || custom}
          icon="clock"
          onPress={() => setCustom((v) => !v)}
        />
      </View>
      {custom && Platform.OS === 'ios' ? (
        <View>
          <DateTimePicker
            value={timeToday(value)}
            mode="time"
            display="spinner"
            themeVariant={t.scheme}
            onChange={(_, d) => d && onChange(toHHMM(d))}
          />
          <Button kind="secondary" title={s.common.done} onPress={() => setCustom(false)} />
        </View>
      ) : null}
      {custom && Platform.OS === 'android' ? (
        <DateTimePicker
          value={timeToday(value)}
          mode="time"
          display="default"
          onChange={(_, d) => {
            setCustom(false);
            if (d) onChange(toHHMM(d));
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
