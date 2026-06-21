import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useTheme } from '@/theme';
import { Banner } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  banners: Banner[];
  onCta?: (b: Banner) => void;
}

const { width } = Dimensions.get('window');
const CARD_W = width - 32;

export const BannerCarousel: React.FC<Props> = ({ banners, onCta }) => {
  const { colors } = useTheme();
  const [idx, setIdx] = useState(0);
  const ref = useRef<FlatList<Banner>>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + 12));
    setIdx(i);
  };

  return (
    <View>
      <FlatList
        ref={ref}
        horizontal
        data={banners}
        keyExtractor={(b) => b.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onCta?.(item)}
            style={[styles.card, { width: CARD_W }]}
          >
            <ExpoImage source={item.image} style={StyleSheet.absoluteFill} contentFit="cover" />
            <View style={[styles.overlay, { backgroundColor: item.color + '99' }]} />
            <View style={styles.body}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <View style={[styles.cta, { backgroundColor: '#fff' }]}>
                <Text style={[styles.ctaText, { color: item.color }]}>{item.cta}</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={item.color} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={styles.dots}>
        {banners.map((b, i) => (
          <View
            key={b.id}
            style={[styles.dot, { backgroundColor: i === idx ? colors.primary : colors.border }]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  body: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 18,
    bottom: 18,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
    maxWidth: 220,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
