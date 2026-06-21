import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { useUIStore } from '@/store/useUIStore';
import { products } from '@/data/products';
import { Product } from '@/types';
import { AppBar } from '@/components/AppBar';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard, CARD_W } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';

const trendingQueries = ['Headphones', 'Sneakers', 'Coffee', 'Smartwatch', 'Sunscreen', 'Yoga mat'];

export const SearchScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const ui = useUIStore();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const results = useMemo(() => {
    const q = (submitted || query).trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryId.toLowerCase().includes(q)
    );
  }, [query, submitted]);

  useEffect(() => {
    const t = setTimeout(() => setSubmitted(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const goProduct = (p: Product) => nav.navigate('ProductDetail', { productId: p.id });

  const onPick = (q: string) => {
    setQuery(q);
    setSubmitted(q);
    ui.addRecentSearch(q);
  };

  const onSearchSubmit = () => {
    setSubmitted(query);
    if (query.trim()) ui.addRecentSearch(query);
    Keyboard.dismiss();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title="Search" showBack showCart={false} />
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search products..."
          onSubmit={onSearchSubmit}
          autoFocus
        />
      </View>

      {!query ? (
        <FlatList
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 16 }}>
              {ui.recentSearches.length > 0 ? (
                <View>
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text style={[styles.label, { color: colors.text }]}>Recent searches</Text>
                    <TouchableOpacity onPress={ui.clearRecentSearches}>
                      <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700' }}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.chips, { gap: 8 }]}>
                    {ui.recentSearches.map((q) => (
                      <TouchableOpacity
                        key={q}
                        onPress={() => onPick(q)}
                        style={[styles.chip, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                      >
                        <MaterialCommunityIcons name="history" size={13} color={colors.textMuted} />
                        <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>{q}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}

              <View>
                <Text style={[styles.label, { color: colors.text }]}>Trending searches</Text>
                <View style={[styles.chips, { gap: 8 }]}>
                  {trendingQueries.map((q) => (
                    <TouchableOpacity
                      key={q}
                      onPress={() => onPick(q)}
                      style={[styles.chip, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}
                    >
                      <MaterialCommunityIcons name="trending-up" size={13} color={colors.primary} />
                      <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={[styles.label, { color: colors.text }]}>Popular categories</Text>
                <View style={[styles.chips, { gap: 8 }]}>
                  {['Electronics', 'Fashion', 'Beauty', 'Sports'].map((q) => (
                    <TouchableOpacity
                      key={q}
                      onPress={() => onPick(q)}
                      style={[styles.chip, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                    >
                      <MaterialCommunityIcons name="tag" size={13} color={colors.textMuted} />
                      <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          }
          data={[]}
          keyExtractor={() => 'placeholder'}
          renderItem={() => null}
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon="magnify-close"
          title="No results"
          subtitle={`We couldn't find anything for "${query}". Try a different keyword.`}
          ctaLabel="Clear"
          onCta={() => setQuery('')}
        />
      ) : (
        <>
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              {results.length} results for "{query}"
            </Text>
          </View>
          <FlatList
            data={results}
            keyExtractor={(p) => p.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ width: CARD_W }}>
                <ProductCard product={item} onPress={goProduct} />
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
