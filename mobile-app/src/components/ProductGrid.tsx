import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, FlatList, ListRenderItem } from 'react-native';
import { Product } from '@/types';
import { ProductCard, CARD_W } from './ProductCard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';

interface Props {
  products: Product[];
  columns?: 2 | 1;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
  empty?: React.ReactElement | null;
  listKey?: string;
}

export const ProductGrid: React.FC<Props> = ({
  products,
  columns = 2,
  style,
  contentContainerStyle,
  refreshing,
  onRefresh,
  empty,
  listKey,
}) => {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const go = (p: Product) => nav.navigate('ProductDetail', { productId: p.id });

  if (columns === 1) {
    const renderItem: ListRenderItem<Product> = ({ item }) => (
      <ProductCard product={item} onPress={go} style="row" />
    );
    return (
      <FlatList
        data={products}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={[styles.list, contentContainerStyle]}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        ListEmptyComponent={empty}
        style={style}
      />
    );
  }

  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <View style={{ width: CARD_W }}>
      <ProductCard product={item} onPress={go} />
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(i) => i.id}
      renderItem={renderItem}
      numColumns={2}
      refreshing={refreshing}
      onRefresh={onRefresh}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.list, contentContainerStyle]}
      ListEmptyComponent={empty}
      scrollEnabled={false}
      style={style}
      key={listKey}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 0,
  },
});
