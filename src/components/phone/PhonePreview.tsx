"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Heart, ShoppingBag, Home, LayoutGrid, User, ChevronLeft, Star,
  Plus, Minus, Trash2, X, Check, Bell, MapPin, CreditCard, Wallet,
  Truck, Shield, Tag, Sun, Moon, Package, ChevronRight, ArrowRight, Zap,
  Settings as SettingsIcon, History, PenLine, Globe, DollarSign, FileText,
  Share2, ThumbsUp, ThumbsDown, MinusCircle, Circle, CheckCircle2, Clock,
  LogOut, Mail, Lock, UserPlus, Loader2, Eye, EyeOff, ArrowLeft,
  Palette, Image as ImageIcon, Ticket, BarChart3, Activity, ExternalLink, Save, Type,
} from "lucide-react";
import { useMobileStore, type Tab, type TrackingStep } from "@/lib/mobile-store";
import { useConfigStore, useProductMap, useCategoryMap } from "@/lib/config-store";
import {
  sampleReviews, formatPrice, type Product,
} from "@/lib/mobile-data";
import { InstallButton } from "@/components/InstallPWA";

/* ---------------- helpers ---------------- */

function useTheme() {
  const dark = useMobileStore((s) => s.darkMode);
  const theme = useConfigStore((s) => s.theme);
  return dark
    ? {
        ...darkTokens,
        primary: theme.primaryColor,
        primaryDark: theme.primaryDarkColor,
        primarySoft: theme.primaryColor + "33",
        accent: theme.accentColor,
        accentSoft: theme.accentColor + "33",
      }
    : {
        ...lightTokens,
        primary: theme.primaryColor,
        primaryDark: theme.primaryDarkColor,
        primarySoft: theme.primaryColor + "22",
        accent: theme.accentColor,
        accentSoft: theme.accentColor + "22",
      };
}

const lightTokens = {
  bg: "#f8fafc", surface: "#ffffff", surfaceAlt: "#f1f5f9", border: "#e2e8f0",
  text: "#0f172a", muted: "#64748b", subtle: "#94a3b8",
  primary: "#10b981", primaryDark: "#059669", primarySoft: "#d1fae5",
  accent: "#f59e0b", accentSoft: "#fef3c7", star: "#f59e0b",
  cardShadow: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
  elevShadow: "0 4px 14px rgba(15,23,42,0.08), 0 1px 3px rgba(15,23,42,0.04)",
};
const darkTokens = {
  bg: "#0b1120", surface: "#111827", surfaceAlt: "#1e293b", border: "#334155",
  text: "#f8fafc", muted: "#94a3b8", subtle: "#64748b",
  primary: "#10b981", primaryDark: "#059669", primarySoft: "#064e3b",
  accent: "#f59e0b", accentSoft: "#78350f", star: "#f59e0b",
  cardShadow: "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
  elevShadow: "0 4px 14px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.2)",
};

function Badge({ label }: { label: string }) {
  const t = useTheme();
  const color = label.startsWith("-")
    ? "#ef4444"
    : label === "Hot"
    ? "#f43f5e"
    : label === "New"
    ? t.primary
    : label === "Sale"
    ? t.accent
    : t.primary;
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

function Stars({ rating, size = 10 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
        />
      ))}
    </div>
  );
}

/* ---------------- product card ---------------- */

function GalleryImage({ src, alt, fallback, className, priority }: { src: string; alt: string; fallback: string; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? fallback : src}
      alt={alt}
      fill
      sizes="320px"
      className={className ?? "object-cover"}
      unoptimized
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}

function ProductCard({ p, onClick }: { p: Product; onClick: () => void }) {
  const t = useTheme();
  const wished = useMobileStore((s) => s.wishlist.includes(p.id));
  const toggleWishlist = useMobileStore((s) => s.toggleWishlist);
  return (
    <div
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer transition active:scale-[0.97] hover:-translate-y-0.5"
      style={{ backgroundColor: t.surface, boxShadow: t.cardShadow }}
    >
      <div className="relative aspect-square" style={{ backgroundColor: t.surfaceAlt }}>
        <GalleryImage src={p.images[0]} alt={p.name} fallback={`https://picsum.photos/seed/${p.id}/600/600`} />
        {p.badge && (
          <div className="absolute top-2 left-2">
            <Badge label={p.badge} />
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md"
          style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
        >
          <Heart size={13} className={wished ? "fill-rose-500 text-rose-500" : "text-slate-600"} />
        </button>
      </div>
      <div className="p-2.5">
        <div className="text-[10px] font-medium leading-tight line-clamp-2" style={{ color: t.text, minHeight: 26 }}>
          {p.name}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Stars rating={p.rating} />
          <span className="text-[8px]" style={{ color: t.subtle }}>({p.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[13px] font-bold" style={{ color: t.primary }}>{formatPrice(p.price)}</span>
          {p.oldPrice && (
            <span className="text-[9px] line-through" style={{ color: t.subtle }}>{formatPrice(p.oldPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- bottom nav ---------------- */

function BottomNav() {
  const t = useTheme();
  const activeTab = useMobileStore((s) => s.activeTab);
  const setTab = useMobileStore((s) => s.setTab);
  const cartCount = useMobileStore((s) => s.cart.reduce((n, l) => n + l.qty, 0));
  const wishCount = useMobileStore((s) => s.wishlist.length);

  const tabs: { id: Tab; label: string; icon: typeof Home; badge?: number }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "shop", label: "Shop", icon: LayoutGrid },
    { id: "cart", label: "Cart", icon: ShoppingBag, badge: cartCount },
    { id: "wishlist", label: "Saved", icon: Heart, badge: wishCount },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-1.5 py-2 border-t backdrop-blur-xl z-50"
      style={{ backgroundColor: t.surface + "f2", borderColor: t.border, paddingBottom: 18 }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className="relative flex flex-col items-center gap-1 px-2 py-1 rounded-xl flex-1 transition"
          >
            <div className="relative flex items-center justify-center w-9 h-6 rounded-full transition" style={{ backgroundColor: active ? t.primarySoft : "transparent" }}>
              <Icon
                size={20}
                style={{ color: active ? t.primary : t.muted }}
                strokeWidth={active ? 2.4 : 2}
                className={active ? "fill-current" : ""}
              />
              {tab.badge ? (
                <span
                  className="absolute -top-1.5 -right-1 min-w-[15px] h-[15px] px-1 rounded-full text-[8px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: t.accent, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
                >
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span
              className="text-[8px] font-medium"
              style={{ color: active ? t.primary : t.muted }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- section header ---------------- */

function SectionHeader({ title, accent, onSeeAll }: { title: string; accent?: boolean; onSeeAll?: () => void }) {
  const t = useTheme();
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-[13px] font-bold" style={{ color: accent ? t.accent : t.text }}>{title}</h2>
      {onSeeAll && (
        <button onClick={onSeeAll} className="text-[10px] font-medium flex items-center gap-0.5" style={{ color: t.primary }}>
          See all <ChevronRight size={11} />
        </button>
      )}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  const t = useTheme();
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px]" style={{ color: t.muted }}>{label}</span>
      <span className="text-[10px] font-semibold" style={{ color: color ?? t.text }}>{value}</span>
    </div>
  );
}

function BannerCarousel() {
  const banners = useConfigStore((s) => s.banners);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setIdx((v) => (v + 1) % banners.length), 3500);
    return () => clearInterval(i);
  }, [banners.length]);
  const b = banners[idx];
  return (
    <div className="relative w-full h-full">
      <GalleryImage src={b.image} alt={b.title} fallback="/brand/free-shipping.png" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${b.color}cc 0%, ${b.color}55 60%, transparent 100%)` }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-center">
        <p className="text-[13px] font-bold text-white max-w-[60%] leading-tight">{b.title}</p>
        <p className="text-[9px] text-white/90 mt-0.5 max-w-[60%]">{b.subtitle}</p>
        <button className="mt-1.5 self-start text-[9px] font-bold px-2 py-1 rounded-lg bg-white" style={{ color: b.color }}>
          {b.cta} →
        </button>
      </div>
      <div className="absolute bottom-1.5 right-2 flex gap-1">
        {banners.map((_, i) => (
          <span key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: i === idx ? "#fff" : "rgba(255,255,255,0.5)" }} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- screens ---------------- */

function HomeScreen() {
  const t = useTheme();
  const push = useMobileStore((s) => s.push);
  const user = useMobileStore((s) => s.user);
  const brand = useConfigStore((s) => s.brand);
  const texts = useConfigStore((s) => s.texts);
  const products = useConfigStore((s) => s.products);
  const categories = useConfigStore((s) => s.categories);
  const productMap = useProductMap();
  const recentlyViewed = useMobileStore((s) => s.recentlyViewed);
  const flash = useMemo(() => products.filter((p) => p.badge === "Hot" || p.badge?.startsWith("-")).slice(0, 6), [products]);
  const trending = useMemo(() => [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6), [products]);
  const rvProducts = recentlyViewed.map((id) => productMap[id]).filter(Boolean).slice(0, 6);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3.5 pt-11 pb-4 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)` }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-6 w-24 h-24 rounded-full bg-amber-300/15" />
        <div className="flex items-center justify-between relative">
          <div className={user ? "" : "cursor-pointer"} onClick={() => { if (!user) push("SignIn"); }}>
            <p className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
              {user ? `${texts.greetingSignedInPrefix} ${user.name.split(" ")[0]} 👋` : texts.greetingSignedOut}
            </p>
            <p className="text-[15px] font-extrabold text-white tracking-tight">
              {user ? brand.tagline : texts.greetingSignedOutSub}
            </p>
          </div>
          <button onClick={() => push("Notifications")} className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            <Bell size={16} className="text-white" />
          </button>
        </div>
        <button
          onClick={() => push("Search")}
          className="mt-3 w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl backdrop-blur-md"
          style={{ backgroundColor: "rgba(255,255,255,0.97)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        >
          <Search size={15} className="text-slate-400" />
          <span className="text-[11px] text-slate-400">{texts.searchPlaceholder}</span>
        </button>
      </div>

      <div className="px-3.5 mt-4">
        <div className="relative h-32 rounded-2xl overflow-hidden" style={{ boxShadow: t.elevShadow }}>
          <BannerCarousel />
        </div>
      </div>

      <div className="px-3.5 mt-5">
        <SectionHeader title={texts.sectionCategories} onSeeAll={() => useMobileStore.getState().setTab("shop")} />
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-3.5 px-3.5" style={{ scrollbarWidth: "none" }}>
          {categories.map((c) => (
            <button key={c.id} onClick={() => { useMobileStore.getState().setTab("shop"); }} className="flex flex-col items-center gap-1.5 w-14 shrink-0">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: c.color + "1a", boxShadow: `inset 0 0 0 1px ${c.color}22` }}>
                <span className="text-base font-extrabold" style={{ color: c.color }}>{c.name[0]}</span>
              </div>
              <span className="text-[8px] font-medium text-center leading-tight" style={{ color: t.text }}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-3.5 mt-5">
        <SectionHeader title={texts.sectionFlashDeals} accent onSeeAll={() => useMobileStore.getState().setTab("shop")} />
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-3.5 px-3.5" style={{ scrollbarWidth: "none" }}>
          {flash.map((p) => (
            <div key={p.id} className="w-28 shrink-0">
              <ProductCard p={p} onClick={() => push("ProductDetail", { id: p.id })} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-3.5 mt-5 mb-4">
        <SectionHeader title={texts.sectionTrending} onSeeAll={() => useMobileStore.getState().setTab("shop")} />
        <div className="grid grid-cols-2 gap-2.5">
          {trending.map((p) => (
            <ProductCard key={p.id} p={p} onClick={() => push("ProductDetail", { id: p.id })} />
          ))}
        </div>
      </div>

      {rvProducts.length > 0 && (
        <div className="px-3.5 mb-4">
          <SectionHeader title={texts.sectionRecentlyViewed} onSeeAll={() => push("RecentlyViewed")} />
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-3.5 px-3.5" style={{ scrollbarWidth: "none" }}>
            {rvProducts.map((p) => (
              <div key={p.id} className="w-28 shrink-0">
                <ProductCard p={p} onClick={() => push("ProductDetail", { id: p.id })} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShopScreen() {
  const t = useTheme();
  const push = useMobileStore((s) => s.push);
  const products = useConfigStore((s) => s.products);
  const categories = useConfigStore((s) => s.categories);
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "rating" | "new">("popular");

  const filtered = useMemo(() => {
    let list = cat === "all" ? [...products] : products.filter((p) => p.categoryId === cat);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "new": list.sort((a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0)); break;
    }
    return list;
  }, [cat, sort, products]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 pt-10 pb-2" style={{ backgroundColor: t.surface, borderBottom: `1px solid ${t.border}` }}>
        <h1 className="text-[16px] font-bold" style={{ color: t.text }}>Shop</h1>
        <button onClick={() => push("Search")} className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: t.surfaceAlt }}>
          <Search size={14} style={{ color: t.muted }} />
          <span className="text-[11px]" style={{ color: t.muted }}>Search products...</span>
        </button>
        <div className="flex gap-1.5 mt-2 overflow-x-auto -mx-3 px-3 pb-1" style={{ scrollbarWidth: "none" }}>
          {[{ id: "all", name: "All" }, ...categories].map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0 transition"
              style={{
                backgroundColor: cat === c.id ? t.primary : t.surfaceAlt,
                color: cat === c.id ? "#fff" : t.muted,
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px]" style={{ color: t.muted }}>{filtered.length} products</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="text-[10px] font-medium px-2 py-1 rounded-lg outline-none"
            style={{ backgroundColor: t.surfaceAlt, color: t.text }}
          >
            <option value="popular">Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="new">Newest</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 p-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} onClick={() => push("ProductDetail", { id: p.id })} />
        ))}
      </div>
    </div>
  );
}

function ProductDetailScreen({ id }: { id: string }) {
  const t = useTheme();
  const productMap = useProductMap();
  const categoryMap = useCategoryMap();
  const p = productMap[id];
  const push = useMobileStore((s) => s.push);
  const addToCart = useMobileStore((s) => s.addToCart);
  const toggleWishlist = useMobileStore((s) => s.toggleWishlist);
  const addRecentlyViewed = useMobileStore((s) => s.addRecentlyViewed);
  const allReviews = useMobileStore((s) => s.reviews);
  const userReviews = useMemo(() => allReviews.filter((r) => r.productId === id), [allReviews, id]);
  const wished = useMobileStore((s) => s.wishlist.includes(id));
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState<string | undefined>(p?.colors?.[0]);
  const [size, setSize] = useState<string | undefined>(p?.sizes?.[0]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (id) addRecentlyViewed(id);
  }, [id, addRecentlyViewed]);

  if (!p) return null;
  const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* gallery: main image + vertical thumbnail strip */}
        <div className="flex gap-2 p-2.5" style={{ backgroundColor: t.surfaceAlt }}>
          <div className="relative flex-1 aspect-square rounded-xl overflow-hidden" style={{ backgroundColor: t.surface }}>
            <GalleryImage src={p.images[imgIdx]} alt={p.name} fallback={`https://picsum.photos/seed/${p.id}/600/600`} priority />
            <button onClick={() => useMobileStore.getState().pop()} className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
              <ChevronLeft size={18} className="text-slate-700" />
            </button>
            <button onClick={() => toggleWishlist(p.id)} className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
              <Heart size={16} className={wished ? "fill-rose-500 text-rose-500" : "text-slate-700"} />
            </button>
            {/* image counter badge */}
            <span className="absolute bottom-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
              {imgIdx + 1} / {p.images.length}
            </span>
          </div>
          {/* thumbnail strip */}
          <div className="flex flex-col gap-1.5 w-12">
            {p.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className="relative w-12 h-12 rounded-lg overflow-hidden transition"
                style={{
                  border: i === imgIdx ? `2px solid ${t.primary}` : `1px solid ${t.border}`,
                  opacity: i === imgIdx ? 1 : 0.6,
                }}
              >
                <GalleryImage src={img} alt={`${p.name} ${i + 1}`} fallback={`https://picsum.photos/seed/${p.id}-${i}/600/600`} />
              </button>
            ))}
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2">
            {p.badge && <Badge label={p.badge} />}
            <span className="text-[10px] font-medium" style={{ color: categoryMap[p.categoryId].color }}>
              {categoryMap[p.categoryId].name}
            </span>
          </div>
          <h1 className="text-[15px] font-bold mt-1 leading-tight" style={{ color: t.text }}>{p.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Stars rating={p.rating} size={12} />
            <span className="text-[10px]" style={{ color: t.muted }}>{p.rating} · {p.reviewCount} reviews</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[20px] font-bold" style={{ color: t.primary }}>{formatPrice(p.price)}</span>
            {p.oldPrice && (
              <>
                <span className="text-[12px] line-through" style={{ color: t.subtle }}>{formatPrice(p.oldPrice)}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ backgroundColor: "#ef4444" }}>-{discount}%</span>
              </>
            )}
          </div>

          {p.colors && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold mb-1.5" style={{ color: t.text }}>Color</p>
              <div className="flex gap-2">
                {p.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: color === c ? t.primary : t.border, backgroundColor: c }}
                  >
                    {color === c && <Check size={12} className="text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {p.sizes && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold mb-1.5" style={{ color: t.text }}>Size</p>
              <div className="flex gap-1.5 flex-wrap">
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="min-w-[34px] px-2 py-1.5 rounded-lg text-[10px] font-bold border"
                    style={{
                      borderColor: size === s ? t.primary : t.border,
                      backgroundColor: size === s ? t.primary : "transparent",
                      color: size === s ? "#fff" : t.text,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3">
            <p className="text-[11px] font-semibold mb-1.5" style={{ color: t.text }}>Quantity</p>
            <div className="flex items-center gap-3 w-fit rounded-xl border" style={{ borderColor: t.border }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center"><Minus size={13} style={{ color: t.text }} /></button>
              <span className="text-[12px] font-bold w-5 text-center" style={{ color: t.text }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 flex items-center justify-center"><Plus size={13} style={{ color: t.text }} /></button>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[11px] font-semibold mb-1" style={{ color: t.text }}>Description</p>
            <p className="text-[10px] leading-relaxed" style={{ color: t.muted }}>{p.description}</p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { icon: Truck, label: "Free shipping" },
              { icon: Shield, label: "2-yr warranty" },
              { icon: Package, label: "Easy returns" },
            ].map((f, i) => (
              <div key={i} className="rounded-xl p-2 flex flex-col items-center gap-1 text-center" style={{ backgroundColor: t.surfaceAlt }}>
                <f.icon size={14} style={{ color: t.primary }} />
                <span className="text-[8px] font-medium" style={{ color: t.muted }}>{f.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[13px] font-bold" style={{ color: t.text }}>Reviews</h2>
                <span className="text-[10px]" style={{ color: t.muted }}>({sampleReviews.length + userReviews.length})</span>
              </div>
              <button
                onClick={() => push("WriteReview", { id: p.id })}
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
                style={{ backgroundColor: t.primarySoft, color: t.primary }}
              >
                <PenLine size={11} /> Write a Review
              </button>
            </div>
            <div className="space-y-2">
              {userReviews.map((r) => (
                <div key={r.productId + r.title} className="rounded-xl p-2.5" style={{ backgroundColor: t.primarySoft, border: `1px solid ${t.primary}` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: t.primary }}>
                        {r.author[0]}
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: t.text }}>{r.author}</span>
                      <span className="text-[7px] font-bold px-1 py-0.5 rounded text-white" style={{ backgroundColor: t.primary }}>YOU</span>
                    </div>
                    <span className="text-[8px]" style={{ color: t.subtle }}>{r.date}</span>
                  </div>
                  <div className="mt-1"><Stars rating={r.rating} size={9} /></div>
                  <p className="text-[10px] font-semibold mt-1" style={{ color: t.text }}>{r.title}</p>
                  <p className="text-[9px] mt-0.5 leading-relaxed" style={{ color: t.muted }}>{r.body}</p>
                  {r.recommend !== null && (
                    <div className="flex items-center gap-1 mt-1 text-[8px]" style={{ color: t.muted }}>
                      {r.recommend ? <ThumbsUp size={9} className="text-emerald-500" /> : <ThumbsDown size={9} className="text-rose-500" />}
                      {r.recommend ? "Recommends this product" : "Does not recommend"}
                    </div>
                  )}
                </div>
              ))}
              {sampleReviews.map((r) => (
                <div key={r.id} className="rounded-xl p-2.5" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: t.primary }}>
                        {r.author[0]}
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: t.text }}>{r.author}</span>
                    </div>
                    <span className="text-[8px]" style={{ color: t.subtle }}>{r.date}</span>
                  </div>
                  <div className="mt-1"><Stars rating={r.rating} size={9} /></div>
                  <p className="text-[9px] mt-1 leading-relaxed" style={{ color: t.muted }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2.5 border-t" style={{ backgroundColor: t.surface, borderColor: t.border, paddingBottom: 14 }}>
        <button
          onClick={() => { addToCart(p.id, qty, color, size); }}
          className="flex-1 py-2.5 rounded-xl text-[11px] font-bold border-2"
          style={{ borderColor: t.primary, color: t.primary }}
        >
          Add to Cart
        </button>
        <button
          onClick={() => { addToCart(p.id, qty, color, size); push("Checkout"); }}
          className="flex-1 py-2.5 rounded-xl text-[11px] font-bold text-white"
          style={{ backgroundColor: t.primary }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

function CartScreen() {
  const t = useTheme();
  const push = useMobileStore((s) => s.push);
  const cart = useMobileStore((s) => s.cart);
  const updateQty = useMobileStore((s) => s.updateQty);
  const removeFromCart = useMobileStore((s) => s.removeFromCart);
  const couponCode = useMobileStore((s) => s.couponCode);
  const applyCoupon = useMobileStore((s) => s.applyCoupon);
  const productMap = useProductMap();
  const texts = useConfigStore((s) => s.texts);
  const coupons = useConfigStore((s) => s.coupons);
  const [code, setCode] = useState("");

  const subtotal = cart.reduce((n, l) => n + (productMap[l.productId]?.price ?? 0) * l.qty, 0);
  const coupon = coupons.find((c) => c.code === couponCode);
  let discount = 0;
  let shipping = subtotal > 35 || subtotal === 0 ? 0 : 5.99;
  if (coupon && subtotal >= coupon.minSubtotal) {
    if (coupon.type === "percent") discount = (subtotal * coupon.value) / 100;
    else if (coupon.type === "flat") discount = coupon.value;
    else if (coupon.type === "shipping") shipping = 0;
  }
  const total = Math.max(0, subtotal - discount + shipping);

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: t.bg }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: t.primarySoft }}>
          <ShoppingBag size={32} style={{ color: t.primary }} />
        </div>
        <h2 className="text-[14px] font-bold mt-3" style={{ color: t.text }}>{texts.cartEmptyTitle}</h2>
        <p className="text-[10px] mt-1" style={{ color: t.muted }}>{texts.cartEmptySub}</p>
        <button onClick={() => useMobileStore.getState().setTab("home")} className="mt-3 px-4 py-2 rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: t.primary }}>
          {texts.cartBrowseButton}
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
        {cart.map((l, i) => {
          const p = productMap[l.productId];
          if (!p) return null;
          return (
            <div key={i} className="flex gap-2.5 p-2.5 rounded-2xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: t.surfaceAlt }}>
                <Image src={p.images[0]} alt={p.name} fill sizes="80px" className="object-cover" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[10px] font-semibold leading-tight line-clamp-2" style={{ color: t.text }}>{p.name}</p>
                  <button onClick={() => removeFromCart(l.productId, l.color, l.size)}><Trash2 size={12} style={{ color: "#ef4444" }} /></button>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {l.color && <span className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: l.color, borderColor: t.border }} />}
                  {l.size && <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ backgroundColor: t.surfaceAlt, color: t.muted }}>Size {l.size}</span>}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[12px] font-bold" style={{ color: t.primary }}>{formatPrice(p.price * l.qty)}</span>
                  <div className="flex items-center gap-2 rounded-lg border" style={{ borderColor: t.border }}>
                    <button onClick={() => updateQty(l.productId, l.qty - 1, l.color, l.size)} className="w-6 h-6 flex items-center justify-center"><Minus size={11} style={{ color: t.text }} /></button>
                    <span className="text-[10px] font-bold w-3 text-center" style={{ color: t.text }}>{l.qty}</span>
                    <button onClick={() => updateQty(l.productId, l.qty + 1, l.color, l.size)} className="w-6 h-6 flex items-center justify-center"><Plus size={11} style={{ color: t.text }} /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="p-2.5 rounded-2xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Tag size={12} style={{ color: t.accent }} />
            <span className="text-[10px] font-semibold" style={{ color: t.text }}>Promo Code</span>
          </div>
          {couponCode ? (
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold" style={{ color: t.primary }}>{couponCode} applied</span>
              <button onClick={() => applyCoupon(null)} className="text-[9px]" style={{ color: "#ef4444" }}>Remove</button>
            </div>
          ) : (
            <>
              <div className="flex gap-1.5">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-2 py-1.5 rounded-lg text-[10px] outline-none"
                  style={{ backgroundColor: t.surfaceAlt, color: t.text }}
                />
                <button
                  onClick={() => { if (coupons.find((c) => c.code === code)) applyCoupon(code); setCode(""); }}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white"
                  style={{ backgroundColor: t.primary }}
                >
                  Apply
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {coupons.map((c) => (
                  <button key={c.code} onClick={() => applyCoupon(c.code)} className="text-[8px] px-1.5 py-0.5 rounded border" style={{ borderColor: t.border, color: t.muted }}>
                    {c.code}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-3 border-t space-y-1" style={{ backgroundColor: t.surface, borderColor: t.border, paddingBottom: 14 }}>
        <Row label="Subtotal" value={formatPrice(subtotal)} />
        {discount > 0 && <Row label="Discount" value={`- ${formatPrice(discount)}`} color="#ef4444" />}
        <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
        <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t" style={{ borderColor: t.border }}>
          <span className="text-[12px] font-bold" style={{ color: t.text }}>Total</span>
          <span className="text-[15px] font-bold" style={{ color: t.primary }}>{formatPrice(total)}</span>
        </div>
        <button onClick={() => push("Checkout")} className="w-full py-2.5 rounded-xl text-[11px] font-bold text-white mt-2 flex items-center justify-center gap-1" style={{ backgroundColor: t.primary }}>
          Proceed to Checkout <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function CheckoutScreen() {
  const t = useTheme();
  const push = useMobileStore((s) => s.push);
  const cart = useMobileStore((s) => s.cart);
  const couponCode = useMobileStore((s) => s.couponCode);
  const placeOrder = useMobileStore((s) => s.placeOrder);
  const productMap = useProductMap();
  const coupons = useConfigStore((s) => s.coupons);
  const [payment, setPayment] = useState<"cod" | "card" | "wallet">("cod");
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce((n, l) => n + (productMap[l.productId]?.price ?? 0) * l.qty, 0);
  const coupon = coupons.find((c) => c.code === couponCode);
  let discount = 0;
  let shipping = subtotal > 35 ? 0 : 5.99;
  if (coupon && subtotal >= coupon.minSubtotal) {
    if (coupon.type === "percent") discount = (subtotal * coupon.value) / 100;
    else if (coupon.type === "flat") discount = coupon.value;
    else if (coupon.type === "shipping") shipping = 0;
  }
  const total = Math.max(0, subtotal - discount + shipping);

  const handlePlace = () => {
    setPlacing(true);
    setTimeout(() => {
      const id = placeOrder(total);
      setPlacing(false);
      push("OrderSuccess", { id, total });
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        <div>
          <h3 className="text-[11px] font-bold mb-1.5" style={{ color: t.text }}>Delivery Address</h3>
          <div className="flex items-start gap-2 p-2.5 rounded-xl" style={{ backgroundColor: t.surfaceAlt }}>
            <MapPin size={14} style={{ color: t.primary }} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] font-bold" style={{ color: t.text }}>Faisu Ahmed</p>
              <p className="text-[9px] mt-0.5" style={{ color: t.muted }}>123 Gulshan Ave, Block E, Dhaka 1212, Bangladesh · +880 1700 000000</p>
            </div>
            <button onClick={() => push("Addresses")} className="text-[9px] font-semibold" style={{ color: t.primary }}>Change</button>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold mb-1.5" style={{ color: t.text }}>Payment Method</h3>
          <div className="space-y-1.5">
            {[
              { id: "cod", label: "Cash on Delivery", icon: Wallet },
              { id: "card", label: "Credit / Debit Card", icon: CreditCard },
              { id: "wallet", label: "Faisu Wallet ($128.50)", icon: Wallet },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id as typeof payment)}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl border"
                style={{ borderColor: payment === m.id ? t.primary : t.border, backgroundColor: payment === m.id ? t.primarySoft : t.surface }}
              >
                <m.icon size={15} style={{ color: payment === m.id ? t.primary : t.muted }} />
                <span className="text-[10px] font-medium flex-1 text-left" style={{ color: t.text }}>{m.label}</span>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: payment === m.id ? t.primary : t.border }}>
                  {payment === m.id && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.primary }} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold mb-1.5" style={{ color: t.text }}>{`Order Items (${cart.length})`}</h3>
          <div className="flex gap-1.5 flex-wrap">
            {cart.map((l, i) => {
              const p = productMap[l.productId];
              if (!p) return null;
              return (
                <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden" style={{ backgroundColor: t.surfaceAlt }}>
                  <Image src={p.images[0]} alt={p.name} fill sizes="60px" className="object-cover" unoptimized />
                  <span className="absolute bottom-0 right-0 text-[7px] font-bold px-0.5 rounded-tl text-white" style={{ backgroundColor: t.primary }}>x{l.qty}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold mb-1.5" style={{ color: t.text }}>Bill Summary</h3>
          <div className="rounded-xl p-2.5 space-y-1" style={{ backgroundColor: t.surfaceAlt }}>
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            {discount > 0 && <Row label="Discount" value={`- ${formatPrice(discount)}`} color="#ef4444" />}
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
            <div className="flex items-center justify-between pt-1.5 mt-1 border-t" style={{ borderColor: t.border }}>
              <span className="text-[11px] font-bold" style={{ color: t.text }}>Total</span>
              <span className="text-[13px] font-bold" style={{ color: t.primary }}>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border-t" style={{ backgroundColor: t.surface, borderColor: t.border, paddingBottom: 14 }}>
        <button
          onClick={handlePlace}
          disabled={placing}
          className="w-full py-2.5 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5"
          style={{ backgroundColor: t.primary, opacity: placing ? 0.7 : 1 }}
        >
          {placing ? "Placing order..." : <><Check size={13} /> Place Order · {formatPrice(total)}</>}
        </button>
      </div>
    </div>
  );
}

function OrderSuccessScreen({ id, total }: { id: string; total: number }) {
  const t = useTheme();
  const setTab = useMobileStore((s) => s.setTab);
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: t.bg }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: t.primary }}
      >
        <Check size={40} className="text-white" />
      </motion.div>
      <h1 className="text-[16px] font-bold mt-3" style={{ color: t.text }}>Order Placed!</h1>
      <p className="text-[11px] mt-1" style={{ color: t.muted }}>Thank you for shopping with Faisu</p>
      <div className="mt-3 p-3 rounded-xl w-full" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
        <div className="flex items-center justify-between"><span className="text-[10px]" style={{ color: t.muted }}>Order ID</span><span className="text-[10px] font-bold" style={{ color: t.text }}>{id}</span></div>
        <div className="flex items-center justify-between mt-1"><span className="text-[10px]" style={{ color: t.muted }}>Total</span><span className="text-[10px] font-bold" style={{ color: t.primary }}>{formatPrice(total)}</span></div>
        <div className="flex items-center justify-between mt-1"><span className="text-[10px]" style={{ color: t.muted }}>ETA</span><span className="text-[10px] font-semibold" style={{ color: t.text }}>3-5 business days</span></div>
      </div>
      <div className="flex gap-2 mt-3 w-full">
        <button onClick={() => setTab("home")} className="flex-1 py-2.5 rounded-xl text-[11px] font-bold border-2" style={{ borderColor: t.primary, color: t.primary }}>Continue Shopping</button>
      </div>
    </div>
  );
}

function WishlistScreen() {
  const t = useTheme();
  const push = useMobileStore((s) => s.push);
  const wishlist = useMobileStore((s) => s.wishlist);
  const productMap = useProductMap();
  const list = wishlist.map((id) => productMap[id]).filter(Boolean);

  if (list.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: t.bg }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "#fce7f3" }}>
          <Heart size={32} className="text-rose-400" />
        </div>
        <h2 className="text-[14px] font-bold mt-3" style={{ color: t.text }}>No favorites yet</h2>
        <p className="text-[10px] mt-1" style={{ color: t.muted }}>Tap the heart on products to save them</p>
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div className="grid grid-cols-2 gap-2.5">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} onClick={() => push("ProductDetail", { id: p.id })} />
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  const t = useTheme();
  const push = useMobileStore((s) => s.push);
  const dark = useMobileStore((s) => s.darkMode);
  const toggleDark = useMobileStore((s) => s.toggleDark);
  const orders = useMobileStore((s) => s.orders);
  const rvCount = useMobileStore((s) => s.recentlyViewed.length);
  const user = useMobileStore((s) => s.user);
  const signOut = useMobileStore((s) => s.signOut);
  const brand = useConfigStore((s) => s.brand);
  const texts = useConfigStore((s) => s.texts);

  // ---- SIGNED OUT STATE ----
  if (!user) {
    return (
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: t.bg }}>
        <div className="px-3.5 pt-12 pb-8 flex flex-col items-center" style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)` }}>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <User size={28} className="text-white" />
          </div>
          <h2 className="text-[16px] font-extrabold text-white mt-2.5">{texts.profileWelcomePrefix} {brand.appName}</h2>
          <p className="text-[11px] text-white/85 mt-1 text-center px-4">{texts.profileWelcomeSub}</p>
        </div>
        <div className="p-3.5 space-y-2.5">
          <button
            onClick={() => push("SignIn")}
            className="w-full py-3 rounded-2xl text-[12px] font-bold text-white flex items-center justify-center gap-1.5 shadow-lg"
            style={{ backgroundColor: t.primary, boxShadow: `0 4px 14px ${t.primary}40` }}
          >
            {texts.signInButton}
          </button>
          <button
            onClick={() => push("SignUp")}
            className="w-full py-3 rounded-2xl text-[12px] font-bold flex items-center justify-center gap-1.5"
            style={{ backgroundColor: t.surface, color: t.primary, border: `1.5px solid ${t.primary}` }}
          >
            {texts.signUpButton}
          </button>
        </div>
        <div className="p-3.5">
          <p className="text-[9px] font-bold uppercase tracking-wide mb-2" style={{ color: t.muted }}>Guest features</p>
          <div className="space-y-1.5">
            {[
              { icon: ShoppingBag, label: "Browse & shop", sub: "Full catalog access" },
              { icon: Heart, label: "Save favorites", sub: "Wishlist stays on this device" },
              { icon: Package, label: "Place orders", sub: "Guest checkout available" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.primarySoft }}>
                  <f.icon size={14} style={{ color: t.primary }} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold" style={{ color: t.text }}>{f.label}</p>
                  <p className="text-[8px]" style={{ color: t.muted }}>{f.sub}</p>
                </div>
                <Check size={13} style={{ color: t.primary }} />
              </div>
            ))}
          </div>
        </div>
        <div className="px-3.5 pb-6">
          {/* Install App Button */}
          <div className="mb-4">
            <InstallButton />
          </div>
          <div className="text-center">
            <p className="text-[9px]" style={{ color: t.subtle }}>{brand.appName} · v1.0.0</p>
          </div>
        </div>
      </div>
    );
  }

  // ---- SIGNED IN STATE ----
  const menu = [
    ...(user.isAdmin ? [{ icon: Shield, label: "Admin Panel", sub: "Manage your store", action: () => push("AdminPanel") }] : []),
    { icon: Package, label: "My Orders", sub: `${orders.length} order(s)`, action: () => push("Orders") },
    { icon: History, label: "Recently Viewed", sub: `${rvCount} product(s)`, action: () => push("RecentlyViewed") },
    { icon: MapPin, label: "Addresses", sub: "Manage delivery addresses", action: () => push("Addresses") },
    { icon: Bell, label: "Notifications", sub: "Offers & order updates", action: () => push("Notifications") },
    { icon: Tag, label: "Coupons & Offers", sub: "4 active coupons", action: () => {} },
    { icon: Shield, label: "Privacy & Security", sub: "Account & data settings", action: () => {} },
    { icon: SettingsIcon, label: "Settings", sub: "Preferences, region, about", action: () => push("Settings") },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: t.bg }}>
      <div className="px-3.5 pt-12 pb-5 flex flex-col items-center" style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)` }}>
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[22px] font-extrabold" style={{ color: t.primary }}>{user.name[0]?.toUpperCase()}</div>
          {user.isAdmin && (
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[7px] font-bold text-white flex items-center gap-0.5" style={{ backgroundColor: t.accent }}>
              <Shield size={7} /> ADMIN
            </span>
          )}
        </div>
        <h2 className="text-[15px] font-bold text-white mt-2">{user.name}</h2>
        <p className="text-[10px] text-white/80">{user.email}</p>
        <div className="flex gap-4 mt-3">
          {[{ n: orders.length, l: "Orders" }, { n: "12", l: "Reviews" }, { n: "3", l: "Addresses" }].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-[14px] font-bold text-white">{s.n}</p>
              <p className="text-[8px] text-white/80">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        {menu.map((m, i) => (
          <button key={i} onClick={m.action} className="w-full flex items-center gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.primarySoft }}>
              <m.icon size={15} style={{ color: t.primary }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[11px] font-semibold" style={{ color: t.text }}>{m.label}</p>
              <p className="text-[8px]" style={{ color: t.muted }}>{m.sub}</p>
            </div>
            <ChevronRight size={14} style={{ color: t.subtle }} />
          </button>
        ))}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.accentSoft }}>
            {dark ? <Moon size={15} style={{ color: t.accent }} /> : <Sun size={15} style={{ color: t.accent }} />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-[11px] font-semibold" style={{ color: t.text }}>Dark Mode</p>
            <p className="text-[8px]" style={{ color: t.muted }}>{dark ? "On" : "Off"}</p>
          </div>
          <button onClick={toggleDark} className="w-9 h-5 rounded-full flex items-center px-0.5 transition" style={{ backgroundColor: dark ? t.primary : t.border }}>
            <motion.div layout className="w-4 h-4 rounded-full bg-white" style={{ marginLeft: dark ? 16 : 0 }} />
          </button>
        </div>
      </div>
      {/* Sign out button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => { signOut(); useMobileStore.getState().setTab("home"); }}
          className="w-full py-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5"
          style={{ backgroundColor: "#ef444411", color: "#ef4444", border: `1px solid #ef444433` }}
        >
          <LogOut size={13} /> {texts.signOutButton}
        </button>
      </div>
      {/* Install App Button */}
      <div className="px-3 pb-3">
        <InstallButton />
      </div>
      <div className="px-3 pb-6 text-center">
        <p className="text-[9px]" style={{ color: t.subtle }}>{brand.appName} · v1.0.0</p>
        <p className="text-[8px] mt-0.5" style={{ color: t.subtle }}>Member since {user.joinedAt?.slice(0, 10)}</p>
      </div>
    </div>
  );
}

function OrdersScreen() {
  const t = useTheme();
  const push = useMobileStore((s) => s.push);
  const orders = useMobileStore((s) => s.orders);
  const productMap = useProductMap();
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0" style={{ backgroundColor: t.bg }}>
      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center pt-20 text-center">
          <Package size={40} style={{ color: t.subtle }} />
          <p className="text-[11px] font-semibold mt-2" style={{ color: t.text }}>No orders yet</p>
          <p className="text-[9px]" style={{ color: t.muted }}>Your orders will appear here</p>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} onClick={() => push("OrderDetail", { id: o.id })} className="rounded-2xl p-3 cursor-pointer active:scale-[0.98] transition" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold" style={{ color: t.text }}>{o.id}</span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: t.accent }}>{o.status}</span>
            </div>
            <p className="text-[9px] mt-0.5" style={{ color: t.muted }}>{o.date}</p>
            <div className="flex gap-1 mt-2">
              {o.items.slice(0, 4).map((l, i) => {
                const p = productMap[l.productId];
                if (!p) return null;
                return (
                  <div key={i} className="relative w-9 h-9 rounded-lg overflow-hidden" style={{ backgroundColor: t.surfaceAlt }}>
                    <Image src={p.images[0]} alt="" fill sizes="50px" className="object-cover" unoptimized />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: t.border }}>
              <span className="text-[9px]" style={{ color: t.muted }}>{o.items.length} item(s)</span>
              <span className="text-[11px] font-bold flex items-center gap-0.5" style={{ color: t.primary }}>{formatPrice(o.total)} <ChevronRight size={11} /></span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function SearchScreen() {
  const t = useTheme();
  const push = useMobileStore((s) => s.push);
  const pop = useMobileStore((s) => s.pop);
  const products = useConfigStore((s) => s.products);
  const categories = useConfigStore((s) => s.categories);
  const [q, setQ] = useState("");
  const trending = ["Headphones", "Sneakers", "Coffee", "Smartwatch", "Yoga Mat"];
  const results = q ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: t.bg }}>
      <div className="flex items-center gap-2 px-3 pt-10 pb-2 border-b" style={{ backgroundColor: t.surface, borderColor: t.border }}>
        <button onClick={pop}><ChevronLeft size={18} style={{ color: t.text }} /></button>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: t.surfaceAlt }}>
          <Search size={14} style={{ color: t.muted }} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-[11px] outline-none"
            style={{ color: t.text }}
          />
          {q && <button onClick={() => setQ("")}><X size={12} style={{ color: t.muted }} /></button>}
        </div>
      </div>
      {q ? (
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-[10px] mb-2" style={{ color: t.muted }}>{results.length} results for "{q}"</p>
          <div className="grid grid-cols-2 gap-2.5">
            {results.map((p) => (
              <ProductCard key={p.id} p={p} onClick={() => push("ProductDetail", { id: p.id })} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-3">
          <h3 className="text-[11px] font-bold mb-2" style={{ color: t.text }}>Trending searches</h3>
          <div className="flex flex-wrap gap-1.5">
            {trending.map((s) => (
              <button key={s} onClick={() => setQ(s)} className="px-2.5 py-1.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: t.surfaceAlt, color: t.muted }}>
                {s}
              </button>
            ))}
          </div>
          <h3 className="text-[11px] font-bold mt-4 mb-2" style={{ color: t.text }}>Browse categories</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <button key={c.id} onClick={() => { useMobileStore.getState().setTab("shop"); }} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: c.color + "22", color: c.color }}>{c.name[0]}</div>
                <span className="text-[10px] font-medium" style={{ color: t.text }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AddressesScreen() {
  const t = useTheme();
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0" style={{ backgroundColor: t.bg }}>
      <div className="rounded-2xl p-3" style={{ backgroundColor: t.surface, border: `1.5px solid ${t.primary}` }}>
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: t.primary }}>DEFAULT</span>
          <button className="text-[9px] font-semibold" style={{ color: t.primary }}>Edit</button>
        </div>
        <p className="text-[11px] font-bold mt-1.5" style={{ color: t.text }}>Faisu Ahmed</p>
        <p className="text-[9px] mt-0.5" style={{ color: t.muted }}>House 123, Road 5, Gulshan Ave, Block E, Dhaka 1212, Bangladesh</p>
        <p className="text-[9px] mt-0.5" style={{ color: t.muted }}>+880 1700 000000</p>
      </div>
      <div className="rounded-2xl p-3" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: t.surfaceAlt, color: t.muted }}>OFFICE</span>
          <button className="text-[9px] font-semibold" style={{ color: t.primary }}>Edit</button>
        </div>
        <p className="text-[11px] font-bold mt-1.5" style={{ color: t.text }}>Faisu Ahmed</p>
        <p className="text-[9px] mt-0.5" style={{ color: t.muted }}>Level 7, Bashundhara City, Panthapath, Dhaka 1205</p>
        <p className="text-[9px] mt-0.5" style={{ color: t.muted }}>+880 1700 000000</p>
      </div>
      <button className="w-full py-2.5 rounded-xl text-[11px] font-bold border-2 border-dashed flex items-center justify-center gap-1.5" style={{ borderColor: t.primary, color: t.primary }}>
        <Plus size={13} /> Add New Address
      </button>
    </div>
  );
}

function NotificationsScreen() {
  const t = useTheme();
  const notifs = [
    { icon: Zap, color: "#f59e0b", title: "Flash Deals are live!", body: "Up to 40% off on top brands. Shop now before they're gone.", time: "5m ago" },
    { icon: Package, color: "#10b981", title: "Order SWF482910 shipped", body: "Your order is on the way. Expected delivery in 3-5 days.", time: "2h ago" },
    { icon: Tag, color: "#ec4899", title: "New coupon unlocked", body: "Use code WELCOME15 for $15 off orders over $75.", time: "1d ago" },
    { icon: Heart, color: "#8b5cf6", title: "Back in stock", body: "AuraBeam Headphones are back. Grab yours now!", time: "2d ago" },
  ];
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0" style={{ backgroundColor: t.bg }}>
      {notifs.map((n, i) => (
        <div key={i} className="flex gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: n.color + "22" }}>
            <n.icon size={15} style={{ color: n.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold" style={{ color: t.text }}>{n.title}</p>
              <span className="text-[8px]" style={{ color: t.subtle }}>{n.time}</span>
            </div>
            <p className="text-[9px] mt-0.5 leading-relaxed" style={{ color: t.muted }}>{n.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- order detail (tracking timeline) ---------------- */

function OrderDetailScreen({ id }: { id: string }) {
  const t = useTheme();
  const pop = useMobileStore((s) => s.pop);
  const push = useMobileStore((s) => s.push);
  const order = useMobileStore((s) => s.orders.find((o) => o.id === id));
  const productMap = useProductMap();

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: t.bg }}>
        <p className="text-[11px]" style={{ color: t.muted }}>Order not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0" style={{ backgroundColor: t.bg }}>
        {/* status hero */}
        <div className="rounded-2xl p-4 text-center" style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)` }}>
          <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center">
            <Package size={22} className="text-white" />
          </div>
          <p className="text-[13px] font-bold text-white mt-2">{order.status}</p>
          <p className="text-[9px] text-white/80 mt-0.5">Order {order.id} · {order.date}</p>
          <p className="text-[9px] text-white/80 mt-0.5">Estimated delivery: 3-5 business days</p>
        </div>

        {/* tracking timeline */}
        <div className="rounded-2xl p-3" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
          <h3 className="text-[11px] font-bold mb-3" style={{ color: t.text }}>Order Tracking</h3>
          <div className="space-y-0">
            {(order.tracking ?? []).map((step, i) => {
              const isLast = i === (order.tracking?.length ?? 0) - 1;
              return (
                <div key={i} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    {step.done ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : step.current ? (
                      <Clock size={16} style={{ color: t.accent }} />
                    ) : (
                      <Circle size={16} style={{ color: t.subtle }} />
                    )}
                    {!isLast && <div className="w-0.5 flex-1 min-h-[20px] my-1" style={{ backgroundColor: step.done ? t.primary : t.border }} />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-[10px] font-semibold" style={{ color: step.done || step.current ? t.text : t.subtle }}>{step.label}</p>
                    <p className="text-[8px] mt-0.5" style={{ color: t.muted }}>{step.desc}</p>
                    <p className="text-[8px] mt-0.5" style={{ color: t.subtle }}>{step.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* items */}
        <div className="rounded-2xl p-3" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
          <h3 className="text-[11px] font-bold mb-2" style={{ color: t.text }}>Items ({order.items.length})</h3>
          <div className="space-y-2">
            {order.items.map((l, i) => {
              const p = productMap[l.productId];
              if (!p) return null;
              return (
                <div key={i} onClick={() => push("ProductDetail", { id: p.id })} className="flex gap-2.5 cursor-pointer">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: t.surfaceAlt }}>
                    <Image src={p.images[0]} alt={p.name} fill sizes="60px" className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold leading-tight line-clamp-2" style={{ color: t.text }}>{p.name}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: t.muted }}>Qty {l.qty}{l.size ? ` · Size ${l.size}` : ""}</p>
                    <p className="text-[10px] font-bold mt-0.5" style={{ color: t.primary }}>{formatPrice(p.price * l.qty)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t" style={{ borderColor: t.border }}>
            <span className="text-[10px] font-bold" style={{ color: t.text }}>Total Paid</span>
            <span className="text-[13px] font-bold" style={{ color: t.primary }}>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* delivery + payment */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl p-3" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
            <MapPin size={13} style={{ color: t.primary }} className="mb-1" />
            <p className="text-[9px] font-bold" style={{ color: t.text }}>Delivery</p>
            <p className="text-[8px] mt-0.5 leading-relaxed" style={{ color: t.muted }}>Faisu Ahmed<br />123 Gulshan Ave, Dhaka 1212</p>
          </div>
          <div className="rounded-2xl p-3" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
            <CreditCard size={13} style={{ color: t.primary }} className="mb-1" />
            <p className="text-[9px] font-bold" style={{ color: t.text }}>Payment</p>
            <p className="text-[8px] mt-0.5" style={{ color: t.muted }}>Cash on Delivery</p>
          </div>
        </div>

        <button onClick={() => pop()} className="w-full py-2.5 rounded-xl text-[11px] font-bold border-2" style={{ borderColor: t.primary, color: t.primary }}>
          Back to Orders
        </button>
      </div>
    </div>
  );
}

/* ---------------- recently viewed ---------------- */

function RecentlyViewedScreen() {
  const t = useTheme();
  const push = useMobileStore((s) => s.push);
  const recentlyViewed = useMobileStore((s) => s.recentlyViewed);
  const clearRecentlyViewed = useMobileStore((s) => s.clearRecentlyViewed);
  const productMap = useProductMap();
  const list = recentlyViewed.map((id) => productMap[id]).filter(Boolean);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-3 pt-10 pb-2 border-b" style={{ backgroundColor: t.surface, borderColor: t.border }}>
        <div className="flex items-center gap-2">
          <button onClick={() => useMobileStore.getState().pop()}><ChevronLeft size={18} style={{ color: t.text }} /></button>
          <h1 className="text-[14px] font-bold" style={{ color: t.text }}>Recently Viewed</h1>
        </div>
        {list.length > 0 && (
          <button onClick={() => clearRecentlyViewed()} className="text-[10px] font-semibold" style={{ color: "#ef4444" }}>Clear</button>
        )}
      </div>
      {list.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: t.surfaceAlt }}>
            <History size={28} style={{ color: t.subtle }} />
          </div>
          <p className="text-[12px] font-semibold mt-3" style={{ color: t.text }}>Nothing here yet</p>
          <p className="text-[10px] mt-1" style={{ color: t.muted }}>Products you view will appear here</p>
          <button onClick={() => useMobileStore.getState().setTab("home")} className="mt-3 px-4 py-2 rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: t.primary }}>
            Start Browsing
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} onClick={() => push("ProductDetail", { id: p.id })} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- settings ---------------- */

function SettingsToggle({ on, onToggle, color }: { on: boolean; onToggle: () => void; color: { primary: string; border: string } }) {
  return (
    <button onClick={onToggle} className="w-9 h-5 rounded-full flex items-center px-0.5 transition shrink-0" style={{ backgroundColor: on ? color.primary : color.border }}>
      <motion.div layout className="w-4 h-4 rounded-full bg-white" style={{ marginLeft: on ? 16 : 0 }} />
    </button>
  );
}

function SettingsScreen() {
  const t = useTheme();
  const pop = useMobileStore((s) => s.pop);
  const dark = useMobileStore((s) => s.darkMode);
  const toggleDark = useMobileStore((s) => s.toggleDark);
  const settings = useMobileStore((s) => s.settings);
  const updateSettings = useMobileStore((s) => s.updateSettings);

  const languages = ["English", "Urdu", "Arabic"];
  const currencies = ["USD", "PKR", "AED"];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-2 px-3 pt-10 pb-2 border-b" style={{ backgroundColor: t.surface, borderColor: t.border }}>
        <button onClick={pop}><ChevronLeft size={18} style={{ color: t.text }} /></button>
        <h1 className="text-[14px] font-bold" style={{ color: t.text }}>Settings</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4 min-h-0" style={{ backgroundColor: t.bg }}>
        {/* Preferences */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide mb-1.5 px-1" style={{ color: t.muted }}>Preferences</p>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
            {[
              { key: "pushNotifications", label: "Push Notifications", sub: "Order updates & deals", icon: Bell },
              { key: "emailNotifications", label: "Email Notifications", sub: "Receipts & newsletters", icon: FileText },
              { key: "orderUpdates", label: "Order Updates", sub: "Real-time tracking alerts", icon: Package },
            ].map((row, i) => (
              <div key={row.key} className="flex items-center gap-2.5 p-2.5" style={{ borderTop: i > 0 ? `1px solid ${t.border}` : "none" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.primarySoft }}>
                  <row.icon size={13} style={{ color: t.primary }} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold" style={{ color: t.text }}>{row.label}</p>
                  <p className="text-[8px]" style={{ color: t.muted }}>{row.sub}</p>
                </div>
                <SettingsToggle on={settings[row.key as keyof typeof settings] as boolean} onToggle={() => updateSettings({ [row.key]: !(settings[row.key as keyof typeof settings] as boolean) })} color={t} />
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide mb-1.5 px-1" style={{ color: t.muted }}>Appearance</p>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
            <div className="flex items-center gap-2.5 p-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.accentSoft }}>
                {dark ? <Moon size={13} style={{ color: t.accent }} /> : <Sun size={13} style={{ color: t.accent }} />}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold" style={{ color: t.text }}>Dark Mode</p>
                <p className="text-[8px]" style={{ color: t.muted }}>{dark ? "On" : "Off"}</p>
              </div>
              <SettingsToggle on={dark} onToggle={toggleDark} color={t} />
            </div>
          </div>
        </div>

        {/* Region */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide mb-1.5 px-1" style={{ color: t.muted }}>Region</p>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
            <div className="flex items-center gap-2.5 p-2.5 border-b" style={{ borderColor: t.border }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.primarySoft }}>
                <Globe size={13} style={{ color: t.primary }} />
              </div>
              <p className="text-[11px] font-semibold flex-1" style={{ color: t.text }}>Language</p>
              <select
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value })}
                className="text-[10px] font-medium px-2 py-1 rounded-lg outline-none"
                style={{ backgroundColor: t.surfaceAlt, color: t.text }}
              >
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2.5 p-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.primarySoft }}>
                <DollarSign size={13} style={{ color: t.primary }} />
              </div>
              <p className="text-[11px] font-semibold flex-1" style={{ color: t.text }}>Currency</p>
              <select
                value={settings.currency}
                onChange={(e) => updateSettings({ currency: e.target.value })}
                className="text-[10px] font-medium px-2 py-1 rounded-lg outline-none"
                style={{ backgroundColor: t.surfaceAlt, color: t.text }}
              >
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide mb-1.5 px-1" style={{ color: t.muted }}>About</p>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
            {[
              { label: "Privacy Policy", icon: Shield },
              { label: "Terms of Service", icon: FileText },
              { label: "Share the App", icon: Share2 },
            ].map((row, i) => (
              <button key={row.label} className="w-full flex items-center gap-2.5 p-2.5" style={{ borderTop: i > 0 ? `1px solid ${t.border}` : "none" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.surfaceAlt }}>
                  <row.icon size={13} style={{ color: t.muted }} />
                </div>
                <p className="text-[11px] font-semibold flex-1 text-left" style={{ color: t.text }}>{row.label}</p>
                <ChevronRight size={13} style={{ color: t.subtle }} />
              </button>
            ))}
          </div>
          <p className="text-center text-[8px] mt-3" style={{ color: t.subtle }}>Shop With Faisu!! · v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- write review ---------------- */

function WriteReviewScreen({ id }: { id: string }) {
  const t = useTheme();
  const pop = useMobileStore((s) => s.pop);
  const productMap = useProductMap();
  const p = productMap[id];
  const submitReview = useMobileStore((s) => s.submitReview);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  if (!p) return null;

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const canSubmit = rating > 0 && title.trim().length >= 3 && body.trim().length >= 20;

  const handleSubmit = () => {
    if (!canSubmit) {
      if (rating === 0) setError("Please select a rating");
      else if (title.trim().length < 3) setError("Title must be at least 3 characters");
      else setError("Review must be at least 20 characters");
      return;
    }
    submitReview({
      productId: id,
      rating,
      title: title.trim(),
      body: body.trim(),
      recommend,
      author: "You",
      date: "Just now",
    });
    pop();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-2 px-3 pt-10 pb-2 border-b" style={{ backgroundColor: t.surface, borderColor: t.border }}>
        <button onClick={pop}><ChevronLeft size={18} style={{ color: t.text }} /></button>
        <h1 className="text-[14px] font-bold" style={{ color: t.text }}>Write a Review</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0" style={{ backgroundColor: t.bg }}>
        {/* product summary */}
        <div className="flex gap-2.5 p-2.5 rounded-2xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: t.surfaceAlt }}>
            <Image src={p.images[0]} alt={p.name} fill sizes="60px" className="object-cover" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold leading-tight line-clamp-2" style={{ color: t.text }}>{p.name}</p>
            <p className="text-[11px] font-bold mt-0.5" style={{ color: t.primary }}>{formatPrice(p.price)}</p>
          </div>
        </div>

        {/* rating */}
        <div className="p-3 rounded-2xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
          <p className="text-[11px] font-semibold mb-2" style={{ color: t.text }}>Overall Rating</p>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={26}
                  className={(hover || rating) >= i ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                />
              </button>
            ))}
            <span className="text-[10px] font-medium ml-2" style={{ color: t.muted }}>{labels[hover || rating]}</span>
          </div>
        </div>

        {/* title */}
        <div className="p-3 rounded-2xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-semibold" style={{ color: t.text }}>Review Title</p>
            <span className="text-[8px]" style={{ color: t.subtle }}>{title.length}/60</span>
          </div>
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value.slice(0, 60)); setError(""); }}
            placeholder="Summarize your experience"
            className="w-full px-2.5 py-2 rounded-lg text-[11px] outline-none"
            style={{ backgroundColor: t.surfaceAlt, color: t.text }}
          />
        </div>

        {/* body */}
        <div className="p-3 rounded-2xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-semibold" style={{ color: t.text }}>Your Review</p>
            <span className="text-[8px]" style={{ color: t.subtle }}>{body.length}/1000</span>
          </div>
          <textarea
            value={body}
            onChange={(e) => { setBody(e.target.value.slice(0, 1000)); setError(""); }}
            placeholder="What did you like or dislike? How was the quality? (min 20 chars)"
            rows={4}
            className="w-full px-2.5 py-2 rounded-lg text-[11px] outline-none resize-none"
            style={{ backgroundColor: t.surfaceAlt, color: t.text }}
          />
        </div>

        {/* recommend */}
        <div className="p-3 rounded-2xl" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
          <p className="text-[11px] font-semibold mb-2" style={{ color: t.text }}>Would you recommend this?</p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setRecommend(recommend === true ? null : true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold"
              style={{
                backgroundColor: recommend === true ? t.primary : t.surfaceAlt,
                color: recommend === true ? "#fff" : t.muted,
              }}
            >
              <ThumbsUp size={12} /> Yes
            </button>
            <button
              onClick={() => setRecommend(recommend === false ? null : false)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold"
              style={{
                backgroundColor: recommend === false ? "#ef4444" : t.surfaceAlt,
                color: recommend === false ? "#fff" : t.muted,
              }}
            >
              <ThumbsDown size={12} /> No
            </button>
          </div>
        </div>

        {error && (
          <p className="text-[10px] text-center font-medium" style={{ color: "#ef4444" }}>{error}</p>
        )}
      </div>

      <div className="p-3 border-t" style={{ backgroundColor: t.surface, borderColor: t.border, paddingBottom: 14 }}>
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5"
          style={{ backgroundColor: canSubmit ? t.primary : t.subtle }}
        >
          <PenLine size={13} /> Submit Review
        </button>
      </div>
    </div>
  );
}

/* ---------------- sign in ---------------- */

function SignInScreen() {
  const t = useTheme();
  const pop = useMobileStore((s) => s.pop);
  const push = useMobileStore((s) => s.push);
  const signIn = useMobileStore((s) => s.signIn);
  const brand = useConfigStore((s) => s.brand);
  const texts = useConfigStore((s) => s.texts);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password"); return; }
    setLoading(true);
    try {
      // Get stored users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem("swf_users") || "[]");
      
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, storedUsers }),
      });
      const data = await res.json();
      if (!res.ok) { 
        setError(data.error || "Sign in failed"); 
        setLoading(false); 
        return; 
      }
      
      // Check if this is admin user
      if (data.user.id === "admin") {
        signIn({ ...data.user, isAdmin: true });
        useMobileStore.getState().push("AdminPanel");
      } else {
        signIn(data.user);
        useMobileStore.getState().setTab("home");
      }
      setLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: t.bg }}>
      <div className="flex items-center gap-2 px-3 pt-10 pb-2">
        <button onClick={pop}><ArrowLeft size={18} style={{ color: t.text }} /></button>
        <h1 className="text-[14px] font-bold" style={{ color: t.text }}>Sign In</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0">
        {/* hero */}
        <div className="text-center mt-2 mb-5">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)` }}>
            <ShoppingBag size={28} className="text-white" />
          </div>
          <h2 className="text-[17px] font-extrabold mt-3" style={{ color: t.text }}>{texts.signInTitle}</h2>
          <p className="text-[11px] mt-1" style={{ color: t.muted }}>{texts.signInSub} {brand.appName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block" style={{ color: t.muted }}>Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.subtle }} />
              <input
                type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com" required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[11px] outline-none"
                style={{ backgroundColor: t.surfaceAlt, color: t.text, border: `1px solid ${t.border}` }}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block" style={{ color: t.muted }}>Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.subtle }} />
              <input
                type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••" required
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-[11px] outline-none"
                style={{ backgroundColor: t.surfaceAlt, color: t.text, border: `1px solid ${t.border}` }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: t.subtle }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-3 py-2 rounded-xl text-[10px] font-medium" style={{ backgroundColor: "#ef444411", color: "#ef4444", border: "1px solid #ef444433" }}>{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-[12px] font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)`, boxShadow: `0 4px 14px ${t.primary}40` }}>
            {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={14} /></>}
          </button>
        </form>

        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px" style={{ backgroundColor: t.border }} />
          <span className="text-[9px]" style={{ color: t.subtle }}>OR</span>
          <div className="flex-1 h-px" style={{ backgroundColor: t.border }} />
        </div>

        <button onClick={() => push("SignUp")} className="w-full py-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5" style={{ backgroundColor: t.surface, color: t.text, border: `1.5px solid ${t.border}` }}>
          <UserPlus size={14} style={{ color: t.primary }} /> Create a new account
        </button>
      </div>
    </div>
  );
}

/* ---------------- sign up ---------------- */

function SignUpScreen() {
  const t = useTheme();
  const pop = useMobileStore((s) => s.pop);
  const push = useMobileStore((s) => s.push);
  const signIn = useMobileStore((s) => s.signIn);
  const brand = useConfigStore((s) => s.brand);
  const texts = useConfigStore((s) => s.texts);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("All fields are required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      // Check if user already exists in localStorage
      const storedUsers = JSON.parse(localStorage.getItem("swf_users") || "[]");
      const existingUser = storedUsers.find((u: any) => u.email === email.toLowerCase().trim());
      
      if (existingUser) {
        setError("An account with this email already exists");
        setLoading(false);
        return;
      }
      
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Sign up failed"); setLoading(false); return; }
      
      // Store user in localStorage
      storedUsers.push(data.user);
      localStorage.setItem("swf_users", JSON.stringify(storedUsers));
      
      // Sign in the user (without password field)
      const { password: _, ...userWithoutPassword } = data.user;
      signIn(userWithoutPassword);
      useMobileStore.getState().setTab("home");
      setLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: t.bg }}>
      <div className="flex items-center gap-2 px-3 pt-10 pb-2">
        <button onClick={pop}><ArrowLeft size={18} style={{ color: t.text }} /></button>
        <h1 className="text-[14px] font-bold" style={{ color: t.text }}>Create Account</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0">
        <div className="text-center mt-2 mb-5">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)` }}>
            <UserPlus size={28} className="text-white" />
          </div>
          <h2 className="text-[17px] font-extrabold mt-3" style={{ color: t.text }}>{texts.signUpTitle} {brand.appName}</h2>
          <p className="text-[11px] mt-1" style={{ color: t.muted }}>{texts.signUpSub}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block" style={{ color: t.muted }}>Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.subtle }} />
              <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Faisu Ahmed" required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[11px] outline-none"
                style={{ backgroundColor: t.surfaceAlt, color: t.text, border: `1px solid ${t.border}` }} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block" style={{ color: t.muted }}>Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.subtle }} />
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com" required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[11px] outline-none"
                style={{ backgroundColor: t.surfaceAlt, color: t.text, border: `1px solid ${t.border}` }} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block" style={{ color: t.muted }}>Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.subtle }} />
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Min 6 characters" required
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-[11px] outline-none"
                style={{ backgroundColor: t.surfaceAlt, color: t.text, border: `1px solid ${t.border}` }} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: t.subtle }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-3 py-2 rounded-xl text-[10px] font-medium" style={{ backgroundColor: "#ef444411", color: "#ef4444", border: "1px solid #ef444433" }}>{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-[12px] font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)`, boxShadow: `0 4px 14px ${t.primary}40` }}>
            {loading ? <><Loader2 size={14} className="animate-spin" /> Creating account...</> : <>Create Account <ArrowRight size={14} /></>}
          </button>
        </form>

        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px" style={{ backgroundColor: t.border }} />
          <span className="text-[9px]" style={{ color: t.subtle }}>OR</span>
          <div className="flex-1 h-px" style={{ backgroundColor: t.border }} />
        </div>

        <button onClick={() => push("SignIn")} className="w-full py-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5" style={{ backgroundColor: t.surface, color: t.text, border: `1.5px solid ${t.border}` }}>
          <Mail size={14} style={{ color: t.primary }} /> Already have an account? Sign in
        </button>

        <p className="text-[8px] text-center mt-3" style={{ color: t.subtle }}>
          By signing up you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  );
}

/* ---------------- admin panel (in-app) ---------------- */

function AdminPanelScreen() {
  const t = useTheme();
  const pop = useMobileStore((s) => s.pop);
  const push = useMobileStore((s) => s.push);
  const brand = useConfigStore((s) => s.brand);
  const [stats, setStats] = useState<{ users: number; signUps: number; signIns: number; products: number; categories: number; banners: number; coupons: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => {
        setStats({
          users: 0, signUps: 0, signIns: 0,
          products: d.products?.length ?? 0,
          categories: d.categories?.length ?? 0,
          banners: d.banners?.length ?? 0,
          coupons: d.coupons?.length ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Management actions that open the full web admin dashboard (where mutations work with auth)
  const openWebAdmin = (section: string) => {
    window.open(`/admin?section=${section}`, "_blank");
  };

  const adminActions = [
    { icon: Palette, label: "Branding & Colors", sub: "Change app name, colors, logo", color: "#10b981", action: () => push("AdminBranding") },
    { icon: Type, label: "Text Content", sub: "Edit all text in the app", color: "#6366f1", action: () => push("AdminTexts") },
    { icon: Package, label: "Manage Products", sub: "Add, edit, delete products", color: "#f59e0b", action: () => openWebAdmin("products") },
    { icon: LayoutGrid, label: "Manage Categories", sub: "Add, edit, delete categories", color: "#8b5cf6", action: () => openWebAdmin("categories") },
    { icon: ImageIcon, label: "Manage Banners", sub: "Edit promo banners", color: "#ec4899", action: () => openWebAdmin("banners") },
    { icon: Ticket, label: "Manage Coupons", sub: "Add, edit coupon codes", color: "#0ea5e9", action: () => openWebAdmin("coupons") },
    { icon: BarChart3, label: "View Analytics", sub: "Sign-ups, sign-ins, activity", color: "#ef4444", action: () => push("AdminAnalytics") },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: t.bg }}>
      <div className="flex items-center gap-2 px-3 pt-10 pb-2 border-b" style={{ backgroundColor: t.surface, borderColor: t.border }}>
        <button onClick={pop}><ChevronLeft size={18} style={{ color: t.text }} /></button>
        <h1 className="text-[14px] font-bold flex items-center gap-1.5" style={{ color: t.text }}>
          <Shield size={15} style={{ color: t.primary }} /> Admin Panel
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {/* admin badge */}
        <div className="rounded-2xl p-4 text-center" style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)` }}>
          <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center">
            <Shield size={22} className="text-white" />
          </div>
          <p className="text-[13px] font-bold text-white mt-2">Administrator Access</p>
          <p className="text-[9px] text-white/80 mt-0.5">{brand.appName} · Control Center</p>
        </div>

        {/* stats grid */}
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 size={20} className="animate-spin" style={{ color: t.primary }} /></div>
        ) : stats ? (
          <div className="grid grid-cols-3 gap-2">
            {[
              { n: stats.products, l: "Products" },
              { n: stats.categories, l: "Categories" },
              { n: stats.banners, l: "Banners" },
              { n: stats.coupons, l: "Coupons" },
              { n: stats.users, l: "Users" },
              { n: stats.signIns, l: "Sign-ins" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
                <p className="text-[16px] font-extrabold" style={{ color: t.primary }}>{s.n}</p>
                <p className="text-[8px]" style={{ color: t.muted }}>{s.l}</p>
              </div>
            ))}
          </div>
        ) : null}

        {/* admin actions */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide mb-2" style={{ color: t.muted }}>Management</p>
          <div className="space-y-1.5">
            {adminActions.map((a, i) => (
              <button key={i} onClick={a.action} className="w-full flex items-center gap-2.5 p-2.5 rounded-xl active:scale-[0.98] transition" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: a.color + "22" }}>
                  <a.icon size={15} style={{ color: a.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[11px] font-semibold" style={{ color: t.text }}>{a.label}</p>
                  <p className="text-[8px]" style={{ color: t.muted }}>{a.sub}</p>
                </div>
                {a.label.includes("Manage") ? <ExternalLink size={12} style={{ color: t.subtle }} /> : <ChevronRight size={14} style={{ color: t.subtle }} />}
              </button>
            ))}
          </div>
        </div>

        {/* info note */}
        <div className="rounded-xl p-2.5" style={{ backgroundColor: t.accentSoft, border: `1px solid ${t.accent}33` }}>
          <p className="text-[8px] leading-relaxed" style={{ color: t.text }}>
            <ExternalLink size={9} className="inline -mt-0.5 mr-0.5" style={{ color: t.accent }} />
            Product, Category, Banner & Coupon editors open the full web dashboard in a new tab. Sign in there with the same admin credentials to make changes.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- admin branding (in-app editor) ---------------- */

function AdminBrandingScreen() {
  const t = useTheme();
  const pop = useMobileStore((s) => s.pop);
  const brand = useConfigStore((s) => s.brand);
  const theme = useConfigStore((s) => s.theme);
  const loadConfig = useConfigStore((s) => s.load);
  const [appName, setAppName] = useState(brand.appName);
  const [tagline, setTagline] = useState(brand.tagline);
  const [primary, setPrimary] = useState(theme.primaryColor);
  const [accent, setAccent] = useState(theme.accentColor);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appName, tagline, primaryColor: primary, accentColor: accent }),
      });
      if (res.ok) {
        setMsg("Saved! Changes are now live.");
        loadConfig();
      } else {
        setMsg("Save failed. Use the full web dashboard.");
      }
    } catch {
      setMsg("Network error.");
    }
    setSaving(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: t.bg }}>
      <div className="flex items-center gap-2 px-3 pt-10 pb-2 border-b" style={{ backgroundColor: t.surface, borderColor: t.border }}>
        <button onClick={pop}><ChevronLeft size={18} style={{ color: t.text }} /></button>
        <h1 className="text-[14px] font-bold flex items-center gap-1.5" style={{ color: t.text }}>
          <Palette size={15} style={{ color: t.primary }} /> Branding & Colors
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {/* live preview */}
        <div className="rounded-2xl p-4 text-center" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${theme.primaryDarkColor} 100%)` }}>
          <p className="text-[15px] font-extrabold text-white">{appName || "App Name"}</p>
          <p className="text-[10px] text-white/85 mt-0.5">{tagline || "Tagline"}</p>
          <div className="flex justify-center gap-2 mt-3">
            <span className="w-7 h-7 rounded-full border-2 border-white/50" style={{ backgroundColor: primary }} />
            <span className="w-7 h-7 rounded-full border-2 border-white/50" style={{ backgroundColor: accent }} />
          </div>
        </div>

        {/* fields */}
        <div className="space-y-2.5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1 block" style={{ color: t.muted }}>App Name</label>
            <input value={appName} onChange={(e) => setAppName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-[11px] outline-none" style={{ backgroundColor: t.surfaceAlt, color: t.text, border: `1px solid ${t.border}` }} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1 block" style={{ color: t.muted }}>Tagline</label>
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-[11px] outline-none" style={{ backgroundColor: t.surfaceAlt, color: t.text, border: `1px solid ${t.border}` }} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1 block" style={{ color: t.muted }}>Primary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" style={{ border: `1px solid ${t.border}` }} />
              <input value={primary} onChange={(e) => setPrimary(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl text-[11px] outline-none font-mono" style={{ backgroundColor: t.surfaceAlt, color: t.text, border: `1px solid ${t.border}` }} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1 block" style={{ color: t.muted }}>Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" style={{ border: `1px solid ${t.border}` }} />
              <input value={accent} onChange={(e) => setAccent(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl text-[11px] outline-none font-mono" style={{ backgroundColor: t.surfaceAlt, color: t.text, border: `1px solid ${t.border}` }} />
            </div>
          </div>
        </div>

        {msg && <p className="text-[10px] text-center font-medium" style={{ color: msg.includes("Saved") ? t.primary : "#ef4444" }}>{msg}</p>}
      </div>
      <div className="p-3 border-t" style={{ backgroundColor: t.surface, borderColor: t.border, paddingBottom: 14 }}>
        <button onClick={handleSave} disabled={saving} className="w-full py-2.5 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5" style={{ backgroundColor: t.primary, opacity: saving ? 0.6 : 1 }}>
          {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Save size={13} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

/* ---------------- admin texts (in-app text editor) ---------------- */

function AdminTextsScreen() {
  const t = useTheme();
  const pop = useMobileStore((s) => s.pop);
  const texts = useConfigStore((s) => s.texts);
  const loadConfig = useConfigStore((s) => s.load);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("Home");

  const getValue = (key: string) => overrides[key] ?? texts[key] ?? "";

  const groups = ["Home", "Cart", "Checkout", "Wishlist", "Orders", "Profile", "Auth", "Product"];

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    const allValues = { ...texts, ...overrides };
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: allValues }),
      });
      if (res.ok) {
        setMsg("Saved! Changes are now live.");
        setOverrides({});
        loadConfig();
      } else {
        setMsg("Save failed. Use the full web dashboard.");
      }
    } catch {
      setMsg("Network error.");
    }
    setSaving(false);
  };

  const fieldLabels: Record<string, string> = {
    greetingSignedOut: "Greeting (signed out)",
    greetingSignedOutSub: "Subtitle (signed out)",
    greetingSignedInPrefix: "Greeting prefix (signed in)",
    sectionCategories: "Categories title",
    sectionFlashDeals: "Flash Deals title",
    sectionTrending: "Trending title",
    sectionRecentlyViewed: "Recently Viewed title",
    searchPlaceholder: "Search placeholder",
    seeAll: "See all link",
    cartEmptyTitle: "Cart empty title",
    cartEmptySub: "Cart empty subtitle",
    cartBrowseButton: "Browse button",
    proceedToCheckout: "Checkout button",
    subtotal: "Subtotal label",
    shipping: "Shipping label",
    total: "Total label",
    promoCode: "Promo code label",
    apply: "Apply button",
    deliveryAddress: "Delivery address",
    paymentMethod: "Payment method",
    billSummary: "Bill summary",
    placeOrder: "Place order button",
    wishlistEmptyTitle: "Wishlist empty title",
    wishlistEmptySub: "Wishlist empty subtitle",
    ordersEmptyTitle: "Orders empty title",
    ordersEmptySub: "Orders empty subtitle",
    profileWelcomePrefix: "Profile welcome prefix",
    profileWelcomeSub: "Profile welcome subtitle",
    signInButton: "Sign in button",
    signUpButton: "Create account button",
    signInTitle: "Sign in page title",
    signInSub: "Sign in subtitle",
    signUpTitle: "Sign up title prefix",
    signUpSub: "Sign up subtitle",
    emailLabel: "Email label",
    passwordLabel: "Password label",
    nameLabel: "Name label",
    signOutButton: "Sign out button",
    addToCart: "Add to cart button",
    buyNow: "Buy now button",
    writeReview: "Write review button",
    reviews: "Reviews heading",
    description: "Description heading",
  };

  const groupFields: Record<string, string[]> = {
    Home: ["greetingSignedOut", "greetingSignedOutSub", "greetingSignedInPrefix", "sectionCategories", "sectionFlashDeals", "sectionTrending", "sectionRecentlyViewed", "searchPlaceholder", "seeAll"],
    Cart: ["cartEmptyTitle", "cartEmptySub", "cartBrowseButton", "proceedToCheckout", "subtotal", "shipping", "total", "promoCode", "apply"],
    Checkout: ["deliveryAddress", "paymentMethod", "billSummary", "placeOrder"],
    Wishlist: ["wishlistEmptyTitle", "wishlistEmptySub"],
    Orders: ["ordersEmptyTitle", "ordersEmptySub"],
    Profile: ["profileWelcomePrefix", "profileWelcomeSub", "signInButton", "signUpButton"],
    Auth: ["signInTitle", "signInSub", "signUpTitle", "signUpSub", "emailLabel", "passwordLabel", "nameLabel", "signOutButton"],
    Product: ["addToCart", "buyNow", "writeReview", "reviews", "description"],
  };

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: t.bg }}>
      <div className="flex items-center gap-2 px-3 pt-10 pb-2 border-b" style={{ backgroundColor: t.surface, borderColor: t.border }}>
        <button onClick={pop}><ChevronLeft size={18} style={{ color: t.text }} /></button>
        <h1 className="text-[14px] font-bold flex items-center gap-1.5" style={{ color: t.text }}>
          <Type size={15} style={{ color: t.primary }} /> Text Content
        </h1>
      </div>

      {/* group tabs */}
      <div className="flex gap-1.5 overflow-x-auto px-3 py-2 border-b" style={{ backgroundColor: t.surface, borderColor: t.border, scrollbarWidth: "none" }}>
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition"
            style={{
              backgroundColor: activeGroup === g ? t.primary : t.surfaceAlt,
              color: activeGroup === g ? "#fff" : t.muted,
            }}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
        {groupFields[activeGroup]?.map((key) => (
          <div key={key}>
            <label className="text-[9px] font-bold uppercase tracking-wide mb-1 block" style={{ color: t.muted }}>
              {fieldLabels[key] || key}
            </label>
            <input
              value={getValue(key)}
              onChange={(e) => setOverrides((o) => ({ ...o, [key]: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-[11px] outline-none"
              style={{ backgroundColor: t.surfaceAlt, color: t.text, border: `1px solid ${key in overrides ? t.primary : t.border}` }}
            />
          </div>
        ))}

        {msg && (
          <p className="text-[10px] text-center font-medium pt-1" style={{ color: msg.includes("Saved") ? t.primary : "#ef4444" }}>{msg}</p>
        )}
      </div>

      <div className="p-3 border-t" style={{ backgroundColor: t.surface, borderColor: t.border, paddingBottom: 14 }}>
        <button onClick={handleSave} disabled={saving} className="w-full py-2.5 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5" style={{ backgroundColor: t.primary, opacity: saving ? 0.6 : 1 }}>
          {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Save size={13} /> Save All Changes</>}
        </button>
      </div>
    </div>
  );
}

/* ---------------- admin analytics (in-app) ---------------- */

function AdminAnalyticsScreen() {
  const t = useTheme();
  const pop = useMobileStore((s) => s.pop);
  const [data, setData] = useState<{ totals: { users: number; signUps: number; signIns: number; products: number; categories: number; banners: number; coupons: number }; last24h: { signIns: number; signUps: number }; recentEvents: { id: string; type: string; email: string; name: string | null; createdAt: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => {
        setData({
          totals: { users: 0, signUps: 0, signIns: 0, products: d.products?.length ?? 0, categories: d.categories?.length ?? 0, banners: d.banners?.length ?? 0, coupons: d.coupons?.length ?? 0 },
          last24h: { signIns: 0, signUps: 0 },
          recentEvents: [],
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: t.bg }}>
      <div className="flex items-center gap-2 px-3 pt-10 pb-2 border-b" style={{ backgroundColor: t.surface, borderColor: t.border }}>
        <button onClick={pop}><ChevronLeft size={18} style={{ color: t.text }} /></button>
        <h1 className="text-[14px] font-bold flex items-center gap-1.5" style={{ color: t.text }}>
          <BarChart3 size={15} style={{ color: t.primary }} /> Analytics
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 size={22} className="animate-spin" style={{ color: t.primary }} /></div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              {[
                { n: data.totals.users, l: "Total Users", c: "#10b981" },
                { n: data.totals.signUps, l: "Sign-ups", c: "#8b5cf6" },
                { n: data.totals.signIns, l: "Sign-ins", c: "#f59e0b" },
                { n: data.last24h.signIns, l: "Sign-ins 24h", c: "#3b82f6" },
                { n: data.totals.products, l: "Products", c: "#ec4899" },
                { n: data.totals.categories, l: "Categories", c: "#0ea5e9" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-3" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1.5" style={{ backgroundColor: s.c + "22" }}>
                    <Activity size={13} style={{ color: s.c }} />
                  </div>
                  <p className="text-[18px] font-extrabold" style={{ color: t.text }}>{s.n}</p>
                  <p className="text-[8px]" style={{ color: t.muted }}>{s.l}</p>
                </div>
              ))}
            </div>
            <a href="/admin" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2.5 rounded-xl text-[10px] font-bold" style={{ backgroundColor: t.primarySoft, color: t.primary }}>
              Open full dashboard for detailed analytics →
            </a>
          </>
        ) : (
          <p className="text-center text-[11px] py-8" style={{ color: t.muted }}>Failed to load analytics</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- screen router ---------------- */

function CurrentScreen() {
  const stack = useMobileStore((s) => s.stack);
  const top = stack[stack.length - 1];
  const params = top.params ?? {};

  switch (top.screen) {
    case "Home": return <HomeScreen />;
    case "Shop": return <ShopScreen />;
    case "Cart": return <CartScreen />;
    case "Wishlist": return <WishlistScreen />;
    case "Profile": return <ProfileScreen />;
    case "ProductDetail": return <ProductDetailScreen id={params.id as string} />;
    case "Checkout": return <CheckoutScreen />;
    case "OrderSuccess": return <OrderSuccessScreen id={params.id as string} total={params.total as number} />;
    case "Orders": return <OrdersScreen />;
    case "OrderDetail": return <OrderDetailScreen id={params.id as string} />;
    case "Search": return <SearchScreen />;
    case "Addresses": return <AddressesScreen />;
    case "Notifications": return <NotificationsScreen />;
    case "Settings": return <SettingsScreen />;
    case "RecentlyViewed": return <RecentlyViewedScreen />;
    case "WriteReview": return <WriteReviewScreen id={params.id as string} />;
    case "SignIn": return <SignInScreen />;
    case "SignUp": return <SignUpScreen />;
    case "AdminPanel": return <AdminPanelScreen />;
    case "AdminBranding": return <AdminBrandingScreen />;
    case "AdminTexts": return <AdminTextsScreen />;
    case "AdminAnalytics": return <AdminAnalyticsScreen />;
    default: return <HomeScreen />;
  }
}

/* ---------------- phone frame ---------------- */

export function PhonePreview() {
  const dark = useMobileStore((s) => s.darkMode);
  const tokens = dark ? darkTokens : lightTokens;
  const stack = useMobileStore((s) => s.stack);
  const top = stack[stack.length - 1];
  const loadConfig = useConfigStore((s) => s.load);
  const configLoaded = useConfigStore((s) => s.loaded);
  const hideBottomNav = ["ProductDetail", "Checkout", "OrderSuccess", "Search", "OrderDetail", "RecentlyViewed", "Settings", "WriteReview", "SignIn", "SignUp", "AdminPanel", "AdminBranding", "AdminTexts", "AdminAnalytics"].includes(top.screen);
  const lightStatusText = top.screen === "Home" || top.screen === "Profile" || top.screen === "OrderDetail";

  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    if (!configLoaded) loadConfig();
    
    // Check if running as installed PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone || 
                        document.referrer.includes('android-app://');
    setIsPWA(isStandalone);
  }, [configLoaded, loadConfig]);

  // If PWA mode, render without phone frame
  if (isPWA) {
    return (
      <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: tokens.bg }}>
        <div key={top.screen + (top.params?.id ?? "")} className="flex-1 flex flex-col relative overflow-hidden" style={{ paddingBottom: hideBottomNav ? 0 : 70 }}>
          <CurrentScreen />
        </div>
        {!hideBottomNav && <BottomNav />}
      </div>
    );
  }

  // Desktop/browser mode - show with phone frame
  return (
    <div className="relative mx-auto" style={{ width: 320 }}>
      {/* ambient glow */}
      <div
        className="absolute -inset-8 rounded-[3rem] blur-3xl opacity-25 -z-10"
        style={{ background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.accent})` }}
      />
      {/* phone bezel */}
      <div
        className="rounded-[2.7rem] p-[3px] shadow-2xl"
        style={{
          background: dark
            ? "linear-gradient(145deg, #1e293b, #020617)"
            : "linear-gradient(145deg, #334155, #0f172a)",
          boxShadow: "0 30px 70px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
      <div
        className="rounded-[2.5rem] p-2"
        style={{
          backgroundColor: dark ? "#020617" : "#1e293b",
        }}
      >
        <div
          className="rounded-[2.1rem] overflow-hidden relative flex flex-col"
          style={{ width: 300, height: 620, backgroundColor: tokens.bg }}
        >
          {/* status bar */}
          <div
            className="absolute top-0 left-0 right-0 h-9 flex items-center justify-between px-5 z-20 text-[10px] font-semibold pointer-events-none"
            style={{ color: lightStatusText ? "#ffffff" : tokens.text }}
          >
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="flex gap-0.5">
                <span className="w-0.5 h-1.5 rounded-sm bg-current" />
                <span className="w-0.5 h-2 rounded-sm bg-current" />
                <span className="w-0.5 h-2.5 rounded-sm bg-current" />
                <span className="w-0.5 h-3 rounded-sm bg-current opacity-40" />
              </span>
              <span className="text-[9px]">5G</span>
              <span className="relative inline-flex items-center w-5 h-2.5 rounded-sm border border-current px-px">
                <span className="block w-3/4 h-1.5 rounded-sm bg-current" />
                <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1 rounded-r bg-current" />
              </span>
            </div>
          </div>

          {/* dynamic island */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full z-30" style={{ backgroundColor: "#000" }} />

          <div key={top.screen + (top.params?.id ?? "")} className="flex-1 flex flex-col relative overflow-hidden min-h-0">
            <CurrentScreen />
          </div>

          {!hideBottomNav && <BottomNav />}

          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full z-30" style={{ backgroundColor: dark ? "#475569" : "#cbd5e1" }} />
        </div>
      </div>
      </div>
    </div>
  );
}
