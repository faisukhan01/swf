import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Category } from '@/types';

interface Props {
  category: Category | { id: 'all'; name: string; icon: string; color: string };
  active: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const CategoryPill: React.FC<Props> = ({ category, active, onPress, style }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.pill,
        {
          backgroundColor: active ? category.color : colors.surface,
          borderColor: active ? category.color : colors.border,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={category.icon as any}
        size={18}
        color={active ? '#fff' : category.color}
      />
      <Text
        style={[
          styles.label,
          {
            color: active ? '#fff' : colors.text,
          },
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
