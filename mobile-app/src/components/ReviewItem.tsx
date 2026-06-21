import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Review } from '@/types';
import { RatingStars } from './RatingStars';
import { formatRelative } from '@/services/format';

interface Props {
  review: Review;
}

export const ReviewItem: React.FC<Props> = ({ review }) => {
  const { colors } = useTheme();
  const initials = review.author
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{review.author}</Text>
          <View style={styles.meta}>
            <RatingStars rating={review.rating} size={12} showValue={false} />
            <Text style={[styles.date, { color: colors.textSubtle }]}>{formatRelative(review.createdAt)}</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{review.title}</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>{review.comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  date: {
    fontSize: 11,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
  },
});
