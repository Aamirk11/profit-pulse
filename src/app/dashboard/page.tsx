"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Percent,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
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
} from "@/lib/mock-data";
import { formatCurrency, getMarginColor } from "@/lib/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

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

export default function DashboardPage() {
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
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profit Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          QuickFlip Commerce &middot; {today}
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard title="Total Revenue" value="34,520" change={12.3} icon={DollarSign} prefix="$" />
        <StatCard title="True Net Profit" value="8,230" change={-4.2} icon={TrendingUp} prefix="$" />
        <StatCard title="Overall Margin" value="23.8%" change={1.2} icon={Percent} />
        <StatCard title="SKUs at Risk" value="7" change={-3} icon={AlertTriangle} />
      </motion.div>

      {/* Profit Trend Chart */}
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
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
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

      {/* Platform Breakdown */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Platform Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {platformSummaries.map((p) => (
            <Card key={p.platform} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{p.icon}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {p.platform}
                </h3>
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
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard & Losers */}
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

      {/* Alert Feed */}
      <motion.div variants={itemVariants}>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Recent Alerts
            </h2>
            <Link
              href="/dashboard/alerts"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardAlertFeed.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <Badge
                  className={`mt-0.5 text-xs shrink-0 capitalize ${severityColors[alert.severity] || ""}`}
                >
                  {alert.severity}
                </Badge>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {alert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
