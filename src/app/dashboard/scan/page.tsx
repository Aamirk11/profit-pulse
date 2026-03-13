"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { barcodeScanHistory } from "@/lib/mock-data";
import { formatCurrency, type BarcodeScan } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ScanBarcode,
  Camera,
  Check,
  X,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Zap,
} from "lucide-react";

// ─── Animated Counter ────────────────────────────────────────────────
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </motion.span>
    </motion.span>
  );
}

// ─── Scanner Corner Bracket ──────────────────────────────────────────
function ScannerCorner({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const borderClasses = {
    tl: "border-t-2 border-l-2 top-0 left-0 rounded-tl-lg",
    tr: "border-t-2 border-r-2 top-0 right-0 rounded-tr-lg",
    bl: "border-b-2 border-l-2 bottom-0 left-0 rounded-bl-lg",
    br: "border-b-2 border-r-2 bottom-0 right-0 rounded-br-lg",
  };

  return (
    <motion.div
      className={`absolute w-8 h-8 sm:w-12 sm:h-12 border-emerald-400 ${borderClasses[position]}`}
      animate={{
        borderColor: [
          "rgb(52, 211, 153)",
          "rgb(16, 185, 129)",
          "rgb(5, 150, 105)",
          "rgb(16, 185, 129)",
          "rgb(52, 211, 153)",
        ],
        boxShadow: [
          "0 0 8px rgba(16, 185, 129, 0.3)",
          "0 0 20px rgba(16, 185, 129, 0.6)",
          "0 0 8px rgba(16, 185, 129, 0.3)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<BarcodeScan | null>(null);
  const [editableCogs, setEditableCogs] = useState<number>(0);
  const [flashActive, setFlashActive] = useState(false);

  const handleSimulateScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanResult(null);

    // Flash effect
    setTimeout(() => {
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 200);
    }, 1200);

    // Show result after 1.5s
    setTimeout(() => {
      const randomScan =
        barcodeScanHistory[
          Math.floor(Math.random() * barcodeScanHistory.length)
        ];
      setScanResult(randomScan);
      setEditableCogs(randomScan.cogs);
      setIsScanning(false);
    }, 1500);
  };

  const handleSelectScan = (scan: BarcodeScan) => {
    setScanResult(scan);
    setEditableCogs(scan.cogs);
    // Scroll to top of result
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setScanResult(null);
    setIsScanning(false);
  };

  // Recalculate profit when COGS changes
  const currentNetProfit = scanResult
    ? scanResult.sellingPrice -
      scanResult.fees.referralFee -
      scanResult.fees.fbaFee -
      scanResult.fees.storageFee -
      editableCogs
    : 0;
  const currentMargin = scanResult
    ? (currentNetProfit / scanResult.sellingPrice) * 100
    : 0;

  return (
    <div className="min-h-screen pb-24 sm:pb-8">
      {/* Page Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <ScanBarcode className="h-6 w-6 text-emerald-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Barcode Scanner
          </h1>
        </div>
        <p className="text-slate-500 ml-[52px]">
          Scan any product barcode to instantly calculate profit
        </p>
      </motion.div>

      {/* Scanner Viewfinder */}
      <motion.div
        className="relative mx-auto max-w-lg mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1E293B] shadow-2xl border border-slate-700/50">
          {/* Scan grid lines background */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40 pointer-events-none" />

          {/* Corner brackets */}
          <div className="absolute inset-6 sm:inset-10">
            <ScannerCorner position="tl" />
            <ScannerCorner position="tr" />
            <ScannerCorner position="bl" />
            <ScannerCorner position="br" />
          </div>

          {/* Scanning line */}
          <motion.div
            className="absolute left-8 right-8 sm:left-12 sm:right-12 h-0.5"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(16,185,129,0.8), rgba(52,211,153,1), rgba(16,185,129,0.8), transparent)",
              boxShadow:
                "0 0 15px rgba(16,185,129,0.5), 0 0 30px rgba(16,185,129,0.3)",
            }}
            animate={{
              top: ["15%", "85%", "15%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <AnimatePresence>
              {isScanning ? (
                <motion.div
                  key="scanning"
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Zap className="h-10 w-10 text-emerald-400" />
                  </motion.div>
                  <p className="text-emerald-400 font-semibold text-lg">
                    Scanning...
                  </p>
                </motion.div>
              ) : !scanResult ? (
                <motion.div
                  key="idle"
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Camera className="h-10 w-10 text-slate-400" />
                  <p className="text-slate-400 text-sm sm:text-base font-medium">
                    Point camera at barcode
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    }}
                  >
                    <Check className="h-12 w-12 text-emerald-400" />
                  </motion.div>
                  <p className="text-emerald-400 font-semibold">
                    Scan Complete
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Flash effect */}
          <AnimatePresence>
            {flashActive && (
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Scan button */}
        <div className="flex justify-center mt-5">
          {scanResult ? (
            <motion.button
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-700 text-white font-semibold text-lg shadow-lg hover:bg-slate-600 transition-colors"
              onClick={handleReset}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ScanBarcode className="h-5 w-5" />
              Scan Another
            </motion.button>
          ) : (
            <motion.button
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold text-lg shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-colors disabled:opacity-50"
              onClick={handleSimulateScan}
              disabled={isScanning}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              animate={
                !isScanning
                  ? {
                      boxShadow: [
                        "0 10px 25px -5px rgba(16,185,129,0.25)",
                        "0 10px 35px -5px rgba(16,185,129,0.45)",
                        "0 10px 25px -5px rgba(16,185,129,0.25)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ScanBarcode className="h-5 w-5" />
              {isScanning ? "Scanning..." : "Tap to Simulate Scan"}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Scan Result Profit Card */}
      <AnimatePresence mode="wait">
        {scanResult && (
          <motion.div
            key={scanResult.id}
            className="max-w-lg mx-auto mb-10"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              mass: 0.8,
            }}
          >
            <Card className="overflow-hidden border-slate-200 shadow-xl">
              {/* Product Header */}
              <div className="p-5 pb-4 border-b border-slate-100">
                <div className="flex gap-4 items-start">
                  {/* Image placeholder */}
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, type: "spring" }}
                  >
                    <Package className="h-8 w-8 text-slate-400" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.h3
                      className="text-lg sm:text-xl font-bold text-slate-900 leading-tight"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {scanResult.productName}
                    </motion.h3>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge
                        variant="secondary"
                        className="mt-1.5 font-mono text-xs"
                      >
                        UPC: {scanResult.upc}
                      </Badge>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Selling Price */}
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">
                    Selling Price
                  </span>
                  <motion.span
                    className="text-2xl font-bold text-slate-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    {formatCurrency(scanResult.sellingPrice)}
                  </motion.span>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="px-5 pb-3 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Fee Breakdown
                </p>
                {[
                  {
                    label: "Referral Fee",
                    value: scanResult.fees.referralFee,
                    delay: 0.3,
                  },
                  {
                    label: "FBA Fee",
                    value: scanResult.fees.fbaFee,
                    delay: 0.35,
                  },
                  {
                    label: "Storage",
                    value: scanResult.fees.storageFee,
                    delay: 0.4,
                  },
                ].map((fee) => (
                  <motion.div
                    key={fee.label}
                    className="flex items-center justify-between text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: fee.delay }}
                  >
                    <span className="text-slate-500">{fee.label}</span>
                    <span className="text-red-500 font-medium">
                      -{formatCurrency(fee.value)}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* COGS Input */}
              <motion.div
                className="px-5 pb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500 font-medium">
                    COGS (Cost of Goods)
                  </span>
                  <div className="relative w-28">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      type="number"
                      value={editableCogs}
                      onChange={(e) =>
                        setEditableCogs(parseFloat(e.target.value) || 0)
                      }
                      className="pl-7 pr-2 h-9 text-right font-mono text-sm"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Separator */}
              <div className="mx-5 border-t border-dashed border-slate-200 my-2" />

              {/* Net Profit & Margin */}
              <motion.div
                className="px-5 py-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Net Profit
                  </span>
                  <AnimatedNumber
                    value={currentNetProfit}
                    prefix="$"
                    className={`text-3xl font-extrabold ${currentNetProfit >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    Margin
                  </span>
                  <AnimatedNumber
                    value={currentMargin}
                    suffix="%"
                    className={`text-xl font-bold ${currentMargin >= 20 ? "text-emerald-500" : currentMargin >= 10 ? "text-amber-500" : "text-red-500"}`}
                  />
                </div>
              </motion.div>

              {/* Sales Velocity & Competition */}
              <motion.div
                className="px-5 pb-3 flex gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ShoppingCart className="h-4 w-4 text-slate-400" />
                  <span>
                    ~{scanResult.monthlySalesVelocity}{" "}
                    <span className="text-slate-400">units/mo</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>
                    {scanResult.competitorCount}{" "}
                    <span className="text-slate-400">sellers</span>
                  </span>
                </div>
              </motion.div>

              {/* GO / NO-GO Verdict */}
              <motion.div
                className="p-5 pt-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.7,
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                }}
              >
                {scanResult.verdict === "buy" ? (
                  <motion.div
                    className="flex items-center justify-center gap-3 py-4 rounded-xl bg-emerald-50 border-2 border-emerald-400"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(16,185,129,0)",
                        "0 0 25px rgba(16,185,129,0.35)",
                        "0 0 0px rgba(16,185,129,0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.85,
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <Check className="h-8 w-8 text-emerald-600" />
                    </motion.div>
                    <span className="text-2xl font-extrabold text-emerald-600 tracking-wide">
                      BUY
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex items-center justify-center gap-3 py-4 rounded-xl bg-red-50 border-2 border-red-400"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(239,68,68,0)",
                        "0 0 25px rgba(239,68,68,0.35)",
                        "0 0 0px rgba(239,68,68,0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.85,
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <X className="h-8 w-8 text-red-600" />
                    </motion.div>
                    <span className="text-2xl font-extrabold text-red-600 tracking-wide">
                      SKIP
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Scans History */}
      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-900">Recent Scans</h2>
          <Badge variant="secondary" className="ml-auto text-xs">
            {barcodeScanHistory.length} scans
          </Badge>
        </div>

        <div className="space-y-2">
          {barcodeScanHistory.slice(0, 15).map((scan, index) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4 + index * 0.05,
                duration: 0.3,
              }}
            >
              <Card
                className={`p-3 sm:p-4 cursor-pointer transition-all hover:shadow-md hover:border-slate-300 ${
                  scanResult?.id === scan.id
                    ? "border-emerald-400 shadow-md ring-1 ring-emerald-400/30"
                    : "border-slate-200"
                }`}
                onClick={() => handleSelectScan(scan)}
              >
                <div className="flex items-center gap-3">
                  {/* Small product icon */}
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-slate-400" />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {scan.productName}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {scan.upc}
                    </p>
                  </div>

                  {/* Profit & verdict */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${scan.netProfit >= 0 ? "text-emerald-500" : "text-red-500"}`}
                      >
                        {formatCurrency(scan.netProfit)}
                      </p>
                      <p
                        className={`text-xs font-medium ${scan.margin >= 20 ? "text-emerald-500" : scan.margin >= 10 ? "text-amber-500" : "text-red-500"}`}
                      >
                        {scan.margin.toFixed(1)}%
                      </p>
                    </div>
                    <Badge
                      className={`text-xs font-bold px-2 py-0.5 ${
                        scan.verdict === "buy"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {scan.verdict === "buy" ? "BUY" : "SKIP"}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
