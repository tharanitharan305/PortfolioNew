import {
  type Transition,
  type Variants,
} from "framer-motion";

/* ──────────────────────────────────────────────────────────────
 *  Animation primitives
 *
 *  A single source of truth for all motion in the Journey section.
 *  Every component imports from here — no magic numbers.
 *
 *  Easing curves
 *  ─────────────
 *  All curves are hand-tuned for a premium, Apple/Linear-calibre feel.
 *  ────────────────────────────────────────────────────────────── */

// ── Cubic bezier easing curves ────────────────────────────────
export const EASE = {
  /** Apple-style smooth ease — used for most UI transitions */
  smooth: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  /** Snappy exit */
  easeIn: "easeIn" as const,
  /** Standard ease-out for large movements */
  decelerate: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
  /** Seamless entrance — overshoots slightly then settles */
  springy: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  /** Entrances feel weighty but refined */
  entrance: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const;

// ── Spring presets ────────────────────────────────────────────
/** `SPRING.gentle` — subtle, natural bounce for decorative elements */
const GENTLE = { type: "spring" as const, stiffness: 120, damping: 14, mass: 1 };

/** `SPRING.snappy` — responsive UI feedback (buttons, cards) */
const SNAPPY = { type: "spring" as const, stiffness: 300, damping: 20, mass: 0.8 };

/** `SPRING.drag` — realistic momentum for card drag interactions */
const DRAG = { type: "spring" as const, stiffness: 350, damping: 22, mass: 1, bounce: 0.2 };

/** `SPRING.entrance` — premium entrance feel */
const ENTRANCE = { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 };

/** `SPRING.magnetic` — rapid snap for magnetic hover effects */
const MAGNETIC = { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.5 };

export const SPRING = { GENTLE, SNAPPY, DRAG, ENTRANCE, MAGNETIC } as const;

// ── Duration presets ──────────────────────────────────────────
export const DUR = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.6,
  glacial: 0.9,
} as const;

// ── Stagger presets ───────────────────────────────────────────
export const STAGGER: Record<string, { staggerChildren: number; delayChildren: number }> = {
  fast: { staggerChildren: 0.04, delayChildren: 0.1 },
  normal: { staggerChildren: 0.07, delayChildren: 0.15 },
  slow: { staggerChildren: 0.1, delayChildren: 0.25 },
};

// ── Standard transition presets ───────────────────────────────
export const fadeTransition: Transition = {
  duration: DUR.normal,
  ease: EASE.smooth,
};

export const slideUpTransition: Transition = {
  duration: DUR.normal,
  ease: EASE.decelerate,
};

export const springTransition: Transition = {
  ...SPRING.ENTRANCE,
};

// ── Variant factories ─────────────────────────────────────────

export function createStaggerItem(
  direction: "up" | "down" | "left" | "right" = "up",
  distance = 16,
): Variants {
  const y = direction === "up" ? distance : direction === "down" ? -distance : 0;
  const x = direction === "left" ? distance : direction === "right" ? -distance : 0;
  return {
    hidden: { opacity: 0, y, x, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: DUR.normal, ease: EASE.smooth },
    },
  };
}

export function createScaleInItem(): Variants {
  return {
    hidden: { opacity: 0, scale: 0.92, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: DUR.slow, ease: EASE.entrance },
    },
  };
}

/* ── Container that staggers its children ────────────────── */
export function staggerContainer(stagger: { staggerChildren: number; delayChildren: number } = STAGGER.normal): Variants {
  return {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger.staggerChildren, delayChildren: stagger.delayChildren },
    },
  };
}

/* ── Blur + fade variant for content transitions ─────────── */
export const blurFade: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 10 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: DUR.normal, ease: EASE.smooth },
  },
  exit: {
    opacity: 0,
    filter: "blur(8px)",
    y: -10,
    transition: { duration: DUR.instant, ease: "easeIn" },
  },
};

/* ── 3D card flip variants ──────────────────────────────── */
export const card3DFlip = (direction: number): Variants => ({
  hidden: {
    opacity: 0,
    rotateY: direction > 0 ? -15 : 15,
    scale: 0.9,
    filter: "blur(6px)",
    transition: { duration: DUR.instant, ease: "easeIn" },
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: DUR.slow,
      ease: EASE.entrance,
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
  exit: {
    opacity: 0,
    rotateY: direction > 0 ? 15 : -15,
    scale: 0.92,
    filter: "blur(6px)",
    transition: { duration: DUR.instant, ease: "easeIn" },
  },
});
