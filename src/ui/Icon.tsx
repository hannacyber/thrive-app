import React from 'react';
import { ColorValue, StyleProp, ViewStyle } from 'react-native';
// Deep import: importing from '@expo/vector-icons' root pulls every icon font
// (~8 MB) into the bundle. This pulls only Feather (~56 KB).
import Feather from '@expo/vector-icons/Feather';
import { ICONS, IconName } from './icons';

export function Icon({
  name,
  size = 20,
  color,
  style,
}: {
  name: IconName;
  size?: number;
  color: ColorValue;
  weight?: string;
  variant?: 'monochrome' | 'hierarchical';
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Feather
      name={ICONS[name].feather as keyof typeof Feather.glyphMap}
      size={size}
      color={color as string}
      style={style as any}
      accessible={false}
    />
  );
}
