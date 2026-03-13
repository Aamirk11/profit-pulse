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
  AlertTriangle,
  X,
  Calculator,
  Smartphone,
  RefreshCw,
  Target,
  Users,
  BadgeDollarSign,
  CircleDollarSign,
  Receipt,
  Truck,
  Megaphone,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

// ─── Profit Counter ─────────────────────────────────────────────────────
const profitValues = [
  { value: "$7.59", positive: true, sku: "Wireless Earbuds Pro", margin: "30.4%", verdict: "PROFIT" },
  { value: "-$2.30", positive: false, sku: "Silicone Phone Case", margin: "-8.2%", verdict: "LOSING MONEY" },
  { value: "$12.41", positive: true, sku: "Bamboo Cutting Board", margin: "42.5%", verdict: "PROFIT" },
  { value: "-$4.87", positive: false, sku: "LED String Lights", margin: "-15.3%", verdict: "LOSING MONEY" },
  { value: "$3.22", positive: true, sku: "Yoga Resistance Bands", margin: "19.7%", verdict: "THIN MARGIN" },
  { value: "-$1.15", positive: false, sku: "Screen Protector 3-Pack", margin: "-4.6%", verdict: "LOSING MONEY" },
];

// ─── Hidden Fee Data ────────────────────────────────────────────────────
const hiddenFees = [
  { icon: Receipt, label: "Referral Fees", percent: "8-15%", color: "text-orange-500", description: "Amazon takes up to 15% before you see a dime" },
  { icon: Package, label: "FBA Fulfillment", percent: "$3-8/unit", color: "text-blue-500", description: "Pick, pack, and ship fees that vary by size and weight" },
  { icon: Truck, label: "Shipping to FBA", percent: "$0.50-3/unit", color: "text-purple-500", description: "Getting your inventory TO Amazon costs money too" },
  { icon: RotateCcw, label: "Returns & Refunds", percent: "3-15%", color: "text-red-500", description: "You eat the return shipping AND the restocking loss" },
  { icon: Megaphone, label: "PPC Ad Costs", percent: "10-30%", color: "text-pink-500", description: "ACoS creeping up? Most sellers don't track per-SKU ad cost" },
  { icon: CreditCard, label: "Payment Processing", percent: "2.9%", color: "text-cyan-500", description: "Stripe, Shopify Payments — another slice off every sale" },
];

// ─── Pain Points ────────────────────────────────────────────────────────
const painPoints = [
  {
    scenario: "You sold 340 units of your 'best seller' last month",
    reality: "After Amazon fees, returns, and ad costs, you actually lost $1.80 per unit. That's $612 gone.",
    icon: TrendingDown,
  },
  {
    scenario: "You found a 'great deal' at retail — $15 product selling for $34 on Amazon",
    reality: "FBA fees ($6.23), referral fee ($5.10), shipping to warehouse ($2.40). True profit: $5.27 — not the $19 you imagined.",
    icon: Calculator,
  },
  {
    scenario: "You check your Seller Central dashboard and see $34,000 in revenue",
    reality: "Your true take-home after ALL costs? About $7,800. The other $26,200 went to fees you're not fully tracking.",
    icon: Eye,
  },
];

// ─── Testimonials ───────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "I discovered 23 SKUs that were LOSING money every single day. I had no idea. ProfitPulse paid for itself in the first hour.",
    name: "Marcus T.",
    role: "Amazon FBA Seller, $420K/yr revenue",
    avatar: "M",
  },
  {
    quote: "The barcode scanner alone is worth 10x the price. I use it every time I source at retail. Saved me from buying 40+ money-losing products.",
    name: "Sarah K.",
    role: "Retail Arbitrage, 1,200+ SKUs",
    avatar: "S",
  },
  {
    quote: "We went from guessing margins in spreadsheets to knowing our true profit within seconds. Revenue went up 31% in 2 months because we finally knew what to scale.",
    name: "James & Dev",
    role: "Shopify + Amazon, 2-person team",
    avatar: "J",
  },
];

// ─── Features ───────────────────────────────────────────────────────────
const features = [
  {
    icon: LayoutDashboard,
    title: "True Profit Dashboard",
    description: "See real profit — not vanity revenue — across Amazon, Shopify, and eBay. Updated in real-time as orders come in.",
    painSolved: "No more end-of-month spreadsheet surprises",
    highlight: false,
    link: "/dashboard",
  },
  {
    icon: ScanBarcode,
    title: "Instant Barcode Scanner",
    description: "Point. Scan. Know. Get instant profit/loss calculation with a BUY or SKIP verdict in 3 seconds flat.",
    painSolved: "Never buy a money-losing product again",
    highlight: true,
    link: "/dashboard/scan",
  },
  {
    icon: BellRing,
    title: "Profit Bleed Alerts",
    description: "Get notified the second a SKU dips below your margin threshold. Catch fee increases, return spikes, and competitor price drops.",
    painSolved: "Stop losing money for weeks before noticing",
    highlight: false,
    link: "/dashboard/alerts",
  },
  {
    icon: Clock,
    title: "Revenue Per Hour",
    description: "Is retail arbitrage worth your time? Track actual $/hour across every activity so you focus where the money is.",
    painSolved: "Stop wasting hours on low-ROI tasks",
    highlight: false,
    link: "/dashboard/hourly",
  },
];

// ─── Pricing ────────────────────────────────────────────────────────────
const pricingTiers = [
  {
    name: "Starter",
    price: 29,
    popular: false,
    description: "For sellers just getting visibility",
    features: [
      "1 platform connected",
      "Up to 200 SKUs",
      "Profit dashboard",
      "Basic margin alerts",
      "7-day trend history",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Growth",
    price: 59,
    popular: true,
    description: "For serious sellers scaling up",
    features: [
      "3 platforms connected",
      "Up to 1,000 SKUs",
      "Barcode scanner (unlimited)",
      "AI trend detection & insights",
      "Ad cost attribution per SKU",
      "30-day trend history",
      "Email & Slack alerts",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Pro",
    price: 99,
    popular: false,
    description: "For teams running at scale",
    features: [
      "Unlimited platforms & SKUs",
      "Revenue-per-hour tracking",
      "Team access (up to 5 seats)",
      "Custom COGS import (CSV/API)",
      "90-day trend + seasonal data",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeFee, setActiveFee] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % profitValues.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFee((prev) => (prev + 1) % hiddenFees.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentProfit = profitValues[currentIndex];

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* ━━━ NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" />
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Live Demo
              </Link>
              <Link
                href="/dashboard/scan"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                <ScanBarcode className="w-4 h-4" />
                <span className="hidden sm:inline">Try Scanner Free</span>
                <span className="sm:hidden">Try Free</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative pt-16 bg-[#1E293B] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/8 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            {/* Urgency badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-8"
            >
              <AlertTriangle className="w-4 h-4" />
              The average seller loses $4,200/year to fees they don&apos;t track
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
            >
              You Think You&apos;re
              <br />
              Profitable.{" "}
              <span className="relative">
                <span className="text-red-400 line-through decoration-red-500/50 decoration-[3px]">You&apos;re Not.</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="mt-6 sm:mt-8 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              Amazon fees, FBA charges, returns, ad spend, storage costs — they&apos;re
              silently <span className="text-red-400 font-semibold">eating 60-78% of every sale</span>.
              Most sellers don&apos;t see it until it&apos;s too late.
              <br /><br />
              <span className="text-white font-medium">ProfitPulse shows you the truth. In real time. Per SKU.</span>
            </motion.p>

            {/* Live Profit Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 sm:mt-14 inline-flex flex-col items-center bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 px-8 sm:px-14 py-6 sm:py-8 shadow-2xl"
            >
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500 font-medium mb-2">
                True profit per unit — right now
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
                      currentProfit.positive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {currentProfit.value}
                  </span>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-slate-500 text-sm">{currentProfit.sku}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      currentProfit.positive
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {currentProfit.verdict}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/dashboard/scan"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
              >
                <ScanBarcode className="w-5 h-5" />
                Scan a Product Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-slate-600 text-slate-300 font-semibold text-lg hover:border-emerald-500/50 hover:text-emerald-400 transition-all hover:scale-105"
              >
                <BarChart3 className="w-5 h-5" />
                See Full Dashboard
              </Link>
            </motion.div>

            {/* Trust */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                No credit card needed
              </span>
              <span className="hidden sm:block text-slate-700">|</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-500" />
                Works in 60 seconds
              </span>
              <span className="hidden sm:block text-slate-700">|</span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-emerald-500" />
                Cancel anytime
              </span>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ━━━ SOCIAL PROOF BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-8 sm:py-10 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "2,400+", label: "Sellers on waitlist", icon: Users },
              { value: "$2.1M+", label: "Hidden fees uncovered", icon: Eye },
              { value: "380K+", label: "SKUs analyzed", icon: Package },
              { value: "3 sec", label: "Barcode scan to verdict", icon: Zap },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="text-center"
                >
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ THE PROBLEM — HIDDEN FEES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Your Revenue Looks Great.
              <br />
              <span className="text-red-500">Your Profit Doesn&apos;t.</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              For every $100 in sales, here&apos;s where your money <em>actually</em> goes.
              Most sellers only see the first line.
            </p>
          </motion.div>

          {/* Revenue Breakdown — Visual */}
          <div className="max-w-4xl mx-auto">
            {/* The bar */}
            <div className="flex rounded-2xl overflow-hidden h-16 sm:h-20 shadow-xl mb-8">
              {[
                { label: "COGS", percent: 40, color: "bg-slate-600" },
                { label: "Platform Fees", percent: 15, color: "bg-orange-500" },
                { label: "Shipping", percent: 8, color: "bg-blue-500" },
                { label: "Returns", percent: 5, color: "bg-red-500" },
                { label: "Ad Costs", percent: 10, color: "bg-purple-500" },
                { label: "PROFIT", percent: 22, color: "bg-emerald-500" },
              ].map((segment, i) => (
                <motion.div
                  key={segment.label}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${segment.percent}%` }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  className={`${segment.color} relative flex items-center justify-center overflow-hidden`}
                >
                  <span className="text-white font-bold text-[9px] sm:text-xs whitespace-nowrap px-1 drop-shadow-md">
                    {segment.percent >= 8 ? `${segment.label} ${segment.percent}%` : ""}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Callout */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-center mb-12"
            >
              <p className="text-lg font-bold text-slate-900">
                You think you made <span className="text-emerald-600">$100</span>.
                You actually made <span className="text-emerald-600">$22</span>.
              </p>
              <p className="text-slate-500 text-sm mt-1">
                And that&apos;s the <em>average</em>. Some of your SKUs are even worse.
              </p>
            </motion.div>

            {/* Hidden Fee Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hiddenFees.map((fee, i) => {
                const Icon = fee.icon;
                return (
                  <motion.div
                    key={fee.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="rounded-xl border border-slate-200 p-4 hover:border-red-200 hover:bg-red-50/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${fee.color}`} />
                      <span className="font-bold text-sm text-slate-900">{fee.label}</span>
                    </div>
                    <p className="text-2xl font-black text-red-500 mb-1">{fee.percent}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{fee.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-10 text-center"
            >
              <p className="text-lg text-slate-600 mb-4">
                <span className="font-bold text-slate-900">Are you tracking all of these per SKU?</span> Probably not.
              </p>
              <Link
                href="/dashboard/skus"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-lg hover:scale-105"
              >
                See the full SKU breakdown
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ PAIN POINTS — REAL SCENARIOS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Sound <span className="text-red-500">Familiar</span>?
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              These scenarios happen to sellers every single day.
            </p>
          </motion.div>

          <div className="space-y-6">
            {painPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-red-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-base sm:text-lg font-medium text-slate-700 mb-2">
                        {point.scenario}...
                      </p>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-base font-bold text-red-600">
                          {point.reality}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 text-center"
          >
            <p className="text-xl font-bold text-slate-900 mb-2">
              What if you could see your true profit <em>before</em> you buy?
            </p>
            <p className="text-slate-500 mb-6">That&apos;s exactly what the barcode scanner does.</p>
            <Link
              href="/dashboard/scan"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/50 hover:scale-105"
            >
              <ScanBarcode className="w-5 h-5" />
              Try the Scanner
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━ FEATURES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Four Tools. <span className="text-emerald-500">Zero Blind Spots.</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Every feature exists because we lost money without it. Built by sellers, for sellers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`relative rounded-2xl bg-white p-6 sm:p-8 shadow-md hover:shadow-xl transition-all cursor-pointer h-full ${
                      feature.highlight
                        ? "border-2 border-emerald-500 ring-4 ring-emerald-500/10"
                        : "border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {feature.highlight && (
                      <div className="absolute -top-3 left-6 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Most Loved Feature
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                        feature.highlight ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700"
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                        <p className={`mt-3 text-sm font-semibold flex items-center gap-1.5 ${
                          feature.highlight ? "text-emerald-600" : "text-slate-700"
                        }`}>
                          <Check className="w-4 h-4" />
                          {feature.painSolved}
                        </p>
                        <span className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${
                          feature.highlight ? "text-emerald-600" : "text-slate-600"
                        }`}>
                          Try it free <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ INTERACTIVE DEMO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
              Don&apos;t Take Our Word For It.
              <br />
              <span className="text-emerald-400">Try It Yourself.</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Full interactive demo with 127 real SKUs. No signup required. See exactly what you get.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                href: "/dashboard/scan",
                icon: ScanBarcode,
                iconColor: "text-emerald-400",
                bgColor: "bg-emerald-500/20",
                borderColor: "border-emerald-500",
                label: "Try Now",
                title: "Barcode Scanner",
                desc: "Scan a product. Get instant BUY or SKIP verdict with full fee breakdown.",
                linkColor: "text-emerald-400",
                featured: true,
              },
              {
                href: "/dashboard",
                icon: BarChart3,
                iconColor: "text-blue-400",
                bgColor: "bg-blue-500/20",
                borderColor: "border-slate-700 hover:border-blue-500/50",
                title: "Profit Dashboard",
                desc: "Revenue trends, platform breakdown, profit leaderboard — all live.",
                linkColor: "text-blue-400",
                featured: false,
              },
              {
                href: "/dashboard/skus",
                icon: Package,
                iconColor: "text-amber-400",
                bgColor: "bg-amber-500/20",
                borderColor: "border-slate-700 hover:border-amber-500/50",
                title: "127 SKU Breakdown",
                desc: "Sort, filter, drill into every cost. See which products are bleeding money.",
                linkColor: "text-amber-400",
                featured: false,
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <Link href={card.href} className="block h-full">
                    <div className={`relative rounded-2xl bg-slate-800 border-2 ${card.borderColor} p-6 text-center shadow-xl transition-all h-full flex flex-col`}>
                      {card.featured && card.label && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {card.label}
                        </div>
                      )}
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${card.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-8 h-8 ${card.iconColor}`} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-sm text-slate-400 mb-4 flex-1">{card.desc}</p>
                      <span className={`inline-flex items-center justify-center gap-1 ${card.linkColor} font-semibold text-sm`}>
                        Explore now <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Sellers Who Stopped <span className="text-emerald-500">Flying Blind</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
              Up and Running in <span className="text-emerald-500">60 Seconds</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                step: "1",
                title: "Connect Your Store",
                description: "Link Amazon, Shopify, or eBay. We pull orders, fees, and costs automatically. One click.",
              },
              {
                step: "2",
                title: "See True Profit Per SKU",
                description: "Every product gets a complete cost breakdown. Platform fees, FBA, shipping, returns, ads — all of it.",
              },
              {
                step: "3",
                title: "Act Before You Lose",
                description: "Scale winners. Kill losers. Get alerts before margins tank. Scan products before you buy. Never fly blind.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500 text-white text-2xl font-black mb-5 shadow-lg shadow-emerald-500/25">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ PRICING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="pricing" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Pays for Itself in <span className="text-emerald-500">One SKU</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Find one money-losing product and the subscription pays for itself. Most sellers find 5-10 in the first week.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                  <h3 className={`text-lg font-bold ${tier.popular ? "text-slate-300" : "text-slate-500"}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs mt-1 ${tier.popular ? "text-slate-400" : "text-slate-400"}`}>
                    {tier.description}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-5xl font-black">${tier.price}</span>
                    <span className={`text-sm ${tier.popular ? "text-slate-400" : "text-slate-500"}`}>/month</span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.popular ? "text-emerald-400" : "text-emerald-500"}`} />
                      <span className={`text-sm ${tier.popular ? "text-slate-300" : "text-slate-600"}`}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] ${
                    tier.popular
                      ? "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/30"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {tier.cta}
                </Link>
                <p className={`text-center text-xs mt-3 ${tier.popular ? "text-slate-500" : "text-slate-400"}`}>
                  14-day free trial. No credit card.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FINAL CTA / WAITLIST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="waitlist" className="relative py-20 sm:py-28 lg:py-32 bg-[#1E293B] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[140px]" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Stop Selling Products
              <br />
              That <span className="text-red-400">Lose You Money</span>
            </h2>
            <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Join <span className="text-white font-semibold">2,400+ sellers</span> who are done guessing.
              Early access members lock in <span className="text-emerald-400 font-semibold">30% off for life</span>.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleWaitlist}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
            <Button
              type="submit"
              className="px-8 py-4 h-auto rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 whitespace-nowrap hover:scale-105"
            >
              Get Early Access
            </Button>
          </motion.form>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 inline-flex items-center gap-2 text-emerald-400 font-medium text-sm"
              >
                <Check className="w-4 h-4" />
                You&apos;re in! Check your email for early access details.
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm"
          >
            <span className="text-slate-500">Can&apos;t wait?</span>
            <Link
              href="/dashboard/scan"
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
            >
              <ScanBarcode className="w-4 h-4" />
              Try the scanner right now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="bg-[#0F172A] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a>
              <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Demo</Link>
              <Link href="/dashboard/scan" className="hover:text-emerald-400 transition-colors font-medium">Scanner</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center sm:text-left">
            <p className="text-sm text-slate-600">
              &copy; {new Date().getFullYear()} ProfitPulse. All rights reserved.
              Built for sellers who refuse to fly blind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
