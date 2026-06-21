// Default editable text strings for the app.
// Admin can override any of these via the Text Content section in the admin panel.

export const defaultTexts = {
  // Home
  greetingSignedOut: "Hey Cutie Pookie 👋",
  greetingSignedOutSub: "Sign in to shop!!",
  greetingSignedInPrefix: "Good morning,",
  sectionCategories: "Categories",
  sectionFlashDeals: "⚡ Flash Deals",
  sectionTrending: "Trending Now",
  sectionRecentlyViewed: "Recently Viewed",
  searchPlaceholder: "Search products, brands...",
  seeAll: "See all",

  // Cart
  cartEmptyTitle: "Your cart is empty",
  cartEmptySub: "Add products to start shopping",
  cartBrowseButton: "Browse Products",
  proceedToCheckout: "Proceed to Checkout",
  subtotal: "Subtotal",
  shipping: "Shipping",
  total: "Total",
  promoCode: "Promo Code",
  apply: "Apply",

  // Checkout
  deliveryAddress: "Delivery Address",
  paymentMethod: "Payment Method",
  billSummary: "Bill Summary",
  placeOrder: "Place Order",

  // Wishlist
  wishlistEmptyTitle: "No favorites yet",
  wishlistEmptySub: "Tap the heart on products to save them",

  // Orders
  ordersEmptyTitle: "No orders yet",
  ordersEmptySub: "Your orders will appear here",

  // Profile (signed out)
  profileWelcomePrefix: "Welcome to",
  profileWelcomeSub: "Sign in to sync your cart, orders & wishlist across devices",
  signInButton: "Sign In",
  signUpButton: "Create Account",

  // Auth
  signInTitle: "Welcome back",
  signInSub: "Sign in to continue shopping",
  signUpTitle: "Join",
  signUpSub: "Create an account to start your shopping journey",
  emailLabel: "Email",
  passwordLabel: "Password",
  nameLabel: "Full Name",
  signOutButton: "Sign Out",

  // Misc
  addToCart: "Add to Cart",
  buyNow: "Buy Now",
  writeReview: "Write a Review",
  reviews: "Reviews",
  description: "Description",
} as const;

export type AppTexts = typeof defaultTexts;

export type TextKey = keyof AppTexts;

// All editable text keys with labels for the admin UI
export const textLabels: { key: TextKey; label: string; group: string }[] = [
  { key: "greetingSignedOut", label: "Home greeting (signed out)", group: "Home" },
  { key: "greetingSignedOutSub", label: "Home greeting subtitle (signed out)", group: "Home" },
  { key: "greetingSignedInPrefix", label: "Home greeting prefix (signed in, before name)", group: "Home" },
  { key: "sectionCategories", label: "Categories section title", group: "Home" },
  { key: "sectionFlashDeals", label: "Flash Deals section title", group: "Home" },
  { key: "sectionTrending", label: "Trending Now section title", group: "Home" },
  { key: "sectionRecentlyViewed", label: "Recently Viewed section title", group: "Home" },
  { key: "searchPlaceholder", label: "Search bar placeholder", group: "Home" },
  { key: "seeAll", label: "See all link", group: "Home" },
  { key: "cartEmptyTitle", label: "Cart empty title", group: "Cart" },
  { key: "cartEmptySub", label: "Cart empty subtitle", group: "Cart" },
  { key: "cartBrowseButton", label: "Cart browse button", group: "Cart" },
  { key: "proceedToCheckout", label: "Proceed to checkout button", group: "Cart" },
  { key: "subtotal", label: "Subtotal label", group: "Cart" },
  { key: "shipping", label: "Shipping label", group: "Cart" },
  { key: "total", label: "Total label", group: "Cart" },
  { key: "promoCode", label: "Promo code label", group: "Cart" },
  { key: "apply", label: "Apply button", group: "Cart" },
  { key: "deliveryAddress", label: "Delivery address heading", group: "Checkout" },
  { key: "paymentMethod", label: "Payment method heading", group: "Checkout" },
  { key: "billSummary", label: "Bill summary heading", group: "Checkout" },
  { key: "placeOrder", label: "Place order button", group: "Checkout" },
  { key: "wishlistEmptyTitle", label: "Wishlist empty title", group: "Wishlist" },
  { key: "wishlistEmptySub", label: "Wishlist empty subtitle", group: "Wishlist" },
  { key: "ordersEmptyTitle", label: "Orders empty title", group: "Orders" },
  { key: "ordersEmptySub", label: "Orders empty subtitle", group: "Orders" },
  { key: "profileWelcomePrefix", label: "Profile welcome prefix (before app name)", group: "Profile" },
  { key: "profileWelcomeSub", label: "Profile welcome subtitle", group: "Profile" },
  { key: "signInButton", label: "Sign in button", group: "Profile" },
  { key: "signUpButton", label: "Create account button", group: "Profile" },
  { key: "signInTitle", label: "Sign in page title", group: "Auth" },
  { key: "signInSub", label: "Sign in page subtitle", group: "Auth" },
  { key: "signUpTitle", label: "Sign up page title prefix", group: "Auth" },
  { key: "signUpSub", label: "Sign up page subtitle", group: "Auth" },
  { key: "emailLabel", label: "Email label", group: "Auth" },
  { key: "passwordLabel", label: "Password label", group: "Auth" },
  { key: "nameLabel", label: "Name label", group: "Auth" },
  { key: "signOutButton", label: "Sign out button", group: "Auth" },
  { key: "addToCart", label: "Add to cart button", group: "Product" },
  { key: "buyNow", label: "Buy now button", group: "Product" },
  { key: "writeReview", label: "Write a review button", group: "Product" },
  { key: "reviews", label: "Reviews heading", group: "Product" },
  { key: "description", label: "Description heading", group: "Product" },
];

export function mergeTexts(overrides: Record<string, string> | null): AppTexts {
  if (!overrides) return { ...defaultTexts } as AppTexts;
  return { ...defaultTexts, ...overrides } as AppTexts;
}
