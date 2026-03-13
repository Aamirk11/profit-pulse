"use client"

import { motion } from "framer-motion"
import { hourlyActivities } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  Clock,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  DollarSign,
  Zap,
  Target,
} from "lucide-react"

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

export default function HourlyPage() {
  const maxHourlyRate = Math.max(...hourlyActivities.map((a) => a.hourlyRate))
  const totalHours = hourlyActivities.reduce((sum, a) => sum + a.hoursLogged, 0)
  const totalRevenue = hourlyActivities.reduce((sum, a) => sum + a.revenueGenerated, 0)
  const weightedAvgRate = Math.round(totalRevenue / totalHours)

  const sortedActivities = [...hourlyActivities].sort(
    (a, b) => b.hourlyRate - a.hourlyRate
  )
  const bestActivity = sortedActivities[0]
  const worstActivity = sortedActivities[sortedActivities.length - 1]
  const multiplier = (bestActivity.hourlyRate / worstActivity.hourlyRate).toFixed(1)

  const chartData = sortedActivities.map((a) => ({
    name: a.activity.length > 20 ? a.activity.slice(0, 18) + "..." : a.activity,
    fullName: a.activity,
    rate: a.hourlyRate,
    color: a.color,
  }))

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
            Track your true hourly rate per activity
          </p>
        </div>
      </div>

      {/* Key Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                <Zap className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-sm sm:text-base">
                  You make {multiplier}x more per hour doing{" "}
                  <span className="text-emerald-500">{bestActivity.activity}</span> vs{" "}
                  <span className="text-red-400">{worstActivity.activity}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Consider shifting 5 hours/week from{" "}
                  {worstActivity.activity.toLowerCase()} to{" "}
                  {bestActivity.activity.toLowerCase().includes("sourcing")
                    ? "online sourcing"
                    : bestActivity.activity.toLowerCase()}{" "}
                  for an estimated{" "}
                  <span className="font-semibold text-emerald-500">
                    {formatCurrency(
                      (bestActivity.hourlyRate - worstActivity.hourlyRate) * 5
                    )}
                    /week
                  </span>{" "}
                  increase
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hourly Rate Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Hourly Rate by Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${v}`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={130}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}/hr`, "Hourly Rate"]}
                    labelFormatter={(label) => {
                      const item = chartData.find((d) => d.name === String(label))
                      return item?.fullName || String(label)
                    }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={28}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sortedActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.06, duration: 0.3 }}
          >
            <Card className="h-full">
              <CardContent className="p-4 sm:p-5 space-y-3">
                {/* Activity Name + Trend */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{activity.activity}</h3>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(activity.trend)}
                    <span className="text-xs text-muted-foreground capitalize">
                      {activity.trend}
                    </span>
                  </div>
                </div>

                {/* Hourly Rate - Large */}
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-2xl font-bold ${getHourlyRateColor(
                      activity.hourlyRate
                    )}`}
                  >
                    {formatCurrency(activity.hourlyRate)}
                  </span>
                  <span className="text-sm text-muted-foreground">/hr</span>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Hours Logged</p>
                    <p className="font-medium">{activity.hoursLogged}h this month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Revenue Generated</p>
                    <p className="font-medium">
                      {formatCurrency(activity.revenueGenerated)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Relative hourly rate</span>
                    <span>
                      {Math.round((activity.hourlyRate / maxHourlyRate) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(activity.hourlyRate / maxHourlyRate) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Time Allocation Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Time Allocation Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Hours</p>
                <p className="text-xl font-bold">{totalHours}h</p>
                <p className="text-xs text-muted-foreground">this month</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-emerald-500">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground">generated</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Weighted Avg Rate</p>
                <p className="text-xl font-bold">
                  {formatCurrency(weightedAvgRate)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /hr
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">across all activities</p>
              </div>
            </div>

            <div className="rounded-md bg-muted/50 border border-muted px-4 py-3">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm">
                  <span className="font-medium">Recommendation:</span> You spend{" "}
                  {worstActivity.hoursLogged}h/month on{" "}
                  {worstActivity.activity.toLowerCase()} at just{" "}
                  {formatCurrency(worstActivity.hourlyRate)}/hr. Shifting even 25% of
                  those hours to high-value sourcing activities could increase your
                  effective hourly rate by{" "}
                  <span className="font-semibold text-emerald-500">
                    {formatCurrency(
                      Math.round(
                        (bestActivity.hourlyRate - worstActivity.hourlyRate) * 0.25 *
                          (worstActivity.hoursLogged / 4)
                      )
                    )}
                    /week
                  </span>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
