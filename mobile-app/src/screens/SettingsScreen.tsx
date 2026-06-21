import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { AppBar } from '@/components/AppBar';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { categories } from '@/data/categories';
import { CategoryId, LanguageCode, CurrencyCode } from '@/types';

const APP_VERSION = '1.0.0';

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'Urdu' },
  { code: 'ar', label: 'Arabic' },
];

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'PKR', label: 'Pakistani Rupee', symbol: '₨' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
];

export const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const push = useSettingsStore((s) => s.pushNotifications);
  const email = useSettingsStore((s) => s.emailNotifications);
  const orderUpd = useSettingsStore((s) => s.orderUpdates);
  const defaultCat = useSettingsStore((s) => s.defaultCategory);
  const language = useSettingsStore((s) => s.language);
  const currency = useSettingsStore((s) => s.currency);
  const setPush = useSettingsStore((s) => s.setPush);
  const setEmail = useSettingsStore((s) => s.setEmail);
  const setOrderUpd = useSettingsStore((s) => s.setOrderUpdates);
  const setDefaultCat = useSettingsStore((s) => s.setDefaultCategory);
  const setLang = useSettingsStore((s) => s.setLanguage);
  const setCur = useSettingsStore((s) => s.setCurrency);

  const themeIsDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const setSystem = useThemeStore((s) => s.setSystem);
  const isDark = themeIsDark === true;

  const logout = useAuthStore((s) => s.logout);

  const onLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          logout();
          nav.replace('Auth');
        },
      },
    ]);
  };

  const pickCategory = () => {
    const opts: Array<{ text: string; onPress: () => void; style?: 'cancel' | 'default' | 'destructive' }> = [
      { text: 'All categories', onPress: () => setDefaultCat('all') },
      ...categories.map((c) => ({
        text: c.name,
        onPress: () => setDefaultCat(c.id),
      })),
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
    ];
    Alert.alert('Default category', 'Choose your default landing category', opts);
  };

  const pickLanguage = () => {
    Alert.alert(
      'Language',
      'Choose your preferred language',
      [
        ...LANGUAGES.map((l) => ({
          text: l.label,
          onPress: () => setLang(l.code),
        })),
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      ]
    );
  };

  const pickCurrency = () => {
    Alert.alert(
      'Currency',
      'Choose your preferred currency',
      [
        ...CURRENCIES.map((c) => ({
          text: `${c.label} (${c.symbol})`,
          onPress: () => setCur(c.code),
        })),
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      ]
    );
  };

  const defaultCatLabel =
    defaultCat === 'all'
      ? 'All categories'
      : categories.find((c) => c.id === (defaultCat as CategoryId))?.name ?? 'All';

  const langLabel = LANGUAGES.find((l) => l.code === language)?.label ?? 'English';
  const curLabel = CURRENCIES.find((c) => c.code === currency)?.code ?? 'USD';

  const onShare = async () => {
    try {
      await Share.share({
        message:
          'Check out Shop With Faisu!! — your everyday shopping companion. Download it from the Play Store. #ShopWithFaisu',
        title: 'Shop With Faisu!!',
      });
    } catch {
      Alert.alert('Share failed', 'Sharing is not available on this device right now.');
    }
  };

  const onRate = () => {
    Alert.alert(
      'Rate Shop With Faisu!!',
      'Thanks for taking the time to rate us! Your feedback keeps the shelves stocked with the good stuff.',
      [{ text: 'Got it', style: 'default' }]
    );
  };

  const onPolicy = () =>
    Alert.alert(
      'Privacy Policy',
      'This is a demo app. We do not collect any personal data. In a production build this would open our full privacy policy.',
      [{ text: 'OK' }]
    );

  const onTerms = () =>
    Alert.alert(
      'Terms of Service',
      'This is a demo app. In a production build this would open our full terms of service.',
      [{ text: 'OK' }]
    );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title="Settings" showBack showCart={false} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Preferences */}
        <SectionLabel colors={colors}>Preferences</SectionLabel>
        <Group colors={colors}>
          <ToggleRow
            colors={colors}
            icon="bell-outline"
            iconColor="#f59e0b"
            label="Push notifications"
            subtitle="Order alerts and deal drops"
            value={push}
            onToggle={setPush}
          />
          <ToggleRow
            colors={colors}
            icon="email-outline"
            iconColor="#0ea5e9"
            label="Email notifications"
            subtitle="Receipts, newsletters and offers"
            value={email}
            onToggle={setEmail}
          />
          <ToggleRow
            colors={colors}
            icon="truck-delivery-outline"
            iconColor="#10b981"
            label="Order updates"
            subtitle="Shipment and delivery status"
            value={orderUpd}
            onToggle={setOrderUpd}
            last
          />
        </Group>

        {/* Appearance */}
        <SectionLabel colors={colors}>Appearance</SectionLabel>
        <Group colors={colors}>
          <ToggleRow
            colors={colors}
            icon={isDark ? 'weather-night' : 'white-balance-sunny'}
            iconColor={isDark ? '#8b5cf6' : '#f59e0b'}
            label="Dark mode"
            subtitle={themeIsDark === null ? 'Follow system' : isDark ? 'On' : 'Off'}
            value={isDark}
            onToggle={toggleTheme}
          />
          {themeIsDark !== null ? (
            <NavRow
              colors={colors}
              icon="cog-outline"
              iconColor={colors.textMuted}
              label="Use system theme"
              onPress={setSystem}
            />
          ) : null}
          <NavRow
            colors={colors}
            icon="apps"
            iconColor="#ec4899"
            label="Default category"
            rightLabel={defaultCatLabel}
            onPress={pickCategory}
            last
          />
        </Group>

        {/* Region */}
        <SectionLabel colors={colors}>Region</SectionLabel>
        <Group colors={colors}>
          <NavRow
            colors={colors}
            icon="translate"
            iconColor="#0ea5e9"
            label="Language"
            rightLabel={langLabel}
            onPress={pickLanguage}
          />
          <NavRow
            colors={colors}
            icon="currency-usd"
            iconColor="#10b981"
            label="Currency"
            rightLabel={curLabel}
            onPress={pickCurrency}
            last
          />
        </Group>

        {/* About */}
        <SectionLabel colors={colors}>About</SectionLabel>
        <Group colors={colors}>
          <InfoRow
            colors={colors}
            icon="information-outline"
            iconColor={colors.textMuted}
            label="App version"
            value={APP_VERSION}
          />
          <NavRow
            colors={colors}
            icon="shield-check-outline"
            iconColor="#10b981"
            label="Privacy Policy"
            onPress={onPolicy}
          />
          <NavRow
            colors={colors}
            icon="file-document-outline"
            iconColor={colors.textMuted}
            label="Terms of Service"
            onPress={onTerms}
          />
          <NavRow
            colors={colors}
            icon="star-plus-outline"
            iconColor="#f59e0b"
            label="Rate the app"
            onPress={onRate}
          />
          <NavRow
            colors={colors}
            icon="share-variant"
            iconColor="#8b5cf6"
            label="Share the app"
            onPress={onShare}
            last
          />
        </Group>

        {/* Account */}
        <SectionLabel colors={colors}>Account</SectionLabel>
        <TouchableOpacity
          onPress={onLogout}
          style={[styles.logoutBtn, { borderColor: colors.danger, backgroundColor: colors.surface }]}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="logout" size={18} color={colors.danger} />
          <Text style={{ color: colors.danger, fontSize: 14, fontWeight: '700' }}>Log out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textSubtle }]}>
          Shop With Faisu v{APP_VERSION}
        </Text>
      </ScrollView>
    </View>
  );
};

const SectionLabel: React.FC<{ colors: any; children: React.ReactNode }> = ({ colors, children }) => (
  <Text
    style={{
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
      marginLeft: 4,
    }}
  >
    {children}
  </Text>
);

const Group: React.FC<{ colors: any; children: React.ReactNode }> = ({ colors, children }) => (
  <View
    style={{
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: 'hidden',
      marginBottom: 8,
    }}
  >
    {children}
  </View>
);

const rowBase = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 12,
  paddingHorizontal: 14,
  minHeight: 56,
  borderBottomWidth: StyleSheet.hairlineWidth,
};

const ToggleRow: React.FC<{
  colors: any;
  icon: string;
  iconColor: string;
  label: string;
  subtitle?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  last?: boolean;
}> = ({ colors, icon, iconColor, label, subtitle, value, onToggle, last }) => (
  <View style={[rowBase, { borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth, borderColor: colors.border }]}>
    <View style={[styles.iconWrap, { backgroundColor: iconColor + '22' }]}>
      <MaterialCommunityIcons name={icon as any} size={18} color={iconColor} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>{label}</Text>
      {subtitle ? (
        <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>{subtitle}</Text>
      ) : null}
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
      thumbColor="#fff"
    />
  </View>
);

const NavRow: React.FC<{
  colors: any;
  icon: string;
  iconColor: string;
  label: string;
  rightLabel?: string;
  onPress: () => void;
  last?: boolean;
}> = ({ colors, icon, iconColor, label, rightLabel, onPress, last }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.65}
    style={[rowBase, { borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth, borderColor: colors.border }]}
  >
    <View style={[styles.iconWrap, { backgroundColor: iconColor + '22' }]}>
      <MaterialCommunityIcons name={icon as any} size={18} color={iconColor} />
    </View>
    <Text style={{ flex: 1, color: colors.text, fontSize: 14, fontWeight: '600' }}>{label}</Text>
    {rightLabel ? (
      <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600' }} numberOfLines={1}>
        {rightLabel}
      </Text>
    ) : null}
    <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textSubtle} />
  </TouchableOpacity>
);

const InfoRow: React.FC<{
  colors: any;
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  last?: boolean;
}> = ({ colors, icon, iconColor, label, value, last }) => (
  <View style={[rowBase, { borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth, borderColor: colors.border }]}>
    <View style={[styles.iconWrap, { backgroundColor: iconColor + '22' }]}>
      <MaterialCommunityIcons name={icon as any} size={18} color={iconColor} />
    </View>
    <Text style={{ flex: 1, color: colors.text, fontSize: 14, fontWeight: '600' }}>{label}</Text>
    <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600' }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
  },
  version: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 16,
  },
});
