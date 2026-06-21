import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme';
import { Badge as BadgeType } from '@/types';

interface Props {
  text: BadgeType;
  style?: StyleProp<ViewStyle>;
}

const isDiscountBadge = (t: string) => /^-\d+%$/.test(t);

export const Badge: React.FC<Props> = ({ text, style }) => {
  const { colors } = useTheme();
  const isDiscount = isDiscountBadge(text);
  const bg = isDiscount
    ? colors.danger
    : text === 'New'
    ? colors.primary
    : text === 'Hot'
    ? colors.accent
    : colors.accentDark;
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  text: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
