import React from 'react';
import { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { SymbolView, SymbolWeight } from 'expo-symbols';
import { ICONS, IconName } from './icons';

export function Icon({
  name,
  size = 20,
  color,
  weight = 'semibold',
  variant = 'monochrome',
  style,
}: {
  name: IconName;
  size?: number;
  color: ColorValue;
  weight?: SymbolWeight;
  /** 'hierarchical' gives the layered, two-tone iOS look. */
  variant?: 'monochrome' | 'hierarchical';
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <SymbolView
      name={ICONS[name].sf}
      size={size}
      tintColor={color}
      weight={weight}
      type={variant}
      resizeMode="scaleAspectFit"
      style={[{ width: size, height: size }, style]}
      accessible={false}
    />
  );
}
