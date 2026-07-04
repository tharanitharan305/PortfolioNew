"use client";

import React, { useId, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

import "./morph-text.css";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface MorphTextProps {
  /**
   * Array of words / phrases to cycle through.
   * @default ["CREATE", "DESIGN", "DEVELOP"]
   */
  words?: string[];
  /**
   * Duration (ms) each word is displayed before transitioning.
   * @default 3000
   */
  interval?: number;
  /**
   * Optional subtext rendered beneath the morphing word.
   */
  subtext?: string;
  /**
   * Font size passed as a CSS value (e.g. "clamp(3rem, 15vw, 10rem)").
   * Defaults to a fluid clamp that scales with the viewport.
   */
  fontSize?: string;
  /**
   * Font family. Defaults to `"Space Grotesk", sans-serif`.
   */
  fontFamily?: string;
  /** Extra CSS classes on the root wrapper. */
  className?: string;
  /** Extra CSS classes on the morphing text container. */
  textClassName?: string;
  /** Extra CSS classes on the subtext element. */
  subtextClassName?: string;
  /**
   * If true, plays the entrance animation once when scrolled into view
   * and stays visible (no cycling). Only the first word is shown.
   * @default false
   */
  once?: boolean;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function MorphText({
  words = ["CREATE", "DESIGN", "DEVELOP"],
  interval = 3000,
  subtext,
  fontSize = "clamp(3rem, 15vw, 10rem)",
  fontFamily = '"Space Grotesk", sans-serif',
  className,
  textClassName,
  subtextClassName,
  once = false,
}: MorphTextProps) {
  // Unique ID so multiple instances don't share filter IDs
  const uid = useId().replace(/:/g, "");
  const filterId = `morph-threshold-${uid}`;

  // ── "once" mode: entrance animation on scroll visibility ──
  const rootRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!once);

  useEffect(() => {
    if (!once || isVisible) return;
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, isVisible]);

  // ── Animation timing ──
  const totalDuration = (interval / 1000) * words.length; // seconds
  const wordDuration = interval / 1000;

  // Build per-word style objects
  const wordStyles = words.map((_, i) => {
    if (once) {
      return {
        opacity: 0,
        whiteSpace: "nowrap" as const,
        animationName: "morph-word-enter" as const,
        animationDuration: "1.2s",
        animationTimingFunction: "ease-out",
        animationFillMode: "forwards" as const,
        animationPlayState: (isVisible ? "running" : "paused") as React.CSSProperties["animationPlayState"],
      };
    }
    return {
      animationDelay: `${i * wordDuration}s`,
      animationDuration: `${totalDuration}s`,
    };
  });

  return (
    <div ref={rootRef} className={cn("morph-text-root relative flex flex-col items-center", className)}>
      {/* ── Threshold SVG filter (hidden) ─────────────────────────── */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* ── Morphing word container ────────────────────────────────── */}
      <div
        className={cn("morph-text-container relative select-none", textClassName)}
        style={{
          fontSize,
          fontWeight: 700,
          filter: `url(#${filterId})`,
          fontFamily,
        }}
      >
        {/* word rotator */}
        <div
          className="morph-word-rotator relative flex items-center justify-center"
          style={{ height: "1.2em", minWidth: "14ch" }}
        >
          {words.map((word, i) => {
            // In "once" mode only render the first word
            if (once && i > 0) return null;
            return (
              <span
                key={`${word}-${i}`}
                className="morph-word absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  opacity: 0,
                  whiteSpace: "nowrap",
                  animationName: "morph-word-rotate",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: once ? 1 : ("infinite" as const),
                  animationFillMode: once ? "forwards" : "both",
                  ...wordStyles[i],
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Optional subtext ──────────────────────────────────────── */}
      {subtext && (
        <p
          className={cn(
            "morph-subtext mt-8 uppercase tracking-[0.2em] text-[#888]",
            subtextClassName
          )}
          style={{
            fontSize: "1.2rem",
            opacity: once ? 0 : undefined,
            animation: once
              ? isVisible
                ? "morph-fade-up 1s ease-out 0.4s forwards"
                : "none"
              : "morph-fade-up 1s ease-out 1s forwards",
            fontFamily,
          }}
        >
          {subtext}
        </p>
      )}

      {/* ── Scoped keyframes (in morph-text.css) ── */}
    </div>
  );
}

export default MorphText;
