"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { hourlyActivities } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Clock,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  DollarSign,
  Zap,
  Target,
  AlertTriangle,
  BarChart3,
  PieChart,
  Lightbulb,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

// ─── Constants & derived data ──────────────────────────────────────

const TARGET_RATE = 50
const INDUSTRY_AVG_RATE = 38

const activityColors: Record<string, string> = {
  "Online Arbitrage Sourcing": "#10B981",
  "Retail Arbitrage Sourcing": "#3B82F6",
  "Product Listing & Photography": "#F59E0B",
  "Shipping & Prep": "#EF4444",
  "Customer Service & Returns": "#8B5CF6",
  "Market Research & Analysis": "#06B6D4",
}

// Weekly mock data: realistic daily patterns per activity
const dailyData = [
  { day: "Mon", hours: { "Online Arbitrage Sourcing": 2.5, "Retail Arbitrage Sourcing": 1.5, "Product Listing & Photography": 1.0, "Shipping & Prep": 1.5, "Customer Service & Returns": 0.5, "Market Research & Analysis": 0.5 } },
  { day: "Tue", hours: { "Online Arbitrage Sourcing": 3.0, "Retail Arbitrage Sourcing": 1.0, "Product Listing & Photography": 0.5, "Shipping & Prep": 1.0, "Customer Service & Returns": 0.5, "Market Research & Analysis": 0.5 } },
  { day: "Wed", hours: { "Online Arbitrage Sourcing": 2.0, "Retail Arbitrage Sourcing": 2.0, "Product Listing & Photography": 1.0, "Shipping & Prep": 1.5, "Customer Service & Returns": 1.0, "Market Research & Analysis": 0.5 } },
  { day: "Thu", hours: { "Online Arbitrage Sourcing": 2.5, "Retail Arbitrage Sourcing": 1.5, "Product Listing & Photography": 1.5, "Shipping & Prep": 1.0, "Customer Service & Returns": 0.5, "Market Research & Analysis": 0.5 } },
  { day: "Fri", hours: { "Online Arbitrage Sourcing": 3.0, "Retail Arbitrage Sourcing": 1.0, "Product Listing & Photography": 0.5, "Shipping & Prep": 2.0, "Customer Service & Returns": 0.5, "Market Research & Analysis": 0.5 } },
  { day: "Sat", hours: { "Online Arbitrage Sourcing": 1.0, "Retail Arbitrage Sourcing": 2.0, "Product Listing & Photography": 0.0, "Shipping & Prep": 0.5, "Customer Service & Returns": 0.0, "Market Research & Analysis": 0.5 } },
  { day: "Sun", hours: { "Online Arbitrage Sourcing": 0.5, "Retail Arbitrage Sourcing": 0.0, "Product Listing & Photography": 0.0, "Shipping & Prep": 0.0, "Customer Service & Returns": 0.0, "Market Research & Analysis": 0.5 } },
]

// Trend mock data (vs last week)
const weeklyTrends: Record<string, number> = {
  "Online Arbitrage Sourcing": 8,
  "Retail Arbitrage Sourcing": -3,
  "Product Listing & Photography": -12,
  "Shipping & Prep": 2,
  "Customer Service & Returns": -5,
  "Market Research & Analysis": 15,
}

// ─── Helper functions ──────────────────────────────────────────────

function getTrendIcon(trend: string) {
  switch (trend) {
    case "up":
      return <ArrowUp className="h-4 w-4 text-emerald-500" />
    case "down":
      return <ArrowDown className="h-4 w-4 text-red-500" />
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />
  }
}

function getHourlyRateColor(rate: number): string {
  if (rate >= 40) return "text-emerald-500"
  if (rate >= 20) return "text-amber-500"
  return "text-red-500"
}

function getEfficiencyRating(rate: number, avgRate: number): number {
  const ratio = rate / avgRate
  if (ratio >= 1.5) return 5
  if (ratio >= 1.2) return 4
  if (ratio >= 0.9) return 3
  if (ratio >= 0.6) return 2
  return 1
}

// ─── SVG Components ────────────────────────────────────────────────

function CircularProgress({ score, size = 160, strokeWidth = 12 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score > 70 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444"
  const bgColor = score > 70 ? "#10B98120" : score >= 50 ? "#F59E0B20" : "#EF444420"

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />
    </svg>
  )
}

function DonutChart({ data, size = 200 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const strokeWidth = 32
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let cumulativePercent = 0
  const segments = data.map((d, i) => {
    const percent = d.value / total
    const dashArray = `${percent * circumference} ${circumference}`
    const rotation = cumulativePercent * 360
    cumulativePercent += percent
    return { ...d, dashArray, rotation, index: i }
  })

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((seg) => (
          <motion.circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={seg.dashArray}
            strokeLinecap="butt"
            style={{ transform: `rotate(${seg.rotation}deg)`, transformOrigin: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + seg.index * 0.15 }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{total}h</span>
        <span className="text-xs text-muted-foreground">per week</span>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────

type SortKey = "activity" | "hours" | "rate" | "revenue" | "trend" | "rating"
type SortDir = "asc" | "desc"

export default function HourlyPage() {
  const [sortKey, setSortKey] = useState<SortKey>("rate")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [targetRate, setTargetRate] = useState(TARGET_RATE)
  const [goalSaved, setGoalSaved] = useState(false)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  const maxHourlyRate = Math.max(...hourlyActivities.map((a) => a.hourlyRate))
  const totalHoursMonth = hourlyActivities.reduce((sum, a) => sum + a.hoursLogged, 0)
  const totalRevenue = hourlyActivities.reduce((sum, a) => sum + a.revenueGenerated, 0)
  const weightedAvgRate = totalRevenue / totalHoursMonth

  // Weekly hours derived from daily mock
  const totalHoursWeek = dailyData.reduce((sum, d) => {
    return sum + Object.values(d.hours).reduce((s, h) => s + h, 0)
  }, 0)

  // Efficiency score: weighted average of (hourlyRate / targetRate) capped at 100
  const efficiencyScore = Math.round(
    hourlyActivities.reduce((sum, a) => {
      const weight = a.hoursLogged / totalHoursMonth
      const score = Math.min((a.hourlyRate / targetRate) * 100, 100)
      return sum + score * weight
    }, 0)
  )

  const aboveIndustry = Math.round(((weightedAvgRate - INDUSTRY_AVG_RATE) / INDUSTRY_AVG_RATE) * 100)

  const sortedActivities = [...hourlyActivities].sort((a, b) => b.hourlyRate - a.hourlyRate)
  const bestActivity = sortedActivities[0]
  const worstActivity = sortedActivities[sortedActivities.length - 1]

  // Donut chart data
  const donutData = hourlyActivities.map((a) => ({
    label: a.activity,
    value: Math.round((a.hoursLogged / (totalHoursMonth / 4.3)) * 10) / 10, // approx weekly
    color: a.color,
  }))

  // Sortable table data
  const tableSorted = useMemo(() => {
    const arr = [...hourlyActivities]
    arr.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case "activity": cmp = a.activity.localeCompare(b.activity); break
        case "hours": cmp = a.hoursLogged - b.hoursLogged; break
        case "rate": cmp = a.hourlyRate - b.hourlyRate; break
        case "revenue": cmp = a.revenueGenerated - b.revenueGenerated; break
        case "trend": cmp = (weeklyTrends[a.activity] ?? 0) - (weeklyTrends[b.activity] ?? 0); break
        case "rating": cmp = getEfficiencyRating(a.hourlyRate, weightedAvgRate) - getEfficiencyRating(b.hourlyRate, weightedAvgRate); break
      }
      return sortDir === "asc" ? cmp : -cmp
    })
    return arr
  }, [sortKey, sortDir, weightedAvgRate])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown className="h-3 w-3 opacity-30" />
    return sortDir === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
  }

  // Max daily total for timeline scaling
  const maxDayTotal = Math.max(
    ...dailyData.map((d) => Object.values(d.hours).reduce((s, h) => s + h, 0))
  )

  // Goal calculations
  const rateGap = targetRate - weightedAvgRate
  const projectedWeeklyIncrease = rateGap > 0 ? Math.round(rateGap * (totalHoursMonth / 4.3)) : 0

  // Insights
  const insights = [
    {
      icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
      borderColor: "border-l-emerald-500",
      title: `Your Most Profitable Hour: ${bestActivity.activity} at ${formatCurrency(bestActivity.hourlyRate)}/hr`,
      action: "Consider spending 2 more hours/week here to add ~" + formatCurrency(bestActivity.hourlyRate * 2) + "/week",
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      borderColor: "border-l-red-500",
      title: `${worstActivity.activity} (${formatCurrency(worstActivity.hourlyRate)}/hr) is dragging down your average`,
      action: "Consider outsourcing at $12/hr to save " + formatCurrency((worstActivity.hourlyRate - 12) * (worstActivity.hoursLogged / 4.3)) + "/week",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      borderColor: "border-l-blue-500",
      title: `If you shifted 3hrs from Customer Service to ${bestActivity.activity}, you'd earn an extra ${formatCurrency((bestActivity.hourlyRate - 15) * 3)}/week`,
      action: "Automate common support queries with templates to free up time",
    },
    {
      icon: <Target className="h-5 w-5 text-amber-500" />,
      borderColor: "border-l-amber-500",
      title: "Top sellers in your category average 15hrs/week on sourcing — you're at 8hrs",
      action: "Scaling sourcing hours is the #1 lever for revenue growth",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
          <Clock className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenue Per Hour</h1>
          <p className="text-sm text-muted-foreground">
            Time intelligence dashboard — maximize your hourly earnings
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          1. EFFICIENCY SCORE HERO CARD
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 overflow-hidden">
          <CardContent className="p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Circular progress ring */}
              <div className="relative shrink-0">
                <CircularProgress score={efficiencyScore} size={160} strokeWidth={12} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className={`text-3xl font-bold ${efficiencyScore > 70 ? "text-emerald-500" : efficiencyScore >= 50 ? "text-amber-500" : "text-red-500"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {efficiencyScore}
                  </motion.span>
                  <span className="text-xs text-muted-foreground font-medium">/100</span>
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Zap className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-bold">Your Efficiency Score</h2>
                </div>
                <p className="text-base text-muted-foreground">
                  You&apos;re earning{" "}
                  <span className="font-semibold text-foreground">{formatCurrency(Math.round(weightedAvgRate * 100) / 100)}/hr</span>{" "}
                  across all activities
                </p>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {aboveIndustry}% above industry
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Industry avg: {formatCurrency(INDUSTRY_AVG_RATE)}/hr
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {efficiencyScore > 70
                    ? "Great job! Your time allocation is strong. Fine-tune low-value tasks to push higher."
                    : efficiencyScore >= 50
                    ? "Room for improvement. Shift hours from low-rate tasks to high-rate activities."
                    : "Needs attention. Focus on your most profitable activities and outsource the rest."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          2. TIME ALLOCATION DONUT + KEY METRICS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-4 w-4 text-muted-foreground" />
                Time Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <DonutChart data={donutData} size={200} />
              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-sm">
                {donutData.map((d) => (
                  <div key={d.label} className="flex items-center gap-2 text-sm">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-muted-foreground truncate text-xs">{d.label}</span>
                    <span className="ml-auto font-medium text-xs">{d.value}h</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Insight Card (kept from original) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Hours / Month</p>
                  <p className="text-2xl font-bold">{totalHoursMonth}h</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-emerald-500">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Weighted Avg Rate</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(Math.round(weightedAvgRate))}
                    <span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Best Activity Rate</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {formatCurrency(bestActivity.hourlyRate)}
                    <span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </p>
                </div>
              </div>
              {/* Quick insight */}
              <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 px-4 py-3">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">Key insight:</span> You make{" "}
                    <span className="font-semibold text-emerald-500">
                      {(bestActivity.hourlyRate / worstActivity.hourlyRate).toFixed(1)}x
                    </span>{" "}
                    more per hour doing{" "}
                    <span className="text-emerald-500">{bestActivity.activity}</span> vs{" "}
                    <span className="text-red-400">{worstActivity.activity}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          3. DAILY EFFICIENCY TIMELINE
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Weekly Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-2 px-2">
              <div className="flex gap-3 min-w-[480px]">
                {dailyData.map((day, dayIdx) => {
                  const dayTotal = Object.values(day.hours).reduce((s, h) => s + h, 0)
                  const maxBarHeight = 180
                  const barHeight = (dayTotal / maxDayTotal) * maxBarHeight
                  const isHovered = hoveredDay === dayIdx
                  const activities = Object.entries(day.hours).filter(([, h]) => h > 0)

                  return (
                    <div
                      key={day.day}
                      className="flex-1 flex flex-col items-center gap-2 min-w-[56px]"
                      onMouseEnter={() => setHoveredDay(dayIdx)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute z-10 bg-popover border border-border rounded-lg p-3 shadow-lg text-xs -mt-2 transform -translate-y-full"
                          style={{ minWidth: 160 }}
                        >
                          <p className="font-semibold mb-1.5">{day.day} — {dayTotal.toFixed(1)}h total</p>
                          {activities.map(([name, hours]) => (
                            <div key={name} className="flex items-center gap-1.5 py-0.5">
                              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: activityColors[name] }} />
                              <span className="text-muted-foreground truncate">{name.split(" ").slice(0, 2).join(" ")}</span>
                              <span className="ml-auto font-medium">{hours}h</span>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {/* Hours label */}
                      <span className="text-xs font-medium text-muted-foreground">
                        {dayTotal.toFixed(1)}h
                      </span>

                      {/* Stacked bar */}
                      <div
                        className="w-full rounded-t-md overflow-hidden flex flex-col-reverse relative cursor-pointer"
                        style={{ height: maxBarHeight }}
                      >
                        <div className="flex flex-col-reverse" style={{ height: barHeight }}>
                          {activities.map(([name, hours], i) => {
                            const segHeight = (hours / dayTotal) * barHeight
                            return (
                              <motion.div
                                key={name}
                                style={{
                                  height: segHeight,
                                  backgroundColor: activityColors[name],
                                  opacity: isHovered ? 1 : 0.85,
                                }}
                                className="w-full transition-opacity duration-200"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ delay: 0.1 + dayIdx * 0.05 + i * 0.03, duration: 0.4, ease: "easeOut" }}
                              />
                            )
                          })}
                        </div>
                      </div>

                      {/* Day label */}
                      <span className={`text-xs font-medium ${dayIdx >= 5 ? "text-muted-foreground" : "text-foreground"}`}>
                        {day.day}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mini legend */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {hourlyActivities.map((a) => (
                <div key={a.id} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: a.color }} />
                  <span className="text-[10px] text-muted-foreground">{a.activity.split(" ").slice(0, 2).join(" ")}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          4. INSIGHTS & RECOMMENDATIONS
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Insights & Recommendations
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {insights.map((insight, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className={`h-full border-l-4 ${insight.borderColor}`}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 mt-0.5">{insight.icon}</div>
                    <p className="text-sm font-semibold leading-snug">{insight.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground pl-7">{insight.action}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          5. ACTIVITY COMPARISON TABLE
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Activity Comparison
              <span className="text-xs text-muted-foreground font-normal ml-auto">Click headers to sort</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th
                      className="text-left px-4 py-3 font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSort("activity")}
                    >
                      <div className="flex items-center gap-1">
                        Activity <SortIcon col="activity" />
                      </div>
                    </th>
                    <th
                      className="text-right px-4 py-3 font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSort("hours")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Hours/wk <SortIcon col="hours" />
                      </div>
                    </th>
                    <th
                      className="text-right px-4 py-3 font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleSort("rate")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        $/hr <SortIcon col="rate" />
                      </div>
                    </th>
                    <th
                      className="text-right px-4 py-3 font-medium cursor-pointer hover:bg-muted/50 transition-colors hidden sm:table-cell"
                      onClick={() => toggleSort("revenue")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Revenue/wk <SortIcon col="revenue" />
                      </div>
                    </th>
                    <th
                      className="text-right px-4 py-3 font-medium cursor-pointer hover:bg-muted/50 transition-colors hidden md:table-cell"
                      onClick={() => toggleSort("trend")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Trend <SortIcon col="trend" />
                      </div>
                    </th>
                    <th
                      className="text-right px-4 py-3 font-medium cursor-pointer hover:bg-muted/50 transition-colors hidden lg:table-cell"
                      onClick={() => toggleSort("rating")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Rating <SortIcon col="rating" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableSorted.map((activity, idx) => {
                    const weeklyHours = Math.round((activity.hoursLogged / 4.3) * 10) / 10
                    const weeklyRevenue = Math.round(activity.revenueGenerated / 4.3)
                    const trendPct = weeklyTrends[activity.activity] ?? 0
                    const rating = getEfficiencyRating(activity.hourlyRate, weightedAvgRate)
                    const isAboveAvg = activity.hourlyRate >= weightedAvgRate
                    const isBest = activity.id === bestActivity.id
                    const isWorst = activity.id === worstActivity.id

                    return (
                      <motion.tr
                        key={activity.id}
                        className={`border-b transition-colors ${
                          idx % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                        } ${isBest ? "bg-emerald-500/5" : ""} ${isWorst ? "bg-red-500/5" : ""}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        {/* Activity name with color dot */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full shrink-0"
                              style={{ backgroundColor: activity.color }}
                            />
                            <span className="font-medium truncate max-w-[180px]">
                              {activity.activity}
                            </span>
                            {isBest && (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px] px-1.5 py-0">
                                Best
                              </Badge>
                            )}
                            {isWorst && (
                              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 text-[10px] px-1.5 py-0">
                                Lowest
                              </Badge>
                            )}
                          </div>
                        </td>

                        {/* Hours with mini bar */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-medium">{weeklyHours}h</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: activity.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(weeklyHours / (totalHoursMonth / 4.3)) * 100}%` }}
                                transition={{ delay: 0.3 + idx * 0.05, duration: 0.5 }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Hourly rate */}
                        <td className={`px-4 py-3 text-right font-bold ${isAboveAvg ? "text-emerald-500" : "text-red-500"}`}>
                          {formatCurrency(activity.hourlyRate)}
                        </td>

                        {/* Weekly revenue */}
                        <td className="px-4 py-3 text-right font-medium hidden sm:table-cell">
                          {formatCurrency(weeklyRevenue)}
                        </td>

                        {/* Trend arrow */}
                        <td className="px-4 py-3 text-right hidden md:table-cell">
                          <div className="flex items-center justify-end gap-1">
                            {trendPct > 0 ? (
                              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                            ) : trendPct < 0 ? (
                              <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                            ) : (
                              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <span className={`text-xs font-medium ${trendPct > 0 ? "text-emerald-500" : trendPct < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                              {trendPct > 0 ? "+" : ""}{trendPct}%
                            </span>
                          </div>
                        </td>

                        {/* Rating dots */}
                        <td className="px-4 py-3 text-right hidden lg:table-cell">
                          <div className="flex items-center justify-end gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-2 w-2 rounded-full ${
                                  i < rating ? "bg-amber-400" : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          6. GOAL SETTING SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Set Your Hourly Rate Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Input row */}
            <div className="flex items-center gap-3 flex-wrap">
              <label className="text-sm font-medium whitespace-nowrap">Target Hourly Rate:</label>
              <div className="relative w-28">
                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={targetRate}
                  onChange={(e) => {
                    setTargetRate(Number(e.target.value) || 0)
                    setGoalSaved(false)
                  }}
                  className="pl-8 h-9"
                  min={1}
                  max={500}
                />
              </div>
              <Button
                size="sm"
                className="h-9"
                onClick={() => {
                  setGoalSaved(true)
                  setTimeout(() => setGoalSaved(false), 3000)
                }}
              >
                {goalSaved ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Saved
                  </span>
                ) : (
                  "Save Goal"
                )}
              </Button>
            </div>

            {/* Visual bar: current vs target */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: {formatCurrency(Math.round(weightedAvgRate))}/hr</span>
                <span>Target: {formatCurrency(targetRate)}/hr</span>
              </div>
              <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                {/* Current rate bar */}
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((weightedAvgRate / Math.max(targetRate, weightedAvgRate, 1)) * 100, 100)}%` }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                />
                {/* Gap highlight */}
                {weightedAvgRate < targetRate && (
                  <motion.div
                    className="absolute inset-y-0 rounded-r-full bg-amber-500/30"
                    style={{
                      left: `${(weightedAvgRate / targetRate) * 100}%`,
                      width: `${((targetRate - weightedAvgRate) / targetRate) * 100}%`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  />
                )}
                {/* Target marker */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-foreground/50"
                  style={{ left: `${Math.min((targetRate / Math.max(targetRate, weightedAvgRate, 1)) * 100, 100)}%` }}
                />
              </div>
              {weightedAvgRate >= targetRate ? (
                <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  You&apos;ve exceeded your target! Consider raising it.
                </p>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">
                    Gap: <span className="font-medium text-amber-500">{formatCurrency(Math.round(rateGap))}/hr</span>
                    {" "}|{" "}
                    To reach your goal, optimize: <span className="font-medium">{bestActivity.activity}</span> (+2 hrs/week)
                  </p>
                  <p className="text-xs">
                    Projected weekly increase:{" "}
                    <span className="font-semibold text-emerald-500">
                      {formatCurrency(projectedWeeklyIncrease)}
                    </span>
                    {" "}if you hit your target rate
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
