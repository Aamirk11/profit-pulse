import {
  SKU,
  Platform,
  Category,
  TrendDirection,
  BarcodeScan,
  Alert,
  HourlyActivity,
  DashboardStats,
  PlatformSummary,
  DailyData,
} from "./types";

// ─── Helpers ────────────────────────────────────────────────────────
function rand(min: number, max: number) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDailyData(days: number, baseRevenue: number, baseProfit: number): DailyData[] {
  const data: DailyData[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const variance = 0.7 + Math.random() * 0.6;
    data.push({
      date: d.toISOString().slice(0, 10),
      revenue: Math.round(baseRevenue * variance * 100) / 100,
      profit: Math.round(baseProfit * variance * 100) / 100,
      unitsSold: Math.max(1, Math.round((baseRevenue * variance) / rand(15, 45))),
    });
  }
  return data;
}

// ─── Product Names ──────────────────────────────────────────────────
const productsByCategory: Record<Category, string[]> = {
  Electronics: [
    "Wireless Earbuds Pro", "USB-C Hub 7-in-1", "Bluetooth Speaker Mini", "LED Ring Light 10\"",
    "Phone Tripod Stand", "Webcam 1080p HD", "Power Bank 20000mAh", "HDMI Cable 6ft",
    "Wireless Mouse Ergonomic", "Keyboard Mechanical RGB", "Laptop Stand Aluminum",
    "Smart Plug WiFi 4-Pack", "Car Phone Mount Magnetic", "Screen Protector 3-Pack",
    "USB Microphone Condenser", "Wireless Charging Pad", "Cable Organizer Box",
    "Noise Cancelling Earbuds", "Portable Monitor 15.6\"", "Smart Light Bulbs 4-Pack",
    "Gaming Headset RGB", "External SSD 500GB",
  ],
  "Home & Kitchen": [
    "Silicone Baking Mat Set", "French Press Coffee Maker", "Knife Sharpener Electric",
    "Storage Container Set 12pc", "Spice Rack Organizer", "Kitchen Scale Digital",
    "Pour Over Coffee Dripper", "Ice Cube Tray Silicone 3-Pack", "Mandoline Slicer",
    "Stainless Steel Straws 8-Pack", "Bamboo Cutting Board Set", "Soap Dispenser Automatic",
    "Drawer Organizer Set", "Wine Opener Electric", "Vacuum Seal Bags 50ct",
    "Dutch Oven 6Qt Enameled", "Air Fryer Liner 100ct", "Compost Bin Countertop",
    "Herb Garden Kit Indoor", "Water Filter Pitcher",
  ],
  Toys: [
    "Building Blocks 500pc Set", "Remote Control Car 4WD", "Art Supply Kit 150pc",
    "Magnetic Tiles 100pc", "Science Experiment Kit", "Puzzle Mat Roll-Up",
    "Kinetic Sand 3lb Pack", "RC Drone Mini Camera", "Card Game Family Edition",
    "Marble Run 120pc Set", "Foam Dart Blaster Set", "Craft Kit for Kids",
    "Robot Building Kit STEM", "Water Balloon Launcher", "Board Game Strategy",
    "Slime Kit DIY 24-Pack",
  ],
  "Health & Beauty": [
    "Vitamin C Serum 1oz", "Jade Roller Set", "Electric Toothbrush Heads 8-Pack",
    "Hair Claw Clips 12-Pack", "Resistance Bands Set 5pc", "Yoga Mat 6mm Non-Slip",
    "Dry Brush Body", "LED Face Mask Therapy", "Scalp Massager Shampoo Brush",
    "Beard Grooming Kit", "Teeth Whitening Strips 28ct", "Collagen Peptides 16oz",
    "Essential Oil Set 6-Pack", "Foam Roller 18\" High Density", "Massage Gun Mini",
    "Posture Corrector Adjustable",
  ],
};

// ─── Generate 127 SKUs ──────────────────────────────────────────────
function generateSKUs(): SKU[] {
  const skus: SKU[] = [];
  let skuCounter = 1000;

  const amazonCount = 84;
  const shopifyCount = 43;

  const categories: Category[] = ["Electronics", "Home & Kitchen", "Toys", "Health & Beauty"];

  for (let i = 0; i < amazonCount + shopifyCount; i++) {
    const platform: Platform = i < amazonCount ? "Amazon" : "Shopify";
    const category = categories[i % categories.length];
    const products = productsByCategory[category];
    const productName = products[i % products.length];
    const skuId = `QF${String(skuCounter++).padStart(5, "0")}`;

    const sellingPrice = rand(12, 89);
    const unitsSold = Math.round(rand(20, 600));
    const revenue = Math.round(sellingPrice * unitsSold * 100) / 100;
    const cogsPerUnit = sellingPrice * rand(0.2, 0.5);
    const cogs = Math.round(cogsPerUnit * unitsSold * 100) / 100;

    const referralRate = platform === "Amazon" ? rand(0.08, 0.15) : rand(0.025, 0.03);
    const referralFee = Math.round(revenue * referralRate * 100) / 100;

    const fbaRate = platform === "Amazon" ? rand(0.1, 0.18) : 0;
    const fulfillmentFee = Math.round(revenue * fbaRate * 100) / 100;

    const storageFee = platform === "Amazon" ? Math.round(unitsSold * rand(0.2, 0.8) * 100) / 100 : 0;
    const processingFee = Math.round(revenue * rand(0.025, 0.03) * 100) / 100;

    const adCost = Math.round(revenue * rand(0.03, 0.15) * 100) / 100;
    const returnRate = rand(0.02, 0.12);
    const returnCost = Math.round(revenue * returnRate * rand(0.3, 0.6) * 100) / 100;
    const shippingCost = platform === "Shopify" ? Math.round(unitsSold * rand(2, 6) * 100) / 100 : 0;

    const totalCosts = cogs + referralFee + fulfillmentFee + storageFee + processingFee + adCost + returnCost + shippingCost;
    const netProfit = Math.round((revenue - totalCosts) * 100) / 100;
    const margin = Math.round((netProfit / revenue) * 10000) / 100;

    const trends: TrendDirection[] = ["up", "up", "up", "down", "down", "flat", "flat"];
    const trend = pick(trends);

    skus.push({
      id: `sku-${i + 1}`,
      sku: skuId,
      productName: `${productName}${i >= products.length ? ` V${Math.floor(i / products.length) + 1}` : ""}`,
      platform,
      category,
      revenue,
      cogs,
      platformFees: { referralFee, fulfillmentFee, storageFee, processingFee },
      adCost,
      returnCost,
      shippingCost,
      netProfit,
      margin,
      trend,
      unitsSold,
      returnRate: Math.round(returnRate * 10000) / 100,
      dailyData: generateDailyData(30, revenue / 30, netProfit / 30),
    });
  }

  return skus;
}

export const skus: SKU[] = generateSKUs();

// ─── Dashboard Stats ────────────────────────────────────────────────
export const dashboardStats: DashboardStats = {
  totalRevenue: 34520,
  trueNetProfit: 8230,
  overallMargin: 23.8,
  skusAtRisk: 7,
  revenueChange: 12.3,
  profitChange: -4.2,
};

// ─── Platform Summaries ─────────────────────────────────────────────
export const platformSummaries: PlatformSummary[] = [
  { platform: "Amazon", revenue: 18400, profit: 4200, margin: 22.8, skuCount: 84, icon: "📦" },
  { platform: "Shopify", revenue: 12300, profit: 3100, margin: 25.2, skuCount: 43, icon: "🛍️" },
  { platform: "eBay", revenue: 3820, profit: 930, margin: 24.3, skuCount: 12, icon: "🏷️" },
];

// ─── 30-Day Trend Data ──────────────────────────────────────────────
export function generate30DayTrend(): DailyData[] {
  const data: DailyData[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
    const trendUp = 1 + (29 - i) * 0.005;
    const noise = 0.85 + Math.random() * 0.3;

    const revenue = Math.round(1150 * weekendFactor * trendUp * noise);
    const profitMargin = 0.2 + Math.random() * 0.08;
    data.push({
      date: d.toISOString().slice(0, 10),
      revenue,
      profit: Math.round(revenue * profitMargin),
      unitsSold: Math.round(revenue / rand(20, 35)),
    });
  }
  return data;
}

export const trendData: DailyData[] = generate30DayTrend();

// ─── Top / Bottom SKUs ──────────────────────────────────────────────
export const topSKUs = [...skus].sort((a, b) => b.netProfit - a.netProfit).slice(0, 5);
export const bottomSKUs = [...skus].sort((a, b) => a.netProfit - b.netProfit).slice(0, 5);

// ─── Barcode Scans ──────────────────────────────────────────────────
export const barcodeScanHistory: BarcodeScan[] = [
  {
    id: "scan-1", upc: "012345678901", productName: "Anker Wireless Earbuds A1",
    sellingPrice: 24.99, fees: { referralFee: 3.75, fbaFee: 5.23, storageFee: 0.42 },
    cogs: 8.0, netProfit: 7.59, margin: 30.4, monthlySalesVelocity: 340,
    competitorCount: 23, verdict: "buy", scannedAt: "2026-03-13T10:30:00Z",
  },
  {
    id: "scan-2", upc: "012345678902", productName: "Bluetooth Speaker JBL Clip",
    sellingPrice: 39.99, fees: { referralFee: 6.0, fbaFee: 7.12, storageFee: 0.55 },
    cogs: 18.5, netProfit: 7.82, margin: 19.6, monthlySalesVelocity: 210,
    competitorCount: 45, verdict: "skip", scannedAt: "2026-03-13T09:45:00Z",
  },
  {
    id: "scan-3", upc: "012345678903", productName: "USB-C Hub 8-in-1 Adapter",
    sellingPrice: 29.99, fees: { referralFee: 4.5, fbaFee: 4.87, storageFee: 0.38 },
    cogs: 7.5, netProfit: 12.74, margin: 42.5, monthlySalesVelocity: 520,
    competitorCount: 18, verdict: "buy", scannedAt: "2026-03-12T16:20:00Z",
  },
  {
    id: "scan-4", upc: "012345678904", productName: "Silicone Baking Mats 3-Pack",
    sellingPrice: 14.99, fees: { referralFee: 2.25, fbaFee: 4.23, storageFee: 0.35 },
    cogs: 5.2, netProfit: 2.96, margin: 19.7, monthlySalesVelocity: 890,
    competitorCount: 67, verdict: "skip", scannedAt: "2026-03-12T14:10:00Z",
  },
  {
    id: "scan-5", upc: "012345678905", productName: "LED Ring Light 12\" with Tripod",
    sellingPrice: 34.99, fees: { referralFee: 5.25, fbaFee: 6.45, storageFee: 0.72 },
    cogs: 11.0, netProfit: 11.57, margin: 33.1, monthlySalesVelocity: 280,
    competitorCount: 34, verdict: "buy", scannedAt: "2026-03-12T11:30:00Z",
  },
  {
    id: "scan-6", upc: "012345678906", productName: "Magnetic Phone Mount Car",
    sellingPrice: 16.99, fees: { referralFee: 2.55, fbaFee: 3.89, storageFee: 0.28 },
    cogs: 3.5, netProfit: 6.77, margin: 39.8, monthlySalesVelocity: 1200,
    competitorCount: 89, verdict: "buy", scannedAt: "2026-03-11T15:45:00Z",
  },
  {
    id: "scan-7", upc: "012345678907", productName: "Yoga Mat Premium 6mm",
    sellingPrice: 28.99, fees: { referralFee: 4.35, fbaFee: 8.12, storageFee: 1.2 },
    cogs: 14.0, netProfit: 1.32, margin: 4.6, monthlySalesVelocity: 150,
    competitorCount: 112, verdict: "skip", scannedAt: "2026-03-11T13:20:00Z",
  },
  {
    id: "scan-8", upc: "012345678908", productName: "Resistance Bands Set 5pc",
    sellingPrice: 19.99, fees: { referralFee: 3.0, fbaFee: 4.56, storageFee: 0.32 },
    cogs: 4.0, netProfit: 8.11, margin: 40.6, monthlySalesVelocity: 670,
    competitorCount: 55, verdict: "buy", scannedAt: "2026-03-11T10:15:00Z",
  },
  {
    id: "scan-9", upc: "012345678909", productName: "Electric Knife Sharpener",
    sellingPrice: 44.99, fees: { referralFee: 6.75, fbaFee: 7.89, storageFee: 0.85 },
    cogs: 22.0, netProfit: 7.5, margin: 16.7, monthlySalesVelocity: 95,
    competitorCount: 28, verdict: "skip", scannedAt: "2026-03-10T17:00:00Z",
  },
  {
    id: "scan-10", upc: "012345678910", productName: "Smart WiFi Plug 4-Pack",
    sellingPrice: 22.99, fees: { referralFee: 3.45, fbaFee: 5.12, storageFee: 0.48 },
    cogs: 6.0, netProfit: 7.94, margin: 34.5, monthlySalesVelocity: 445,
    competitorCount: 41, verdict: "buy", scannedAt: "2026-03-10T14:30:00Z",
  },
  {
    id: "scan-11", upc: "012345678911", productName: "Kinetic Sand 5lb Bucket",
    sellingPrice: 18.99, fees: { referralFee: 2.85, fbaFee: 5.78, storageFee: 0.92 },
    cogs: 9.5, netProfit: -0.06, margin: -0.3, monthlySalesVelocity: 320,
    competitorCount: 15, verdict: "skip", scannedAt: "2026-03-10T11:00:00Z",
  },
  {
    id: "scan-12", upc: "012345678912", productName: "Portable Monitor 15.6\" USB-C",
    sellingPrice: 149.99, fees: { referralFee: 22.5, fbaFee: 12.34, storageFee: 2.1 },
    cogs: 65.0, netProfit: 48.05, margin: 32.0, monthlySalesVelocity: 45,
    competitorCount: 22, verdict: "buy", scannedAt: "2026-03-09T16:15:00Z",
  },
  {
    id: "scan-13", upc: "012345678913", productName: "Vitamin C Serum 2oz",
    sellingPrice: 16.99, fees: { referralFee: 2.55, fbaFee: 4.23, storageFee: 0.3 },
    cogs: 2.5, netProfit: 7.41, margin: 43.6, monthlySalesVelocity: 780,
    competitorCount: 95, verdict: "buy", scannedAt: "2026-03-09T12:00:00Z",
  },
  {
    id: "scan-14", upc: "012345678914", productName: "Board Game Settlers Edition",
    sellingPrice: 32.99, fees: { referralFee: 4.95, fbaFee: 7.45, storageFee: 1.8 },
    cogs: 18.0, netProfit: 0.79, margin: 2.4, monthlySalesVelocity: 60,
    competitorCount: 8, verdict: "skip", scannedAt: "2026-03-09T09:30:00Z",
  },
  {
    id: "scan-15", upc: "012345678915", productName: "Massage Gun Percussion Mini",
    sellingPrice: 59.99, fees: { referralFee: 9.0, fbaFee: 8.67, storageFee: 0.95 },
    cogs: 22.0, netProfit: 19.37, margin: 32.3, monthlySalesVelocity: 175,
    competitorCount: 38, verdict: "buy", scannedAt: "2026-03-08T15:45:00Z",
  },
];

// ─── Alerts ─────────────────────────────────────────────────────────
export const alerts: Alert[] = [
  {
    id: "alert-1", severity: "critical", sku: "QF01023",
    title: "Amazon Referral Fee Increase — Electronics",
    description: "Amazon increased referral fee in Electronics category from 8% to 10%. 3 of your SKUs are affected.",
    impact: "Estimated $420/month margin reduction across affected SKUs",
    recommendation: "Raise prices by $1.50-2.00 on affected SKUs or switch to FBM to offset fee increase",
    createdAt: "2026-03-13T08:00:00Z", resolved: false,
  },
  {
    id: "alert-2", severity: "critical", sku: "QF01045",
    title: "SKU #QF01045 Negative for 12 Days",
    description: "Wireless Mouse Ergonomic has been selling at a loss for 12 consecutive days. Current margin: -3.2%",
    impact: "Losing approximately $2.80 per unit, $156 total loss this period",
    recommendation: "Consider discontinuing or raising price from $18.99 to $22.99 immediately",
    createdAt: "2026-03-12T14:00:00Z", resolved: false,
  },
  {
    id: "alert-3", severity: "warning", sku: "QF01012",
    title: "Return Rate Spike — SKU #QF01012",
    description: "Return rate on Phone Tripod Stand spiked to 14% (was 4%). 47 returns in last 30 days.",
    impact: "Extra $280 in return processing costs, margin dropped from 28% to 16%",
    recommendation: "Investigate quality issue — check recent supplier batch. Consider adding instructional insert.",
    createdAt: "2026-03-11T10:30:00Z", resolved: false,
  },
  {
    id: "alert-4", severity: "warning", sku: "QF01008",
    title: "Competitor Price Drop on #1 Seller",
    description: "Main competitor dropped price on HDMI Cable 6ft by $3. Your margin compressed from 34% to 12%.",
    impact: "If you match price, profit drops by $890/month. If you don't, expect 30-40% sales volume loss.",
    recommendation: "Run a 15% coupon for 7 days to test price sensitivity before permanent price change.",
    createdAt: "2026-03-10T16:00:00Z", resolved: false,
  },
  {
    id: "alert-5", severity: "warning",
    title: "Ad Spend Efficiency Declining",
    description: "Overall ACoS increased from 18% to 27% in the last 14 days across 12 campaigns.",
    impact: "Extra $340/month in ad costs eating into margin on 12 SKUs",
    recommendation: "Pause underperforming campaigns, reduce bids on broad match keywords, shift budget to exact match.",
    createdAt: "2026-03-09T09:00:00Z", resolved: false,
  },
  {
    id: "alert-6", severity: "info",
    title: "Q2 FBA Storage Fee Increase Coming",
    description: "Amazon announced Q2 storage fee increase effective April 1. Rates going up 12% for standard-size.",
    impact: "Estimated $180/month increase across your 84 Amazon SKUs",
    recommendation: "Liquidate slow-moving inventory before April 1. Consider removing SKUs with <5 units/month velocity.",
    createdAt: "2026-03-08T12:00:00Z", resolved: false,
  },
  {
    id: "alert-7", severity: "info", sku: "QF01003",
    title: "High-Margin Opportunity — Bluetooth Speaker",
    description: "Bluetooth Speaker Mini margin increased to 52% due to COGS reduction from new supplier.",
    impact: "Potential to increase profit by $1,200/month if you scale ad spend",
    recommendation: "Increase daily ad budget from $15 to $30 and target additional keywords.",
    createdAt: "2026-03-07T11:00:00Z", resolved: false,
  },
  {
    id: "alert-8", severity: "critical", sku: "QF01067",
    title: "Shopify Payment Processing Fee Change",
    description: "Shopify increased payment processing fee for your plan. 43 SKUs affected.",
    impact: "Estimated $95/month additional cost across all Shopify SKUs",
    recommendation: "Evaluate upgrading Shopify plan — Advanced plan has lower processing fees that offset the plan cost at your volume.",
    createdAt: "2026-03-06T15:00:00Z", resolved: true,
  },
  {
    id: "alert-9", severity: "info",
    title: "Weekly Profit Summary",
    description: "This week: $8,230 revenue, $1,945 true profit (23.6% margin). Up 3.2% from last week.",
    impact: "On track for $34,500 monthly revenue if current trend continues",
    recommendation: "Focus on scaling top 5 performing SKUs — they account for 38% of total profit.",
    createdAt: "2026-03-13T07:00:00Z", resolved: false,
  },
  {
    id: "alert-10", severity: "warning", sku: "QF01089",
    title: "Shipping Cost Surge — Shopify Orders",
    description: "Average shipping cost per order increased 22% due to carrier rate changes.",
    impact: "Margin on Shopify SKUs dropped average 2.1 percentage points",
    recommendation: "Negotiate rates with alternative carrier or pass partial cost to customers via $1 price increase.",
    createdAt: "2026-03-05T13:00:00Z", resolved: false,
  },
];

// ─── Hourly Activities ──────────────────────────────────────────────
export const hourlyActivities: HourlyActivity[] = [
  {
    id: "act-1", activity: "Online Arbitrage Sourcing", category: "sourcing",
    hoursLogged: 42, revenueGenerated: 2814, hourlyRate: 67, trend: "up",
    color: "#10B981",
  },
  {
    id: "act-2", activity: "Retail Arbitrage Sourcing", category: "sourcing",
    hoursLogged: 28, revenueGenerated: 1176, hourlyRate: 42, trend: "flat",
    color: "#3B82F6",
  },
  {
    id: "act-3", activity: "Product Listing & Photography", category: "listing",
    hoursLogged: 18, revenueGenerated: 468, hourlyRate: 26, trend: "down",
    color: "#F59E0B",
  },
  {
    id: "act-4", activity: "Shipping & Prep", category: "shipping",
    hoursLogged: 24, revenueGenerated: 432, hourlyRate: 18, trend: "flat",
    color: "#EF4444",
  },
  {
    id: "act-5", activity: "Customer Service & Returns", category: "customer-service",
    hoursLogged: 12, revenueGenerated: 180, hourlyRate: 15, trend: "down",
    color: "#8B5CF6",
  },
  {
    id: "act-6", activity: "Market Research & Analysis", category: "research",
    hoursLogged: 8, revenueGenerated: 520, hourlyRate: 65, trend: "up",
    color: "#06B6D4",
  },
];

// ─── Alert Feed (for dashboard) ─────────────────────────────────────
export const dashboardAlertFeed = alerts.filter((a) => !a.resolved).slice(0, 4);
