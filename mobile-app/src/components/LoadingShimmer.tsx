import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

interface Props {
  count?: number;
  style?: StyleProp<ViewStyle>;
  variant?: 'card' | 'list' | 'wide';
}

export const LoadingShimmer: React.FC<Props> = ({ count = 4, style, variant = 'card' }) => {
  const { colors } = useTheme();
  const baseColor = colors.surfaceAlt;
  const highlightColor = colors.border;

  const blocks = Array.from({ length: count });

  if (variant === 'list') {
    return (
      <View style={[{ padding: 16, gap: 12 }, style]}>
        {blocks.map((_, i) => (
          <View key={i} style={[styles.listWrap, { backgroundColor: baseColor }]}>
            <View style={[styles.listImage, { backgroundColor: highlightColor }]} />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={[styles.line, { width: '80%', height: 14, backgroundColor: highlightColor }]} />
              <View style={[styles.line, { width: '40%', height: 12, backgroundColor: highlightColor }]} />
              <View style={[styles.line, { width: '30%', height: 12, backgroundColor: highlightColor }]} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (variant === 'wide') {
    return (
      <View style={[{ padding: 16 }, style]}>
        <View style={[styles.wideCard, { backgroundColor: baseColor }]}>
          <View style={[styles.wideImage, { backgroundColor: highlightColor }]} />
          <View style={{ gap: 8, padding: 8 }}>
            <View style={[styles.line, { width: '60%', height: 14, backgroundColor: highlightColor }]} />
            <View style={[styles.line, { width: '40%', height: 12, backgroundColor: highlightColor }]} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.grid, style]}>
      {blocks.map((_, i) => (
        <View key={i} style={[styles.cardWrap, { backgroundColor: baseColor }]}>
          <View style={[styles.cardImage, { backgroundColor: highlightColor }]} />
          <View style={{ padding: 10, gap: 6 }}>
            <View style={[styles.line, { width: '90%', height: 12, backgroundColor: highlightColor }]} />
            <View style={[styles.line, { width: '60%', height: 10, backgroundColor: highlightColor }]} />
            <View style={[styles.line, { width: '40%', height: 14, backgroundColor: highlightColor }]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  cardWrap: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 170,
  },
  line: {
    borderRadius: 4,
  },
  listWrap: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: 16,
  },
  listImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  wideCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  wideImage: {
    width: '100%',
    height: 200,
  },
});
