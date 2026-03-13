"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shared/sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { AnimatePresence, motion } from "framer-motion";

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
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-6 sm:px-6 lg:px-8 pb-24 md:pb-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
