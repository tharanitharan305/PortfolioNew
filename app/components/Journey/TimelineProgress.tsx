"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { milestones } from "@/data/milestones";

/* ──────────────────────────────────────────────────────────────
 *  TimelineProgress — Vertical progress indicator
 *
 *  • Fixed vertical line on the left side
 *  • Nodes at each milestone position
 *  • Glowing active milestone with pulse
 *  • Completed nodes filled, future nodes dim
 *  • Smooth progress bar filling from top
 *  • Connected to the current milestone index
 * ────────────────────────────────────────────────────────────── */

interface Props {
  activeIndex: number;
  progress: number;
  enabled?: boolean;
}

export default function TimelineProgress({
  activeIndex,
  progress,
  enabled = true,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Smooth progress for the line fill
  const rawProgress = useMotionValue(progress);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 25,
  });
  rawProgress.set(progress);

  // Line height as percentage
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className={`relative flex flex-col items-center ${!enabled ? "motion-reduce:opacity-60" : ""}`}
      style={{ width: 32 }}
      role="progressbar"
      aria-valuenow={activeIndex + 1}
      aria-valuemin={1}
      aria-valuemax={milestones.length}
      aria-label="Journey progress"
    >
      {/* ── Track line ── */}
      <div className="relative w-px flex-1 min-h-[200px]">
        {/* Background track */}
        <div className="absolute inset-0 w-full bg-white/10 rounded-full" />

        {/* Filled progress */}
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent to-accent-teal rounded-full"
          style={{ height: lineHeight }}
        />

        {/* ── Nodes ── */}
        {milestones.map((m, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          const pos = (i / (milestones.length - 1)) * 100;

          return (
            <div
              key={m.id}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: `${pos}%` }}
            >
              {/* Node dot */}
              <motion.div
                className={`relative w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                  isActive
                    ? "border-accent bg-accent shadow-lg shadow-accent/40"
                    : isPast
                      ? "border-accent-teal bg-accent-teal/80"
                      : "border-white/20 bg-transparent"
                }`}
                animate={
                  isActive && enabled
                    ? {
                        scale: [1, 1.25, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(212, 162, 76, 0.4)",
                          "0 0 0 8px rgba(212, 162, 76, 0)",
                          "0 0 0 0 rgba(212, 162, 76, 0)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />

              {/* Glow ring for active node */}
              {isActive && mounted && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  style={{
                    background: "radial-gradient(circle, rgba(212,162,76,0.3), transparent 70%)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Label ── */}
      <motion.div
        className="mt-4 font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ writingMode: "vertical-rl" as const, textOrientation: "mixed" as const }}
      >
        <span className="text-accent">{String(activeIndex + 1).padStart(2, "0")}</span>
        <span className="text-white/30"> / {String(milestones.length).padStart(2, "0")}</span>
      </motion.div>
    </div>
  );
}
