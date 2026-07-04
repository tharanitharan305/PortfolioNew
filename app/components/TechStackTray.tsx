"use client";

import { Milestone } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

interface TechStackTrayProps {
  milestones: Milestone[];
}

const MAX_VISIBLE = 6;

/** Format months into "Xm" or "X.Yyr". */
function fmtDuration(m: number): string {
  return m >= 12 ? `${(m / 12).toFixed(1)}yr` : `${m}mo`;
}

interface AccumulatedTech {
  name: string;
  totalMonths: number;
}

export default function TechStackTray({ milestones }: TechStackTrayProps) {
  const { visible, hiddenCount } = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of milestones) {
      for (const t of m.tech) {
        map.set(t.name, (map.get(t.name) || 0) + t.durationMonths);
      }
    }
    const sorted: AccumulatedTech[] = Array.from(
      map,
      ([name, totalMonths]) => ({ name, totalMonths }),
    ).sort((a, b) => b.totalMonths - a.totalMonths);
    return {
      visible: sorted.slice(0, MAX_VISIBLE),
      hiddenCount: sorted.length - MAX_VISIBLE,
    };
  }, [milestones]);

  if (visible.length === 0) return null;

  return (
    <div className="w-full max-w-[280px]">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-body/40 mb-3 text-center">
        Cumulative Tech Experience
      </p>

      <div
        className="flex flex-wrap justify-center gap-1.5 max-h-[160px] overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: "thin" }}
      >
        <AnimatePresence mode="popLayout">
          {visible.map((tech) => (
            <motion.span
              key={tech.name}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.5,
              }}
              className="font-mono text-[10px] px-2 py-1 rounded-full bg-accent-teal/10 text-accent-teal border border-accent-teal/20 whitespace-nowrap"
            >
              {tech.name}{" "}
              <span className="text-text-body/30 font-medium">
                {fmtDuration(tech.totalMonths)}
              </span>
            </motion.span>
          ))}
        </AnimatePresence>

        {hiddenCount > 0 && (
          <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-white/5 text-text-body/40 border border-white/10 whitespace-nowrap select-none">
            +{hiddenCount} more
          </span>
        )}
      </div>
    </div>
  );
}
