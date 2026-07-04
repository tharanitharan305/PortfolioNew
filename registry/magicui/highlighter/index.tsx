"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface HighlighterProps {
  children: ReactNode;
  action?: "underline" | "highlight";
  color?: string;
  className?: string;
}

const variants: Record<string, Variants> = {
  underline: {
    hidden: { scaleX: 0, transformOrigin: "left" },
    visible: {
      scaleX: 1,
      transformOrigin: "left",
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  highlight: {
    hidden: { scaleX: 0, transformOrigin: "left" },
    visible: {
      scaleX: 1,
      transformOrigin: "left",
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
};

export function Highlighter({
  children,
  action = "underline",
  color = "#d4a24c",
  className,
}: HighlighterProps) {
  if (action === "highlight") {
    return (
      <span className={`relative inline-block ${className ?? ""}`}>
        <motion.span
          className="absolute inset-0 -inset-x-1 -inset-y-0.5 rounded-sm"
          style={{ backgroundColor: color, opacity: 0.2 }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <span className="relative z-10">{children}</span>
      </span>
    );
  }

  // default: underline
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] w-full"
        style={{ backgroundColor: color }}
        initial={{ scaleX: 0, transformOrigin: "right" }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </span>
  );
}
