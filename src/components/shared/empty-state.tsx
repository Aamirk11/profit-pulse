"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="mb-4 rounded-2xl bg-muted p-5">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {actionLabel && (
        <div className="mt-5">
          {actionHref ? (
            <Link href={actionHref}>
              <Button
                className="bg-emerald-500 text-white hover:bg-emerald-600"
              >
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onAction}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
