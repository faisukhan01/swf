import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { useUIStore } from '@/store/useUIStore';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { CategoryId, Product, SortOption } from '@/types';
import { AppBar } from '@/components/AppBar';
import { SearchBar } from '@/components/SearchBar';
import { CategoryPill } from '@/components/CategoryPill';
import { ProductGrid } from '@/components/ProductGrid';
import { EmptyState } from '@/components/EmptyState';

const sortLabels: Record<SortOption, string> = {
  popular: 'Popular',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
  rating: 'Top rated',
  newest: 'Newest',
};

export const ShopScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const ui = useUIStore();

  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftPrice, setDraftPrice] = useState(ui.priceMax);
  const [draftRating, setDraftRating] = useState(ui.minRating);

  const filtered = useMemo(() => {
    let list = [...products];
    if (ui.selectedCategory !== 'all') {
      list = list.filter((p) => p.categoryId === ui.selectedCategory);
    }
    if (ui.searchQuery.trim()) {
      const q = ui.searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryId.toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => p.price <= ui.priceMax);
    list = list.filter((p) => p.rating >= ui.minRating);

    switch (ui.sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => b.createdAt - a.createdAt);
        break;
      default:
        list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return list;
  }, [ui.selectedCategory, ui.searchQuery, ui.sort, ui.priceMax, ui.minRating]);

  const activeFilters =
    (ui.selectedCategory !== 'all' ? 1 : 0) +
    (ui.priceMax < 500 ? 1 : 0) +
    (ui.minRating > 0 ? 1 : 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title="Shop" showCart />

      {/* Filters bar */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <SearchBar
          value={ui.searchQuery}
          onChangeText={ui.setSearch}
          placeholder="Search in shop..."
        />

        <View style={{ height: 12 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
          <CategoryPill
            category={{ id: 'all', name: 'All', icon: 'view-grid', color: colors.primary }}
            active={ui.selectedCategory === 'all'}
            onPress={() => ui.setCategory('all')}
          />
          {categories.map((c) => (
            <CategoryPill
              key={c.id}
              category={c}
              active={ui.selectedCategory === c.id}
              onPress={() => ui.setCategory(c.id as CategoryId)}
            />
          ))}
        </ScrollView>

        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => setSortOpen(true)}
            style={[styles.actionBtn, { borderColor: colors.border }]}
          >
            <MaterialCommunityIcons name="sort-variant" size={16} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>{sortLabels[ui.sort]}</Text>
            <MaterialCommunityIcons name="chevron-down" size={14} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setDraftPrice(ui.priceMax);
              setDraftRating(ui.minRating);
              setFilterOpen(true);
            }}
            style={[styles.actionBtn, { borderColor: colors.border }]}
          >
            <MaterialCommunityIcons name="tune-variant" size={16} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>Filters</Text>
            {activeFilters > 0 ? (
              <View style={[styles.filterBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.filterBadgeText}>{activeFilters}</Text>
              </View>
            ) : null}
          </TouchableOpacity>

          {activeFilters > 0 ? (
            <TouchableOpacity onPress={ui.resetFilters} style={styles.clearBtn}>
              <Text style={[styles.clearText, { color: colors.danger }]}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 4 }}>
        <Text style={[styles.count, { color: colors.textMuted }]}>{filtered.length} products</Text>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="magnify-close"
          title="No products found"
          subtitle="Try changing your filters or search term."
          ctaLabel="Reset filters"
          onCta={ui.resetFilters}
        />
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <ProductGrid products={filtered} />
          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {/* Sort bottom sheet */}
      <Modal visible={sortOpen} transparent animationType="slide" onRequestClose={() => setSortOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setSortOpen(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 16 }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.sheetTitle, { color: colors.text }]}>Sort by</Text>
            {(Object.keys(sortLabels) as SortOption[]).map((k) => (
              <TouchableOpacity
                key={k}
                onPress={() => {
                  ui.setSort(k);
                  setSortOpen(false);
                }}
                style={styles.sheetItem}
              >
                <Text style={[styles.sheetItemText, { color: colors.text }]}>{sortLabels[k]}</Text>
                {ui.sort === k ? (
                  <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                ) : null}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Filter bottom sheet */}
      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setFilterOpen(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 16 }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.sheetTitle, { color: colors.text }]}>Filters</Text>

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
              Max price: <Text style={{ color: colors.text, fontWeight: '700' }}>${draftPrice}</Text>
            </Text>
            <View style={styles.priceChips}>
              {[50, 100, 200, 300, 500].map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setDraftPrice(v)}
                  style={[
                    styles.priceChip,
                    {
                      borderColor: draftPrice === v ? colors.primary : colors.border,
                      backgroundColor: draftPrice === v ? colors.primarySoft : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: draftPrice === v ? colors.primary : colors.text,
                      fontSize: 13,
                      fontWeight: '700',
                    }}
                  >
                    ${v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Min rating</Text>
            <View style={styles.priceChips}>
              {[0, 3.5, 4, 4.5].map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setDraftRating(v)}
                  style={[
                    styles.priceChip,
                    {
                      borderColor: draftRating === v ? colors.primary : colors.border,
                      backgroundColor: draftRating === v ? colors.primarySoft : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: draftRating === v ? colors.primary : colors.text,
                      fontSize: 13,
                      fontWeight: '700',
                    }}
                  >
                    {v === 0 ? 'Any' : `${v}★+`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sheetActions}>
              <TouchableOpacity
                onPress={() => {
                  setDraftPrice(500);
                  setDraftRating(0);
                }}
                style={[styles.sheetAction, { borderColor: colors.border }]}
              >
                <Text style={[styles.sheetActionText, { color: colors.text }]}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  ui.setPriceMax(draftPrice);
                  ui.setMinRating(draftRating);
                  setFilterOpen(false);
                }}
                style={[styles.sheetAction, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.sheetActionText, { color: '#fff' }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterBadge: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
  },
  count: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 10,
    paddingHorizontal: 18,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sheetItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  priceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  sheetAction: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sheetActionText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
