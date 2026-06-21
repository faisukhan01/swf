import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
  size?: 'sm' | 'md';
}

export const QuantityStepper: React.FC<Props> = ({ value, min = 1, max = 99, onChange, size = 'md' }) => {
  const { colors } = useTheme();
  const dim = size === 'sm' ? 28 : 36;
  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
      ]}
    >
      <TouchableOpacity
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={[styles.btn, { width: dim, height: dim, opacity: value <= min ? 0.4 : 1 }]}
      >
        <MaterialCommunityIcons name="minus" size={iconSize} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.value, { color: colors.text, minWidth: dim }]}>{value}</Text>
      <TouchableOpacity
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={[styles.btn, { width: dim, height: dim, opacity: value >= max ? 0.4 : 1 }]}
      >
        <MaterialCommunityIcons name="plus" size={iconSize} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
});
