"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { alerts } from "@/lib/mock-data"
import { type Alert, type AlertSeverity } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  Bell,
  Filter,
  Settings,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  Shield,
  Clock,
  DollarSign,
  CheckCircle2,
  LayoutList,
  GitCommitHorizontal,
  Package,
  Sparkles,
  X,
} from "lucide-react"

type FilterTab = "all" | "critical" | "warning" | "info" | "resolved"
type ViewMode = "cards" | "timeline"

// Mock SKU names per alert for "Affected SKUs" section
const mockAffectedSkus: Record<string, string[]> = {
  "alert-1": ["Wireless Earbuds Pro", "USB-C Hub 7-in-1", "LED Ring Light 10\""],
  "alert-2": ["Wireless Mouse Ergonomic"],
  "alert-3": ["Phone Tripod Stand"],
  "alert-4": ["HDMI Cable 6ft", "HDMI Cable 6ft V2"],
  "alert-5": ["Bluetooth Speaker Mini", "Power Bank 20000mAh", "Webcam 1080p HD"],
  "alert-6": ["All Amazon SKUs (84)"],
  "alert-7": ["Bluetooth Speaker Mini"],
  "alert-8": ["All Shopify SKUs (43)"],
  "alert-9": ["Top 5 Performers"],
  "alert-10": ["Yoga Mat 6mm Non-Slip", "Resistance Bands Set 5pc"],
}

// Mock estimated dollar impact per alert
const mockEstimatedImpact: Record<string, number> = {
  "alert-1": 420,
  "alert-2": 156,
  "alert-3": 280,
  "alert-4": 890,
  "alert-5": 340,
  "alert-6": 180,
  "alert-7": -1200,
  "alert-8": 95,
  "alert-9": 0,
  "alert-10": 210,
}

// Alert category types for the stacked bar
type AlertCategory = "margin_drop" | "fee_increase" | "competitor_price" | "stock_alert"
const alertCategoryMap: Record<string, AlertCategory> = {
  "alert-1": "fee_increase",
  "alert-2": "margin_drop",
  "alert-3": "margin_drop",
  "alert-4": "competitor_price",
  "alert-5": "margin_drop",
  "alert-6": "fee_increase",
  "alert-7": "stock_alert",
  "alert-8": "fee_increase",
  "alert-9": "stock_alert",
  "alert-10": "fee_increase",
}

const categoryColors: Record<AlertCategory, string> = {
  margin_drop: "bg-red-500",
  fee_increase: "bg-amber-500",
  competitor_price: "bg-blue-500",
  stock_alert: "bg-purple-500",
}

const categoryLabels: Record<AlertCategory, string> = {
  margin_drop: "Margin Drop",
  fee_increase: "Fee Increase",
  competitor_price: "Competitor Price",
  stock_alert: "Stock/Opportunity",
}

function getRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return `${Math.floor(diffDays / 7)}w ago`
}

function getTimeSinceHours(dateStr: string): number {
  const now = new Date()
  const date = new Date(dateStr)
  return (now.getTime() - date.getTime()) / 3600000
}

function getTimeColor(dateStr: string): string {
  const hours = getTimeSinceHours(dateStr)
  if (hours > 24) return "text-red-500"
  if (hours > 6) return "text-amber-500"
  return "text-green-500"
}

function getSeverityIcon(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    case "warning":
      return <AlertCircle className="h-5 w-5 text-amber-500" />
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />
  }
}

function getSeverityBadge(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return <Badge variant="destructive">Critical</Badge>
    case "warning":
      return (
        <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/20">
          Warning
        </Badge>
      )
    case "info":
      return (
        <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 hover:bg-blue-500/20">
          Info
        </Badge>
      )
  }
}

function getSeverityBorderColor(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "border-l-red-500"
    case "warning":
      return "border-l-amber-500"
    case "info":
      return "border-l-blue-500"
  }
}

function getSeverityBarWidth(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "w-full"
    case "warning":
      return "w-2/3"
    case "info":
      return "w-1/3"
  }
}

function getSeverityBarColor(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "bg-red-500"
    case "warning":
      return "bg-amber-500"
    case "info":
      return "bg-blue-500"
  }
}

// ─── Confetti Particle Component ─────────────────────────────────
function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ["bg-green-400", "bg-emerald-400", "bg-teal-400", "bg-green-300", "bg-emerald-300"]
  const color = colors[Math.floor(Math.abs(x * 10) % colors.length)]
  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${color}`}
      initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, -40, 60],
        x: [0, x * 30, x * 50],
        scale: [1, 1.2, 0.5],
        rotate: [0, 180, 360],
      }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
    />
  )
}

// ─── Summary Card Component ──────────────────────────────────────
function SummaryCard({
  title,
  value,
  icon,
  borderColor,
  valueColor,
  index,
}: {
  title: string
  value: string
  icon: React.ReactNode
  borderColor: string
  valueColor: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
    >
      <Card className={`border-l-4 ${borderColor} relative overflow-hidden`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {title}
              </p>
              <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            </div>
            <div className="shrink-0 opacity-80">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Timeline Node ───────────────────────────────────────────────
function TimelineNode({ alert, index }: { alert: Alert; index: number }) {
  const dotSizeClass =
    alert.severity === "critical"
      ? "h-4 w-4"
      : alert.severity === "warning"
        ? "h-3 w-3"
        : "h-2.5 w-2.5"

  const dotColorClass =
    alert.resolved
      ? "bg-green-500"
      : alert.severity === "critical"
        ? "bg-red-500"
        : alert.severity === "warning"
          ? "bg-amber-500"
          : "bg-blue-500"

  const impact = mockEstimatedImpact[alert.id] || 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative flex gap-4 pb-8 last:pb-0"
    >
      {/* Vertical line */}
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <motion.div
            className={`${dotSizeClass} rounded-full ${dotColorClass} z-10 relative`}
            animate={
              !alert.resolved
                ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
                : {}
            }
            transition={
              !alert.resolved
                ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                : {}
            }
          />
          {!alert.resolved && (
            <motion.div
              className={`absolute inset-0 ${dotColorClass} rounded-full`}
              animate={{ scale: [1, 2], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </div>
        {/* Connecting line */}
        <div className="w-px flex-1 bg-border mt-1" />
      </div>

      {/* Content */}
      <div className={`flex-1 pb-2 ${alert.resolved ? "opacity-50" : ""}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] font-mono ${getTimeColor(alert.createdAt)}`}>
            {getRelativeTime(alert.createdAt)}
          </span>
          {alert.resolved ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px]">
              Resolved
            </Badge>
          ) : (
            getSeverityBadge(alert.severity)
          )}
        </div>
        <p className={`text-sm font-semibold mt-1 ${alert.resolved ? "line-through text-muted-foreground" : ""}`}>
          {alert.title}
        </p>
        {impact !== 0 && (
          <p className={`text-xs mt-0.5 ${impact > 0 ? "text-red-500" : "text-emerald-500"}`}>
            {impact > 0 ? "-" : "+"}${Math.abs(impact).toLocaleString()}/mo impact
          </p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Category Bar Segment ────────────────────────────────────────
function CategoryBar({
  categories,
  total,
}: {
  categories: Record<AlertCategory, number>
  total: number
}) {
  const entries = (Object.entries(categories) as [AlertCategory, number][]).filter(
    ([, count]) => count > 0
  )

  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {entries.map(([cat, count], idx) => (
          <motion.div
            key={cat}
            className={`${categoryColors[cat]} h-full`}
            initial={{ width: 0 }}
            animate={{ width: `${(count / total) * 100}%` }}
            transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {entries.map(([cat, count]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${categoryColors[cat]}`} />
            <span className="text-xs text-muted-foreground">
              {categoryLabels[cat]} ({count})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────
export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const [alertData, setAlertData] = useState<Alert[]>(alerts)
  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set())
  const [showSaveToast, setShowSaveToast] = useState(false)
  const [thresholds, setThresholds] = useState({
    marginWarning: 15,
    marginCritical: 5,
    feeIncrease: 10,
  })

  const unresolvedCount = alertData.filter((a) => !a.resolved).length
  const criticalCount = alertData.filter((a) => a.severity === "critical" && !a.resolved).length
  const warningCount = alertData.filter((a) => a.severity === "warning" && !a.resolved).length
  const infoCount = alertData.filter((a) => a.severity === "info" && !a.resolved).length
  const resolvedCount = alertData.filter((a) => a.resolved).length

  const totalEstimatedImpact = useMemo(() => {
    return alertData
      .filter((a) => !a.resolved)
      .reduce((sum, a) => {
        const impact = mockEstimatedImpact[a.id] || 0
        return sum + (impact > 0 ? impact : 0)
      }, 0)
  }, [alertData])

  // Category counts for the stacked bar
  const categoryCounts = useMemo(() => {
    const counts: Record<AlertCategory, number> = {
      margin_drop: 0,
      fee_increase: 0,
      competitor_price: 0,
      stock_alert: 0,
    }
    alertData
      .filter((a) => !a.resolved)
      .forEach((a) => {
        const cat = alertCategoryMap[a.id] || "stock_alert"
        counts[cat]++
      })
    return counts
  }, [alertData])

  // Preview count based on thresholds
  const previewAlertCount = useMemo(() => {
    // Simulate: lower thresholds = fewer alerts triggered
    const base = unresolvedCount
    const marginEffect = Math.max(0, thresholds.marginWarning - 10) / 5
    const criticalEffect = Math.max(0, thresholds.marginCritical - 3) / 2
    const feeEffect = Math.max(0, thresholds.feeIncrease - 5) / 5
    return Math.max(1, Math.round(base - marginEffect - criticalEffect + feeEffect))
  }, [thresholds, unresolvedCount])

  const filteredAlerts = alertData.filter((alert) => {
    if (activeFilter === "all") return !alert.resolved
    if (activeFilter === "resolved") return alert.resolved
    return alert.severity === activeFilter && !alert.resolved
  })

  const handleResolve = (alertId: string) => {
    setAlertData((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    )
  }

  const toggleExpand = (alertId: string) => {
    setExpandedAlerts((prev) => {
      const next = new Set(prev)
      if (next.has(alertId)) {
        next.delete(alertId)
      } else {
        next.add(alertId)
      }
      return next
    })
  }

  const handleSaveSettings = () => {
    setShowSaveToast(true)
    setTimeout(() => setShowSaveToast(false), 2500)
  }

  const filterTabs: { key: FilterTab; label: string; count?: number; color?: string }[] = [
    { key: "all", label: "All" },
    { key: "critical", label: "Critical", count: criticalCount, color: "bg-red-500" },
    { key: "warning", label: "Warning", count: warningCount, color: "bg-amber-500" },
    { key: "info", label: "Info", count: infoCount, color: "bg-blue-500" },
    { key: "resolved", label: "Resolved", count: resolvedCount, color: "bg-green-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Save Toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-white shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <CheckCircle2 className="h-5 w-5" />
            </motion.div>
            <span className="text-sm font-medium">Settings saved successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
            <Bell className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Margin Alerts</h1>
              <Badge variant="secondary" className="text-xs">
                {unresolvedCount} unresolved
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Intelligent alert command center for margin threats
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="hidden sm:flex items-center rounded-lg border bg-muted/50 p-0.5">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="gap-1.5 h-8"
            >
              <LayoutList className="h-3.5 w-3.5" />
              Cards
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("timeline")}
              className="gap-1.5 h-8"
            >
              <GitCommitHorizontal className="h-3.5 w-3.5" />
              Timeline
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="shrink-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ─── Impact Summary Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          title="Active Alerts"
          value={String(unresolvedCount)}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
              {criticalCount > 0 ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
            </div>
          }
          borderColor="border-l-red-500"
          valueColor="text-red-600"
          index={0}
        />
        <SummaryCard
          title="Estimated Impact"
          value={`-$${totalEstimatedImpact.toLocaleString()}/mo`}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
              <DollarSign className="h-5 w-5 text-red-500" />
            </div>
          }
          borderColor="border-l-red-400"
          valueColor="text-red-600"
          index={1}
        />
        <SummaryCard
          title="Resolved This Week"
          value={String(resolvedCount)}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          }
          borderColor="border-l-green-500"
          valueColor="text-green-600"
          index={2}
        />
        <SummaryCard
          title="Avg Response Time"
          value="2.4 hours"
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
          }
          borderColor="border-l-blue-500"
          valueColor="text-blue-600"
          index={3}
        />
      </div>

      {/* ─── Alert Categories Bar ──────────────────────────────────── */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Alert Distribution by Type
          </p>
          <CategoryBar categories={categoryCounts} total={unresolvedCount} />
        </CardContent>
      </Card>

      {/* ─── Threshold Settings Panel ──────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="border-emerald-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    Alert Thresholds
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="grid gap-6 sm:grid-cols-3">
                  {/* Margin Warning */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Low Margin Warning</label>
                      <span className="text-sm font-bold text-amber-500">
                        {thresholds.marginWarning}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={thresholds.marginWarning}
                      onChange={(e) =>
                        setThresholds((p) => ({
                          ...p,
                          marginWarning: Number(e.target.value),
                        }))
                      }
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-amber-500
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                    />
                    <p className="text-xs text-muted-foreground">
                      Alert when margin drops below {thresholds.marginWarning}%
                    </p>
                  </div>

                  {/* Critical Margin */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Critical Margin</label>
                      <span className="text-sm font-bold text-red-500">
                        {thresholds.marginCritical}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={thresholds.marginCritical}
                      onChange={(e) =>
                        setThresholds((p) => ({
                          ...p,
                          marginCritical: Number(e.target.value),
                        }))
                      }
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-red-500
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                    />
                    <p className="text-xs text-muted-foreground">
                      Critical alert below {thresholds.marginCritical}%
                    </p>
                  </div>

                  {/* Fee Increase */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Fee Increase Alert</label>
                      <span className="text-sm font-bold text-blue-500">
                        {thresholds.feeIncrease}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={thresholds.feeIncrease}
                      onChange={(e) =>
                        setThresholds((p) => ({
                          ...p,
                          feeIncrease: Number(e.target.value),
                        }))
                      }
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-blue-500
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                    />
                    <p className="text-xs text-muted-foreground">
                      Alert on fee increases above {thresholds.feeIncrease}%
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    With these settings, you&apos;d have{" "}
                    <span className="font-bold text-foreground">{previewAlertCount}</span> active
                    alerts
                  </p>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"
                    onClick={handleSaveSettings}
                  >
                    <Check className="h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Filter Tabs ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeFilter === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(tab.key)}
            className="gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white ${tab.color}`}
              >
                {tab.count}
              </span>
            )}
          </Button>
        ))}

        {/* Mobile view toggle */}
        <div className="sm:hidden flex items-center ml-auto rounded-lg border bg-muted/50 p-0.5">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="h-8 w-8 p-0"
          >
            <LayoutList className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("timeline")}
            className="h-8 w-8 p-0"
          >
            <GitCommitHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ─── Alert Content ─────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {filteredAlerts.length === 0 ? (
          /* ─── Empty / Celebration State ─────────────────────────── */
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center relative"
          >
            {/* Confetti particles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => (
                <ConfettiParticle
                  key={i}
                  delay={i * 0.1}
                  x={Math.sin(i * 0.8) * (i % 2 === 0 ? 1 : -1)}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              className="relative"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mb-4 mx-auto">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </motion.div>
              </div>
              {/* Sparkle effects */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-2"
                animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="h-4 w-4 text-green-400" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-emerald-600 mb-1">All Clear!</h3>
              <p className="text-base font-medium text-foreground mb-1">
                No {activeFilter !== "all" ? activeFilter : "active"} alerts to show
              </p>
              <p className="text-sm text-muted-foreground">
                Your margins are looking healthy
              </p>
            </motion.div>
          </motion.div>
        ) : viewMode === "timeline" ? (
          /* ─── Timeline View ─────────────────────────────────────── */
          <motion.div
            key="timeline-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="pl-2">
                  {filteredAlerts.map((alert, index) => (
                    <TimelineNode key={alert.id} alert={alert} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* ─── Cards View ────────────────────────────────────────── */
          <div className="space-y-3" key="cards-view">
            {filteredAlerts.map((alert, index) => {
              const isExpanded = expandedAlerts.has(alert.id)
              const impact = mockEstimatedImpact[alert.id] || 0
              const affectedSkus = mockAffectedSkus[alert.id] || []
              const hoursSince = getTimeSinceHours(alert.createdAt)

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  layout
                >
                  <Card
                    className={`overflow-hidden ${
                      alert.resolved ? "opacity-60" : ""
                    }`}
                  >
                    {/* Severity Bar at top */}
                    <div className="h-1 w-full bg-muted relative overflow-hidden">
                      <motion.div
                        className={`h-full ${getSeverityBarColor(alert.severity)} ${
                          alert.severity === "critical" && !alert.resolved
                            ? "animate-pulse"
                            : ""
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                      >
                        <div className={`h-full ${getSeverityBarWidth(alert.severity)}`}>
                          <div className={`h-full ${getSeverityBarColor(alert.severity)}`} />
                        </div>
                      </motion.div>
                    </div>

                    <CardContent className={`p-4 sm:p-5 border-l-4 ${getSeverityBorderColor(alert.severity)}`}>
                      <div className="flex flex-col gap-3">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                              {alert.resolved ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                  <Check className="h-5 w-5 text-emerald-500" />
                                </motion.div>
                              ) : (
                                getSeverityIcon(alert.severity)
                              )}
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                {alert.resolved ? (
                                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                                    Resolved
                                  </Badge>
                                ) : (
                                  getSeverityBadge(alert.severity)
                                )}
                                {alert.sku && (
                                  <Badge variant="outline" className="text-[10px] font-mono">
                                    {alert.sku}
                                  </Badge>
                                )}
                                {impact !== 0 && !alert.resolved && (
                                  <Badge
                                    className={`text-[10px] ${
                                      impact > 0
                                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    }`}
                                  >
                                    {impact > 0 ? "-" : "+"}${Math.abs(impact).toLocaleString()}/mo
                                  </Badge>
                                )}
                              </div>
                              <h3
                                className={`font-bold text-base sm:text-lg leading-tight ${
                                  alert.resolved ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                {alert.title}
                              </h3>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span
                              className={`text-[11px] font-medium whitespace-nowrap ${
                                alert.resolved
                                  ? "text-muted-foreground"
                                  : getTimeColor(alert.createdAt)
                              }`}
                            >
                              <Clock className="h-3 w-3 inline mr-0.5 -mt-0.5" />
                              {getRelativeTime(alert.createdAt)}
                            </span>
                            {!alert.resolved && (
                              <span className={`text-[10px] ${getTimeColor(alert.createdAt)}`}>
                                {hoursSince > 24
                                  ? "Overdue"
                                  : hoursSince > 6
                                    ? "Aging"
                                    : "Recent"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground pl-8">
                          {alert.description}
                        </p>

                        {/* Impact highlight */}
                        <div className="pl-8 flex items-center gap-2">
                          <TrendingDown className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          <p className="text-sm font-medium text-red-500/80">
                            {alert.impact}
                          </p>
                        </div>

                        {/* Affected SKUs */}
                        {affectedSkus.length > 0 && (
                          <div className="pl-8 flex flex-wrap items-center gap-1.5">
                            <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            {affectedSkus.map((sku) => (
                              <Badge
                                key={sku}
                                variant="outline"
                                className="text-[10px] font-normal"
                              >
                                {sku}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Expandable Details */}
                        <div className="pl-8">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(alert.id)}
                            className="gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                            {isExpanded ? "Hide" : "Show"} Recommendation
                          </Button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="rounded-md bg-muted/50 border border-muted px-3 py-2 mt-2">
                                  <p className="text-xs font-medium text-muted-foreground mb-0.5">
                                    Recommended Action
                                  </p>
                                  <p className="text-sm">{alert.recommendation}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Actions */}
                        {!alert.resolved && (
                          <div className="pl-8 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolve(alert.id)}
                              className="gap-1.5"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
