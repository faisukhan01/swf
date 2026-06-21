import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { categories } from '@/data/categories';
import { banners as bannerData } from '@/data/banners';
import { products } from '@/data/products';
import { Product } from '@/types';
import { SearchBar } from '@/components/SearchBar';
import { BannerCarousel } from '@/components/BannerCarousel';
import { CategoryPill } from '@/components/CategoryPill';
import { ProductCard, CARD_W } from '@/components/ProductCard';
import { SectionHeader } from '@/components/SectionHeader';
import { LoadingShimmer } from '@/components/LoadingShimmer';
import { EmptyState } from '@/components/EmptyState';

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const setCategory = useUIStore((s) => s.setCategory);
  const setSearch = useUIStore((s) => s.setSearch);
  const cartCount = useCartStore((s) => s.count());

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    setFlash(products.filter((p) => p.oldPrice).slice(0, 8));
    setTrending([...products].sort((a, b) => b.rating - a.rating).slice(0, 6));
    setRecommended([...products].sort((a, b) => (a.id < b.id ? -1 : 1)).slice(0, 6));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    await load();
    setRefreshing(false);
  }, [load]);

  const goProduct = (p: Product) => nav.navigate('ProductDetail', { productId: p.id });
  const goCategory = (id: 'all' | string) => {
    setCategory(id as any);
    nav.navigate('MainTabs', { screen: 'Shop' });
  };
  const goSearch = () => nav.navigate('Search');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'Shopper';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.surface, paddingHorizontal: 16, paddingTop: insets.top, paddingBottom: 12, borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greet, { color: colors.textMuted }]}>{greeting},</Text>
            <Text style={[styles.name, { color: colors.text }]}>{firstName} 👋</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => nav.navigate('Notifications')}
              hitSlop={10}
              style={styles.iconBtn}
            >
              <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => nav.navigate('MainTabs', { screen: 'Cart' })}
              hitSlop={10}
              style={styles.iconBtn}
            >
              <MaterialCommunityIcons name="cart-outline" size={24} color={colors.text} />
              {cartCount > 0 ? (
                <View style={[styles.cartBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={goSearch} activeOpacity={1} style={{ marginTop: 14 }}>
          <SearchBar
            value=""
            onChangeText={(t) => setSearch(t)}
            placeholder="Search products, brands & more..."
            onFocus={() => goSearch()}
            leftIcon="magnify"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={{ paddingTop: 16 }}>
          <BannerCarousel banners={bannerData} onCta={() => goCategory('all')} />
        </View>

        {/* Categories */}
        <SectionHeader title="Shop by category" actionLabel="See all" onAction={() => goCategory('all')} />
        <FlatList
          data={categories}
          keyExtractor={(c) => c.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => goCategory(item.id)}
              activeOpacity={0.85}
              style={{ alignItems: 'center', marginRight: 18, width: 76 }}
            >
              <View style={[styles.catCircle, { backgroundColor: item.color + '22' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={26} color={item.color} />
              </View>
              <Text style={[styles.catLabel, { color: colors.text }]} numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Flash deals */}
        <SectionHeader title="⚡ Flash deals" subtitle="Limited-time offers" icon="lightning-bolt" actionLabel="View all" onAction={() => goCategory('all')} />
        {loading ? (
          <LoadingShimmer variant="wide" count={1} />
        ) : (
          <FlatList
            data={flash}
            keyExtractor={(p) => p.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <View style={{ width: 150 }}>
                <ProductCard product={item} onPress={goProduct} />
              </View>
            )}
          />
        )}

        {/* Trending grid */}
        <SectionHeader title="🔥 Trending now" icon="fire" />
        {loading ? (
          <LoadingShimmer count={4} />
        ) : (
          <View style={styles.grid}>
            {trending.map((p) => (
              <View key={p.id} style={{ width: CARD_W }}>
                <ProductCard product={p} onPress={goProduct} />
              </View>
            ))}
          </View>
        )}

        {/* Recommended */}
        <SectionHeader title="Recommended for you" icon="star-shooting" />
        {loading ? (
          <LoadingShimmer count={4} />
        ) : (
          <View style={styles.grid}>
            {recommended.map((p) => (
              <View key={p.id} style={{ width: CARD_W }}>
                <ProductCard product={p} onPress={goProduct} />
              </View>
            ))}
          </View>
        )}

        {/* Category pills */}
        <SectionHeader title="Browse by category" icon="shape" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        >
          {categories.map((c) => (
            <CategoryPill
              key={c.id}
              category={c}
              active={false}
              onPress={() => goCategory(c.id)}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  greet: {
    fontSize: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  searchCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchCtaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  catCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
