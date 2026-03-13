"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shared/sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar — fixed position */}
      <Sidebar pathname={pathname} />

      {/* Main Content Area — offset for fixed sidebar on desktop */}
      <main className="md:ml-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8 pb-24 md:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
