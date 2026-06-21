import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/theme';
import { AppBar } from '@/components/AppBar';
import { PriceTag } from '@/components/PriceTag';
import { productMap } from '@/data/products';
import { categoryMap } from '@/data/categories';
import { ReviewInput } from '@/types';

const TITLE_MAX = 60;
const BODY_MIN = 20;
const BODY_MAX = 1000;
const TITLE_MIN = 3;

const RATING_LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export const WriteReviewScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const productId: string = route.params?.productId ?? '';
  const product = productMap[productId];

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!product) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar title="Write a Review" showBack showCart={false} />
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>
            This product is no longer available.
          </Text>
        </View>
      </View>
    );
  }

  const validate = (): string | null => {
    if (rating <= 0) return 'Please tap a star to give your overall rating.';
    if (title.trim().length < TITLE_MIN) return `Title must be at least ${TITLE_MIN} characters.`;
    if (body.trim().length < BODY_MIN) return `Your review must be at least ${BODY_MIN} characters.`;
    return null;
  };

  const onSubmit = () => {
    const err = validate();
    if (err) {
      Alert.alert('Almost there', err);
      return;
    }
    setSubmitting(true);
    const payload: ReviewInput = {
      productId: product.id,
      rating,
      title: title.trim(),
      body: body.trim(),
      recommend: recommend ?? undefined,
    };
    // Mock submission — in a real app this would POST to the backend.
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Review submitted',
        `Thanks for reviewing ${product.name}! Your ${rating}-star feedback helps other shoppers.`,
        [{ text: 'Done', onPress: () => nav.goBack() }]
      );
      // eslint-disable-next-line no-console
      console.log('[review] submitted', payload);
    }, 450);
  };

  const onPickPhoto = () => {
    Keyboard.dismiss();
    Alert.alert(
      'Photo attachments',
      'Photo upload is a demo placeholder. In the production build you would pick from your gallery or camera here.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar title="Write a Review" showBack showCart={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 96 }}
      >
        {/* Product summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ExpoImage source={product.images[0]} style={styles.thumb} contentFit="cover" />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
              {categoryMap[product.categoryId]?.name}
            </Text>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }} numberOfLines={2}>
              {product.name}
            </Text>
            <PriceTag price={product.price} oldPrice={product.oldPrice} size="sm" />
          </View>
        </View>

        {/* Overall rating */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Overall rating</Text>
          <View style={[styles.starRow, { gap: 6 }]}>
            {[1, 2, 3, 4, 5].map((n) => {
              const filled = n <= rating;
              return (
                <TouchableOpacity
                  key={n}
                  hitSlop={8}
                  onPress={() => setRating(n)}
                  style={styles.starBtn}
                >
                  <MaterialCommunityIcons
                    name={filled ? 'star' : 'star-outline'}
                    size={36}
                    color={filled ? colors.star : colors.textSubtle}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={[styles.ratingLabel, { color: rating > 0 ? colors.text : colors.textSubtle }]}>
            {rating > 0 ? RATING_LABELS[rating - 1] : 'Tap a star to rate'}
          </Text>
        </View>

        {/* Title */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.labelRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Review title</Text>
            <Text style={[styles.counter, { color: colors.textSubtle }]}>
              {title.length}/{TITLE_MAX}
            </Text>
          </View>
          <TextInput
            value={title}
            onChangeText={(t) => setTitle(t.slice(0, TITLE_MAX))}
            placeholder="Summarize your experience"
            placeholderTextColor={colors.textSubtle}
            style={[
              styles.input,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text },
            ]}
            maxLength={TITLE_MAX}
          />
        </View>

        {/* Body */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.labelRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Your review</Text>
            <Text style={[styles.counter, { color: colors.textSubtle }]}>
              {body.length}/{BODY_MAX}
            </Text>
          </View>
          <TextInput
            value={body}
            onChangeText={(t) => setBody(t.slice(0, BODY_MAX))}
            placeholder={`Tell others what you liked (minimum ${BODY_MIN} characters)`}
            placeholderTextColor={colors.textSubtle}
            multiline
            style={[
              styles.textarea,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text },
            ]}
            maxLength={BODY_MAX}
          />
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Mention fit, quality, value, or anything that surprised you.
          </Text>
        </View>

        {/* Recommend */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Would you recommend this?</Text>
          <Text style={[styles.hint, { color: colors.textMuted, marginBottom: 10 }]}>
            Optional — helps other shoppers decide.
          </Text>
          <View style={styles.segmentRow}>
            <SegmentBtn
              colors={colors}
              label="Yes"
              icon="thumb-up-outline"
              active={recommend === true}
              onPress={() => setRecommend(true)}
            />
            <SegmentBtn
              colors={colors}
              label="No"
              icon="thumb-down-outline"
              active={recommend === false}
              onPress={() => setRecommend(false)}
            />
            <SegmentBtn
              colors={colors}
              label="Skip"
              icon="minus-circle-outline"
              active={recommend === null}
              onPress={() => setRecommend(null)}
            />
          </View>
        </View>

        {/* Photos */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Add photos (optional)</Text>
          <Text style={[styles.hint, { color: colors.textMuted, marginBottom: 10 }]}>
            Up to 3 photos. Shoppers love seeing real shots.
          </Text>
          <View style={[styles.photoRow, { gap: 10 }]}>
            {[0, 1, 2].map((i) => (
              <TouchableOpacity
                key={i}
                onPress={onPickPhoto}
                activeOpacity={0.7}
                style={[
                  styles.photoSlot,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
              >
                <MaterialCommunityIcons name="camera-plus-outline" size={22} color={colors.textSubtle} />
                <Text style={[styles.photoLabel, { color: colors.textSubtle }]}>Add</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom submit bar */}
      <View
        style={[
          styles.submitBar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <TouchableOpacity
          onPress={onSubmit}
          disabled={submitting}
          activeOpacity={0.85}
          style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.6 : 1 }]}
        >
          <MaterialCommunityIcons name="send-outline" size={18} color="#fff" />
          <Text style={styles.submitText}>{submitting ? 'Submitting…' : 'Submit Review'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SegmentBtn: React.FC<{
  colors: any;
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}> = ({ colors, label, icon, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      styles.segmentBtn,
      {
        backgroundColor: active ? colors.primary : colors.surfaceAlt,
        borderColor: active ? colors.primary : colors.border,
      },
    ]}
  >
    <MaterialCommunityIcons name={icon as any} size={16} color={active ? '#fff' : colors.textMuted} />
    <Text style={{ color: active ? '#fff' : colors.text, fontSize: 13, fontWeight: '700' }}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    marginBottom: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  counter: {
    fontSize: 11,
    fontWeight: '600',
  },
  input: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  textarea: {
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500',
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  hint: {
    fontSize: 11,
    marginTop: 6,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  starBtn: {
    padding: 4,
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoRow: {
    flexDirection: 'row',
  },
  photoSlot: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  submitBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});
