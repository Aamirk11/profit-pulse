export type Platform = "Amazon" | "Shopify" | "eBay";
export type Category = "Electronics" | "Home & Kitchen" | "Toys" | "Health & Beauty";
export type TrendDirection = "up" | "down" | "flat";
export type AlertSeverity = "critical" | "warning" | "info";
export type MarginTier = "excellent" | "good" | "warning" | "danger" | "negative";

export interface SKU {
  id: string;
  sku: string;
  productName: string;
  platform: Platform;
  category: Category;
  imageUrl?: string;
  revenue: number;
  cogs: number;
  platformFees: {
    referralFee: number;
    fulfillmentFee: number;
    storageFee: number;
    processingFee: number;
  };
  adCost: number;
  returnCost: number;
  shippingCost: number;
  netProfit: number;
  margin: number;
  trend: TrendDirection;
  unitsSold: number;
  returnRate: number;
  dailyData?: DailyData[];
}

export interface DailyData {
  date: string;
  revenue: number;
  profit: number;
  unitsSold: number;
}

export interface PlatformSummary {
  platform: Platform;
  revenue: number;
  profit: number;
  margin: number;
  skuCount: number;
  icon: string;
}

export interface BarcodeScan {
  id: string;
  upc: string;
  productName: string;
  imageUrl?: string;
  sellingPrice: number;
  fees: {
    referralFee: number;
    fbaFee: number;
    storageFee: number;
  };
  cogs: number;
  netProfit: number;
  margin: number;
  monthlySalesVelocity: number;
  competitorCount: number;
  verdict: "buy" | "skip";
  scannedAt: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  sku?: string;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  createdAt: string;
  resolved: boolean;
}

export interface HourlyActivity {
  id: string;
  activity: string;
  category: "sourcing" | "listing" | "shipping" | "customer-service" | "research";
  hoursLogged: number;
  revenueGenerated: number;
  hourlyRate: number;
  trend: TrendDirection;
  color: string;
}

export interface DashboardStats {
  totalRevenue: number;
  trueNetProfit: number;
  overallMargin: number;
  skusAtRisk: number;
  revenueChange: number;
  profitChange: number;
}

export function getMarginTier(margin: number): MarginTier {
  if (margin < 0) return "negative";
  if (margin < 10) return "danger";
  if (margin < 20) return "warning";
  if (margin < 30) return "good";
  return "excellent";
}

export function getMarginColor(margin: number): string {
  const tier = getMarginTier(margin);
  switch (tier) {
    case "excellent": return "text-emerald-500";
    case "good": return "text-emerald-400";
    case "warning": return "text-amber-500";
    case "danger": return "text-red-400";
    case "negative": return "text-red-600";
  }
}

export function getMarginBgColor(margin: number): string {
  const tier = getMarginTier(margin);
  switch (tier) {
    case "excellent": return "bg-emerald-500/10 border-emerald-500/20";
    case "good": return "bg-emerald-400/10 border-emerald-400/20";
    case "warning": return "bg-amber-500/10 border-amber-500/20";
    case "danger": return "bg-red-400/10 border-red-400/20";
    case "negative": return "bg-red-600/10 border-red-600/20";
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}
