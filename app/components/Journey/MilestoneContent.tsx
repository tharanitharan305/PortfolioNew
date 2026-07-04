"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Milestone } from "@/lib/types";
import {
  EASE,
  DUR,
  createStaggerItem,
  staggerContainer,
  STAGGER,
} from "@/lib/animation";
import ScrollFloat from "@/app/components/ScrollFloat";

/* ──────────────────────────────────────────────────────────────
 *  MilestoneContent — Left-panel description
 *
 *  Each milestone transition is a layered sequence:
 *    Old content → blur + fade out → move up
 *    ↓
 *    New content → fade in → unblur → move up
 *    ↓
 *    Accent line animates in
 *    ↓
 *    Title reveals (ScrollFloat character float)
 *    ↓
 *    Paragraph fades in
 *    ↓
 *    Tags reveal one by one
 *
 *  All powered by Framer Motion AnimatePresence with mode="wait"
 *  so exits complete before enters start.
 * ────────────────────────────────────────────────────────────── */

interface Props {
  milestone: Milestone;
  /** Total milestone count for counter */
  total: number;
}

/* ── Individual staggered item variant ───────────── */
const staggerItem = createStaggerItem("up", 12);

/* ── Counter stagger item (slower, lighter) ──────── */
const counterItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.normal, ease: EASE.smooth },
  },
};

/* ── Accent bar variant ──────────────────────────── */
const accentBar = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: DUR.slow, ease: EASE.decelerate },
  },
};

const MilestoneContent = memo(function MilestoneContent({
  milestone,
  total,
}: Props) {

  return (
    <div className="overflow-hidden" style={{ contain: "content" }}>
      {/* ── Counter ── */}
      <motion.p
        className="font-mono text-xs tracking-[0.25em] uppercase text-accent/60 mb-4"
        variants={counterItem}
      >
        <motion.span
          key={milestone.id + "-count"}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.fast, ease: EASE.smooth }}
        >
          {String(milestone.id).padStart(2, "0")}
        </motion.span>
        <span className="text-white/20"> / {String(total).padStart(2, "0")}</span>
      </motion.p>

      {/*
        AnimatePresence mode="wait" ensures exit completes
        before enter starts — never overlapping content.
      */}
      <AnimatePresence mode="wait">
        <motion.div
          key={milestone.id}
          variants={staggerContainer(STAGGER.normal)}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative"
          style={{ minHeight: 220 }}
        >
          {/* ── Accent line ── */}
          <motion.div
            className="h-px bg-gradient-to-r from-accent to-accent-teal mb-5 origin-left"
            variants={accentBar}
            style={{ transformOrigin: "left center" }}
          />

          {/* ── Period ── */}
          <motion.p
            className="font-mono text-xs tracking-[0.25em] uppercase text-accent/60 mb-3"
            variants={staggerItem}
          >
            {milestone.period}
          </motion.p>

          {/* ── Title — ScrollFloat character arrival animation ── */}
          <motion.div variants={staggerItem}>
            <ScrollFloat
              containerClassName="mb-4"
              textClassName="!font-heading !text-3xl md:!text-4xl lg:!text-5xl !font-bold !text-white !leading-tight !text-left"
              animationDuration={0.8}
              ease="back.inOut(2)"
              scrollStart="top bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
            >
              {milestone.title}
            </ScrollFloat>
          </motion.div>

          {/* ── Organisation (for work) ── */}
          {milestone.type === "work" && (
            <motion.p
              className="font-mono text-base text-text-body/60 mb-3"
              variants={staggerItem}
            >
              at{" "}
              <span className="text-accent-teal">{milestone.org}</span>
            </motion.p>
          )}

          {/* ── Role ── */}
          <motion.p
            className="font-mono text-sm text-text-body/40 mb-6"
            variants={staggerItem}
          >
            {milestone.role}
          </motion.p>

          {/* ── Tech tags ── */}
          <motion.div
            className="flex flex-wrap gap-2"
            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.25,
                },
              },
            }}
          >
            {milestone.tech.map((t) => (
              <motion.span
                key={t.name}
                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-accent-teal/8 text-accent-teal border border-accent-teal/15"
                variants={createStaggerItem("up", 8)}
              >
                {t.name}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export default MilestoneContent;
