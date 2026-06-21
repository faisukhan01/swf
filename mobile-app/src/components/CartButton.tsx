import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { useCartStore } from '@/store/useCartStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';

interface Props {
  color?: string;
}

export const CartButton: React.FC<Props> = ({ color }) => {
  const { colors } = useTheme();
  const count = useCartStore((s) => s.count());
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      hitSlop={10}
      onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}
      style={{ paddingHorizontal: 4 }}
    >
      <MaterialCommunityIcons name="cart-outline" size={24} color={color ?? colors.text} />
      {count > 0 ? (
        <Text style={[styles.badge, { backgroundColor: colors.accent, color: '#fff' }]}>
          {count > 99 ? '99+' : count}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
  },
});
