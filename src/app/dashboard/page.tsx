"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Package,
  ScanBarcode,
  Bell,
  Clock,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import Link from "next/link";

import { StatCard } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  trendData,
  platformSummaries,
  topSKUs,
  bottomSKUs,
  dashboardAlertFeed,
  dashboardStats,
  skus,
  alerts,
} from "@/lib/mock-data";
import { formatCurrency, getMarginColor } from "@/lib/types";

// ─── Animation Variants ──────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const quickActionVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

const severityDotColors: Record<string, string> = {
  critical: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-400",
};

// ─── Helpers ─────────────────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

// ─── Micro Sparkline Component ───────────────────────────────────────
function MicroSparkline({ data, color }: { data: number[]; color: string }) {
  const width = 44;
  const height = 18;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="inline-block ml-2 align-middle">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Recharts Custom Tooltip ─────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// ─── Waterfall Data ──────────────────────────────────────────────────
const waterfallSegments = [
  { label: "Gross Revenue", value: dashboardStats.totalRevenue, color: "#10B981" },
  { label: "Platform Fees", value: 4840, color: "#EF4444" },
  { label: "Shipping", value: 3200, color: "#F59E0B" },
  { label: "Returns", value: 2100, color: "#EF4444" },
  { label: "Ad Spend", value: 4600, color: "#F97316" },
  { label: "COGS", value: 11550, color: "#DC2626" },
  { label: "Net Profit", value: dashboardStats.trueNetProfit, color: "#059669" },
];

// ─── Quick Actions Config ────────────────────────────────────────────
const criticalAlertCount = alerts.filter(
  (a) => !a.resolved && a.severity === "critical"
).length;

const quickActions = [
  {
    label: "Scan Product",
    href: "/dashboard/scan",
    icon: ScanBarcode,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  {
    label: "Check Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    badge: criticalAlertCount,
  },
  {
    label: "Low-Margin SKUs",
    href: "/dashboard/skus",
    icon: TrendingDown,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
  },
  {
    label: "Revenue / Hour",
    href: "/dashboard/hourly",
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
  },
];

// ─── Platform Colors ─────────────────────────────────────────────────
const platformColors: Record<string, string> = {
  Amazon: "#F97316",
  Shopify: "#10B981",
  eBay: "#3B82F6",
};

const platformBarColors: Record<string, string> = {
  Amazon: "bg-orange-500",
  Shopify: "bg-emerald-500",
  eBay: "bg-blue-500",
};

function getHealthDot(margin: number): string {
  if (margin >= 25) return "bg-emerald-500";
  if (margin >= 15) return "bg-amber-500";
  return "bg-red-500";
}

// ─── Main Component ──────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("profitpulse-onboarded")) {
      router.push("/dashboard/onboarding");
    }
  }, [router]);

  // SKUs with negative or <5% margins
  const lowMarginSKUs = useMemo(() => skus.filter((s) => s.margin < 5), []);

  // Sparkline data from trend data (last 10 points)
  const revenueSparkline = useMemo(
    () => trendData.slice(-10).map((d) => d.revenue),
    []
  );
  const profitSparkline = useMemo(
    () => trendData.slice(-10).map((d) => d.profit),
    []
  );

  // Platform total revenue for bar widths
  const totalPlatformRevenue = useMemo(
    () => platformSummaries.reduce((sum, p) => sum + p.revenue, 0),
    []
  );

  // Waterfall max value for bar widths
  const waterfallMax = dashboardStats.totalRevenue;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── 1. Time-Based Welcome Header ────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="relative rounded-xl bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/30 dark:to-transparent p-5 sm:p-6 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {getGreeting()}, Alex
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Here&apos;s your profit snapshot for today &middot;{" "}
                <span className="text-gray-400 dark:text-gray-500">{today}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <Badge
                variant="outline"
                className="text-xs font-medium text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-white/60 dark:bg-emerald-950/40"
              >
                Last updated: Just now
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Pain-Point Callout Banner ────────────────────────────── */}
      {lowMarginSKUs.length > 0 && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link href="/dashboard/skus">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 dark:from-amber-900/30 dark:via-red-900/30 dark:to-amber-900/30 border border-amber-300/60 dark:border-amber-700/40 p-4 cursor-pointer group transition-all hover:shadow-md hover:shadow-amber-500/10">
              {/* Animated pulse border effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-amber-400/30 dark:border-amber-500/20 animate-pulse pointer-events-none" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/40 p-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      {lowMarginSKUs.length} SKUs are losing money or barely breaking even
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {lowMarginSKUs.filter((s) => s.margin < 0).length} negative margin &middot;{" "}
                      {lowMarginSKUs.filter((s) => s.margin >= 0 && s.margin < 5).length} under 5% margin
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform whitespace-nowrap">
                  Fix Now <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* ── 3. Quick Actions Row ────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {quickActions.map((action, i) => (
          <motion.div key={action.label} variants={quickActionVariants} custom={i}>
            <Link href={action.href}>
              <Card
                className={`relative p-4 ${action.bg} ${action.border} border cursor-pointer group transition-all duration-200 hover:scale-[1.03] hover:shadow-md`}
              >
                {action.badge && action.badge > 0 && (
                  <span className="absolute top-2 right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1.5">
                    {action.badge}
                  </span>
                )}
                <action.icon className={`h-6 w-6 ${action.color} mb-2`} />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {action.label}
                </p>
                <ArrowRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 mt-1 group-hover:translate-x-1 transition-transform" />
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* ── 5. Enhanced Stats Row (with sparklines) ─────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="relative">
          <StatCard
            title="Total Revenue"
            value="34,520"
            change={12.3}
            icon={DollarSign}
            prefix="$"
          />
          <div className="absolute bottom-4 right-5 pointer-events-none">
            <MicroSparkline data={revenueSparkline} color="#10B981" />
          </div>
        </div>
        <div className="relative">
          <StatCard
            title="True Net Profit"
            value="8,230"
            change={-4.2}
            icon={TrendingUp}
            prefix="$"
          />
          <div className="absolute bottom-4 right-5 pointer-events-none">
            <MicroSparkline data={profitSparkline} color="#3B82F6" />
          </div>
        </div>
        <div className="relative">
          <StatCard title="Overall Margin" value="23.8%" change={1.2} icon={Percent} />
          <div className="absolute bottom-4 right-5 pointer-events-none">
            <MicroSparkline
              data={trendData.slice(-10).map((d) =>
                d.revenue > 0 ? (d.profit / d.revenue) * 100 : 0
              )}
              color="#F59E0B"
            />
          </div>
        </div>
        <div className="relative">
          <StatCard title="SKUs at Risk" value="7" change={-3} icon={AlertTriangle} />
        </div>
      </motion.div>

      {/* ── 4. Profit Waterfall Mini-Chart ──────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Where the Money Goes
          </h2>
          <div className="space-y-3">
            {waterfallSegments.map((seg, i) => {
              const pct = (seg.value / waterfallMax) * 100;
              const isDeduction =
                seg.label !== "Gross Revenue" && seg.label !== "Net Profit";
              return (
                <div key={seg.label} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-28 sm:w-32 text-right shrink-0">
                    {seg.label}
                  </span>
                  <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-md flex items-center justify-end pr-2"
                      style={{ backgroundColor: seg.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(pct, 4)}%` }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <span className="text-[11px] font-bold text-white drop-shadow-sm whitespace-nowrap">
                        {isDeduction ? "-" : ""}
                        {formatCurrency(seg.value)}
                      </span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* ── Profit Trend Chart ──────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            30-Day Profit Trend
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  className="text-gray-500"
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-gray-500"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#10b981"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#3b82f6"
                  fill="url(#colorProfit)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* ── 6. Enhanced Platform Breakdown ──────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Platform Breakdown
        </h2>

        {/* Revenue share bar */}
        <div className="mb-4 rounded-lg overflow-hidden flex h-3 bg-gray-100 dark:bg-gray-800">
          {platformSummaries.map((p) => {
            const share = (p.revenue / totalPlatformRevenue) * 100;
            return (
              <motion.div
                key={p.platform}
                className={`${platformBarColors[p.platform] || "bg-gray-400"} h-full`}
                initial={{ width: 0 }}
                animate={{ width: `${share}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                title={`${p.platform}: ${Math.round(share)}%`}
              />
            );
          })}
        </div>
        <div className="flex gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
          {platformSummaries.map((p) => (
            <span key={p.platform} className="flex items-center gap-1.5">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-sm ${platformBarColors[p.platform] || "bg-gray-400"}`}
              />
              {p.platform} {Math.round((p.revenue / totalPlatformRevenue) * 100)}%
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {platformSummaries.map((p) => (
            <Card key={p.platform} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{p.icon}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white flex-1">
                  {p.platform}
                </h3>
                {/* Health indicator dot */}
                <span
                  className={`h-2.5 w-2.5 rounded-full ${getHealthDot(p.margin)}`}
                  title={`Margin health: ${p.margin}%`}
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Revenue</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(p.revenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Profit</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(p.profit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Margin</span>
                  <span className={`font-medium ${getMarginColor(p.margin)}`}>
                    {p.margin}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">SKUs</span>
                  <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {p.skuCount}
                  </span>
                </div>
                {/* Revenue share mini bar */}
                <div className="pt-1">
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${platformBarColors[p.platform] || "bg-gray-400"}`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(p.revenue / totalPlatformRevenue) * 100}%`,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ── Leaderboard & Losers ────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Profit Leaderboard */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-emerald-500" />
            Profit Leaderboard
          </h2>
          <div className="space-y-3">
            {topSKUs.map((sku, index) => (
              <div
                key={sku.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400 w-5">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {sku.productName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {sku.platform} &middot; {sku.sku}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(sku.netProfit)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {sku.margin}% margin
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Money Losers */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ArrowDownRight className="h-5 w-5 text-red-500" />
            Money Losers
          </h2>
          <div className="space-y-3">
            {bottomSKUs.map((sku, index) => (
              <div
                key={sku.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400 w-5">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {sku.productName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {sku.platform} &middot; {sku.sku}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(sku.netProfit)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {sku.margin}% margin
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── 7. Enhanced Alert Feed ──────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Recent Alerts
            </h2>
            <Link
              href="/dashboard/alerts"
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardAlertFeed.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {/* Severity pulse dot */}
                <div className="mt-1.5 shrink-0">
                  <span className="relative flex h-2.5 w-2.5">
                    {alert.severity === "critical" && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${severityDotColors[alert.severity] || "bg-gray-400"}`}
                    />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {alert.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {getRelativeTime(alert.createdAt)}
                      </span>
                      <Badge
                        className={`text-[10px] shrink-0 capitalize ${severityColors[alert.severity] || ""}`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
