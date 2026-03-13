"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, integrations, and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

        {/* Connected Platforms */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Platforms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Amazon</Label>
                <p className="text-xs text-muted-foreground">
                  Seller Central integration
                </p>
              </div>
              <Switch
                checked={amazonConnected}
                onCheckedChange={setAmazonConnected}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Shopify</Label>
                <p className="text-xs text-muted-foreground">
                  Store data sync
                </p>
              </div>
              <Switch
                checked={shopifyConnected}
                onCheckedChange={setShopifyConnected}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>eBay</Label>
                <p className="text-xs text-muted-foreground">
                  Marketplace connection
                </p>
              </div>
              <Switch
                checked={ebayConnected}
                onCheckedChange={setEbayConnected}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lowMargin">Low Margin Warning (%)</Label>
              <Input
                id="lowMargin"
                type="number"
                value={lowMargin}
                onChange={(e) => setLowMargin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="criticalMargin">Critical Margin (%)</Label>
              <Input
                id="criticalMargin"
                type="number"
                value={criticalMargin}
                onChange={(e) => setCriticalMargin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeIncrease">Fee Increase Alert (%)</Label>
              <Input
                id="feeIncrease"
                type="number"
                value={feeIncrease}
                onChange={(e) => setFeeIncrease(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailAlerts">Email Alerts</Label>
              <Switch
                id="emailAlerts"
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <Switch
                id="pushNotifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dailyDigest">Daily Digest</Label>
              <Switch
                id="dailyDigest"
                checked={dailyDigest}
                onCheckedChange={setDailyDigest}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weeklyReport">Weekly Report</Label>
              <Switch
                id="weeklyReport"
                checked={weeklyReport}
                onCheckedChange={setWeeklyReport}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-2">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <Switch
                  id="darkMode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-2">
                <Label htmlFor="compactView">Compact View</Label>
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
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
