import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: string;
}

export const SectionHeader: React.FC<Props> = ({ title, subtitle, actionLabel, onAction, style, icon }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>
        {icon ? (
          <MaterialCommunityIcons name={icon as any} size={20} color={colors.primary} />
        ) : null}
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text> : null}
        </View>
      </View>
      {actionLabel && onAction ? (
        <Text onPress={onAction} style={[styles.action, { color: colors.primary }]}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  action: {
    fontSize: 13,
    fontWeight: '700',
  },
});
