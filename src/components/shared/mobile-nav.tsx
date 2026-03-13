"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ScanBarcode,
  Bell,
  Clock,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "SKU", href: "/dashboard/skus", icon: Package },
  { label: "Scanner", href: "/dashboard/scan", icon: ScanBarcode, isCenter: true },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Revenue", href: "/dashboard/hourly", icon: Clock },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-end justify-around border-t bg-white dark:bg-zinc-950 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        if (item.isCenter) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center -mt-5"
            >
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full shadow-lg",
                  "bg-emerald-500 text-white"
                )}
              >
                <ScanBarcode className="h-7 w-7" />
              </div>
              <span className="mt-1 text-[10px] font-medium text-emerald-500">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 px-1",
              isActive ? "text-emerald-500" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
