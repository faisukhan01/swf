import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { AppBar } from '@/components/AppBar';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard, CARD_W } from '@/components/ProductCard';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';
import { productMap } from '@/data/products';
import { Product } from '@/types';

export const RecentlyViewedScreen: React.FC = () => {
  const { colors } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const ids = useRecentlyViewedStore((s) => s.ids);
  const clear = useRecentlyViewedStore((s) => s.clear);

  const items = useMemo<Product[]>(
    () => ids.map((id) => productMap[id]).filter(Boolean) as Product[],
    [ids]
  );

  const goProduct = (p: Product) => nav.push('ProductDetail', { productId: p.id });
  const goShop = () => nav.navigate('MainTabs', { screen: 'Shop' });

  const onClearAll = () => {
    if (items.length === 0) return;
    Alert.alert('Clear history', 'Remove all recently viewed products?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);
  };

  const ClearAllButton = (
    <TouchableOpacity
      hitSlop={12}
      onPress={onClearAll}
      disabled={items.length === 0}
      style={[styles.clearBtn, { opacity: items.length === 0 ? 0.4 : 1 }]}
    >
      <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.danger} />
      <Text style={[styles.clearText, { color: colors.danger }]}>Clear</Text>
    </TouchableOpacity>
  );

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar
          title="Recently Viewed"
          showBack
          showCart={false}
          rightIcon="trash-can-outline"
          onRightPress={onClearAll}
        />
        <EmptyState
          icon="history"
          title="No recently viewed products"
          subtitle="Products you open will show up here so you can quickly get back to them."
          ctaLabel="Start browsing"
          onCta={goShop}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title={`Recently Viewed (${items.length})`}
        showBack
        showCart={false}
      />
      <View style={styles.headerRow}>
        <Text style={[styles.subtle, { color: colors.textMuted }]}>
          Your last {items.length} viewed {items.length === 1 ? 'product' : 'products'}.
        </Text>
        {ClearAllButton}
      </View>
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width: CARD_W, marginBottom: 16 }}>
            <ProductCard product={item} onPress={goProduct} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  subtle: {
    fontSize: 12,
    fontWeight: '500',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
