"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Heart, ShoppingBag, Home, LayoutGrid, User, ChevronLeft, Star,
  Plus, Minus, Trash2, X, Check, Bell, MapPin, CreditCard, Wallet,
  Truck, Shield, Tag, Sun, Moon, Package, ChevronRight, ArrowRight, Zap,
} from "lucide-react";
import { useMobileStore, type Tab } from "@/lib/mobile-store";
import {
  products, productMap, categories, categoryMap, banners, coupons,
  sampleReviews, formatPrice, type Product,
} from "@/lib/mobile-data";

/* ---------------- helpers ---------------- */

function useTheme() {
  const dark = useMobileStore((s) => s.darkMode);
  return dark ? darkTokens : lightTokens;
}

const lightTokens = {
  bg: "#f8fafc", surface: "#ffffff", surfaceAlt: "#f1f5f9", border: "#e2e8f0",
  text: "#0f172a", muted: "#64748b", subtle: "#94a3b8",
  primary: "#10b981", primaryDark: "#059669", primarySoft: "#d1fae5",
  accent: "#f59e0b", accentSoft: "#fef3c7", star: "#f59e0b",
};
const darkTokens = {
  bg: "#0b1120", surface: "#111827", surfaceAlt: "#1e293b", border: "#334155",
  text: "#f8fafc", muted: "#94a3b8", subtle: "#64748b",
  primary: "#10b981", primaryDark: "#059669", primarySoft: "#064e3b",
  accent: "#f59e0b", accentSoft: "#78350f", star: "#f59e0b",
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

function ProductCard({ p, onClick }: { p: Product; onClick: () => void }) {
  const t = useTheme();
  const wished = useMobileStore((s) => s.wishlist.includes(p.id));
  const toggleWishlist = useMobileStore((s) => s.toggleWishlist);
  return (
    <div
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer transition active:scale-[0.97]"
      style={{ backgroundColor: t.surface, boxShadow: `0 2px 10px ${t.border}` }}
    >
      <div className="relative aspect-square" style={{ backgroundColor: t.surfaceAlt }}>
        <Image src={p.images[0]} alt={p.name} fill sizes="200px" className="object-cover" unoptimized />
        {p.badge && (
          <div className="absolute top-1.5 left-1.5">
            <Badge label={p.badge} />
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
        >
          <Heart size={12} className={wished ? "fill-rose-500 text-rose-500" : "text-slate-500"} />
        </button>
      </div>
      <div className="p-2">
        <div className="text-[10px] font-medium leading-tight line-clamp-2" style={{ color: t.text, minHeight: 26 }}>
          {p.name}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Stars rating={p.rating} />
          <span className="text-[8px]" style={{ color: t.subtle }}>({p.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[12px] font-bold" style={{ color: t.primary }}>{formatPrice(p.price)}</span>
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
      className="flex items-center justify-around px-1 py-1.5 border-t"
      style={{ backgroundColor: t.surface, borderColor: t.border, paddingBottom: 18 }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className="relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl flex-1"
          >
            <div className="relative">
              <Icon
                size={20}
                style={{ color: active ? t.primary : t.muted }}
                strokeWidth={active ? 2.4 : 2}
                className={active ? "fill-current" : ""}
              />
              {tab.badge ? (
                <span
                  className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-1 rounded-full text-[8px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: t.accent }}
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
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setIdx((v) => (v + 1) % banners.length), 3500);
    return () => clearInterval(i);
  }, []);
  const b = banners[idx];
  return (
    <div className="relative w-full h-full">
      <Image src={b.image} alt={b.title} fill sizes="320px" className="object-cover" unoptimized />
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
  const flash = useMemo(() => products.filter((p) => p.badge === "Hot" || p.badge?.startsWith("-")).slice(0, 6), []);
  const trending = useMemo(() => [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6), []);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 pt-10 pb-2" style={{ backgroundColor: t.primary }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.85)" }}>Good morning, Faisu 👋</p>
            <p className="text-[15px] font-bold text-white">Shop smart, live better</p>
          </div>
          <button onClick={() => push("Notifications")} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            <Bell size={15} className="text-white" />
          </button>
        </div>
        <button
          onClick={() => push("Search")}
          className="mt-2.5 w-full flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
        >
          <Search size={14} className="text-slate-400" />
          <span className="text-[11px] text-slate-400">Search products, brands...</span>
        </button>
      </div>

      <div className="px-3 mt-3">
        <div className="relative h-28 rounded-2xl overflow-hidden">
          <BannerCarousel />
        </div>
      </div>

      <div className="px-3 mt-4">
        <SectionHeader title="Categories" onSeeAll={() => useMobileStore.getState().setTab("shop")} />
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-3 px-3" style={{ scrollbarWidth: "none" }}>
          {categories.map((c) => (
            <button key={c.id} onClick={() => { useMobileStore.getState().setTab("shop"); }} className="flex flex-col items-center gap-1 w-14 shrink-0">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: c.color + "22" }}>
                <span className="text-base font-bold" style={{ color: c.color }}>{c.name[0]}</span>
              </div>
              <span className="text-[8px] font-medium text-center leading-tight" style={{ color: t.text }}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 mt-4">
        <SectionHeader title="⚡ Flash Deals" accent onSeeAll={() => useMobileStore.getState().setTab("shop")} />
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-3 px-3" style={{ scrollbarWidth: "none" }}>
          {flash.map((p) => (
            <div key={p.id} className="w-28 shrink-0">
              <ProductCard p={p} onClick={() => push("ProductDetail", { id: p.id })} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 mt-4 mb-4">
        <SectionHeader title="Trending Now" onSeeAll={() => useMobileStore.getState().setTab("shop")} />
        <div className="grid grid-cols-2 gap-2.5">
          {trending.map((p) => (
            <ProductCard key={p.id} p={p} onClick={() => push("ProductDetail", { id: p.id })} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ShopScreen() {
  const t = useTheme();
  const push = useMobileStore((s) => s.push);
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
  }, [cat, sort]);

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
  const p = productMap[id];
  const push = useMobileStore((s) => s.push);
  const addToCart = useMobileStore((s) => s.addToCart);
  const toggleWishlist = useMobileStore((s) => s.toggleWishlist);
  const wished = useMobileStore((s) => s.wishlist.includes(id));
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState<string | undefined>(p?.colors?.[0]);
  const [size, setSize] = useState<string | undefined>(p?.sizes?.[0]);
  const [qty, setQty] = useState(1);

  if (!p) return null;
  const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="relative aspect-square" style={{ backgroundColor: t.surfaceAlt }}>
          <Image src={p.images[imgIdx]} alt={p.name} fill sizes="320px" className="object-cover" unoptimized priority />
          <button onClick={() => useMobileStore.getState().pop()} className="absolute top-10 left-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90">
            <ChevronLeft size={18} className="text-slate-700" />
          </button>
          <button onClick={() => toggleWishlist(p.id)} className="absolute top-10 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90">
            <Heart size={16} className={wished ? "fill-rose-500 text-rose-500" : "text-slate-700"} />
          </button>
          {p.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {p.images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i === imgIdx ? "#fff" : "rgba(255,255,255,0.5)" }} />
              ))}
            </div>
          )}
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
            <SectionHeader title="Reviews" />
            <div className="space-y-2">
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
        <h2 className="text-[14px] font-bold mt-3" style={{ color: t.text }}>Your cart is empty</h2>
        <p className="text-[10px] mt-1" style={{ color: t.muted }}>Add products to start shopping</p>
        <button onClick={() => useMobileStore.getState().setTab("home")} className="mt-3 px-4 py-2 rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: t.primary }}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
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
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
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

  const menu = [
    { icon: Package, label: "My Orders", sub: `${orders.length} order(s)`, action: () => push("Orders") },
    { icon: MapPin, label: "Addresses", sub: "Manage delivery addresses", action: () => push("Addresses") },
    { icon: Bell, label: "Notifications", sub: "Offers & order updates", action: () => push("Notifications") },
    { icon: Shield, label: "Privacy & Security", sub: "Account settings", action: () => {} },
    { icon: Tag, label: "Coupons & Offers", sub: "4 active coupons", action: () => {} },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: t.bg }}>
      <div className="px-3 pt-12 pb-5 flex flex-col items-center" style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)` }}>
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[22px] font-bold" style={{ color: t.primary }}>F</div>
        <h2 className="text-[15px] font-bold text-white mt-2">Faisu Ahmed</h2>
        <p className="text-[10px] text-white/80">faisu@shopwithfaisu.com</p>
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
      <div className="px-3 pb-6 text-center">
        <p className="text-[9px]" style={{ color: t.subtle }}>Shop With Faisu!! v1.0.0</p>
        <p className="text-[8px] mt-0.5" style={{ color: t.subtle }}>Built with React Native + Expo</p>
      </div>
    </div>
  );
}

function OrdersScreen() {
  const t = useTheme();
  const orders = useMobileStore((s) => s.orders);
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2.5" style={{ backgroundColor: t.bg }}>
      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center pt-20 text-center">
          <Package size={40} style={{ color: t.subtle }} />
          <p className="text-[11px] font-semibold mt-2" style={{ color: t.text }}>No orders yet</p>
          <p className="text-[9px]" style={{ color: t.muted }}>Your orders will appear here</p>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="rounded-2xl p-3" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
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
              <span className="text-[11px] font-bold" style={{ color: t.primary }}>{formatPrice(o.total)}</span>
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
  const [q, setQ] = useState("");
  const trending = ["Headphones", "Sneakers", "Coffee", "Smartwatch", "Yoga Mat"];
  const results = q ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: t.bg }}>
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
    <div className="flex-1 overflow-y-auto p-3 space-y-2.5" style={{ backgroundColor: t.bg }}>
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
    <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ backgroundColor: t.bg }}>
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
    case "Search": return <SearchScreen />;
    case "Addresses": return <AddressesScreen />;
    case "Notifications": return <NotificationsScreen />;
    default: return <HomeScreen />;
  }
}

/* ---------------- phone frame ---------------- */

export function PhonePreview() {
  const dark = useMobileStore((s) => s.darkMode);
  const tokens = dark ? darkTokens : lightTokens;
  const stack = useMobileStore((s) => s.stack);
  const top = stack[stack.length - 1];
  const hideBottomNav = ["ProductDetail", "Checkout", "OrderSuccess", "Search"].includes(top.screen);
  const lightStatusText = top.screen === "Home" || top.screen === "Profile";

  return (
    <div className="relative mx-auto" style={{ width: 320 }}>
      <div
        className="absolute -inset-6 rounded-[3rem] blur-2xl opacity-30 -z-10"
        style={{ background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.accent})` }}
      />
      <div
        className="rounded-[2.6rem] p-2.5 shadow-2xl"
        style={{
          backgroundColor: dark ? "#020617" : "#1e293b",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.05) inset",
        }}
      >
        <div
          className="rounded-[2.1rem] overflow-hidden relative flex flex-col"
          style={{ width: 300, height: 620, backgroundColor: tokens.bg }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-9 flex items-center justify-between px-5 z-20 text-[10px] font-semibold pointer-events-none"
            style={{ color: lightStatusText ? "#ffffff" : tokens.text }}
          >
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>•••</span>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl z-30" style={{ backgroundColor: "#000" }} />

          <AnimatePresence mode="wait">
            <motion.div
              key={top.screen + (top.params?.id ?? "")}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col relative overflow-hidden"
            >
              <CurrentScreen />
            </motion.div>
          </AnimatePresence>

          {!hideBottomNav && <BottomNav />}

          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full z-30" style={{ backgroundColor: dark ? "#475569" : "#cbd5e1" }} />
        </div>
      </div>
    </div>
  );
}
