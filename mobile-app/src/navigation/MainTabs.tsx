import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { BottomNav } from '@/components/BottomNav';
import { useCartStore } from '@/store/useCartStore';
import { HomeScreen } from '@/screens/HomeScreen';
import { ShopScreen } from '@/screens/ShopScreen';
import { CartScreen } from '@/screens/CartScreen';
import { WishlistScreen } from '@/screens/WishlistScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';

export type MainTabsParamList = {
  Home: undefined;
  Shop: undefined;
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const icon =
  (name: string) =>
  ({ color, size }: { color: string; size: number }) =>
    <MaterialCommunityIcons name={name as any} color={color} size={size} />;

export const MainTabs: React.FC = () => {
  const { colors } = useTheme();
  const count = useCartStore((s) => s.count());

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(p) => <BottomNav {...p} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: icon('home-variant-outline'),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: icon('storefront-outline'),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: icon('cart-outline'),
          tabBarBadge: count > 0 ? count : undefined,
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarLabel: 'Wishlist',
          tabBarIcon: icon('heart-outline'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: icon('account-circle-outline'),
        }}
      />
    </Tab.Navigator>
  );
};
