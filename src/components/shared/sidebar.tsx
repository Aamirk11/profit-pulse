"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
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
      <div className="flex flex-col items-start gap-1 px-6 py-6 border-b">
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-500 text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
