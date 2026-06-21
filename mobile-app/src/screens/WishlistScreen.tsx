import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { productMap } from '@/data/products';
import { AppBar } from '@/components/AppBar';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard, CARD_W } from '@/components/ProductCard';
import { Product } from '@/types';

export const WishlistScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const remove = useWishlistStore((s) => s.remove);
  const add = useCartStore((s) => s.add);

  const items = useMemo(
    () => ids.map((id) => productMap[id]).filter(Boolean) as Product[],
    [ids]
  );

  const goProduct = (p: Product) => nav.navigate('ProductDetail', { productId: p.id });
  const goShop = () => nav.navigate('MainTabs', { screen: 'Shop' });

  const moveToCart = (p: Product) => {
    add({
      productId: p.id,
      qty: 1,
      color: p.colors?.[0],
      size: p.sizes?.[0],
    });
    remove(p.id);
    Alert.alert('Moved to cart', `${p.name} moved to your cart.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title={`Wishlist (${items.length})`} showCart />
      {items.length === 0 ? (
        <EmptyState
          icon="heart-off"
          title="Your wishlist is empty"
          subtitle="Tap the heart on any product to save it for later."
          ctaLabel="Discover products"
          onCta={goShop}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ width: CARD_W, marginBottom: 4 }}>
              <ProductCard product={item} onPress={goProduct} />
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => moveToCart(item)}
                  style={[styles.miniBtn, { backgroundColor: colors.primary }]}
                >
                  <MaterialCommunityIcons name="cart-plus" size={14} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggle(item.id)}
                  style={[styles.miniBtn, { borderColor: colors.border, borderWidth: 1 }]}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={14} color={colors.danger} />
                  <Text style={{ color: colors.danger, fontSize: 11, fontWeight: '700' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  miniBtn: {
    flex: 1,
    height: 30,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
