import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { AppBar } from '@/components/AppBar';
import { LoadingShimmer } from '@/components/LoadingShimmer';
import { EmptyState } from '@/components/EmptyState';
import { getOrder } from '@/services/api';
import { formatDate, formatPriceExact } from '@/services/format';
import { Order, OrderStatus } from '@/types';

const statusColors: Record<OrderStatus, { bg: string; fg: string }> = {
  Processing: { bg: '#fef3c7', fg: '#92400e' },
  Shipped: { bg: '#dbeafe', fg: '#1e40af' },
  Delivered: { bg: '#d1fae5', fg: '#065f46' },
  Cancelled: { bg: '#fee2e2', fg: '#991b1b' },
};

const paymentLabels: Record<string, string> = {
  COD: 'Cash on Delivery',
  Card: 'Credit / Debit Card',
  Wallet: 'Faisu Wallet',
};

export const OrderDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const orderId: string = route.params?.orderId ?? '';
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    getOrder(orderId).then(setOrder);
  }, [orderId]);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar title="Order details" showBack showCart={false} />
        <LoadingShimmer variant="list" count={3} />
      </View>
    );
  }

  const sc = statusColors[order.status];
  const currentStep = order.timeline.filter((t) => t.done).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title={`Order ${order.id}`} showBack showCart={false} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Status banner */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>Current status</Text>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>{order.status}</Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: sc.bg }]}>
              <Text style={[styles.statusText, { color: sc.fg }]}>{order.status}</Text>
            </View>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>
            Estimated delivery: {formatDate(order.etaMs)}
          </Text>
        </View>

        {/* Timeline */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 12 }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Delivery tracking</Text>
          {order.timeline.map((step, i) => {
            const isLast = i === order.timeline.length - 1;
            return (
              <View key={i} style={[styles.row, { alignItems: 'flex-start' }]}>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: step.done ? colors.primary : colors.surfaceAlt,
                        borderColor: step.done ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    {step.done ? (
                      <MaterialCommunityIcons name="check" size={12} color="#fff" />
                    ) : null}
                  </View>
                  {!isLast ? (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: order.timeline[i + 1].done ? colors.primary : colors.border },
                      ]}
                    />
                  ) : null}
                </View>
                <View style={{ flex: 1, paddingBottom: 12 }}>
                  <Text style={{ color: colors.text, fontSize: 13, fontWeight: step.done ? '700' : '500' }}>
                    {step.label}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                    {step.done ? formatDate(step.at) : 'Pending'}
                  </Text>
                </View>
              </View>
            );
          })}
          <View style={[styles.progressBar, { backgroundColor: colors.surfaceAlt }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${(currentStep / order.timeline.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Items */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 12 }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Items ({order.items.length})</Text>
          {order.items.map((it, i) => (
            <View key={i} style={[styles.row, { gap: 12, paddingVertical: 8 }]}>
              <ExpoImage source={it.image} style={styles.thumb} contentFit="cover" />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }} numberOfLines={2}>
                  {it.name}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                  Qty {it.qty}
                  {it.color ? ` • ${it.color}` : ''}
                  {it.size ? ` • ${it.size}` : ''}
                </Text>
              </View>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>
                {formatPriceExact(it.price * it.qty)}
              </Text>
            </View>
          ))}
        </View>

        {/* Address + Payment */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 12 }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Delivery address</Text>
          <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>{order.address.name}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2, lineHeight: 17 }}>
            {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''},{'\n'}
            {order.address.city}, {order.address.state} {order.address.zip}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{order.address.phone}</Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Payment</Text>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>Method</Text>
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
              {paymentLabels[order.payment] ?? order.payment}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 12 }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Payment summary</Text>
          <Row label="Subtotal" value={formatPriceExact(order.subtotal)} colors={colors} />
          {order.discount > 0 ? (
            <Row label={`Discount${order.couponCode ? ` (${order.couponCode})` : ''}`} value={`- ${formatPriceExact(order.discount)}`} colors={colors} valueColor={colors.success} />
          ) : null}
          <Row label="Shipping" value={order.shipping === 0 ? 'FREE' : formatPriceExact(order.shipping)} colors={colors} valueColor={order.shipping === 0 ? colors.success : undefined} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row label="Total paid" value={formatPriceExact(order.total)} colors={colors} bold large />
        </View>

        <TouchableOpacity
          onPress={() => nav.replace('MainTabs', { screen: 'Home' })}
          style={[styles.btn, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Row: React.FC<{ label: string; value: string; colors: any; bold?: boolean; large?: boolean; valueColor?: string }> = ({
  label, value, colors, bold, large, valueColor,
}) => (
  <View style={[styles.row, { justifyContent: 'space-between', marginVertical: 3 }]}>
    <Text style={{ color: colors.textMuted, fontSize: large ? 14 : 13, fontWeight: bold ? '700' : '500' }}>{label}</Text>
    <Text style={{ color: valueColor ?? colors.text, fontSize: large ? 16 : 13, fontWeight: bold ? '800' : '600' }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
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
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  btn: {
    marginTop: 18,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
