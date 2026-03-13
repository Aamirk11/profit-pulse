"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skus } from "@/lib/mock-data";
import {
  formatCurrency,
  getMarginColor,
  getMarginBgColor,
  type SKU,
  type Platform,
  type TrendDirection,
} from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronDown,
  ChevronRight,
  Filter,
  Package,
} from "lucide-react";

type SortColumn =
  | "sku"
  | "productName"
  | "platform"
  | "revenue"
  | "cogs"
  | "totalFees"
  | "adCost"
  | "returnCost"
  | "netProfit"
  | "margin"
  | "trend";

function getTotalFees(sku: SKU): number {
  return (
    sku.platformFees.referralFee +
    sku.platformFees.fulfillmentFee +
    sku.platformFees.storageFee +
    sku.platformFees.processingFee
  );
}

function TrendIcon({ trend }: { trend: TrendDirection }) {
  if (trend === "up") return <ArrowUp className="h-4 w-4 text-emerald-500" />;
  if (trend === "down") return <ArrowDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-amber-500" />;
}

function PlatformBadge({ platform }: { platform: Platform }) {
  const variants: Record<Platform, string> = {
    Amazon: "bg-orange-100 text-orange-700 border-orange-200",
    Shopify: "bg-green-100 text-green-700 border-green-200",
    eBay: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <Badge variant="outline" className={`text-xs font-medium ${variants[platform]}`}>
      {platform}
    </Badge>
  );
}

export default function SKUProfitabilityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [marginFilter, setMarginFilter] = useState<string>("all");
  const [trendFilter, setTrendFilter] = useState<TrendDirection | "all">("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>("netProfit");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filter
  const filteredSKUs = skus.filter((sku) => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !sku.sku.toLowerCase().includes(q) &&
        !sku.productName.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    // Platform
    if (platformFilter !== "all" && sku.platform !== platformFilter) return false;

    // Margin
    if (marginFilter === ">30" && sku.margin <= 30) return false;
    if (marginFilter === "10-30" && (sku.margin < 10 || sku.margin > 30)) return false;
    if (marginFilter === "<10" && (sku.margin >= 10 || sku.margin < 0)) return false;
    if (marginFilter === "negative" && sku.margin >= 0) return false;

    // Trend
    if (trendFilter !== "all" && sku.trend !== trendFilter) return false;

    return true;
  });

  // Sort
  const sortedSKUs = [...filteredSKUs].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;

    switch (sortColumn) {
      case "sku":
        aVal = a.sku;
        bVal = b.sku;
        break;
      case "productName":
        aVal = a.productName;
        bVal = b.productName;
        break;
      case "platform":
        aVal = a.platform;
        bVal = b.platform;
        break;
      case "revenue":
        aVal = a.revenue;
        bVal = b.revenue;
        break;
      case "cogs":
        aVal = a.cogs;
        bVal = b.cogs;
        break;
      case "totalFees":
        aVal = getTotalFees(a);
        bVal = getTotalFees(b);
        break;
      case "adCost":
        aVal = a.adCost;
        bVal = b.adCost;
        break;
      case "returnCost":
        aVal = a.returnCost;
        bVal = b.returnCost;
        break;
      case "netProfit":
        aVal = a.netProfit;
        bVal = b.netProfit;
        break;
      case "margin":
        aVal = a.margin;
        bVal = b.margin;
        break;
      case "trend":
        const order = { up: 3, flat: 2, down: 1 };
        aVal = order[a.trend];
        bVal = order[b.trend];
        break;
      default:
        aVal = a.netProfit;
        bVal = b.netProfit;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  }

  function toggleRow(id: string) {
    setExpandedRow(expandedRow === id ? null : id);
  }

  function clearFilters() {
    setSearchQuery("");
    setPlatformFilter("all");
    setMarginFilter("all");
    setTrendFilter("all");
  }

  function SortHeader({
    column,
    label,
    className = "",
  }: {
    column: SortColumn;
    label: string;
    className?: string;
  }) {
    const isActive = sortColumn === column;
    return (
      <th
        className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-slate-100 ${className}`}
        onClick={() => handleSort(column)}
      >
        <div className="flex items-center gap-1">
          <span className={isActive ? "text-slate-900" : "text-slate-500"}>
            {label}
          </span>
          {isActive ? (
            sortDirection === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 text-emerald-600" />
            )
          ) : (
            <ArrowUpDown className="h-3 w-3 text-slate-300" />
          )}
        </div>
      </th>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SKU Profitability</h1>
          <p className="text-sm text-slate-500 mt-1">
            <Package className="inline h-4 w-4 mr-1 -mt-0.5" />
            {skus.length} total SKUs tracked
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by SKU or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />

            <Select
              value={platformFilter}
              onValueChange={(v) => setPlatformFilter(v as Platform | "all")}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Amazon">Amazon</SelectItem>
                <SelectItem value="Shopify">Shopify</SelectItem>
                <SelectItem value="eBay">eBay</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={marginFilter}
              onValueChange={(v) => setMarginFilter(v ?? "all")}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Margin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Margins</SelectItem>
                <SelectItem value=">30">&gt; 30%</SelectItem>
                <SelectItem value="10-30">10 - 30%</SelectItem>
                <SelectItem value="<10">&lt; 10%</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={trendFilter}
              onValueChange={(v) => setTrendFilter(v as TrendDirection | "all")}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Trend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trends</SelectItem>
                <SelectItem value="up">Up</SelectItem>
                <SelectItem value="down">Down</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {sortedSKUs.length === 0 && (
        <Card>
          <EmptyState
            icon={Package}
            title="No SKUs Match Your Filters"
            description="Try adjusting your search or filter criteria"
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        </Card>
      )}

      {/* Desktop Table */}
      {sortedSKUs.length > 0 && <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="w-8 px-3 py-3" />
                <SortHeader column="sku" label="SKU" />
                <SortHeader column="productName" label="Product Name" className="min-w-[180px]" />
                <SortHeader column="platform" label="Platform" />
                <SortHeader column="revenue" label="Revenue" />
                <SortHeader column="cogs" label="COGS" />
                <SortHeader column="totalFees" label="Total Fees" />
                <SortHeader column="adCost" label="Ad Cost" />
                <SortHeader column="returnCost" label="Returns" />
                <SortHeader column="netProfit" label="Net Profit" />
                <SortHeader column="margin" label="Margin %" />
                <SortHeader column="trend" label="Trend" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedSKUs.map((sku) => (
                <React.Fragment key={sku.id}>
                  <tr
                    className={`cursor-pointer transition-colors hover:bg-slate-50 border-l-4 ${getMarginBgColor(sku.margin)}`}
                    onClick={() => toggleRow(sku.id)}
                  >
                    <td className="px-3 py-3">
                      {expandedRow === sku.id ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs font-mono text-slate-600">
                      {sku.sku}
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-slate-900 max-w-[220px] truncate">
                      {sku.productName}
                    </td>
                    <td className="px-3 py-3">
                      <PlatformBadge platform={sku.platform} />
                    </td>
                    <td className="px-3 py-3 text-sm font-mono text-slate-700">
                      {formatCurrency(sku.revenue)}
                    </td>
                    <td className="px-3 py-3 text-sm font-mono text-slate-700">
                      {formatCurrency(sku.cogs)}
                    </td>
                    <td className="px-3 py-3 text-sm font-mono text-slate-700">
                      {formatCurrency(getTotalFees(sku))}
                    </td>
                    <td className="px-3 py-3 text-sm font-mono text-slate-700">
                      {formatCurrency(sku.adCost)}
                    </td>
                    <td className="px-3 py-3 text-sm font-mono text-slate-700">
                      {formatCurrency(sku.returnCost)}
                    </td>
                    <td className={`px-3 py-3 text-sm font-mono font-semibold ${getMarginColor(sku.margin)}`}>
                      {formatCurrency(sku.netProfit)}
                    </td>
                    <td className={`px-3 py-3 text-sm font-semibold ${getMarginColor(sku.margin)}`}>
                      {sku.margin.toFixed(1)}%
                    </td>
                    <td className="px-3 py-3">
                      <TrendIcon trend={sku.trend} />
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  <AnimatePresence>
                    {expandedRow === sku.id && (
                      <tr>
                        <td colSpan={12} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100">
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                <DetailItem
                                  label="Referral Fee"
                                  value={formatCurrency(sku.platformFees.referralFee)}
                                />
                                <DetailItem
                                  label="Fulfillment Fee"
                                  value={formatCurrency(sku.platformFees.fulfillmentFee)}
                                />
                                <DetailItem
                                  label="Storage Fee"
                                  value={formatCurrency(sku.platformFees.storageFee)}
                                />
                                <DetailItem
                                  label="Processing Fee"
                                  value={formatCurrency(sku.platformFees.processingFee)}
                                />
                                <DetailItem
                                  label="Return Rate"
                                  value={`${sku.returnRate.toFixed(1)}%`}
                                  highlight={sku.returnRate > 8}
                                />
                                <DetailItem
                                  label="Units Sold"
                                  value={sku.unitsSold.toLocaleString()}
                                />
                                <DetailItem
                                  label="Shipping Cost"
                                  value={formatCurrency(sku.shippingCost)}
                                />
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>}

      {/* Mobile Card View */}
      {sortedSKUs.length > 0 && <div className="md:hidden space-y-3">
        {sortedSKUs.map((sku) => (
          <Card
            key={sku.id}
            className={`overflow-hidden border-l-4 ${getMarginBgColor(sku.margin)} cursor-pointer`}
            onClick={() => toggleRow(sku.id)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-500">{sku.sku}</span>
                    <PlatformBadge platform={sku.platform} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 truncate">
                    {sku.productName}
                  </h3>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <TrendIcon trend={sku.trend} />
                  {expandedRow === sku.id ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Net Profit</p>
                  <p className={`text-lg font-bold font-mono ${getMarginColor(sku.margin)}`}>
                    {formatCurrency(sku.netProfit)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Margin</p>
                  <p className={`text-lg font-bold ${getMarginColor(sku.margin)}`}>
                    {sku.margin.toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Revenue</p>
                  <p className="text-sm font-mono text-slate-700">
                    {formatCurrency(sku.revenue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Expanded Detail */}
            <AnimatePresence>
              {expandedRow === sku.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50">
                    <div className="grid grid-cols-2 gap-3">
                      <DetailItem label="COGS" value={formatCurrency(sku.cogs)} />
                      <DetailItem label="Ad Cost" value={formatCurrency(sku.adCost)} />
                      <DetailItem
                        label="Referral Fee"
                        value={formatCurrency(sku.platformFees.referralFee)}
                      />
                      <DetailItem
                        label="Fulfillment Fee"
                        value={formatCurrency(sku.platformFees.fulfillmentFee)}
                      />
                      <DetailItem
                        label="Storage Fee"
                        value={formatCurrency(sku.platformFees.storageFee)}
                      />
                      <DetailItem
                        label="Processing Fee"
                        value={formatCurrency(sku.platformFees.processingFee)}
                      />
                      <DetailItem
                        label="Return Rate"
                        value={`${sku.returnRate.toFixed(1)}%`}
                        highlight={sku.returnRate > 8}
                      />
                      <DetailItem
                        label="Units Sold"
                        value={sku.unitsSold.toLocaleString()}
                      />
                      <DetailItem
                        label="Returns Cost"
                        value={formatCurrency(sku.returnCost)}
                      />
                      <DetailItem
                        label="Shipping Cost"
                        value={formatCurrency(sku.shippingCost)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>}

      {/* Results Count */}
      <div className="text-center text-sm text-slate-500 pb-4">
        Showing {sortedSKUs.length} of {skus.length} SKUs
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`text-sm font-mono font-medium ${
          highlight ? "text-red-500" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
