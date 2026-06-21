import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { getOrder } from '@/services/api';
import { formatDate } from '@/services/format';
import { Order } from '@/types';

export const OrderSuccessScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const orderId: string = route.params?.orderId ?? '';

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [order, setOrder] = React.useState<Order | undefined>(undefined);

  useEffect(() => {
    getOrder(orderId).then(setOrder);
  }, [orderId]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  const eta = order ? formatDate(order.etaMs) : 'in 5-7 business days';

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background, paddingTop: insets.top + 30 }]}>
      <Animated.View style={{ opacity, transform: [{ scale }], alignItems: 'center' }}>
        <View style={[styles.check, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="check" size={56} color="#fff" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Order Placed!</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Thank you for shopping with us. We've received your order and it's on the way.
        </Text>
      </Animated.View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Order number</Text>
          <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>{orderId}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Estimated delivery</Text>
          <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>{eta}</Text>
        </View>
        {order ? (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>Items</Text>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>
                {order.items.length} • ${order.total.toFixed(2)}
              </Text>
            </View>
          </>
        ) : null}
      </View>

      <View style={{ gap: 10, marginTop: 24 }}>
        <TouchableOpacity
          onPress={() => nav.navigate('OrderDetail', { orderId })}
          style={[styles.btn, { backgroundColor: colors.primary }]}
        >
          <MaterialCommunityIcons name="receipt" size={18} color="#fff" />
          <Text style={styles.btnTextLight}>View Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => nav.replace('MainTabs', { screen: 'Home' })}
          style={[styles.btn, { borderColor: colors.primary, borderWidth: 1 }]}
        >
          <MaterialCommunityIcons name="shopping-outline" size={18} color={colors.primary} />
          <Text style={[styles.btnTextDark, { color: colors.primary }]}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  check: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#10b981',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 19,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginTop: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    width: '100%',
    borderRadius: 14,
  },
  btnTextLight: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  btnTextDark: {
    fontSize: 15,
    fontWeight: '700',
  },
});
