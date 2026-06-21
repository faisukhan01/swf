import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

interface Props {
  price: number;
  oldPrice?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceTag: React.FC<Props> = ({ price, oldPrice, size = 'md' }) => {
  const { colors } = useTheme();
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 22 : 16;
  const oldFontSize = size === 'sm' ? 11 : size === 'lg' ? 16 : 12;
  return (
    <Text style={styles.row}>
      <Text style={{ color: colors.text, fontSize, fontWeight: '700' }}>${price.toFixed(2)}</Text>
      {oldPrice && oldPrice > price ? (
        <Text style={[styles.old, { color: colors.textSubtle, fontSize: oldFontSize }]}>
          {'  $' + oldPrice.toFixed(2)}
        </Text>
      ) : null}
    </Text>
  );
};

const styles = StyleSheet.create({
  row: {
    // nothing extra; inline styles handle alignment
  },
  old: {
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
});
