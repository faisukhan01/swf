import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { palette } from '@/theme/colors';

export const SplashScreen: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const spinRef = useRef(new Animated.Value(0));
  const fadeRef = useRef(new Animated.Value(0));

  useEffect(() => {
    const spin = spinRef.current;
    const fade = fadeRef.current;
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    const t = setTimeout(() => {
      // For this mock app we just go to Onboarding on every launch.
      nav.replace('Onboarding');
    }, 1700);
    return () => clearTimeout(t);
  }, [nav]);

  const fade = fadeRef.current;
  const spin = spinRef.current;

  return (
    <View style={[styles.wrap, { backgroundColor: palette.emerald, paddingTop: insets.top }]}>
      <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
        <View style={styles.logoWrap}>
          <MaterialCommunityIcons name="shopping" size={56} color="#fff" />
        </View>
        <Text style={styles.title}>Shop With Faisu!!</Text>
        <Text style={styles.tagline}>Shop smart, live better</Text>
      </Animated.View>

      <View style={styles.loaderWrap}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: spin.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <MaterialCommunityIcons name="loading" size={28} color="#fff" />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    width: 110,
    height: 110,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    marginTop: 6,
  },
  loaderWrap: {
    position: 'absolute',
    bottom: 60,
  },
});
