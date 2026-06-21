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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { AppBar } from '@/components/AppBar';
import { EmptyState } from '@/components/EmptyState';
import { LoadingShimmer } from '@/components/LoadingShimmer';
import { getNotifications } from '@/services/api';
import { formatRelative } from '@/services/format';
import { AppNotification } from '@/types';

const typeMeta: Record<AppNotification['type'], { icon: string; color: string; bg: string }> = {
  promo: { icon: 'tag', color: '#f59e0b', bg: '#fef3c7' },
  order: { icon: 'truck-fast', color: '#10b981', bg: '#d1fae5' },
  system: { icon: 'cog', color: '#64748b', bg: '#f1f5f9' },
};

export const NotificationsScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await getNotifications();
    setItems(data);
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

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title="Notifications"
        showBack
        showCart={false}
        rightIcon="check-all"
        onRightPress={markAllRead}
      />
      {loading ? (
        <LoadingShimmer variant="list" count={4} />
      ) : items.length === 0 ? (
        <EmptyState
          icon="bell-off-outline"
          title="No notifications"
          subtitle="Promo codes and order updates will show up here."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(n) => n.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => {
            const meta = typeMeta[item.type];
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.card,
                  {
                    backgroundColor: item.read ? colors.surface : colors.primarySoft + '99',
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.icon, { backgroundColor: meta.bg }]}>
                  <MaterialCommunityIcons name={meta.icon as any} size={18} color={meta.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {!item.read ? (
                      <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
                    ) : null}
                  </View>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
                    {item.body}
                  </Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 11, marginTop: 6 }}>
                    {formatRelative(item.createdAt)}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});
