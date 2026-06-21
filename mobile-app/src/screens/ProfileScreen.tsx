import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

export const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const themeIsDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const setSystem = useThemeStore((s) => s.setSystem);

  const cartCount = useCartStore((s) => s.count());
  const wishCount = useWishlistStore((s) => s.ids.length);

  const isDark = themeIsDark === true; // treat null/false as light for the switch

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

  const name = user?.name ?? 'Guest';
  const email = user?.email ?? 'Not signed in';
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, alignItems: 'center', marginBottom: 24 }}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.email, { color: colors.textMuted }]}>{email}</Text>
        </View>

        {/* Stats row */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border, marginHorizontal: 16 }]}>
          <Stat label="Cart" value={String(cartCount)} icon="cart-outline" colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <Stat label="Wishlist" value={String(wishCount)} icon="heart-outline" colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <Stat label="Orders" value="—" icon="receipt-text" colors={colors} />
        </View>

        {/* Menu group 1 */}
        <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Item
            icon="receipt-text-clock"
            color={colors.primary}
            label="My Orders"
            colors={colors}
            onPress={() => nav.navigate('Orders')}
            rightIcon="chevron-right"
          />
          <Item
            icon="map-marker-radius-outline"
            color="#8b5cf6"
            label="Addresses"
            colors={colors}
            onPress={() => nav.navigate('Addresses')}
            rightIcon="chevron-right"
          />
          <Item
            icon="heart-outline"
            color="#ec4899"
            label="Wishlist"
            colors={colors}
            onPress={() => nav.navigate('MainTabs', { screen: 'Wishlist' })}
            rightIcon="chevron-right"
          />
          <Item
            icon="bell-outline"
            color="#f59e0b"
            label="Notifications"
            colors={colors}
            onPress={() => nav.navigate('Notifications')}
            rightIcon="chevron-right"
          />
        </View>

        {/* Settings group */}
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>Preferences</Text>
        <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.item, { borderColor: colors.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceAlt }]}>
              <MaterialCommunityIcons
                name={isDark ? 'weather-night' : 'white-balance-sunny'}
                size={18}
                color={isDark ? '#8b5cf6' : '#f59e0b'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>Dark mode</Text>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                {themeIsDark === null ? 'Follow system' : isDark ? 'On' : 'Off'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
          {themeIsDark !== null ? (
            <Item
              icon="cog"
              color={colors.textMuted}
              label="Use system theme"
              colors={colors}
              onPress={setSystem}
              rightIcon="chevron-right"
            />
          ) : null}
          <Item
            icon="translate"
            color="#0ea5e9"
            label="Language"
            colors={colors}
            onPress={() => Alert.alert('Language', 'Only English is available in this demo.')}
            rightIcon="chevron-right"
            rightLabel="English"
          />
          <Item
            icon="cash-multiple"
            color="#10b981"
            label="Currency"
            colors={colors}
            onPress={() => Alert.alert('Currency', 'Only USD is available in this demo.')}
            rightIcon="chevron-right"
            rightLabel="USD"
          />
        </View>

        {/* Support group */}
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>Support</Text>
        <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Item
            icon="help-circle-outline"
            color="#3b82f6"
            label="Help & Support"
            colors={colors}
            onPress={() => Alert.alert('Help', 'Email us at support@shopwithfaisu.example')}
            rightIcon="chevron-right"
          />
          <Item
            icon="file-document-outline"
            color={colors.textMuted}
            label="Terms & Policies"
            colors={colors}
            onPress={() => Alert.alert('Terms', 'This is a demo app — no real terms.')}
            rightIcon="chevron-right"
          />
          <Item
            icon="information-outline"
            color={colors.textMuted}
            label="About"
            colors={colors}
            onPress={() => Alert.alert('About', 'Shop With Faisu v1.0.0 — Demo mobile app.')}
            rightIcon="chevron-right"
          />
        </View>

        <TouchableOpacity
          onPress={onLogout}
          style={[styles.logoutBtn, { borderColor: colors.danger, backgroundColor: colors.surface }]}
        >
          <MaterialCommunityIcons name="logout" size={18} color={colors.danger} />
          <Text style={{ color: colors.danger, fontSize: 14, fontWeight: '700' }}>Log out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textSubtle }]}>Shop With Faisu v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const Stat: React.FC<{ label: string; value: string; icon: string; colors: any }> = ({
  label, value, icon, colors,
}) => (
  <View style={styles.stat}>
    <MaterialCommunityIcons name={icon as any} size={20} color={colors.primary} />
    <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 4 }}>{value}</Text>
    <Text style={{ color: colors.textMuted, fontSize: 11 }}>{label}</Text>
  </View>
);

const Item: React.FC<{
  icon: string;
  color: string;
  label: string;
  colors: any;
  onPress?: () => void;
  rightIcon?: string;
  rightLabel?: string;
}> = ({ icon, color, label, colors, onPress, rightIcon, rightLabel }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { borderColor: colors.border }]}
    disabled={!onPress}
  >
    <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
      <MaterialCommunityIcons name={icon as any} size={18} color={color} />
    </View>
    <Text style={{ flex: 1, color: colors.text, fontSize: 14, fontWeight: '600' }}>{label}</Text>
    {rightLabel ? (
      <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600' }}>{rightLabel}</Text>
    ) : null}
    {rightIcon ? <MaterialCommunityIcons name={rightIcon as any} size={18} color={colors.textSubtle} /> : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 12,
  },
  email: {
    fontSize: 13,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 18,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
  },
  group: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
    marginHorizontal: 24,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    height: 54,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
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
    marginHorizontal: 16,
    marginTop: 24,
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
