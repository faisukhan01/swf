import React from 'react';
import { TouchableOpacity, TextInput, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  style?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
  leftIcon?: string;
  returnKeyType?: 'search' | 'done' | 'go';
}

export const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = 'Search products...',
  onSubmit,
  onClear,
  onFocus,
  style,
  autoFocus,
  leftIcon = 'magnify',
  returnKeyType = 'search',
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
        style,
      ]}
    >
      <MaterialCommunityIcons name={leftIcon as any} size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        autoFocus={autoFocus}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmit}
        onFocus={onFocus}
        style={[styles.input, { color: colors.text }]}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
});
