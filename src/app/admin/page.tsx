"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster as SonnerToaster } from "sonner";
import {
  LayoutDashboard,
  Palette,
  Image as ImageIcon,
  Package,
  Tags,
  Ticket,
  LogOut,
  Menu,
  X,
  Plus,
  Trash2,
  Pencil,
  Save,
  Check,
  Loader2,
  ExternalLink,
  Search,
  Shield,
  ChevronRight,
  AlertCircle,
  BarChart3,
  Users,
  LogIn,
  UserPlus,
  TrendingUp,
  Activity,
  Type,
  RotateCcw,
} from "lucide-react";
import { textLabels, defaultTexts, type TextKey } from "@/lib/app-texts";

// =====================================================================
// Types
// =====================================================================

type Section =
  | "dashboard"
  | "branding"
  | "texts"
  | "banners"
  | "products"
  | "categories"
  | "coupons"
  | "analytics";

interface AppConfig {
  appName: string;
  tagline: string;
  logoUrl: string | null;
  primaryColor: string;
  primaryDarkColor: string;
  accentColor: string;
  darkModeDefault: boolean;
  currency: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  color: string;
  order: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
}

interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  badge?: string;
  createdAt: string;
}

type CouponType = "percent" | "flat" | "shipping";

interface Coupon {
  code: string;
  description: string;
  minSubtotal: number;
  type: CouponType;
  value: number;
}

// =====================================================================
// Constants
// =====================================================================

const CURRENCIES = ["USD", "PKR", "AED", "EUR", "GBP"] as const;

const NAV_ITEMS: {
  id: Section;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "branding", label: "Branding & Theme", icon: Palette },
  { id: "texts", label: "Text Content", icon: Type },
  { id: "banners", label: "Banners", icon: ImageIcon },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "coupons", label: "Coupons", icon: Ticket },
];

// =====================================================================
// Shared UI primitives
// =====================================================================

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition text-sm";

const labelClass = "text-xs font-semibold text-slate-300 mb-1.5 block";

const cardClass =
  "bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl";

const primaryBtnClass =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed";

const ghostBtnClass =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium text-sm transition";

const dangerBtnClass =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-medium text-sm transition";

function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} size={18} />;
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const safe = value && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : "#10b981";
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2 items-center">
        <div className="relative">
          <input
            type="color"
            value={safe}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-12 rounded-lg bg-white/5 border border-white/10 cursor-pointer p-1"
            aria-label={`${label} color picker`}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} font-mono`}
          placeholder="#10b981"
        />
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        checked ? "bg-emerald-500" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidth} ${cardClass} shadow-2xl max-h-[90vh] flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-white font-semibold text-base">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Package;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center mb-4">
        <Icon className="text-slate-500" size={24} />
      </div>
      <p className="text-slate-300 font-medium">{title}</p>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

function ImageThumb({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div
        className={`bg-white/5 border border-white/10 flex items-center justify-center ${className}`}
      >
        <ImageIcon className="text-slate-600" size={16} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}

// =====================================================================
// Section: Dashboard
// =====================================================================

function DashboardSection({
  onNavigate,
}: {
  onNavigate: (s: Section) => void;
}) {
  const [stats, setStats] = useState<{
    products: number;
    categories: number;
    banners: number;
    coupons: number;
  }>({ products: 0, categories: 0, banners: 0, coupons: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [p, c, b, co] = await Promise.all([
          fetch("/api/admin/products").then((r) => r.json()),
          fetch("/api/admin/categories").then((r) => r.json()),
          fetch("/api/admin/banners").then((r) => r.json()),
          fetch("/api/admin/coupons").then((r) => r.json()),
        ]);
        if (!cancelled) {
          setStats({
            products: Array.isArray(p) ? p.length : 0,
            categories: Array.isArray(c) ? c.length : 0,
            banners: Array.isArray(b) ? b.length : 0,
            coupons: Array.isArray(co) ? co.length : 0,
          });
        }
      } catch {
        if (!cancelled) toast.error("Failed to load stats");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      label: "Products",
      value: stats.products,
      icon: Package,
      tint: "from-emerald-500/20 to-emerald-600/5",
      ring: "text-emerald-400",
      section: "products" as Section,
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: Tags,
      tint: "from-amber-500/20 to-amber-600/5",
      ring: "text-amber-400",
      section: "categories" as Section,
    },
    {
      label: "Banners",
      value: stats.banners,
      icon: ImageIcon,
      tint: "from-sky-500/20 to-sky-600/5",
      ring: "text-sky-400",
      section: "banners" as Section,
    },
    {
      label: "Coupons",
      value: stats.coupons,
      icon: Ticket,
      tint: "from-fuchsia-500/20 to-fuchsia-600/5",
      ring: "text-fuchsia-400",
      section: "coupons" as Section,
    },
  ];

  const quickActions: { label: string; desc: string; section: Section; icon: typeof Package }[] = [
    { label: "Edit Branding", desc: "App name, colors, currency", section: "branding", icon: Palette },
    { label: "Manage Banners", desc: "Promo carousel slides", section: "banners", icon: ImageIcon },
    { label: "Manage Products", desc: "Add, edit, remove items", section: "products", icon: Package },
    { label: "Manage Categories", desc: "Organize catalog", section: "categories", icon: Tags },
    { label: "Manage Coupons", desc: "Discounts & promos", section: "coupons", icon: Ticket },
  ];

  return (
    <div>
      <SectionHeader
        title="Dashboard"
        subtitle="Overview of your store at a glance"
        action={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={primaryBtnClass}
          >
            <ExternalLink size={15} /> Live Preview
          </a>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={() => onNavigate(c.section)}
            className={`${cardClass} p-5 text-left hover:border-white/20 transition group relative overflow-hidden`}
          >
            <div
              className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${c.tint} blur-2xl opacity-70 group-hover:opacity-100 transition`}
            />
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 ${c.ring}`}
              >
                <c.icon size={18} />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {loading ? <Spinner className="mx-0" /> : c.value}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wider">
                {c.label}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`${cardClass} p-5 sm:p-6 mb-6`}>
        <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.section)}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <a.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {a.label}
                </div>
                <div className="text-xs text-slate-400 truncate">{a.desc}</div>
              </div>
              <ChevronRight
                size={16}
                className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Live preview CTA */}
      <div
        className={`${cardClass} p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
      >
        <div>
          <h3 className="text-white font-semibold">See it live</h3>
          <p className="text-sm text-slate-400 mt-1">
            Open the customer-facing phone preview in a new tab to see your
            changes in action.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={ghostBtnClass}
        >
          <ExternalLink size={15} /> Open Preview
        </a>
      </div>
    </div>
  );
}

// =====================================================================
// Section: Branding & Theme
// =====================================================================

function BrandingSection() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/config");
      const data = (await res.json()) as AppConfig;
      setConfig({
        appName: data.appName ?? "Shop With Faisu!!",
        tagline: data.tagline ?? "",
        logoUrl: data.logoUrl ?? null,
        primaryColor: data.primaryColor ?? "#10b981",
        primaryDarkColor: data.primaryDarkColor ?? "#059669",
        accentColor: data.accentColor ?? "#f59e0b",
        darkModeDefault: !!data.darkModeDefault,
        currency: data.currency ?? "USD",
      });
    } catch {
      toast.error("Failed to load config");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = <K extends keyof AppConfig>(k: K, v: AppConfig[K]) => {
    setConfig((prev) => (prev ? { ...prev, [k]: v } : prev));
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      toast.success("Branding saved successfully");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <div>
        <SectionHeader title="Branding & Theme" />
        <div className={`${cardClass} p-10 flex items-center justify-center`}>
          <Spinner className="text-emerald-400" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Branding & Theme"
        subtitle="Customize your app's identity, colors, and currency"
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className={primaryBtnClass}
          >
            {saving ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              <>
                <Save size={15} /> Save Changes
              </>
            )}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className={`${cardClass} p-5 sm:p-6 space-y-4`}>
            <h3 className="text-sm font-semibold text-white">Identity</h3>
            <Field label="App Name">
              <input
                className={inputClass}
                value={config.appName}
                onChange={(e) => update("appName", e.target.value)}
                placeholder="Shop With Faisu!!"
              />
            </Field>
            <Field label="Tagline">
              <input
                className={inputClass}
                value={config.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                placeholder="Shop smart, live better"
              />
            </Field>
            <Field label="Logo URL" hint="Leave empty to use the default shield icon">
              <input
                className={inputClass}
                value={config.logoUrl ?? ""}
                onChange={(e) =>
                  update("logoUrl", e.target.value.trim() || null)
                }
                placeholder="https://example.com/logo.png"
              />
            </Field>
          </div>

          <div className={`${cardClass} p-5 sm:p-6 space-y-4`}>
            <h3 className="text-sm font-semibold text-white">Theme Colors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorField
                label="Primary Color"
                value={config.primaryColor}
                onChange={(v) => update("primaryColor", v)}
              />
              <ColorField
                label="Primary Dark Color"
                value={config.primaryDarkColor}
                onChange={(v) => update("primaryDarkColor", v)}
              />
              <ColorField
                label="Accent Color"
                value={config.accentColor}
                onChange={(v) => update("accentColor", v)}
              />
              <Field label="Currency">
                <select
                  className={inputClass}
                  value={config.currency}
                  onChange={(e) => update("currency", e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900">
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-sm font-semibold text-white">
                  Dark Mode Default
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Open the app in dark mode by default
                </div>
              </div>
              <Toggle
                checked={config.darkModeDefault}
                onChange={(v) => update("darkModeDefault", v)}
                label="Dark mode default"
              />
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="space-y-5">
          <div className={`${cardClass} p-5 sm:p-6 sticky top-6`}>
            <h3 className="text-sm font-semibold text-white mb-4">
              Live Preview
            </h3>
            <div
              className="rounded-2xl p-5 mb-4 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${config.primaryColor}, ${config.primaryDarkColor})`,
              }}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white blur-2xl" />
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
                  {config.logoUrl ? (
                    <ImageThumb
                      src={config.logoUrl}
                      alt="Logo"
                      className="w-full h-full rounded-xl"
                    />
                  ) : (
                    <Shield className="text-white" size={20} />
                  )}
                </div>
                <div className="text-white font-extrabold text-lg">
                  {config.appName || "App Name"}
                </div>
                <div className="text-white/80 text-xs mt-0.5">
                  {config.tagline || "Tagline"}
                </div>
                <div
                  className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full text-xs font-bold text-slate-900"
                  style={{ background: config.accentColor }}
                >
                  <Check size={12} /> Shop Now
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Swatches
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Primary", color: config.primaryColor },
                  { label: "Dark", color: config.primaryDarkColor },
                  { label: "Accent", color: config.accentColor },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg overflow-hidden border border-white/10"
                  >
                    <div
                      className="h-12"
                      style={{ background: s.color }}
                    />
                    <div className="px-2 py-1.5 bg-white/[0.02]">
                      <div className="text-[10px] text-slate-400 font-medium">
                        {s.label}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase">
                        {s.color}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Currency</span>
              <span className="text-sm font-semibold text-white">
                {config.currency}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-400">Dark mode default</span>
              <span
                className={`text-xs font-semibold ${
                  config.darkModeDefault ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                {config.darkModeDefault ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Section: Text Content
// =====================================================================

function TextsSection() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/config");
      const data = (await res.json()) as { texts?: string | null };
      let parsed: Record<string, string> = {};
      if (data.texts) {
        try {
          const obj = JSON.parse(data.texts) as unknown;
          if (obj && typeof obj === "object") {
            for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
              if (typeof v === "string") parsed[k] = v;
            }
          }
        } catch {
          parsed = {};
        }
      }
      setValues(parsed);
    } catch {
      toast.error("Failed to load text content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Group text fields by their group name (preserve order of first occurrence).
  const grouped = useMemo(() => {
    const map = new Map<string, { key: TextKey; label: string }[]>();
    for (const item of textLabels) {
      const arr = map.get(item.group) ?? [];
      arr.push({ key: item.key, label: item.label });
      map.set(item.group, arr);
    }
    return Array.from(map.entries());
  }, []);

  const getValue = (key: TextKey) => values[key] ?? defaultTexts[key];

  const handleChange = (key: string, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      for (const item of textLabels) {
        payload[item.key] = values[item.key] ?? "";
      }
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: payload }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      toast.success("Text content saved successfully");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Reset ALL text overrides to their default values? This cannot be undone."
      )
    )
      return;
    setResetting(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: {} }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Reset failed");
      }
      toast.success("Text content reset to defaults");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reset");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <SectionHeader title="Text Content" />
        <div className={`${cardClass} p-10 flex items-center justify-center`}>
          <Spinner className="text-emerald-400" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Text Content"
        subtitle="Override the app's default text strings across screens"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleReset}
              disabled={resetting || saving}
              className={ghostBtnClass}
            >
              {resetting ? (
                <>
                  <Spinner /> Resetting...
                </>
              ) : (
                <>
                  <RotateCcw size={15} /> Reset to defaults
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={primaryBtnClass}
            >
              {saving ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                <>
                  <Save size={15} /> Save Changes
                </>
              )}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {grouped.map(([groupName, fields]) => (
          <div key={groupName} className={`${cardClass} p-5 sm:p-6 space-y-4`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Type size={15} />
              </div>
              <h3 className="text-sm font-semibold text-white">{groupName}</h3>
              <span className="ml-auto text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {fields.length} {fields.length === 1 ? "field" : "fields"}
              </span>
            </div>
            <div className="space-y-3">
              {fields.map((f) => {
                const overridden = values[f.key] !== undefined;
                return (
                  <Field
                    key={f.key}
                    label={f.label}
                    hint={
                      overridden
                        ? "Custom override"
                        : "Using default value"
                    }
                  >
                    <input
                      className={`${inputClass} ${
                        overridden ? "border-emerald-500/30" : ""
                      }`}
                      value={getValue(f.key)}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      placeholder={defaultTexts[f.key]}
                    />
                  </Field>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// Section: Banners
// =====================================================================

interface BannerForm {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  color: string;
}

const emptyBannerForm: BannerForm = {
  title: "",
  subtitle: "",
  cta: "Shop Now",
  image: "",
  color: "#10b981",
};

function BannersSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(emptyBannerForm);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openAdd = () => {
    setForm(emptyBannerForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setForm({
      title: b.title,
      subtitle: b.subtitle,
      cta: b.cta,
      image: b.image,
      color: b.color,
    });
    setEditingId(b.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      const isEdit = editingId !== null;
      const url = "/api/admin/banners";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? { id: editingId, ...payload } : payload;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      toast.success(isEdit ? "Banner updated" : "Banner created");
      setModalOpen(false);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (b: Banner) => {
    if (!window.confirm(`Delete banner "${b.title || b.id}"?`)) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${encodeURIComponent(b.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Banner deleted");
      await refresh();
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Banners"
        subtitle="Promo slides shown in the home carousel"
        action={
          <button onClick={openAdd} className={primaryBtnClass}>
            <Plus size={15} /> Add Banner
          </button>
        }
      />

      {loading ? (
        <div className={`${cardClass} p-10 flex items-center justify-center`}>
          <Spinner className="text-emerald-400" />
        </div>
      ) : banners.length === 0 ? (
        <div className={`${cardClass}`}>
          <EmptyState
            icon={ImageIcon}
            title="No banners yet"
            subtitle="Click 'Add Banner' to create your first promo slide"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b.id} className={`${cardClass} overflow-hidden`}>
              <div
                className="relative h-32 bg-white/5"
                style={{
                  background: b.color
                    ? `linear-gradient(135deg, ${b.color}, ${b.color}99)`
                    : undefined,
                }}
              >
                {b.image && (
                  <ImageThumb
                    src={b.image}
                    alt={b.title}
                    className="absolute inset-0 w-full h-full opacity-90"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <div className="text-white font-bold text-sm truncate">
                    {b.title || "Untitled"}
                  </div>
                  {b.subtitle && (
                    <div className="text-white/80 text-xs truncate">
                      {b.subtitle}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-white/20"
                    style={{ background: b.color }}
                  />
                  <span className="text-xs text-slate-400 font-mono">
                    {b.color}
                  </span>
                  <span className="ml-auto text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    CTA: {b.cta || "—"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(b)}
                    className={`${ghostBtnClass} flex-1 !py-2`}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b)}
                    className={`${dangerBtnClass} !py-2 !px-3`}
                    aria-label="Delete banner"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Banner" : "Add Banner"}
      >
        <div className="space-y-4">
          <Field label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Flash Sale Weekend"
            />
          </Field>
          <Field label="Subtitle">
            <input
              className={inputClass}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Up to 50% off everything"
            />
          </Field>
          <Field label="CTA Text">
            <input
              className={inputClass}
              value={form.cta}
              onChange={(e) => setForm({ ...form, cta: e.target.value })}
              placeholder="Shop Now"
            />
          </Field>
          <Field label="Image URL">
            <input
              className={inputClass}
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </Field>
          {form.image && (
            <ImageThumb
              src={form.image}
              alt="Preview"
              className="w-full h-28 rounded-xl border border-white/10"
            />
          )}
          <ColorField
            label="Accent Color"
            value={form.color}
            onChange={(v) => setForm({ ...form, color: v })}
          />
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className={`${ghostBtnClass} flex-1`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`${primaryBtnClass} flex-1`}
            >
              {saving ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                <>
                  <Save size={15} /> {editingId ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// =====================================================================
// Section: Products
// =====================================================================

interface ProductForm {
  name: string;
  categoryId: string;
  price: string;
  oldPrice: string;
  rating: string;
  reviewCount: string;
  imagesText: string;
  description: string;
  colorsText: string;
  sizesText: string;
  badge: string;
  inStock: boolean;
}

const emptyProductForm: ProductForm = {
  name: "",
  categoryId: "",
  price: "",
  oldPrice: "",
  rating: "4.5",
  reviewCount: "0",
  imagesText: "",
  description: "",
  colorsText: "",
  sizesText: "",
  badge: "",
  inStock: true,
};

function productsToForm(p: Product): ProductForm {
  return {
    name: p.name,
    categoryId: p.categoryId,
    price: String(p.price ?? ""),
    oldPrice: p.oldPrice != null ? String(p.oldPrice) : "",
    rating: String(p.rating ?? 4.5),
    reviewCount: String(p.reviewCount ?? 0),
    imagesText: (p.images || []).join("\n"),
    description: p.description || "",
    colorsText: (p.colors || []).join(", "),
    sizesText: (p.sizes || []).join(", "),
    badge: p.badge || "",
    inStock: p.inStock,
  };
}

function parseList(text: string): string[] {
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);
      const p = await pRes.json();
      const c = await cRes.json();
      setProducts(Array.isArray(p) ? p : []);
      setCategories(Array.isArray(c) ? c : []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const catName = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.name || id,
    [categories]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        catName(p.categoryId).toLowerCase().includes(q) ||
        (p.badge || "").toLowerCase().includes(q)
    );
  }, [products, search, catName]);

  const openAdd = () => {
    setForm({
      ...emptyProductForm,
      categoryId: categories[0]?.id || "",
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setForm(productsToForm(p));
    setEditingId(p.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      toast.error("Valid price is required");
      return;
    }

    const images = parseList(form.imagesText);
    if (images.length === 0) {
      toast.error("At least one image URL is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        rating: Number(form.rating) || 4.5,
        reviewCount: Number(form.reviewCount) || 0,
        images,
        description: form.description,
        colors: parseList(form.colorsText),
        sizes: parseList(form.sizesText),
        badge: form.badge.trim() || null,
        inStock: form.inStock,
      };
      const isEdit = editingId !== null;
      const url = "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? { id: editingId, ...payload } : payload;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      toast.success(isEdit ? "Product updated" : "Product created");
      setModalOpen(false);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Delete product "${p.name}"?`)) return;
    try {
      const res = await fetch(
        `/api/admin/products?id=${encodeURIComponent(p.id)}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Product deleted");
      await refresh();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Products"
        subtitle={`${products.length} item${products.length === 1 ? "" : "s"} in your catalog`}
        action={
          <button
            onClick={openAdd}
            disabled={categories.length === 0}
            className={primaryBtnClass}
            title={
              categories.length === 0
                ? "Add a category first"
                : "Add product"
            }
          >
            <Plus size={15} /> Add Product
          </button>
        }
      />

      {categories.length === 0 && !loading && (
        <div className="mb-4 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            You need at least one category before adding products. Head to the
            Categories tab first.
          </div>
        </div>
      )}

      <div className={`${cardClass} p-3 mb-4`}>
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            className={`${inputClass} pl-10`}
            placeholder="Search by name, category, or badge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={`${cardClass} p-10 flex items-center justify-center`}>
          <Spinner className="text-emerald-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${cardClass}`}>
          <EmptyState
            icon={Package}
            title={search ? "No matches" : "No products yet"}
            subtitle={
              search
                ? "Try a different search term"
                : "Click 'Add Product' to create your first item"
            }
          />
        </div>
      ) : (
        <div className={`${cardClass} overflow-hidden`}>
          <div className="divide-y divide-white/5">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/[0.02] transition"
              >
                <ImageThumb
                  src={p.images?.[0] || ""}
                  alt={p.name}
                  className="w-14 h-14 rounded-xl shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate">
                      {p.name}
                    </span>
                    {p.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {catName(p.categoryId)} · ${p.price.toFixed(2)}
                    {p.oldPrice != null && (
                      <span className="ml-1 line-through text-slate-600">
                        ${p.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        p.inStock
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-rose-500/10 text-rose-300"
                      }`}
                    >
                      {p.inStock ? "In stock" : "Out of stock"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ★ {p.rating} · {p.reviewCount} reviews
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => openEdit(p)}
                    className={`${ghostBtnClass} !py-2 !px-3`}
                    aria-label="Edit product"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className={`${dangerBtnClass} !py-2 !px-3`}
                    aria-label="Delete product"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Product" : "Add Product"}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Wireless Headphones"
              />
            </Field>
            <Field label="Category">
              <select
                className={inputClass}
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
              >
                <option value="" className="bg-slate-900">
                  Select category...
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Price">
              <input
                type="number"
                step="0.01"
                className={inputClass}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="99.99"
              />
            </Field>
            <Field label="Old Price">
              <input
                type="number"
                step="0.01"
                className={inputClass}
                value={form.oldPrice}
                onChange={(e) =>
                  setForm({ ...form, oldPrice: e.target.value })
                }
                placeholder="129.99"
              />
            </Field>
            <Field label="Rating">
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                className={inputClass}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                placeholder="4.5"
              />
            </Field>
            <Field label="Reviews">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.reviewCount}
                onChange={(e) =>
                  setForm({ ...form, reviewCount: e.target.value })
                }
                placeholder="0"
              />
            </Field>
          </div>

          <Field
            label="Image URLs"
            hint="One URL per line, or comma-separated. First image is the thumbnail."
          >
            <textarea
              className={`${inputClass} min-h-[80px] font-mono text-xs resize-y`}
              value={form.imagesText}
              onChange={(e) =>
                setForm({ ...form, imagesText: e.target.value })
              }
              placeholder={"https://...\nhttps://..."}
            />
          </Field>

          {parseList(form.imagesText).length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {parseList(form.imagesText).slice(0, 6).map((u, i) => (
                <ImageThumb
                  key={i}
                  src={u}
                  alt={`Preview ${i + 1}`}
                  className="w-12 h-12 rounded-lg border border-white/10"
                />
              ))}
            </div>
          )}

          <Field label="Description">
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Product description..."
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Colors"
              hint="Comma-separated hex values, e.g. #10b981, #f59e0b"
            >
              <input
                className={inputClass}
                value={form.colorsText}
                onChange={(e) =>
                  setForm({ ...form, colorsText: e.target.value })
                }
                placeholder="#10b981, #f59e0b"
              />
            </Field>
            <Field
              label="Sizes"
              hint="Comma-separated, e.g. S, M, L, XL"
            >
              <input
                className={inputClass}
                value={form.sizesText}
                onChange={(e) =>
                  setForm({ ...form, sizesText: e.target.value })
                }
                placeholder="S, M, L, XL"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Field label="Badge" hint="Short label like 'New', 'Sale', 'Hot'">
              <input
                className={inputClass}
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="New"
              />
            </Field>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div>
                <div className="text-sm font-semibold text-white">
                  In Stock
                </div>
                <div className="text-xs text-slate-400">
                  Available for purchase
                </div>
              </div>
              <Toggle
                checked={form.inStock}
                onChange={(v) => setForm({ ...form, inStock: v })}
                label="In stock"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className={`${ghostBtnClass} flex-1`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`${primaryBtnClass} flex-1`}
            >
              {saving ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                <>
                  <Save size={15} /> {editingId ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// =====================================================================
// Section: Categories
// =====================================================================

interface CategoryForm {
  name: string;
  icon: string;
  color: string;
}

const emptyCategoryForm: CategoryForm = {
  name: "",
  icon: "tag",
  color: "#10b981",
};

function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyCategoryForm);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openAdd = () => {
    setForm(emptyCategoryForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setForm({ name: c.name, icon: c.icon, color: c.color });
    setEditingId(c.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        icon: form.icon.trim() || "tag",
        color: form.color,
      };
      const isEdit = editingId !== null;
      const url = "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? { id: editingId, ...payload } : payload;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      toast.success(isEdit ? "Category updated" : "Category created");
      setModalOpen(false);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Category) => {
    if (
      !window.confirm(
        `Delete category "${c.name}"? Products in this category may be affected.`
      )
    )
      return;
    try {
      const res = await fetch(
        `/api/admin/categories?id=${encodeURIComponent(c.id)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Delete failed");
      }
      toast.success("Category deleted");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Categories"
        subtitle={`${categories.length} categor${categories.length === 1 ? "y" : "ies"} in your catalog`}
        action={
          <button onClick={openAdd} className={primaryBtnClass}>
            <Plus size={15} /> Add Category
          </button>
        }
      />

      {loading ? (
        <div className={`${cardClass} p-10 flex items-center justify-center`}>
          <Spinner className="text-emerald-400" />
        </div>
      ) : categories.length === 0 ? (
        <div className={`${cardClass}`}>
          <EmptyState
            icon={Tags}
            title="No categories yet"
            subtitle="Click 'Add Category' to create your first one"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.id} className={`${cardClass} p-5 text-center`}>
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 border border-white/10"
                style={{ background: `${c.color}22` }}
              >
                <span
                  className="font-bold text-lg uppercase"
                  style={{ color: c.color }}
                >
                  {c.name.charAt(0)}
                </span>
              </div>
              <div className="text-sm font-semibold text-white truncate">
                {c.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                icon: {c.icon}
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span
                  className="inline-block w-3 h-3 rounded-full border border-white/20"
                  style={{ background: c.color }}
                />
                <span className="text-[10px] text-slate-500 font-mono">
                  {c.color}
                </span>
              </div>
              <div className="flex gap-1.5 mt-4">
                <button
                  onClick={() => openEdit(c)}
                  className={`${ghostBtnClass} flex-1 !py-2 !px-2`}
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className={`${dangerBtnClass} !py-2 !px-2.5`}
                  aria-label="Delete category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Category" : "Add Category"}
      >
        <div className="space-y-4">
          <Field label="Name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Electronics"
            />
          </Field>
          <Field
            label="Icon Name"
            hint="MaterialCommunityIcons name, e.g. laptop, tshirt, home"
          >
            <input
              className={`${inputClass} font-mono`}
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="laptop"
            />
          </Field>
          <ColorField
            label="Color"
            value={form.color}
            onChange={(v) => setForm({ ...form, color: v })}
          />
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className={`${ghostBtnClass} flex-1`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`${primaryBtnClass} flex-1`}
            >
              {saving ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                <>
                  <Save size={15} /> {editingId ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// =====================================================================
// Section: Coupons
// =====================================================================

interface CouponForm {
  code: string;
  description: string;
  type: CouponType;
  value: string;
  minSubtotal: string;
}

const emptyCouponForm: CouponForm = {
  code: "",
  description: "",
  type: "percent",
  value: "",
  minSubtotal: "0",
};

function CouponsSection() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [form, setForm] = useState<CouponForm>(emptyCouponForm);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openAdd = () => {
    setForm(emptyCouponForm);
    setEditingCode(null);
    setModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setForm({
      code: c.code,
      description: c.description,
      type: (c.type as CouponType) || "percent",
      value: String(c.value ?? ""),
      minSubtotal: String(c.minSubtotal ?? 0),
    });
    setEditingCode(c.code);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (form.value === "" || isNaN(Number(form.value))) {
      toast.error("Valid value is required");
      return;
    }
    setSaving(true);
    try {
      const isEdit = editingCode !== null;
      // When editing, use the original code as the identifier (code field is
      // disabled). When creating, use the uppercased value from the form.
      const code = isEdit ? editingCode : form.code.trim().toUpperCase();
      const body = {
        code,
        description: form.description.trim(),
        type: form.type,
        value: Number(form.value),
        minSubtotal: Number(form.minSubtotal) || 0,
      };
      const url = "/api/admin/coupons";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      toast.success(isEdit ? "Coupon updated" : "Coupon created");
      setModalOpen(false);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Coupon) => {
    if (!window.confirm(`Delete coupon "${c.code}"?`)) return;
    try {
      const res = await fetch(
        `/api/admin/coupons?code=${encodeURIComponent(c.code)}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Coupon deleted");
      await refresh();
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const typeLabel = (t: string) => {
    if (t === "percent") return "% off";
    if (t === "flat") return "flat off";
    return "free shipping";
  };

  const formatValue = (c: Coupon) => {
    if (c.type === "percent") return `${c.value}%`;
    if (c.type === "flat") return `$${c.value.toFixed(2)}`;
    return "Free";
  };

  return (
    <div>
      <SectionHeader
        title="Coupons"
        subtitle={`${coupons.length} coupon${coupons.length === 1 ? "" : "s"} available`}
        action={
          <button onClick={openAdd} className={primaryBtnClass}>
            <Plus size={15} /> Add Coupon
          </button>
        }
      />

      {loading ? (
        <div className={`${cardClass} p-10 flex items-center justify-center`}>
          <Spinner className="text-emerald-400" />
        </div>
      ) : coupons.length === 0 ? (
        <div className={`${cardClass}`}>
          <EmptyState
            icon={Ticket}
            title="No coupons yet"
            subtitle="Click 'Add Coupon' to create your first discount"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div
              key={c.code}
              className={`${cardClass} p-5 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 border-dashed">
                      <Ticket size={12} className="text-emerald-400" />
                      <span className="text-emerald-300 font-mono font-bold text-sm tracking-wider">
                        {c.code}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white">
                    {formatValue(c)}
                  </span>
                </div>
                <div className="text-xs text-slate-400 line-clamp-2 min-h-[2rem]">
                  {c.description || "No description"}
                </div>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-wider font-semibold">
                    {typeLabel(c.type)}
                  </span>
                  <span>Min subtotal: ${c.minSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEdit(c)}
                    className={`${ghostBtnClass} flex-1 !py-2`}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className={`${dangerBtnClass} !py-2 !px-3`}
                    aria-label="Delete coupon"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCode ? "Edit Coupon" : "Add Coupon"}
      >
        <div className="space-y-4">
          <Field
            label="Code"
            hint="Will be uppercased automatically. Used as the unique identifier."
          >
            <input
              className={`${inputClass} font-mono uppercase`}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="SAVE20"
              disabled={editingCode !== null}
            />
          </Field>
          <Field label="Description">
            <input
              className={inputClass}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="20% off your order"
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Type">
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as CouponType })
                }
              >
                <option value="percent" className="bg-slate-900">
                  Percent off
                </option>
                <option value="flat" className="bg-slate-900">
                  Flat amount off
                </option>
                <option value="shipping" className="bg-slate-900">
                  Free shipping
                </option>
              </select>
            </Field>
            <Field
              label={
                form.type === "percent"
                  ? "Value (%)"
                  : form.type === "flat"
                  ? "Value ($)"
                  : "Value (unused for shipping)"
              }
            >
              <input
                type="number"
                step="0.01"
                className={inputClass}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === "percent" ? "20" : "10"}
                disabled={form.type === "shipping"}
              />
            </Field>
          </div>
          <Field label="Minimum Subtotal">
            <input
              type="number"
              step="0.01"
              className={inputClass}
              value={form.minSubtotal}
              onChange={(e) =>
                setForm({ ...form, minSubtotal: e.target.value })
              }
              placeholder="0"
            />
          </Field>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className={`${ghostBtnClass} flex-1`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`${primaryBtnClass} flex-1`}
            >
              {saving ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                <>
                  <Save size={15} /> {editingCode ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// =====================================================================
// Sidebar
// =====================================================================

function SidebarContent({
  active,
  onNavigate,
  onLogout,
  loggingOut,
}: {
  active: Section;
  onNavigate: (s: Section) => void;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Shield className="text-white" size={20} />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">
              Shop With Faisu!!
            </div>
            <div className="text-[11px] text-slate-400">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition group ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon
                size={17}
                className={isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition disabled:opacity-60"
        >
          {loggingOut ? (
            <Spinner className="text-rose-300" />
          ) : (
            <LogOut size={17} />
          )}
          Logout
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// Analytics section
// =====================================================================

function AnalyticsSection() {
  const [data, setData] = useState<{
    totals: { users: number; signUps: number; signIns: number; products: number; categories: number; banners: number; coupons: number };
    last24h: { signIns: number; signUps: number };
    chart: { date: string; signups: number; signins: number }[];
    recentEvents: { id: string; type: string; email: string; name: string | null; createdAt: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-emerald-400" size={28} />
      </div>
    );
  }
  if (!data) {
    return <div className="text-center text-slate-400 py-20">Failed to load analytics.</div>;
  }

  const maxBar = Math.max(...data.chart.flatMap((d) => [d.signups, d.signins]), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">User sign-ups, sign-ins, and store activity</p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Users" value={data.totals.users} color="#10b981" />
        <StatCard icon={UserPlus} label="Total Sign-ups" value={data.totals.signUps} color="#8b5cf6" />
        <StatCard icon={LogIn} label="Total Sign-ins" value={data.totals.signIns} color="#f59e0b" />
        <StatCard icon={Activity} label="Sign-ins (24h)" value={data.last24h.signIns} color="#3b82f6" />
      </div>

      {/* secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat label="Products" value={data.totals.products} />
        <MiniStat label="Categories" value={data.totals.categories} />
        <MiniStat label="Banners" value={data.totals.banners} />
        <MiniStat label="Coupons" value={data.totals.coupons} />
      </div>

      {/* 7-day chart */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2"><TrendingUp size={15} className="text-emerald-400" /> Last 7 Days</h2>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Sign-ups</span>
            <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-amber-500" /> Sign-ins</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {data.chart.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex items-end justify-center gap-1 h-32">
                <div className="w-3 rounded-t bg-emerald-500/80 transition-all" style={{ height: `${(d.signups / maxBar) * 100}%`, minHeight: d.signups > 0 ? 4 : 0 }} title={`${d.signups} sign-ups`} />
                <div className="w-3 rounded-t bg-amber-500/80 transition-all" style={{ height: `${(d.signins / maxBar) * 100}%`, minHeight: d.signins > 0 ? 4 : 0 }} title={`${d.signins} sign-ins`} />
              </div>
              <span className="text-[9px] text-slate-500">{new Date(d.date).toLocaleDateString("en", { weekday: "short" })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* recent activity */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-3">Recent Activity</h2>
        {data.recentEvents.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No activity yet. When users sign up or sign in, it will appear here.</p>
        ) : (
          <div className="space-y-2">
            {data.recentEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02]">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ev.type === "signup" ? "bg-emerald-500/15" : "bg-amber-500/15"}`}>
                  {ev.type === "signup" ? <UserPlus size={14} className="text-emerald-400" /> : <LogIn size={14} className="text-amber-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{ev.name || ev.email}</p>
                  <p className="text-[10px] text-slate-400">{ev.type === "signup" ? "Signed up" : "Signed in"} · {ev.email}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{new Date(ev.createdAt).toLocaleString("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: number; color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ backgroundColor: color + "22" }}>
        <Icon size={17} style={{ color }} />
      </div>
      <p className="text-2xl font-extrabold text-white">{value.toLocaleString()}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  );
}

// =====================================================================
// Main admin dashboard
// =====================================================================

export default function AdminDashboard() {
  const router = useRouter();
  const [active, setActive] = useState<Section>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Signed out");
      router.push("/admin/login");
    } catch {
      toast.error("Logout failed");
      setLoggingOut(false);
    }
  };

  const navigate = (s: Section) => {
    setActive(s);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white/[0.02] backdrop-blur-xl border-r border-white/10 z-30">
        <SidebarContent
          active={active}
          onNavigate={navigate}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-slate-950 border-r border-white/10 shadow-2xl">
            <SidebarContent
              active={active}
              onNavigate={navigate}
              onLogout={handleLogout}
              loggingOut={loggingOut}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-3 px-4 h-14">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-slate-300 hover:text-white p-1 -ml-1"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Shield className="text-white" size={14} />
              </div>
              <span className="text-white font-semibold text-sm">
                Admin Panel
              </span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {active === "dashboard" && (
            <DashboardSection onNavigate={navigate} />
          )}
          {active === "branding" && <BrandingSection />}
          {active === "texts" && <TextsSection />}
          {active === "banners" && <BannersSection />}
          {active === "products" && <ProductsSection />}
          {active === "categories" && <CategoriesSection />}
          {active === "coupons" && <CouponsSection />}
          {active === "analytics" && <AnalyticsSection />}
        </main>
      </div>

      {/* Sonner toaster (dark theme) */}
      <SonnerToaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}
