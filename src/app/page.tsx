"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ScanBarcode,
  BellRing,
  Clock,
  Check,
  ArrowRight,
  ChevronRight,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShieldCheck,
  Zap,
  BarChart3,
  Eye,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";

// ─── Profit Counter Data ────────────────────────────────────────────────────
const profitValues = [
  { value: "$7.59", positive: true, sku: "Wireless Earbuds Pro", margin: "30.4%" },
  { value: "-$2.30", positive: false, sku: "Silicone Phone Case", margin: "-8.2%" },
  { value: "$12.41", positive: true, sku: "Bamboo Cutting Board", margin: "42.5%" },
  { value: "-$4.87", positive: false, sku: "LED String Lights", margin: "-15.3%" },
  { value: "$3.22", positive: true, sku: "Yoga Resistance Bands", margin: "19.7%" },
  { value: "-$1.15", positive: false, sku: "Screen Protector 3-Pack", margin: "-4.6%" },
];

// ─── Revenue Breakdown Data ─────────────────────────────────────────────────
const revenueBreakdown = [
  { label: "COGS", percent: 40, color: "bg-slate-500" },
  { label: "Platform Fees", percent: 15, color: "bg-orange-500" },
  { label: "Shipping", percent: 8, color: "bg-blue-500" },
  { label: "Returns", percent: 5, color: "bg-red-400" },
  { label: "Ad Costs", percent: 10, color: "bg-purple-500" },
  { label: "YOUR ACTUAL PROFIT", percent: 22, color: "bg-emerald-500" },
];

// ─── Feature Cards Data ─────────────────────────────────────────────────────
const features = [
  {
    icon: LayoutDashboard,
    title: "Multi-Platform Dashboard",
    description:
      "See Amazon, Shopify, and eBay profits side-by-side. One view. Zero guessing.",
    highlight: false,
    link: "/dashboard",
  },
  {
    icon: ScanBarcode,
    title: "Barcode Profit Scanner",
    description:
      "Scan any product in-store. Get instant true profit after ALL fees. Know before you buy.",
    highlight: true,
    link: "/dashboard/scan",
  },
  {
    icon: BellRing,
    title: "Margin Alerts",
    description:
      "Get notified the moment a SKU dips below your profit threshold. Never bleed money silently.",
    highlight: false,
    link: "/dashboard/alerts",
  },
  {
    icon: Clock,
    title: "Revenue / Hour",
    description:
      "Track your actual hourly rate across sourcing, listing, and shipping. Know your true wage.",
    highlight: false,
    link: "/dashboard/hourly",
  },
];

// ─── Pricing Data ───────────────────────────────────────────────────────────
const pricingTiers = [
  {
    name: "Starter",
    price: 29,
    popular: false,
    features: [
      "1 platform connected",
      "Up to 200 SKUs",
      "Profit dashboard",
      "Basic margin alerts",
      "7-day trend history",
    ],
  },
  {
    name: "Growth",
    price: 59,
    popular: true,
    features: [
      "3 platforms connected",
      "Up to 1,000 SKUs",
      "Barcode scanner",
      "Trend detection & insights",
      "Ad cost attribution",
      "30-day trend history",
      "Email & Slack alerts",
    ],
  },
  {
    name: "Pro",
    price: 99,
    popular: false,
    features: [
      "Unlimited platforms",
      "Unlimited SKUs",
      "Revenue-per-hour tracking",
      "Team access (up to 5)",
      "Custom COGS import (CSV)",
      "90-day trend history",
      "API access",
      "Priority support",
    ],
  },
];

// ─── Stats Data ─────────────────────────────────────────────────────────────
const stats = [
  { label: "Active Sellers", value: "2,400+", icon: Package },
  { label: "SKUs Tracked", value: "380K+", icon: BarChart3 },
  { label: "Hidden Fees Found", value: "$2.1M+", icon: Eye },
  { label: "Avg Margin Boost", value: "+18%", icon: TrendingUp },
];

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function LandingPage() {
  // ─── Profit Counter State ───────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % profitValues.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const currentProfit = profitValues[currentIndex];

  // ─── Waitlist State ─────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* ━━━ NAVIGATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" />
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Live Demo
              </Link>
              <Link
                href="/dashboard/scan"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25"
              >
                <ScanBarcode className="w-4 h-4" />
                Try Scanner
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative pt-16 bg-[#1E293B] overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
            >
              <Zap className="w-4 h-4" />
              Real-time profit intelligence for e-commerce sellers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              You Think You Know
              <br />
              Your Margins.{" "}
              <span className="text-emerald-400">You Don&apos;t.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="mt-6 sm:mt-8 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              Platform fees, FBA charges, returns, ad spend — they&apos;re
              silently eating your profit on every single sale. ProfitPulse
              reveals your{" "}
              <span className="text-white font-medium">true margins</span> in
              real time.
            </motion.p>

            {/* Animated Profit Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 sm:mt-14 inline-flex flex-col items-center bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/50 px-8 sm:px-12 py-6 sm:py-8 shadow-2xl"
            >
              <span className="text-xs sm:text-sm uppercase tracking-widest text-slate-500 font-medium mb-1">
                Real Profit Per Unit
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: 90 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col items-center"
                >
                  <span
                    className={`text-5xl sm:text-6xl md:text-7xl font-black tabular-nums ${
                      currentProfit.positive
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {currentProfit.value}
                  </span>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-slate-500 text-sm">
                      {currentProfit.sku}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      currentProfit.positive
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {currentProfit.margin}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/dashboard/scan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
              >
                <ScanBarcode className="w-5 h-5" />
                Try the Scanner
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-slate-600 text-slate-300 font-semibold text-lg hover:border-emerald-500 hover:text-emerald-400 transition-all hover:scale-105"
              >
                <LayoutDashboard className="w-5 h-5" />
                View Dashboard Demo
              </Link>
            </motion.div>

            {/* Trust badge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-6 text-sm text-slate-500 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              No credit card required. Full demo with mock data.
            </motion.p>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ━━━ SOCIAL PROOF STATS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ PROBLEM VISUALIZATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 sm:py-28 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Where Your Money{" "}
              <span className="text-emerald-500">Actually</span> Goes
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              For every $100 in revenue, here&apos;s the brutal breakdown most
              sellers never see.
            </p>
          </motion.div>

          {/* Revenue Breakdown Bar */}
          <div className="space-y-4">
            <div className="flex rounded-2xl overflow-hidden h-14 sm:h-16 shadow-lg">
              {revenueBreakdown.map((segment, i) => (
                <motion.div
                  key={segment.label}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${segment.percent}%` }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: "easeOut",
                  }}
                  className={`${segment.color} relative flex items-center justify-center overflow-hidden group`}
                >
                  <span className="text-white font-bold text-[10px] sm:text-xs md:text-sm whitespace-nowrap px-1 drop-shadow-md">
                    {segment.percent >= 10 ? segment.label : ""}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-6">
              {revenueBreakdown.map((segment) => (
                <div key={segment.label} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-sm ${segment.color}`}
                  />
                  <span
                    className={`text-xs sm:text-sm ${
                      segment.label === "YOUR ACTUAL PROFIT"
                        ? "font-bold text-emerald-600"
                        : "text-slate-600"
                    }`}
                  >
                    {segment.label} ({segment.percent}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Problem-to-Solution CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-lg text-slate-600 mb-4">
              <span className="font-bold text-slate-900">78% of sellers</span> unknowingly run money-losing SKUs for months.
            </p>
            <Link
              href="/dashboard/skus"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              See how we break down every SKU
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━ INTERACTIVE DEMO PREVIEW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 sm:py-28 bg-[#1E293B] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              See It In <span className="text-emerald-400">Action</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Explore the full dashboard with real mock data from a fictional Amazon/Shopify seller.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Scanner Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Link href="/dashboard/scan" className="block">
                <div className="relative rounded-2xl bg-slate-800 border-2 border-emerald-500 p-6 text-center shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-shadow h-full">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Try Now
                  </div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <ScanBarcode className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Barcode Scanner</h3>
                  <p className="text-sm text-slate-400 mb-4">Scan a product, get instant profit/loss with GO or NO-GO verdict</p>
                  <div className="flex items-center justify-center gap-1 text-emerald-400 font-semibold text-sm">
                    Try it live <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Dashboard Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Link href="/dashboard" className="block">
                <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6 text-center shadow-lg hover:border-slate-500 transition-colors h-full">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Profit Dashboard</h3>
                  <p className="text-sm text-slate-400 mb-4">See revenue, profit trends, platform breakdown, and leaderboards</p>
                  <div className="flex items-center justify-center gap-1 text-blue-400 font-semibold text-sm">
                    View dashboard <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* SKU Table Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Link href="/dashboard/skus" className="block">
                <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6 text-center shadow-lg hover:border-slate-500 transition-colors h-full">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                    <Package className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">127 Live SKUs</h3>
                  <p className="text-sm text-slate-400 mb-4">Sort, filter, and drill into every cost for each product</p>
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-semibold text-sm">
                    Explore SKUs <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ FEATURE CARDS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="features"
        className="py-20 sm:py-28 lg:py-32 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to{" "}
              <span className="text-emerald-500">Stop Guessing</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Built by sellers, for sellers. Every feature exists because we
              lost money without it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    className={`relative rounded-2xl bg-white p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full ${
                      feature.highlight
                        ? "border-2 border-emerald-500 ring-4 ring-emerald-500/10"
                        : "border border-slate-200"
                    }`}
                  >
                    {feature.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Viral Feature
                      </div>
                    )}
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                        feature.highlight
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className={`mt-4 flex items-center gap-1 text-sm font-semibold ${
                      feature.highlight ? "text-emerald-600" : "text-slate-600"
                    }`}>
                      Try it <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              How <span className="text-emerald-500">ProfitPulse</span> Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect Your Stores",
                description: "Link Amazon, Shopify, or eBay in 60 seconds. We pull your orders, fees, and costs automatically.",
                icon: Zap,
              },
              {
                step: "2",
                title: "See True Profit",
                description: "Every SKU gets a complete cost breakdown — platform fees, FBA, shipping, returns, ads. No more guessing.",
                icon: Eye,
              },
              {
                step: "3",
                title: "Act on Insights",
                description: "Get alerts before you bleed money. Scale winners. Kill losers. Make decisions in seconds, not spreadsheets.",
                icon: TrendingUp,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 text-white text-xl font-black mb-4 shadow-lg shadow-emerald-500/25">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ PRICING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="pricing" className="py-20 sm:py-28 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Simple, Transparent{" "}
              <span className="text-emerald-500">Pricing</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Know exactly what you pay. Ironic if we didn&apos;t practice what
              we preach.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col ${
                  tier.popular
                    ? "bg-[#1E293B] text-white border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-[1.02] md:scale-105"
                    : "bg-white text-slate-900 border border-slate-200 shadow-md"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className={`text-lg font-bold ${
                      tier.popular ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-5xl font-black">${tier.price}</span>
                    <span
                      className={`text-sm ${
                        tier.popular ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      / month
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          tier.popular
                            ? "text-emerald-400"
                            : "text-emerald-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          tier.popular ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] ${
                    tier.popular
                      ? "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/30"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {tier.popular ? "Start Free Trial" : "Get Started"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ WAITLIST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="waitlist" className="relative py-20 sm:py-28 lg:py-32 bg-[#1E293B] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Join{" "}
              <span className="text-emerald-400">2,400+</span> Sellers
              <br />
              Already Waiting
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
              Be the first to know when ProfitPulse launches. Early access
              members get 30% off for life.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleWaitlist}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 whitespace-nowrap hover:scale-105"
            >
              Join Waitlist
            </button>
          </motion.form>

          <AnimatePresence>
            {submitted && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-emerald-400 font-medium text-sm"
              >
                You&apos;re on the list! We&apos;ll be in touch soon.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Quick demo link below waitlist */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-4 text-sm"
          >
            <span className="text-slate-500">Want to see it first?</span>
            <Link
              href="/dashboard"
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
            >
              Explore the demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="bg-[#0F172A] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#features" className="hover:text-slate-300 transition-colors">
                Features
              </a>
              <a href="#pricing" className="hover:text-slate-300 transition-colors">
                Pricing
              </a>
              <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
                Demo
              </Link>
              <Link href="/dashboard/scan" className="hover:text-slate-300 transition-colors">
                Scanner
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center sm:text-left">
            <p className="text-sm text-slate-600">
              &copy; {new Date().getFullYear()} ProfitPulse. All rights
              reserved. Built for sellers who refuse to fly blind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
