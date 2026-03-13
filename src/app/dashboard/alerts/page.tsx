"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { alerts } from "@/lib/mock-data"
import { type Alert, type AlertSeverity } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
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
} from "lucide-react"

type FilterTab = "all" | "critical" | "warning" | "info" | "resolved"

function getRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`
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

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const [alertData, setAlertData] = useState<Alert[]>(alerts)
  const [showSettings, setShowSettings] = useState(false)
  const [thresholds, setThresholds] = useState({
    marginWarning: 15,
    marginCritical: 5,
    returnRateSpike: 3,
    adCostIncrease: 50,
  })

  const unresolvedCount = alertData.filter((a) => !a.resolved).length
  const criticalCount = alertData.filter((a) => a.severity === "critical" && !a.resolved).length
  const warningCount = alertData.filter((a) => a.severity === "warning" && !a.resolved).length
  const infoCount = alertData.filter((a) => a.severity === "info" && !a.resolved).length
  const resolvedCount = alertData.filter((a) => a.resolved).length

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

  const filterTabs: { key: FilterTab; label: string; count?: number; color?: string }[] = [
    { key: "all", label: "All" },
    { key: "critical", label: "Critical", count: criticalCount, color: "bg-red-500" },
    { key: "warning", label: "Warning", count: warningCount, color: "bg-amber-500" },
    { key: "info", label: "Info", count: infoCount, color: "bg-blue-500" },
    { key: "resolved", label: "Resolved" },
  ]

  return (
    <div className="space-y-6">
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
              Stay on top of margin changes and profit threats
            </p>
          </div>
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

      {/* Filter Tabs */}
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
      </div>

      {/* Alert Cards */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Check className="h-12 w-12 text-emerald-500 mb-3" />
              <p className="text-lg font-medium">All clear!</p>
              <p className="text-sm text-muted-foreground">
                No {activeFilter !== "all" ? activeFilter : ""} alerts to show
              </p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                layout
              >
                <Card
                  className={`border-l-4 ${getSeverityBorderColor(alert.severity)} ${
                    alert.resolved ? "opacity-60" : ""
                  }`}
                >
                  <CardContent className="p-4 sm:p-5">
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
                          <div className="space-y-1">
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
                            </div>
                            <h3
                              className={`font-semibold text-sm sm:text-base ${
                                alert.resolved ? "line-through text-muted-foreground" : ""
                              }`}
                            >
                              {alert.title}
                            </h3>
                          </div>
                        </div>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                          {getRelativeTime(alert.createdAt)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground pl-8">
                        {alert.description}
                      </p>

                      {/* Impact */}
                      <p className="text-sm italic text-muted-foreground pl-8">
                        Impact: {alert.impact}
                      </p>

                      {/* Recommendation */}
                      <div className="ml-8 rounded-md bg-muted/50 border border-muted px-3 py-2">
                        <p className="text-xs font-medium text-muted-foreground mb-0.5">
                          Recommended Action
                        </p>
                        <p className="text-sm">{alert.recommendation}</p>
                      </div>

                      {/* Actions */}
                      {!alert.resolved && (
                        <div className="pl-8">
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
            ))
          )}
        </div>
      </AnimatePresence>

      {/* Alert Settings Section */}
      <Separator />
      <div>
        <Button
          variant="ghost"
          onClick={() => setShowSettings(!showSettings)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2 font-semibold">
            <Settings className="h-4 w-4" />
            Alert Thresholds
          </span>
          {showSettings ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Card className="mt-3">
                <CardContent className="p-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Margin Warning Threshold
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={thresholds.marginWarning}
                          onChange={(e) =>
                            setThresholds((p) => ({
                              ...p,
                              marginWarning: Number(e.target.value),
                            }))
                          }
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Alert when margin drops below this
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Margin Critical Threshold
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={thresholds.marginCritical}
                          onChange={(e) =>
                            setThresholds((p) => ({
                              ...p,
                              marginCritical: Number(e.target.value),
                            }))
                          }
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Critical alert when margin drops below this
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Return Rate Spike Threshold
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={thresholds.returnRateSpike}
                          onChange={(e) =>
                            setThresholds((p) => ({
                              ...p,
                              returnRateSpike: Number(e.target.value),
                            }))
                          }
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">x normal</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Alert when return rate exceeds this multiple
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Ad Cost Increase Threshold
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={thresholds.adCostIncrease}
                          onChange={(e) =>
                            setThresholds((p) => ({
                              ...p,
                              adCostIncrease: Number(e.target.value),
                            }))
                          }
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Alert when ad costs increase by this percentage
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
