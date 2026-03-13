"use client";

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

export function StatCard({ title, value, change, icon: Icon, prefix }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="rounded-lg bg-muted p-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">
              {prefix}
              {value}
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
