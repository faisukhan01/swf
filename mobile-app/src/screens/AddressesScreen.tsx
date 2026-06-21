import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
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
import { AppBar } from '@/components/AppBar';
import { EmptyState } from '@/components/EmptyState';
import { Address } from '@/types';

export const AddressesScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const addresses = useAuthStore((s) => s.addresses);
  const addAddress = useAuthStore((s) => s.addAddress);
  const updateAddress = useAuthStore((s) => s.updateAddress);
  const removeAddress = useAuthStore((s) => s.removeAddress);
  const setDefault = useAuthStore((s) => s.setDefaultAddress);

  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const reset = () => {
    setName(''); setPhone(''); setLine1(''); setLine2('');
    setCity(''); setState(''); setZip(''); setIsDefault(false);
    setEditing(null);
  };

  const openAdd = () => {
    reset();
    setShowForm(true);
  };

  const openEdit = (a: Address) => {
    setEditing(a);
    setName(a.name); setPhone(a.phone); setLine1(a.line1); setLine2(a.line2 ?? '');
    setCity(a.city); setState(a.state); setZip(a.zip); setIsDefault(!!a.isDefault);
    setShowForm(true);
  };

  const validate = (): boolean => {
    if (name.trim().length < 2) { Alert.alert('Invalid', 'Enter a valid name.'); return false; }
    if (phone.trim().length < 7) { Alert.alert('Invalid', 'Enter a valid phone number.'); return false; }
    if (!line1.trim()) { Alert.alert('Invalid', 'Address line 1 is required.'); return false; }
    if (!city.trim() || !state.trim() || !zip.trim()) { Alert.alert('Invalid', 'City, state and ZIP are required.'); return false; }
    return true;
  };

  const onSave = () => {
    if (!validate()) return;
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      line1: line1.trim(),
      line2: line2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
      isDefault,
    };
    if (editing) {
      updateAddress(editing.id, payload);
    } else {
      addAddress(payload);
    }
    setShowForm(false);
    reset();
  };

  const onDelete = (a: Address) => {
    Alert.alert('Remove address', `Remove ${a.name}'s address?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeAddress(a.id) },
    ]);
  };

  if (showForm) {
    const inputStyle = [
      styles.input,
      { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text },
    ];
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar title={editing ? 'Edit address' : 'Add address'} showBack showCart={false} onRightPress={onSave} rightIcon="check" />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          <Field label="Full name" colors={colors}>
            <TextInput value={name} onChangeText={setName} placeholder="Jane Doe" placeholderTextColor={colors.textSubtle} style={inputStyle} />
          </Field>
          <Field label="Phone" colors={colors}>
            <TextInput value={phone} onChangeText={setPhone} placeholder="+1 555 0100" placeholderTextColor={colors.textSubtle} keyboardType="phone-pad" style={inputStyle} />
          </Field>
          <Field label="Address line 1" colors={colors}>
            <TextInput value={line1} onChangeText={setLine1} placeholder="Street address" placeholderTextColor={colors.textSubtle} style={inputStyle} />
          </Field>
          <Field label="Address line 2 (optional)" colors={colors}>
            <TextInput value={line2} onChangeText={setLine2} placeholder="Apt, suite, etc." placeholderTextColor={colors.textSubtle} style={inputStyle} />
          </Field>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field label="City" colors={colors} style={{ flex: 1 }}>
              <TextInput value={city} onChangeText={setCity} placeholder="City" placeholderTextColor={colors.textSubtle} style={inputStyle} />
            </Field>
            <Field label="State" colors={colors} style={{ flex: 1 }}>
              <TextInput value={state} onChangeText={setState} placeholder="State" placeholderTextColor={colors.textSubtle} style={inputStyle} />
            </Field>
          </View>
          <Field label="ZIP" colors={colors}>
            <TextInput value={zip} onChangeText={setZip} placeholder="12345" placeholderTextColor={colors.textSubtle} keyboardType="numeric" style={inputStyle} />
          </Field>

          <View style={[styles.defaultRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <View>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>Set as default</Text>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>Default address is preselected at checkout</Text>
            </View>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity onPress={onSave} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
              {editing ? 'Update address' : 'Save address'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title="Addresses" showBack showCart={false} rightIcon="plus" onRightPress={openAdd} />
      {addresses.length === 0 ? (
        <EmptyState
          icon="map-marker-plus"
          title="No addresses yet"
          subtitle="Add a delivery address to speed up checkout."
          ctaLabel="Add address"
          onCta={openAdd}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
          {addresses.map((a) => (
            <View key={a.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>{a.name}</Text>
                {a.isDefault ? (
                  <View style={[styles.defaultTag, { backgroundColor: colors.primary }]}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>DEFAULT</Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 6, lineHeight: 17 }}>
                {a.line1}{a.line2 ? `, ${a.line2}` : ''},{'\n'}
                {a.city}, {a.state} {a.zip}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>{a.phone}</Text>

              <View style={[styles.row, { gap: 10, marginTop: 12 }]}>
                <TouchableOpacity
                  onPress={() => openEdit(a)}
                  style={[styles.miniBtn, { borderColor: colors.primary }]}
                >
                  <MaterialCommunityIcons name="pencil" size={14} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Edit</Text>
                </TouchableOpacity>
                {!a.isDefault ? (
                  <TouchableOpacity
                    onPress={() => setDefault(a.id)}
                    style={[styles.miniBtn, { borderColor: colors.border }]}
                  >
                    <MaterialCommunityIcons name="star-outline" size={14} color={colors.textMuted} />
                    <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '700' }}>Set default</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  onPress={() => onDelete(a)}
                  style={[styles.miniBtn, { borderColor: colors.danger }]}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={14} color={colors.danger} />
                  <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={openAdd}
            style={[styles.addBtn, { borderColor: colors.primary, backgroundColor: colors.primarySoft }]}
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '700' }}>Add new address</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const Field: React.FC<{ label: string; colors: any; children: React.ReactNode; style?: any }> = ({
  label, children, style,
}) => (
  <View style={[{ gap: 6, marginBottom: 12 }, style]}>
    <Text style={{ fontSize: 12, fontWeight: '600', color: label ? undefined : undefined }}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
    marginBottom: 18,
  },
  saveBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  miniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 8,
  },
});
