import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { useCartStore } from '@/store/useCartStore';
import { productMap } from '@/data/products';
import { validateCoupon, calcDiscount, coupons } from '@/services/api';
import { formatPriceExact } from '@/services/format';
import { AppBar } from '@/components/AppBar';
import { QuantityStepper } from '@/components/QuantityStepper';
import { EmptyState } from '@/components/EmptyState';
import { CartItem } from '@/types';

export const CartScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const couponCode = useCartStore((s) => s.couponCode);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const [codeInput, setCodeInput] = useState(couponCode ?? '');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        const p = productMap[i.productId];
        return sum + (p ? p.price * i.qty : 0);
      }, 0),
    [items]
  );

  const activeCoupon = couponCode
    ? validateCoupon(couponCode, subtotal)
    : { ok: false };
  const discount = activeCoupon.ok && activeCoupon.coupon
    ? calcDiscount(activeCoupon.coupon, subtotal)
    : 0;
  const shipping = subtotal > 0 ? (subtotal >= 35 ? 0 : 5.99) : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const onApplyCoupon = () => {
    if (!codeInput.trim()) return;
    const r = validateCoupon(codeInput, subtotal);
    if (r.ok && r.coupon) {
      applyCoupon(codeInput);
      setFeedback({ ok: true, msg: `${r.coupon.code} applied — ${r.coupon.description}` });
    } else {
      setFeedback({ ok: false, msg: r.reason ?? 'Invalid coupon' });
    }
  };

  const goCheckout = () => nav.navigate('Checkout');
  const goShop = () => nav.navigate('MainTabs', { screen: 'Shop' });

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar title="Cart" showCart={false} />
        <EmptyState
          icon="cart-off"
          title="Your cart is empty"
          subtitle="Browse our catalog and add your favorite products."
          ctaLabel="Start shopping"
          onCta={goShop}
        />
      </View>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => {
    const p = productMap[item.productId];
    if (!p) return null;
    return (
      <View style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ExpoImage source={p.images[0]} style={styles.itemImage} contentFit="cover" />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
            {p.name}
          </Text>
          <View style={[styles.row, { gap: 8 }]}>
            {item.color ? (
              <View style={[styles.variantChip, { backgroundColor: colors.surfaceAlt }]}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color }} />
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.color}</Text>
              </View>
            ) : null}
            {item.size ? (
              <View style={[styles.variantChip, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>Size: {item.size}</Text>
              </View>
            ) : null}
          </View>
          <View style={[styles.row, { justifyContent: 'space-between', marginTop: 4 }]}>
            <Text style={[styles.itemPrice, { color: colors.text }]}>
              {formatPriceExact(p.price * item.qty)}
            </Text>
            <View style={[styles.row, { gap: 12 }]}>
              <QuantityStepper
                value={item.qty}
                size="sm"
                onChange={(n) => setQty(item.productId, n, item.color, item.size)}
              />
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Remove item',
                    `Remove ${p.name} from cart?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Remove', style: 'destructive', onPress: () => remove(item.productId, item.color, item.size) },
                    ]
                  )
                }
                hitSlop={8}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title={`Cart (${items.reduce((n, i) => n + i.qty, 0)})`} showCart={false} />
      <FlatList
        data={items}
        keyExtractor={(i, idx) => `${i.productId}-${i.color ?? ''}-${i.size ?? ''}-${idx}`}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 240 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={{ marginTop: 16, gap: 12 }}>
            {/* Coupon */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Apply coupon</Text>
              <View style={styles.row}>
                <View style={[styles.couponInput, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                  <MaterialCommunityIcons name="ticket-percent" size={16} color={colors.primary} />
                  <TextInputInline
                    value={codeInput}
                    onChangeText={setCodeInput}
                    placeholder="Enter code"
                    placeholderTextColor={colors.textSubtle}
                    colors={colors}
                  />
                </View>
                <TouchableOpacity
                  onPress={onApplyCoupon}
                  style={[styles.applyBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Apply</Text>
                </TouchableOpacity>
              </View>

              {couponCode && activeCoupon.ok ? (
                <View style={[styles.appliedRow, { backgroundColor: colors.primarySoft }]}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600', flex: 1 }}>
                    {couponCode} applied
                  </Text>
                  <TouchableOpacity onPress={() => { removeCoupon(); setCodeInput(''); setFeedback(null); }}>
                    <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700' }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : feedback ? (
                <Text style={{ color: feedback.ok ? colors.success : colors.danger, fontSize: 12, marginTop: 8 }}>
                  {feedback.msg}
                </Text>
              ) : null}

              <View style={{ marginTop: 8, gap: 6 }}>
                <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '600' }}>Available coupons:</Text>
                {coupons.map((c) => (
                  <TouchableOpacity
                    key={c.code}
                    onPress={() => setCodeInput(c.code)}
                    style={[styles.couponLine, { borderColor: colors.border }]}
                  >
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>{c.code}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11, flex: 1 }}>{c.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Summary */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Order summary</Text>
              <Row label="Subtotal" value={formatPriceExact(subtotal)} colors={colors} />
              <Row label="Discount" value={`- ${formatPriceExact(discount)}`} colors={colors} valueColor={colors.success} />
              <Row
                label="Shipping"
                value={shipping === 0 ? 'FREE' : formatPriceExact(shipping)}
                colors={colors}
                valueColor={shipping === 0 ? colors.success : undefined}
              />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Row label="Total" value={formatPriceExact(total)} colors={colors} bold large />
            </View>
          </View>
        }
      />

      {/* Sticky bottom bar */}
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
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>
            {formatPriceExact(total)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={goCheckout}
          activeOpacity={0.85}
          style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Proceed to Checkout</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
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

// small inline textinput to avoid extra import overhead
import { TextInput } from 'react-native';
const TextInputInline: React.FC<{
  value: string;
  onChangeText: (s: string) => void;
  placeholder: string;
  placeholderTextColor: string;
  colors: any;
}> = (props) => (
  <TextInput
    value={props.value}
    onChangeText={props.onChangeText}
    placeholder={props.placeholder}
    placeholderTextColor={props.placeholderTextColor}
    autoCapitalize="characters"
    style={{ flex: 1, color: props.colors.text, fontSize: 13, padding: 0 }}
  />
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  variantChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  couponInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  applyBtn: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  couponLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
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
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
});
