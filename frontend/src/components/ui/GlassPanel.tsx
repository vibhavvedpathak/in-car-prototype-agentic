"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-3xl backdrop-blur-xl",
          "dark:bg-white/[0.03] bg-white/70",
          "dark:border-white/[0.06] border-white/50",
          "border shadow-2xl",
          className
        )
      )}
    >
      {children}
    </div>
  );
}
