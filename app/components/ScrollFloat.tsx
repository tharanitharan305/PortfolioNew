"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

import "./ScrollFloat.css";

/* ─── Plugin registration ──────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ─────────────────────────────────────────────────── */

export interface ScrollFloatProps {
  /**
   * Text content to animate character-by-character.
   * Only a single string — no React nodes.
   */
  children: string;

  /** Extra CSS classes on the root wrapper element. */
  className?: string;

  /** Extra CSS classes on the inner text container span. */
  textClassName?: string;

  /** @deprecated Use `className` on the wrapper instead. */
  containerClassName?: string;

  /** Custom scroll container ref (for horizontal scroll / custom scroller). */
  scrollContainerRef?: React.RefObject<HTMLElement | null>;

  /**
   * Duration (seconds) of the per-character tween.
   * @default 1.5
   */
  animationDuration?: number;

  /**
   * GSAP ease string.
   * @default "power2.out"
   */
  ease?: string;

  /**
   * ScrollTrigger start position.
   * @default "top bottom"
   */
  scrollStart?: string;

  /**
   * ScrollTrigger end position.
   * @default "top center"
   */
  scrollEnd?: string;

  /**
   * Stagger delay (seconds) between each character's animation.
   * @default 0.035
   */
  stagger?: number;
}

/* ─── Component ─────────────────────────────────────────────── */

export default function ScrollFloat({
  children,
  className,
  textClassName,
  containerClassName,
  scrollContainerRef,
  animationDuration = 1.2,
  ease = "power2.out",
  scrollStart = "top bottom",
  scrollEnd = "top center",
  stagger = 0.035,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  /* ── Reduced-motion detection ── */

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
    };
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ── Character split ── */

  const splitChars = useMemo<React.ReactElement[]>(() => {
    return children.split("").map((char, index) => (
      <span key={index} className="scroll-float-char" aria-hidden="true">
        {char === " " ? " " : char}
      </span>
    ));
  }, [children]);

  /* ── GSAP Timeline + ScrollTrigger ──
   *
   * Uses a single timeline with one ScrollTrigger.  The timeline
   * owns all per-character fromTo tweens via stagger, so there is
   * exactly one ScrollTrigger instance per heading — avoiding the
   * multi-target + stagger + scrub initialisation issues that arise
   * when every child tween creates its own ScrollTrigger under Lenis.
   *
   * ScrollTrigger.refresh() is called after setup so positions are
   * recalculated once the DOM has settled.
   * ─────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const scroller: Window | HTMLElement =
      scrollContainerRef?.current ?? window;

    const chars = el.querySelectorAll<HTMLElement>(".scroll-float-char");
    if (!chars.length) return;

    /* Kill any previous timeline first (strict mode double-mount) */
    if (tlRef.current) {
      tlRef.current.scrollTrigger?.kill();
      tlRef.current.kill();
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scroller,
        start: scrollStart,
        end: scrollEnd,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      chars,
      { opacity: 0, yPercent: 40 },
      {
        opacity: 1,
        yPercent: 0,
        duration: animationDuration,
        ease,
        stagger,
      },
    );

    tlRef.current = tl;

    /* Force recalculation so GSAP bakes in the correct positions */
    ScrollTrigger.refresh();

    return () => {
      if (tlRef.current) {
        tlRef.current.scrollTrigger?.kill();
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, [
    prefersReducedMotion,
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
  ]);

  /* ── Render ── */

  return (
    <h2
      ref={containerRef}
      aria-label={typeof children === "string" ? children : undefined}
      className={cn(
        "scroll-float-wrapper",
        prefersReducedMotion && "scroll-float-reduced",
        className,
        containerClassName,
      )}
    >
      <span className={cn("scroll-float-text", textClassName)}>
        {splitChars}
      </span>
    </h2>
  );
}
