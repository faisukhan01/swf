"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Smartphone, Code2, Rocket, Github, Star, ShoppingBag, Heart, Search,
  Bell, Shield, Zap, Palette, Moon, Package, MapPin, CreditCard, Tag,
  ArrowRight, Check, ChevronRight, Terminal, Copy, CheckCheck, Layers,
  Navigation, Database, Boxes, GitBranch,
} from "lucide-react";
import { PhonePreview } from "@/components/phone/PhonePreview";
import { CodeBrowser } from "@/components/showcase/CodeBrowser";

export default function Home() {
  const [tab, setTab] = useState<"preview" | "code" | "setup">("preview");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* top nav */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-emerald-500/30 shadow-md">
              <Image src="/brand/logo.png" alt="Shop With Faisu" width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold tracking-tight">Shop With Faisu<span className="text-emerald-500">!!</span></p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">React Native + Expo</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <a href="#preview" className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600">Preview</a>
            <a href="#features" className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600">Features</a>
            <a href="#stack" className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600">Stack</a>
            <a href="#code" className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600">Code</a>
            <a href="#setup" className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600">Setup</a>
          </div>
          <a
            href="#setup"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 transition"
          >
            <Rocket size={13} /> Run it
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
              <Smartphone size={13} className="text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Built with React Native · Expo · TypeScript</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
              Shop With Faisu<span className="text-emerald-500">!!</span>
            </h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              A complete, real Android ecommerce app — source code in React Native + Expo. Browse the live interactive preview, then grab the actual code.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#preview" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-xl shadow-emerald-500/30 transition">
                <Smartphone size={16} /> Try the live preview
              </a>
              <a href="#code" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold hover:border-emerald-500 transition">
                <Code2 size={16} /> Browse the source
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Boxes size={13} className="text-emerald-500" /> 28 products · 8 categories</span>
              <span className="flex items-center gap-1.5"><Layers size={13} className="text-emerald-500" /> 16 screens</span>
              <span className="flex items-center gap-1.5"><GitBranch size={13} className="text-emerald-500" /> 57 source files</span>
              <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-500" /> tsc clean · expo bundles</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center lg:justify-end"
          >
            <PhonePreview />
          </motion.div>
        </div>

        {/* marquee of tech */}
        <div className="border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-semibold text-slate-400">
            <span>React Native</span><span className="text-slate-300">·</span>
            <span>Expo SDK 52</span><span className="text-slate-300">·</span>
            <span>TypeScript</span><span className="text-slate-300">·</span>
            <span>React Navigation</span><span className="text-slate-300">·</span>
            <span>Zustand</span><span className="text-slate-300">·</span>
            <span>AsyncStorage</span><span className="text-slate-300">·</span>
            <span>expo-image</span><span className="text-slate-300">·</span>
            <span>Reanimated</span>
          </div>
        </div>
      </section>

      {/* interactive preview / code / setup */}
      <section id="preview" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 w-full">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Interactive</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Three ways to explore the app</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Tap through a fully working phone preview, read every real source file, or follow the setup to run it on your own Android device.
          </p>
        </div>

        {/* tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {[
              { id: "preview" as const, label: "Live Preview", icon: Smartphone },
              { id: "code" as const, label: "Source Code", icon: Code2 },
              { id: "setup" as const, label: "Setup Guide", icon: Terminal },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
                  tab === t.id
                    ? "bg-white dark:bg-slate-950 text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <t.icon size={13} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "preview" && (
          <div className="grid lg:grid-cols-[auto_1fr] gap-10 items-start">
            <div className="flex justify-center">
              <PhonePreview />
            </div>
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold mb-1">A real, working app — right in your browser</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This is the actual app rendered into a phone frame. The cart, wishlist, dark mode, product details, checkout flow and order placement all work. State is persisted to your browser, just like the RN app uses AsyncStorage.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: ShoppingBag, title: "Add to cart", desc: "Tap any product → Add to Cart. Quantity steppers update live." },
                  { icon: Heart, title: "Wishlist", desc: "Heart any product; the Saved tab shows your favorites." },
                  { icon: CreditCard, title: "Checkout flow", desc: "Address → payment → place order → success screen → order history." },
                  { icon: Moon, title: "Dark mode", desc: "Profile → Dark Mode toggle. Whole app re-themes instantly." },
                  { icon: Search, title: "Search", desc: "Tap the search bar on Home for live filtering + trending searches." },
                  { icon: Tag, title: "Coupons", desc: "Apply FAISU10, FAISU25, WELCOME15 or FREESHIP in the cart." },
                ].map((f, i) => (
                  <div key={i} className="flex gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <f.icon size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{f.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <Zap size={13} className="inline mr-1 -mt-0.5" />
                  <strong>Tip:</strong> The preview is a faithful DOM rendering of the same screens and mock data used by the real React Native app. The actual RN source is in the <strong>Source Code</strong> tab.
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === "code" && (
          <div id="code">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">Browse the real React Native source</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Every file below is the actual source code from <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs">/mobile-app</code>. Click any file to read it, copy it, or download it.
                </p>
              </div>
            </div>
            <CodeBrowser />
          </div>
        )}

        {tab === "setup" && <SetupGuide />}
      </section>

      {/* features grid */}
      <section id="features" className="bg-slate-50 dark:bg-slate-950/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Feature-complete</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Everything a real shopping app needs</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">16 fully-built screens. No placeholders, no TODOs.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: ShoppingBag, title: "Shopping cart", desc: "Per-variant line items, quantity steppers, coupon codes, live totals." },
              { icon: CreditCard, title: "Checkout", desc: "Address selection, COD/Card/Wallet payment, order summary, place order." },
              { icon: Package, title: "Order history", desc: "Past orders with status badges, item thumbnails, totals and ETA." },
              { icon: Heart, title: "Wishlist", desc: "Save favorites, tap to open detail, persistent across launches." },
              { icon: Search, title: "Search & filter", desc: "Live search, trending queries, category browse, sort by price/rating." },
              { icon: Star, title: "Product detail", desc: "Image gallery, color/size variants, quantity, reviews, add-to-cart." },
              { icon: MapPin, title: "Address management", desc: "Multiple saved addresses, default tagging, add/edit/delete." },
              { icon: Bell, title: "Notifications", desc: "Promo, order and stock alerts with timestamps." },
              { icon: Moon, title: "Dark mode", desc: "Full theme swap, persisted via AsyncStorage, toggle in Profile." },
              { icon: Palette, title: "Material-3 styling", desc: "Emerald primary, amber accent, rounded cards, soft shadows." },
              { icon: Shield, title: "Auth flow", desc: "Login/Signup tabs with validation, persisted mock session." },
              { icon: Navigation, title: "Bottom tab nav", desc: "Home · Shop · Cart (badge) · Wishlist · Profile." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.05 }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                  <f.icon size={18} className="text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* stack */}
      <section id="stack" className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Architecture</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">The tech behind the app</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">A modern, production-ready React Native stack.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Smartphone, title: "Framework", items: ["Expo SDK ~52", "React Native 0.76", "TypeScript 5 (strict)"] },
            { icon: Navigation, title: "Navigation", items: ["React Navigation v6", "Native Stack", "Bottom Tabs"] },
            { icon: Database, title: "State & Data", items: ["Zustand + persist", "AsyncStorage", "Mock API layer"] },
            { icon: Palette, title: "UI & UX", items: ["expo-image", "@expo/vector-icons", "Reanimated animations"] },
          ].map((s, i) => (
            <div key={i} className="p-5 rounded-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800">
              <s.icon size={20} className="text-emerald-600 mb-3" />
              <h3 className="text-sm font-bold mb-2">{s.title}</h3>
              <ul className="space-y-1.5">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <Check size={11} className="text-emerald-500 shrink-0" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image src="/brand/logo.png" alt="" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold">Shop With Faisu<span className="text-emerald-500">!!</span></p>
              <p className="text-[10px] text-slate-500">React Native + Expo · v1.0.0</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center">
            Source code at <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600">/mobile-app</code> · Run with <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600">npx expo start</code>
          </p>
          <p className="text-xs text-slate-400">Built with care for Faisu 🛍️</p>
        </div>
      </footer>
    </div>
  );
}

function SetupGuide() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const steps = [
    {
      n: 1, title: "Install Node + Expo Go",
      desc: "Make sure Node 18+ is installed. On your Android phone, install Expo Go from the Play Store.",
      cmd: "node --version",
    },
    {
      n: 2, title: "Open the mobile-app folder",
      desc: "The full React Native project lives in the /mobile-app directory of this workspace.",
      cmd: "cd mobile-app",
    },
    {
      n: 3, title: "Install dependencies",
      desc: "Install all npm packages used by the Expo app.",
      cmd: "npm install",
    },
    {
      n: 4, title: "Start the Expo dev server",
      desc: "This prints a QR code and starts the Metro bundler.",
      cmd: "npx expo start",
    },
    {
      n: 5, title: "Open on your Android phone",
      desc: "Open Expo Go on your phone and scan the QR code shown in the terminal. The app downloads and runs natively.",
      cmd: "# scan the QR with Expo Go 📱",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black">Run it on your Android phone in 5 steps</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          No Android Studio required — just Node and the Expo Go app.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
              {s.n}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold">{s.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-2">{s.desc}</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800">
                <Terminal size={12} className="text-emerald-400 shrink-0" />
                <code className="flex-1 text-xs text-slate-200 font-mono overflow-x-auto whitespace-nowrap">{s.cmd}</code>
                {s.n < 5 && (
                  <button onClick={() => copy(s.cmd, `s${s.n}`)} className="shrink-0 text-slate-400 hover:text-white">
                    {copied === `s${s.n}` ? <CheckCheck size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <div className="flex items-start gap-3">
          <Rocket size={20} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold">That's it — you have a real Android app running</h4>
            <p className="text-xs text-emerald-50 mt-1 leading-relaxed">
              The same code can be published to the Play Store later by running <code className="px-1 py-0.5 rounded bg-white/20">eas build --platform android</code> to produce a signed .aab. For this sandbox, we can't compile native binaries (no Android SDK), so the live preview above is the fastest way to see the app in action.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        {[
          { label: "Project location", value: "/mobile-app" },
          { label: "Entry point", value: "App.tsx" },
          { label: "Bundle ID", value: "com.faisu.shopwithfaisu" },
        ].map((m) => (
          <div key={m.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">{m.label}</p>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-200 mt-0.5">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
