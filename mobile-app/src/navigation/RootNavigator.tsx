import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/theme';
import { stackScreenOptions, modalScreenOptions } from './screenOptions';
import { MainTabs, MainTabsParamList } from './MainTabs';
import { SplashScreen } from '@/screens/SplashScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { AuthScreen } from '@/screens/AuthScreen';
import { ProductDetailScreen } from '@/screens/ProductDetailScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { CheckoutScreen } from '@/screens/CheckoutScreen';
import { OrderSuccessScreen } from '@/screens/OrderSuccessScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { OrderDetailScreen } from '@/screens/OrderDetailScreen';
import { AddressesScreen } from '@/screens/AddressesScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { RecentlyViewedScreen } from '@/screens/RecentlyViewedScreen';
import { WriteReviewScreen } from '@/screens/WriteReviewScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  MainTabs: { screen?: keyof MainTabsParamList; params?: any };
  ProductDetail: { productId: string };
  Search: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  Orders: undefined;
  OrderDetail: { orderId: string };
  Addresses: undefined;
  Notifications: undefined;
  Settings: undefined;
  RecentlyViewed: undefined;
  WriteReview: { productId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={stackScreenOptions(theme)}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} options={modalScreenOptions(theme)} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="RecentlyViewed" component={RecentlyViewedScreen} />
      <Stack.Screen name="WriteReview" component={WriteReviewScreen} options={modalScreenOptions(theme)} />
    </Stack.Navigator>
  );
};
