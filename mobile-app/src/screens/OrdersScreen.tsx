import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { AppBar } from '@/components/AppBar';
import { EmptyState } from '@/components/EmptyState';
import { LoadingShimmer } from '@/components/LoadingShimmer';
import { getOrders } from '@/services/api';
import { formatDate, formatPriceExact } from '@/services/format';
import { Order, OrderStatus } from '@/types';

const statusColors: Record<OrderStatus, { bg: string; fg: string }> = {
  Processing: { bg: '#fef3c7', fg: '#92400e' },
  Shipped: { bg: '#dbeafe', fg: '#1e40af' },
  Delivered: { bg: '#d1fae5', fg: '#065f46' },
  Cancelled: { bg: '#fee2e2', fg: '#991b1b' },
};

export const OrdersScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title="My Orders" showBack showCart={false} />
      {loading ? (
        <LoadingShimmer variant="list" count={4} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="receipt-text-clock"
          title="No orders yet"
          subtitle="Your past orders will appear here once you start shopping."
          ctaLabel="Browse shop"
          onCta={() => nav.replace('MainTabs', { screen: 'Shop' })}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => {
            const sc = statusColors[item.status];
            return (
              <TouchableOpacity
                onPress={() => nav.navigate('OrderDetail', { orderId: item.id })}
                activeOpacity={0.85}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>{item.id}</Text>
                  <View style={[styles.statusTag, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.statusText, { color: sc.fg }]}>{item.status}</Text>
                  </View>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
                  Placed on {formatDate(item.createdAt)}
                </Text>

                <View style={[styles.row, { gap: 8, marginTop: 12 }]}>
                  {item.items.slice(0, 4).map((it, i) => (
                    <ExpoImage
                      key={i}
                      source={it.image}
                      style={styles.thumb}
                      contentFit="cover"
                    />
                  ))}
                  {item.items.length > 4 ? (
                    <View style={[styles.thumb, { backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }]}>
                      <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700' }}>
                        +{item.items.length - 4}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View style={[styles.row, { justifyContent: 'space-between', marginTop: 12 }]}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                    {item.items.reduce((n, i) => n + i.qty, 0)} items
                  </Text>
                  <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800' }}>
                    {formatPriceExact(item.total)}
                  </Text>
                </View>
                <View style={[styles.row, { justifyContent: 'space-between', marginTop: 10 }]}>
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>ETA: {formatDate(item.etaMs)}</Text>
                  <Text style={[styles.row, { gap: 4 }]}>
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>View details</Text>
                    <MaterialCommunityIcons name="chevron-right" size={14} color={colors.primary} />
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
});
