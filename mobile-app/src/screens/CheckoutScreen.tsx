import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { productMap } from '@/data/products';
import { validateCoupon, calcDiscount, placeOrder, saveOrder } from '@/services/api';
import { formatPriceExact } from '@/services/format';
import { AppBar } from '@/components/AppBar';
import { PaymentMethod, OrderItem } from '@/types';

export const CheckoutScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const clear = useCartStore((s) => s.clear);
  const addresses = useAuthStore((s) => s.addresses);
  const addAddress = useAuthStore((s) => s.addAddress);

  const [selectedAddr, setSelectedAddr] = useState<string | undefined>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id
  );
  const [payment, setPayment] = useState<PaymentMethod>('COD');
  const [placing, setPlacing] = useState(false);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        const p = productMap[i.productId];
        return sum + (p ? p.price * i.qty : 0);
      }, 0),
    [items]
  );

  const activeCoupon = couponCode ? validateCoupon(couponCode, subtotal) : { ok: false };
  const discount = activeCoupon.ok && activeCoupon.coupon
    ? calcDiscount(activeCoupon.coupon, subtotal)
    : 0;
  const shipping = subtotal >= 35 ? 0 : 5.99;
  const total = Math.max(0, subtotal - discount + shipping);

  const selected = addresses.find((a) => a.id === selectedAddr);

  const ensureDefaultAddress = () => {
    const a = addAddress({
      name: 'Demo User',
      phone: '+1 555 0100',
      line1: '742 Evergreen Terrace',
      line2: 'Apt 4B',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
      isDefault: true,
    });
    setSelectedAddr(a.id);
  };

  const onPlaceOrder = async () => {
    if (!selected) {
      Alert.alert('Add a delivery address', 'Please add an address before placing your order.');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Empty cart', 'Add items to your cart first.');
      return;
    }
    setPlacing(true);
    const orderItems: OrderItem[] = items.map((i) => {
      const p = productMap[i.productId];
      return {
        productId: i.productId,
        name: p.name,
        image: p.images[0],
        price: p.price,
        qty: i.qty,
        color: i.color,
        size: i.size,
      };
    });
    const order = await placeOrder({
      items: orderItems,
      address: selected,
      payment,
      subtotal,
      discount,
      shipping,
      total,
      couponCode: couponCode && activeCoupon.ok ? couponCode : undefined,
    });
    await saveOrder(order);
    setPlacing(false);
    clear();
    nav.replace('OrderSuccess', { orderId: order.id });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title="Checkout" showBack showCart={false} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 160 }}>
        {/* Address */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Delivery address</Text>
            <TouchableOpacity
              onPress={() => nav.navigate('Addresses')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <MaterialCommunityIcons name="pencil" size={14} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>
                {addresses.length === 0 ? 'Add' : 'Manage'}
              </Text>
            </TouchableOpacity>
          </View>

          {addresses.length === 0 ? (
            <TouchableOpacity
              onPress={ensureDefaultAddress}
              style={[styles.addAddrBtn, { borderColor: colors.primary, backgroundColor: colors.primarySoft }]}
            >
              <MaterialCommunityIcons name="plus-circle-outline" size={20} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>
                Use demo address
              </Text>
            </TouchableOpacity>
          ) : (
            addresses.map((a) => {
              const selected = a.id === selectedAddr;
              return (
                <TouchableOpacity
                  key={a.id}
                  onPress={() => setSelectedAddr(a.id)}
                  style={[
                    styles.addrItem,
                    {
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? colors.primarySoft : colors.surfaceAlt,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>{a.name}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2, lineHeight: 17 }}>
                      {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.zip}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{a.phone}</Text>
                  </View>
                  {a.isDefault ? (
                    <View style={[styles.defaultTag, { backgroundColor: colors.primary }]}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>DEFAULT</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Payment */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 12 }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Payment method</Text>
          {([
            { id: 'COD' as PaymentMethod, label: 'Cash on Delivery', icon: 'cash' },
            { id: 'Card' as PaymentMethod, label: 'Credit / Debit Card', icon: 'credit-card-outline' },
            { id: 'Wallet' as PaymentMethod, label: 'Faisu Wallet', icon: 'wallet-outline' },
          ]).map((p) => {
            const active = payment === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setPayment(p.id)}
                style={[
                  styles.addrItem,
                  {
                    borderColor: active ? colors.primary : colors.border,
                    backgroundColor: active ? colors.primarySoft : colors.surfaceAlt,
                  },
                ]}
              >
                <MaterialCommunityIcons name={p.icon as any} size={20} color={active ? colors.primary : colors.textMuted} />
                <Text style={{ flex: 1, color: colors.text, fontSize: 13, fontWeight: '600' }}>{p.label}</Text>
                <MaterialCommunityIcons
                  name={active ? 'radiobox-marked' : 'radiobox-blank'}
                  size={20}
                  color={active ? colors.primary : colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 12 }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Order summary</Text>
          {items.map((i, idx) => {
            const p = productMap[i.productId];
            if (!p) return null;
            return (
              <View key={`${i.productId}-${idx}`} style={[styles.row, { justifyContent: 'space-between', paddingVertical: 4 }]}>
                <Text style={{ color: colors.text, fontSize: 13, flex: 1 }} numberOfLines={1}>
                  {p.name} × {i.qty}
                </Text>
                <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
                  {formatPriceExact(p.price * i.qty)}
                </Text>
              </View>
            );
          })}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row label="Subtotal" value={formatPriceExact(subtotal)} colors={colors} />
          <Row label="Discount" value={`- ${formatPriceExact(discount)}`} colors={colors} valueColor={colors.success} />
          <Row label="Shipping" value={shipping === 0 ? 'FREE' : formatPriceExact(shipping)} colors={colors} valueColor={shipping === 0 ? colors.success : undefined} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row label="Total" value={formatPriceExact(total)} colors={colors} bold large />
        </View>
      </ScrollView>

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
        <View>
          <Text style={{ color: colors.textMuted, fontSize: 11 }}>Total</Text>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>{formatPriceExact(total)}</Text>
        </View>
        <TouchableOpacity
          onPress={onPlaceOrder}
          disabled={placing}
          activeOpacity={0.85}
          style={[styles.placeBtn, { backgroundColor: colors.primary, opacity: placing ? 0.7 : 1 }]}
        >
          {placing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Place Order</Text>
              <MaterialCommunityIcons name="check-circle" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Row: React.FC<{
  label: string;
  value: string;
  colors: any;
  bold?: boolean;
  large?: boolean;
  valueColor?: string;
}> = ({ label, value, colors, bold, large, valueColor }) => (
  <View style={[styles.row, { justifyContent: 'space-between', marginVertical: 3 }]}>
    <Text style={{ color: colors.textMuted, fontSize: large ? 14 : 13, fontWeight: bold ? '700' : '500' }}>
      {label}
    </Text>
    <Text
      style={{
        color: valueColor ?? colors.text,
        fontSize: large ? 16 : 13,
        fontWeight: bold ? '800' : '600',
      }}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addAddrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  addrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  defaultTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  placeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
});
