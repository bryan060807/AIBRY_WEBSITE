"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  href?: string;
}

/**
 * DashboardCard
 *
 * A flexible, reusable card component for dashboard sections.
 * Supports hover animation, click/tap interactions, and
 * consistent dark theme styling.
 *
 * Usage:
 * - Wrap any content (avatars, stats, quick actions, etc.)
 * - Add `hoverable` for subtle scale + glow effects
 * - Optionally wrap with a link via `href`
 */
export default function DashboardCard({
  children,
  className,
  onClick,
  hoverable = true,
  href,
}: DashboardCardProps) {
  const baseClasses =
    "bg-[#0e0f11] border border-gray-800 rounded-2xl shadow-md p-6 flex flex-col transition-all duration-200";
  const hoverClasses = hoverable
    ? "hover:scale-[1.02] hover:border-[#83c0cc]/40 hover:shadow-[#83c0cc]/10"
    : "";

  // Card core (with motion for smoothness)
  const CardContent = (
    <motion.div
      whileHover={hoverable ? { scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      onClick={onClick}
      className={clsx(baseClasses, hoverClasses, className, {
        "cursor-pointer": onClick || href,
      })}
      role={onClick || href ? "button" : undefined}
      tabIndex={onClick || href ? 0 : undefined}
    >
      {children}
    </motion.div>
  );

  // If a link is provided, wrap the card with a <Link> tag
  if (href) {
    const Link = require("next/link").default;
    return <Link href={href}>{CardContent}</Link>;
  }

  return CardContent;
}
