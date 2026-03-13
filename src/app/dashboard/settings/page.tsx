"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  Link2,
  Bell,
  SlidersHorizontal,
  Monitor,
  Store,
  ShoppingBag,
  Globe,
  AlertTriangle,
  Download,
  Trash2,
  Check,
  Shield,
} from "lucide-react";

function ThresholdSlider({
  label,
  value,
  onChange,
  helperPrefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helperPrefix: string;
}) {
  const numValue = Number(value) || 0;
  const barColor =
    numValue > 20
      ? "bg-emerald-500"
      : numValue > 10
      ? "bg-amber-500"
      : "bg-red-500";
  const textColor =
    numValue > 20
      ? "text-emerald-600"
      : numValue > 10
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className={`text-lg font-bold ${textColor}`}>{numValue}%</span>
      </div>
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={false}
            animate={{ width: `${Math.min(numValue, 100)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="50"
          value={numValue}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {helperPrefix} {numValue}%
      </p>
    </div>
  );
}

function PlatformCard({
  name,
  description,
  icon: Icon,
  color,
  connected,
  onToggle,
}: {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
  onToggle: (v: boolean) => void;
}) {
  const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
      badge: "bg-orange-100 text-orange-700",
    },
    green: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    },
  };
  const c = colorMap[color] || colorMap.green;

  return (
    <motion.div
      layout
      className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all ${
        connected ? `${c.bg} ${c.border}` : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            connected ? `${c.bg} ${c.text}` : "bg-gray-100 text-gray-400"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Label className="font-semibold">{name}</Label>
            <AnimatePresence mode="wait">
              {connected ? (
                <motion.span
                  key="connected"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.badge}`}
                >
                  <Check className="h-3 w-3" /> Connected
                </motion.span>
              ) : (
                <motion.span
                  key="disconnected"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-500"
                >
                  Not Connected
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={connected} onCheckedChange={onToggle} />
    </motion.div>
  );
}

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("QuickFlip Commerce");
  const [email, setEmail] = useState("alex@quickflip.com");

  const [amazonConnected, setAmazonConnected] = useState(true);
  const [shopifyConnected, setShopifyConnected] = useState(true);
  const [ebayConnected, setEbayConnected] = useState(false);

  const [lowMargin, setLowMargin] = useState("15");
  const [criticalMargin, setCriticalMargin] = useState("5");
  const [feeIncrease, setFeeIncrease] = useState("10");

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [currency, setCurrency] = useState("USD");

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [showToast, setShowToast] = useState(false);

  const handleSave = useCallback(() => {
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setShowToast(true);
      setTimeout(() => {
        setSaveState("idle");
        setShowToast(false);
      }, 2000);
    }, 400);
  }, []);

  return (
    <div className="space-y-6 relative">
      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg"
          >
            <Check className="h-4 w-4" />
            Settings saved successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
      </motion.div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-500" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xl font-bold text-white shadow-md">
                  AC
                </div>
                <div>
                  <p className="font-semibold">Alex Chen</p>
                  <p className="text-xs text-muted-foreground">Owner, QuickFlip Commerce</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Connected Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-emerald-500" />
                Connected Platforms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PlatformCard
                name="Amazon"
                description="Seller Central integration"
                icon={Store}
                color="orange"
                connected={amazonConnected}
                onToggle={setAmazonConnected}
              />
              <PlatformCard
                name="Shopify"
                description="Store data sync"
                icon={ShoppingBag}
                color="green"
                connected={shopifyConnected}
                onToggle={setShopifyConnected}
              />
              <PlatformCard
                name="eBay"
                description="Marketplace connection"
                icon={Globe}
                color="blue"
                connected={ebayConnected}
                onToggle={setEbayConnected}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert Thresholds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
                Alert Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ThresholdSlider
                label="Low Margin Warning"
                value={lowMargin}
                onChange={setLowMargin}
                helperPrefix="You'll be alerted when margin drops below"
              />
              <Separator />
              <ThresholdSlider
                label="Critical Margin"
                value={criticalMargin}
                onChange={setCriticalMargin}
                helperPrefix="Critical alert when margin falls below"
              />
              <Separator />
              <ThresholdSlider
                label="Fee Increase Alert"
                value={feeIncrease}
                onChange={setFeeIncrease}
                helperPrefix="Alert when fees increase more than"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailAlerts">Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified via email</p>
                </div>
                <Switch
                  id="emailAlerts"
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Browser push alerts</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dailyDigest">Daily Digest</Label>
                  <p className="text-xs text-muted-foreground">Summary every morning</p>
                </div>
                <Switch
                  id="dailyDigest"
                  checked={dailyDigest}
                  onCheckedChange={setDailyDigest}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weeklyReport">Weekly Report</Label>
                  <p className="text-xs text-muted-foreground">Full weekly analysis</p>
                </div>
                <Switch
                  id="weeklyReport"
                  checked={weeklyReport}
                  onCheckedChange={setWeeklyReport}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-emerald-500" />
                Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Switch to dark theme</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="compactView">Compact View</Label>
                    <p className="text-xs text-muted-foreground">Denser layout</p>
                  </div>
                  <Switch
                    id="compactView"
                    checked={compactView}
                    onCheckedChange={setCompactView}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v ?? "USD")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (&euro;)</SelectItem>
                      <SelectItem value="GBP">GBP (&pound;)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            onClick={handleSave}
            disabled={saveState === "saving"}
            className={`px-8 text-white transition-all ${
              saveState === "saved"
                ? "bg-emerald-600 hover:bg-emerald-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            <AnimatePresence mode="wait">
              {saveState === "saved" ? (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" /> Saved
                </motion.span>
              ) : saveState === "saving" ? (
                <motion.span
                  key="saving"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Saving...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  Save Changes
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      <Separator />

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Shield className="h-4 w-4" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Irreversible actions. Please proceed with caution.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <Download className="h-4 w-4" />
                Export All Data
              </Button>
              <Button variant="outline" className="gap-2 border-red-300 text-red-600 hover:bg-red-600 hover:text-white">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
