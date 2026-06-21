# Shop With Faisu!! 🛍️

> **Shop smart, live better** — a complete, real, runnable React Native (Expo + TypeScript) ecommerce mobile app, with mock data so it runs anywhere, no backend required.

This project is the source code for the **Shop With Faisu!!** shopping app. It boots in any Expo-compatible environment (`npx expo start` + Expo Go on Android, or any iOS/Android emulator).

> **Note about the icons/splash PNGs:** The files in `assets/` are tiny 1×1 placeholder PNGs so that the project loads cleanly. Replace them with real 1024×1024 icon and 1242×2436 splash artwork before publishing.

---

## ✨ Features

- **Splash & Onboarding** — animated brand splash, 3-slide onboarding carousel with pagination dots.
- **Auth (Login / Signup)** — tabbed forms with validation; mock auth persisted to AsyncStorage.
- **Home** — personalized greeting, search bar, banner carousel, category circles, flash deals, trending grid, recommended for you. Pull-to-refresh.
- **Shop** — category chips, sort bottom sheet (popular / price asc / desc / rating / newest), filter bottom sheet (max price + min rating), inline search, responsive 2-col grid, empty state.
- **Product Detail** — swipeable image gallery with dots, badge, color & size variants, quantity stepper, description, reviews list with rating breakdown, sticky Add-to-cart / Buy-now / wishlist bar.
- **Search** — recent searches (persisted in-memory), trending searches, popular categories, live debounced results.
- **Cart** — quantity steppers, per-variant line items, coupon input with validation (4 demo coupons), order summary, sticky checkout bar, empty state.
- **Checkout** — address selector, payment method (COD / Card / Wallet), coupon summary, place-order with simulated network delay.
- **Order Success** — animated checkmark, order number, ETA, view-order & continue-shopping CTAs.
- **Orders / Order Detail** — past orders list with status tags, status timeline, address, payment, full breakdown.
- **Wishlist** — grid of saved products, move-to-cart, remove, empty state.
- **Profile** — avatar + stats, menu (Orders, Addresses, Wishlist, Notifications), **dark mode toggle** (persists), help, logout.
- **Addresses** — list + add/edit form with full validation, default toggle, delete.
- **Notifications** — promo/order/system notifications with read state, mark-all-read.
- **Dark mode** — toggle in Profile, persisted to AsyncStorage; full theme swap across all screens.
- **Persistence** — cart, wishlist, theme, auth user & addresses all persisted via AsyncStorage (Zustand persist middleware).

---

## 🚀 How to run

> Requirements: **Node 18+**, npm (or yarn / bun), and the **Expo Go** app on your Android phone (or an emulator).

### 1. Install dependencies

```bash
cd mobile-app
npm install
# or: yarn install / bun install
```

### 2. Start the Expo dev server

```bash
npx expo start
```

This prints a QR code in your terminal and starts the Metro bundler.

### 3. Open on Android (Expo Go)

1. Install **Expo Go** from the Google Play Store.
2. Open Expo Go and **scan the QR code** printed in the terminal.
   - On some devices you may need to enable "Scan QR code" from the camera app.
3. The app bundle will download and the **Shop With Faisu!!** splash screen should appear, then Onboarding.

### Other platforms

```bash
npx expo start --android    # open on a connected Android emulator
npx expo start --ios        # open on an iOS simulator (macOS only)
npx expo start --web        # run in a browser (some RN modules are mocked)
```

---

## 🧱 Tech stack

| Concern                | Choice |
|------------------------|--------|
| Framework              | **Expo SDK ~52** + **React Native** + **TypeScript 5** (strict) |
| Navigation             | **React Navigation v6/v7** — Native Stack + Bottom Tabs |
| State management       | **Zustand** (with `persist` middleware) — cart, wishlist, auth, theme, UI |
| Persistence            | **@react-native-async-storage/async-storage** |
| Icons                  | **@expo/vector-icons** — `MaterialCommunityIcons` |
| Images                 | **expo-image** (fast, cached, crossfade) |
| Animations             | React Native `Animated` (splash & success animations) |
| Safe area / gestures   | `react-native-safe-area-context`, `react-native-screens`, `react-native-gesture-handler`, `react-native-reanimated` |
| Mock data layer        | `src/data/` (catalog of 24+ products across 8 categories) + `src/services/api.ts` (Promise-returning mock functions with simulated network delay) |

No backend, no API keys — runs offline once installed.

---

## 📁 Folder structure

```
mobile-app/
  package.json
  app.json
  tsconfig.json
  babel.config.js
  App.tsx
  README.md
  assets/
    icon.png          # placeholder — replace with real 1024×1024
    splash.png        # placeholder — replace with real artwork
  src/
    types/index.ts                # Product, Category, CartItem, Order, Address, Review, User, Coupon, Banner, etc.
    theme/
      colors.ts                   # emerald primary, amber accent, light & dark palettes
      spacing.ts
      typography.ts
      index.tsx                   # ThemeProvider + useTheme() hook
    data/
      products.ts                 # 24+ products across 8 categories (Unsplash image URLs)
      categories.ts               # 8 categories with icon + color
      banners.ts                  # 3 promotional banners
      reviews.ts                  # sample reviews
    store/
      useCartStore.ts             # cart with persist
      useWishlistStore.ts         # wishlist with persist
      useAuthStore.ts             # auth user + addresses with persist
      useThemeStore.ts            # dark mode with persist (null = follow system)
      useUIStore.ts               # search query, filters, selected category (session only)
    services/
      api.ts                      # mock async functions: getProducts, searchProducts, placeOrder, getOrders, coupons, etc.
      format.ts                   # price/date helpers
    components/
      AppBar.tsx
      BottomNav.tsx
      ProductCard.tsx
      ProductGrid.tsx
      CategoryPill.tsx
      SearchBar.tsx
      RatingStars.tsx
      Badge.tsx
      CartButton.tsx
      EmptyState.tsx
      PriceTag.tsx
      SectionHeader.tsx
      BannerCarousel.tsx
      QuantityStepper.tsx
      ReviewItem.tsx
      LoadingShimmer.tsx
    navigation/
      RootNavigator.tsx           # Native Stack with all screens
      MainTabs.tsx                # Bottom Tabs (Home, Shop, Cart, Wishlist, Profile)
      screenOptions.ts
    screens/
      SplashScreen.tsx
      OnboardingScreen.tsx
      AuthScreen.tsx              # login + signup tabs
      HomeScreen.tsx
      ShopScreen.tsx              # category + sort + filter + search
      ProductDetailScreen.tsx
      SearchScreen.tsx
      CartScreen.tsx
      CheckoutScreen.tsx
      OrderSuccessScreen.tsx
      OrdersScreen.tsx
      OrderDetailScreen.tsx
      WishlistScreen.tsx
      ProfileScreen.tsx
      AddressesScreen.tsx
      NotificationsScreen.tsx
```

---

## 🎨 Design system

- **Primary**: emerald `#10b981`
- **Accent**: amber `#f59e0b`
- **Neutral**: slate grays (`#0f172a` → `#f8fafc`)
- **Cards**: radius 16, soft shadow on iOS, elevation on Android
- **Bottom tab nav**: Home · Shop · Cart (badge) · Wishlist · Profile — MaterialCommunityIcons
- **Sticky bottom action bars** on Cart, ProductDetail, Checkout
- **44px minimum touch targets**, touchable-opacity press feedback everywhere
- **Dark mode** swaps full palette; persisted across launches

---

## 🧪 Demo coupons

| Code         | Effect |
|--------------|--------|
| `FAISU10`    | 10% off orders over $50 |
| `FAISU25`    | 25% off orders over $150 |
| `WELCOME15`  | $15 off orders over $75 |
| `FREESHIP`   | $5 shipping credit on orders over $35 |

---

## 📝 Notes & assumptions

- This is a **source-code only** deliverable. The sandbox does not contain an Android/Gradle build toolchain, so a `.apk` cannot be compiled here. To run on a real device, install the project on any machine with Node and follow the steps above.
- All product images are loaded from `images.unsplash.com` (real photo IDs relevant to each product). If any Unsplash ID fails to load on a constrained network, image cells still render the surrounding card correctly.
- Orders are kept in-memory for the session via `src/services/api.ts`. For real persistence you would persist the `_orders` array to AsyncStorage (left out to keep the demo minimal).
- Auth is intentionally mock — any valid email + 6+ char password will "log you in" and persist a fake user.
