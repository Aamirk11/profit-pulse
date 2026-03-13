"use client";

import { useEffect, useRef, useState } from "react";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  prefix?: string;
}

function useCountUp(target: number, duration = 1200): string {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const isDecimal = String(target).includes(".") || Math.abs(target) % 1 !== 0;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (isDecimal) {
        setDisplay(current.toFixed(1));
      } else {
        setDisplay(Math.round(current).toLocaleString());
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

function parseNumericValue(value: string): number | null {
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export function StatCard({ title, value, change, icon: Icon, prefix }: StatCardProps) {
  const isPositive = change >= 0;
  const numericTarget = parseNumericValue(value);
  const animatedValue = useCountUp(numericTarget ?? 0);

  // Determine if value has formatting we should preserve (commas, decimals)
  const hasComma = value.includes(",");
  const displayValue = numericTarget !== null
    ? (hasComma ? Number(animatedValue.replace(/,/g, "")).toLocaleString() : animatedValue)
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/20">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="rounded-lg bg-muted p-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">
              {prefix}
              {displayValue}
            </p>
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                isPositive ? "text-emerald-500" : "text-red-500"
              )}
            >
              {isPositive ? "+" : ""}
              {change}%{" "}
              <span className="text-muted-foreground">from last period</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
