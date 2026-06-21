import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/store/useAuthStore';

type Mode = 'login' | 'signup';

export const AuthScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (mode === 'signup' && name.trim().length < 2) e.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email);
      } else {
        await signup(name.trim(), email);
      }
      nav.replace('MainTabs', { screen: 'Home' });
    } catch {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="shopping" size={30} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Shop With Faisu!!</Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>
            Shop smart, live better
          </Text>
        </View>

        <View style={[styles.tabs, { backgroundColor: colors.surfaceAlt }]}>
          {(['login', 'signup'] as Mode[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => {
                setMode(m);
                setErrors({});
              }}
              style={[
                styles.tab,
                {
                  backgroundColor: mode === m ? colors.primary : 'transparent',
                },
              ]}
            >
              <Text
                style={{
                  color: mode === m ? '#fff' : colors.textMuted,
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                {m === 'login' ? 'Login' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          {mode === 'signup' && (
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Full name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Jane Doe"
                placeholderTextColor={colors.textSubtle}
                style={inputStyle}
              />
              {errors.name ? <Text style={styles.err}>{errors.name}</Text> : null}
            </View>
          )}

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textSubtle}
              keyboardType="email-address"
              autoCapitalize="none"
              style={inputStyle}
            />
            {errors.email ? <Text style={styles.err}>{errors.email}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Password</Text>
            <View style={[styles.pwWrap, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••"
                placeholderTextColor={colors.textSubtle}
                secureTextEntry={!show}
                style={[styles.input, { flex: 1, borderWidth: 0, backgroundColor: 'transparent', color: colors.text }]}
              />
              <TouchableOpacity onPress={() => setShow((v) => !v)} hitSlop={8} style={{ paddingHorizontal: 12 }}>
                <MaterialCommunityIcons
                  name={show ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.err}>{errors.password}</Text> : null}
          </View>

          {mode === 'login' ? (
            <Text style={[styles.forgot, { color: colors.primary }]}>Forgot password?</Text>
          ) : null}

          <TouchableOpacity
            onPress={submit}
            disabled={busy}
            activeOpacity={0.85}
            style={[styles.submit, { backgroundColor: colors.primary, opacity: busy ? 0.7 : 1 }]}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>
                {mode === 'login' ? 'Login' : 'Create account'}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={[styles.footHint, { color: colors.textSubtle }]}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Text
              style={{ color: colors.primary, fontWeight: '700' }}
              onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </Text>
          </Text>

          <Text style={[styles.note, { color: colors.textSubtle }]}>
            Demo app — any valid email/password will log you in.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  tagline: {
    fontSize: 13,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  pwWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  err: {
    color: '#ef4444',
    fontSize: 11,
    marginLeft: 2,
  },
  forgot: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: -4,
  },
  submit: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footHint: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  note: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
