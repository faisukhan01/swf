import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

interface Props {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

export const RatingStars: React.FC<Props> = ({ rating, size = 14, showValue = true, reviewCount }) => {
  const { colors } = useTheme();
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars: React.ReactNode[] = [];

  for (let i = 0; i < 5; i++) {
    let name: React.ComponentProps<typeof MaterialCommunityIcons>['name'] = 'star-outline';
    if (i < full) name = 'star';
    else if (i === full && half) name = 'star-half-full';
    stars.push(
      <MaterialCommunityIcons key={i} name={name} size={size} color={colors.star} />
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.row}>{stars}</View>
      {showValue && (
        <Text style={[styles.value, { color: colors.textMuted }]}>{rating.toFixed(1)}</Text>
      )}
      {reviewCount !== undefined && (
        <Text style={[styles.count, { color: colors.textSubtle }]}>({reviewCount})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  count: {
    fontSize: 11,
    marginLeft: 2,
  },
});
