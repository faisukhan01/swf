import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';

interface Slide {
  icon: string;
  title: string;
  body: string;
  color: string;
  image: string;
}

const slides: Slide[] = [
  {
    icon: 'shopping-search',
    title: 'Welcome to Shop With Faisu!',
    body: 'Discover thousands of products across 8 categories — curated, reviewed, and delivered to your door.',
    color: '#10b981',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
  },
  {
    icon: 'lightning-bolt',
    title: 'Flash deals & smart filters',
    body: 'Catch lightning-fast deals, save favorites, and filter the catalog by price, rating, and category in seconds.',
    color: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
  },
  {
    icon: 'shield-check',
    title: 'Secure, effortless checkout',
    body: 'Multiple payment options, saved addresses, and order tracking — all wrapped in a delightful experience.',
    color: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1556742205-f5a8b16c8d1d?w=800',
  },
];

const { width } = Dimensions.get('window');

export const OnboardingScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [idx, setIdx] = useState(0);
  const ref = useRef<FlatList<Slide>>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIdx(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const next = () => {
    if (idx < slides.length - 1) {
      ref.current?.scrollToIndex({ index: idx + 1, animated: true });
    } else {
      nav.replace('Auth');
    }
  };

  const skip = () => nav.replace('Auth');

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.skipWrap}>
        {idx < slides.length - 1 ? (
          <TouchableOpacity onPress={skip} hitSlop={10}>
            <Text style={[styles.skip, { color: colors.textMuted }]}>Skip</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.imageWrap, { backgroundColor: item.color + '22' }]}>
              <ExpoImage source={item.image} style={styles.image} contentFit="cover" />
              <View style={[styles.iconBubble, { backgroundColor: item.color }]}>
                <MaterialCommunityIcons name={item.icon as any} size={28} color="#fff" />
              </View>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: colors.textMuted }]}>{item.body}</Text>
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === idx ? colors.primary : colors.border,
                  width: i === idx ? 22 : 8,
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={next}
          activeOpacity={0.85}
          style={[styles.cta, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.ctaText}>
            {idx === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  skipWrap: {
    height: 50,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skip: {
    fontSize: 14,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  imageWrap: {
    width: width - 56,
    height: width - 56,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  iconBubble: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 28,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 21,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 16,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
