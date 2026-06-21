import { TextStyle } from 'react-native';

export const fontFamily = 'System';

export const typography = {
  h1: { fontFamily, fontSize: 28, fontWeight: '700', lineHeight: 34 } as TextStyle,
  h2: { fontFamily, fontSize: 22, fontWeight: '700', lineHeight: 28 } as TextStyle,
  h3: { fontFamily, fontSize: 18, fontWeight: '600', lineHeight: 24 } as TextStyle,
  title: { fontFamily, fontSize: 16, fontWeight: '600', lineHeight: 22 } as TextStyle,
  body: { fontFamily, fontSize: 14, fontWeight: '400', lineHeight: 20 } as TextStyle,
  bodyStrong: { fontFamily, fontSize: 14, fontWeight: '600', lineHeight: 20 } as TextStyle,
  caption: { fontFamily, fontSize: 12, fontWeight: '400', lineHeight: 16 } as TextStyle,
  captionStrong: { fontFamily, fontSize: 12, fontWeight: '600', lineHeight: 16 } as TextStyle,
  micro: { fontFamily, fontSize: 10, fontWeight: '600', lineHeight: 12 } as TextStyle,
  button: { fontFamily, fontSize: 15, fontWeight: '600', lineHeight: 20 } as TextStyle,
  price: { fontFamily, fontSize: 16, fontWeight: '700', lineHeight: 20 } as TextStyle,
} as const;
