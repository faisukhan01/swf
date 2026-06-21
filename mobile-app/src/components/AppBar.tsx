import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme';
import { CartButton } from './CartButton';

interface Props {
  title: string;
  showBack?: boolean;
  showCart?: boolean;
  rightIcon?: string;
  onRightPress?: () => void;
  subtitle?: string;
  transparent?: boolean;
}

export const AppBar: React.FC<Props> = ({
  title,
  showBack = false,
  showCart = true,
  rightIcon,
  onRightPress,
  subtitle,
  transparent,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: transparent ? 'transparent' : colors.surface,
          borderBottomColor: colors.border,
          paddingTop: insets.top,
        },
        transparent ? null : { borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity
            hitSlop={12}
            onPress={() => nav.goBack()}
            style={styles.iconBtn}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.right}>
          {rightIcon && onRightPress ? (
            <TouchableOpacity hitSlop={10} onPress={onRightPress} style={styles.iconBtn}>
              <MaterialCommunityIcons name={rightIcon as any} size={22} color={colors.text} />
            </TouchableOpacity>
          ) : null}
          {showCart ? <CartButton /> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  row: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    marginLeft: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
