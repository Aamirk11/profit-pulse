"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ScanBarcode,
  Bell,
  Clock,
  Settings,
} from "lucide-react";

interface SidebarProps {
  pathname: string;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "SKU Profitability", href: "/dashboard/skus", icon: Package },
  { label: "Barcode Scanner", href: "/dashboard/scan", icon: ScanBarcode },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Revenue/Hour", href: "/dashboard/hourly", icon: Clock },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ pathname }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:left-0 border-r bg-white dark:bg-zinc-950 z-40">
      {/* Logo */}
      <div className="flex flex-col items-start gap-1 px-6 py-4 border-b">
        <Logo size="md" />
        <span className="text-xs text-muted-foreground ml-1">
          QuickFlip Commerce
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-emerald-500"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon className="relative z-10 h-5 w-5 shrink-0" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
            QF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">QuickFlip Commerce</span>
            <span className="text-xs text-muted-foreground">Growth Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
