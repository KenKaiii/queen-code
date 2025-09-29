import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
  children: React.ReactNode;
  showZero?: boolean;
}

/**
 * NotificationBadge - Wraps an element with a notification count badge
 *
 * @example
 * <NotificationBadge count={5}>
 *   <IconButton icon={<Bell />} />
 * </NotificationBadge>
 */
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  className,
  children,
  showZero = false,
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();
  const shouldShow = count > 0 || showZero;

  return (
    <div className={cn("relative inline-flex", className)}>
      {children}
      {shouldShow && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm"
        >
          {displayCount}
        </motion.span>
      )}
    </div>
  );
};