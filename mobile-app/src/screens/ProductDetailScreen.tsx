import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { productMap } from '@/data/products';
import { reviewsForProduct } from '@/data/reviews';
import { categoryMap } from '@/data/categories';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';
import { AppBar } from '@/components/AppBar';
import { PriceTag } from '@/components/PriceTag';
import { RatingStars } from '@/components/RatingStars';
import { Badge } from '@/components/Badge';
import { QuantityStepper } from '@/components/QuantityStepper';
import { ReviewItem } from '@/components/ReviewItem';
import { LoadingShimmer } from '@/components/LoadingShimmer';
import { formatPrice } from '@/services/format';
import { Product } from '@/types';

const { width } = Dimensions.get('window');

export const ProductDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const productId: string = route.params?.productId ?? '';
  const product = productMap[productId];

  const add = useCartStore((s) => s.add);
  const has = useWishlistStore((s) => s.ids.includes(productId));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.add);
  const recentIds = useRecentlyViewedStore((s) => s.ids);

  useFocusEffect(
    useCallback(() => {
      if (product) {
        addRecentlyViewed(product.id);
      }
    }, [product, addRecentlyViewed])
  );

  const [imageIdx, setImageIdx] = useState(0);
  const [color, setColor] = useState<string | undefined>(product?.colors?.[0]);
  const [size, setSize] = useState<string | undefined>(product?.sizes?.[0]);
  const [qty, setQty] = useState(1);

  // Recently viewed products (excluding the currently viewed one), capped at 6.
  const recentProducts = useMemo<Product[]>(
    () =>
      recentIds
        .filter((id) => id !== productId)
        .map((id) => productMap[id])
        .filter((p): p is Product => Boolean(p))
        .slice(0, 6),
    [recentIds, productId]
  );

  if (!product) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar title="Product" showBack />
        <LoadingShimmer variant="wide" />
      </View>
    );
  }

  const reviews = reviewsForProduct(product.id);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setImageIdx(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const addToCart = (buyNow = false) => {
    add({ productId: product.id, qty, color, size });
    if (buyNow) {
      nav.navigate('MainTabs', { screen: 'Cart' });
      nav.navigate('Checkout');
    } else {
      Alert.alert('Added to cart', `${product.name} × ${qty} added.`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title="Product" showBack showCart={false} rightIcon={has ? 'heart' : 'heart-outline'} onRightPress={() => toggleWish(product.id)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image gallery */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {product.images.map((uri, i) => (
              <ExpoImage
                key={i}
                source={uri}
                style={{ width, height: width }}
                contentFit="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.dots}>
            {product.images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === imageIdx ? colors.primary : colors.border },
                ]}
              />
            ))}
          </View>
          {product.badge ? (
            <View style={styles.galleryBadge}>
              <Badge text={product.badge} />
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() => toggleWish(product.id)}
            style={[styles.heartFloat, { backgroundColor: colors.surface }]}
          >
            <MaterialCommunityIcons name={has ? 'heart' : 'heart-outline'} size={22} color={has ? colors.danger : colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.body, { backgroundColor: colors.surface }]}>
          <Text style={[styles.category, { color: colors.primary }]}>
            {categoryMap[product.categoryId]?.name}
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>

          <View style={styles.row}>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            {discount > 0 ? (
              <View style={[styles.saveTag, { backgroundColor: colors.primarySoft }]}>
                <Text style={[styles.saveTagText, { color: colors.primary }]}>Save {discount}%</Text>
              </View>
            ) : null}
          </View>

          <PriceTag price={product.price} oldPrice={product.oldPrice} size="lg" />

          {/* Colors */}
          {product.colors && product.colors.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Color</Text>
              <View style={styles.row}>
                {product.colors.map((c) => {
                  const selected = color === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setColor(c)}
                      style={[
                        styles.colorSwatch,
                        {
                          borderColor: selected ? colors.primary : colors.border,
                          borderWidth: selected ? 2 : 1,
                        },
                      ]}
                    >
                      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: c }} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Size</Text>
              <View style={[styles.row, { flexWrap: 'wrap', gap: 8 }]}>
                {product.sizes.map((s) => {
                  const selected = size === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setSize(s)}
                      style={[
                        styles.sizeBtn,
                        {
                          backgroundColor: selected ? colors.primary : colors.surfaceAlt,
                          borderColor: selected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: selected ? '#fff' : colors.text,
                          fontSize: 13,
                          fontWeight: '700',
                        }}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}

          {/* Quantity */}
          <View style={[styles.section, styles.row, { justifyContent: 'space-between' }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quantity</Text>
            <QuantityStepper value={qty} onChange={setQty} />
          </View>

          {/* Stock */}
          <View style={[styles.row, { gap: 6 }]}>
            <MaterialCommunityIcons
              name={product.inStock ? 'check-circle' : 'close-circle'}
              size={16}
              color={product.inStock ? colors.success : colors.danger}
            />
            <Text style={{ color: product.inStock ? colors.success : colors.danger, fontSize: 13, fontWeight: '600' }}>
              {product.inStock ? 'In stock' : 'Out of stock'}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.body, { backgroundColor: colors.surface, marginTop: 10 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.desc, { color: colors.textMuted }]}>{product.description}</Text>
        </View>

        {/* Recently viewed */}
        {recentProducts.length > 0 ? (
          <View style={{ marginTop: 18 }}>
            <View style={[styles.row, { justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 }]}>
              <View style={[styles.row, { gap: 6 }]}>
                <MaterialCommunityIcons name="history" size={18} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Recently Viewed</Text>
              </View>
              <Text
                onPress={() => nav.navigate('RecentlyViewed')}
                style={[styles.seeAll, { color: colors.primary }]}
              >
                See all
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            >
              {recentProducts.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  activeOpacity={0.85}
                  onPress={() => nav.push('ProductDetail', { productId: p.id })}
                  style={[styles.rvCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <ExpoImage source={p.images[0]} style={styles.rvImage} contentFit="cover" />
                  <Text style={[styles.rvName, { color: colors.text }]} numberOfLines={2}>
                    {p.name}
                  </Text>
                  <Text style={[styles.rvPrice, { color: colors.primary }]}>{formatPrice(p.price)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Reviews */}
        <View style={[styles.body, { backgroundColor: colors.surface, marginTop: 10 }]}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews ({reviews.length})</Text>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </View>
          <View style={[styles.row, { alignItems: 'center', gap: 14, marginVertical: 10 }]}>
            <View style={styles.ratingBig}>
              <Text style={[styles.ratingBigText, { color: colors.text }]}>{product.rating.toFixed(1)}</Text>
              <RatingStars rating={product.rating} size={12} showValue={false} />
              <Text style={[styles.reviewCount, { color: colors.textMuted }]}>{product.reviewCount} reviews</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 6 : star === 2 ? 2 : 2;
                return (
                  <View key={star} style={[styles.row, { gap: 6 }]}>
                    <Text style={{ color: colors.textMuted, fontSize: 11, width: 14 }}>{star}★</Text>
                    <View style={[styles.barBg, { backgroundColor: colors.surfaceAlt }]}>
                      <View style={[styles.barFill, { backgroundColor: colors.star, width: `${pct}%` }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => nav.navigate('WriteReview', { productId: product.id })}
            activeOpacity={0.85}
            style={[styles.writeReviewBtn, { borderColor: colors.primary }]}
          >
            <MaterialCommunityIcons name="star-plus-outline" size={18} color={colors.primary} />
            <Text style={[styles.writeReviewText, { color: colors.primary }]}>Write a Review</Text>
          </TouchableOpacity>
          {reviews.length === 0 ? (
            <Text style={[styles.noReviews, { color: colors.textSubtle }]}>
              No reviews yet. Be the first to review!
            </Text>
          ) : (
            reviews.slice(0, 3).map((r) => <ReviewItem key={r.id} review={r} />)
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky bottom action bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => toggleWish(product.id)}
          style={[styles.iconAction, { borderColor: colors.border }]}
        >
          <MaterialCommunityIcons name={has ? 'heart' : 'heart-outline'} size={22} color={has ? colors.danger : colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => addToCart(false)}
          style={[styles.cta, { borderColor: colors.primary }]}
        >
          <Text style={[styles.ctaText, { color: colors.primary }]}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => addToCart(true)}
          style={[styles.cta, { backgroundColor: colors.primary, borderColor: colors.primary }]}
        >
          <Text style={[styles.ctaText, { color: '#fff' }]}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dots: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  galleryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  heartFloat: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  body: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  saveTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sizeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 44,
    alignItems: 'center',
  },
  desc: {
    fontSize: 13,
    lineHeight: 21,
  },
  ratingBig: {
    alignItems: 'center',
    gap: 4,
  },
  ratingBigText: {
    fontSize: 32,
    fontWeight: '800',
  },
  reviewCount: {
    fontSize: 11,
  },
  barBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  noReviews: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 18,
  },
  writeReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    marginVertical: 6,
  },
  writeReviewText: {
    fontSize: 14,
    fontWeight: '700',
  },
  rvCard: {
    width: 132,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    padding: 8,
    gap: 4,
  },
  rvImage: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  rvName: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
    minHeight: 30,
  },
  rvPrice: {
    fontSize: 13,
    fontWeight: '800',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  iconAction: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
