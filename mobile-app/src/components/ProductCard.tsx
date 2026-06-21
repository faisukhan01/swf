import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Product } from '@/types';
import { PriceTag } from './PriceTag';
import { Badge } from './Badge';
import { RatingStars } from './RatingStars';
import { useWishlistStore } from '@/store/useWishlistStore';

interface Props {
  product: Product;
  onPress?: (p: Product) => void;
  style?: 'card' | 'row';
}

const { width } = Dimensions.get('window');
// 2-col grid with 16px outer + 16 gap
export const CARD_W = (width - 16 * 3) / 2;

export const ProductCard: React.FC<Props> = ({ product, onPress, style = 'card' }) => {
  const { colors } = useTheme();
  const has = useWishlistStore((s) => s.ids.includes(product.id));
  const toggle = useWishlistStore((s) => s.toggle);

  if (style === 'row') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress?.(product)}
        style={[rowStyles.wrap, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <ExpoImage
          source={product.images[0]}
          style={rowStyles.image}
          contentFit="cover"
          transition={150}
        />
        <View style={rowStyles.body}>
          <Text style={[rowStyles.name, { color: colors.text }]} numberOfLines={2}>
            {product.name}
          </Text>
          <RatingStars rating={product.rating} size={12} reviewCount={product.reviewCount} />
          <View style={rowStyles.row}>
            <PriceTag price={product.price} oldPrice={product.oldPrice} size="sm" />
            {product.badge ? <Badge text={product.badge} /> : null}
          </View>
        </View>
        <TouchableOpacity
          hitSlop={10}
          onPress={() => toggle(product.id)}
          style={rowStyles.heart}
        >
          <MaterialCommunityIcons
            name={has ? 'heart' : 'heart-outline'}
            size={20}
            color={has ? colors.danger : colors.textMuted}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(product)}
      style={[cardStyles.wrap, { backgroundColor: colors.surface, borderColor: colors.border }, { width: CARD_W }]}
    >
      <View style={cardStyles.imageWrap}>
        <ExpoImage
          source={product.images[0]}
          style={cardStyles.image}
          contentFit="cover"
          transition={150}
        />
        {product.badge ? (
          <View style={cardStyles.badge}>
            <Badge text={product.badge} />
          </View>
        ) : null}
        <TouchableOpacity
          hitSlop={10}
          onPress={() => toggle(product.id)}
          style={[cardStyles.heart, { backgroundColor: colors.surface }]}
        >
          <MaterialCommunityIcons
            name={has ? 'heart' : 'heart-outline'}
            size={18}
            color={has ? colors.danger : colors.textMuted}
          />
        </TouchableOpacity>
      </View>
      <View style={cardStyles.body}>
        <Text style={[cardStyles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <RatingStars rating={product.rating} size={12} showValue={false} />
        <PriceTag price={product.price} oldPrice={product.oldPrice} size="sm" />
      </View>
    </TouchableOpacity>
  );
};

const cardStyles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 170,
    backgroundColor: '#f1f5f9',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  body: {
    padding: 10,
    gap: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    minHeight: 34,
    lineHeight: 17,
  },
});

const rowStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    padding: 10,
    gap: 10,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heart: {
    alignSelf: 'flex-start',
    padding: 4,
  },
});
