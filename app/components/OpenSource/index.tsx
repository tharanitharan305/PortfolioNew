"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { openSourceProjects } from "@/data/openSource";
import ScrollFloat from "@/app/components/ScrollFloat";
import { EASE, DUR } from "@/lib/animation";

import "./OpenSource.css";

/* ──────────────────────────────────────────────────────────────
 *  TypewriterText — pure CSS typewriter effect
 *
 *  Each character gets an inline animation-delay (computed from
 *  the overall timing plan) so they stagger-reveal left to right
 *  as soon as the parent receives .typing-active.
 *
 *  No JS animation lib touches these spans — the CSS keyframe
 *  handles everything, making this zero-risk for runtime failure.
 * ────────────────────────────────────────────────────────────── */

function TypewriterText({
  text,
  baseDelay,
}: {
  text: string;
  baseDelay: number;
}) {
  const CHAR_INTERVAL = 0.015;
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="typewriter-char"
          style={{ animationDelay: `${(baseDelay + i * CHAR_INTERVAL).toFixed(3)}s` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Compute a flat timing plan so every element knows its exact
 *  animation delay upfront — no runtime coordination needed.
 *
 *  Returns arrays parallel to openSourceProjects:
 *    nameDelay[n]   — when repo n's name fades in
 *    descDelay[n]   — when repo n's description typewriter starts
 *    statsDelay[n]  — when repo n's stats row appears
 * ────────────────────────────────────────────────────────────── */

const CHAR_INTERVAL = 0.015;
const NAME_DUR = 0.3;
const STATS_DUR = 0.2;
const GAP = 0.18;

interface Timing {
  nameDelay: number;
  descDelay: number;
  statsDelay: number;
}

function computeTiming(): Timing[] {
  let cursor = 0.85; // terminal entrance 0.7s + small settle

  cursor += 0.15; // gap before prompt
  const promptEnd = cursor + 0.3; // prompt takes 0.3s
  cursor = promptEnd;

  return openSourceProjects.map((repo) => {
    cursor += 0.12; // gap before this repo

    const nameDelay = cursor;
    cursor += NAME_DUR;

    cursor += 0.1; // small gap before description

    const descDelay = cursor;
    const descChars = repo.description.length;
    const descDuration = descChars * CHAR_INTERVAL;
    cursor += descDuration;

    cursor += 0.06; // small gap before stats

    const statsDelay = cursor;
    cursor += STATS_DUR;

    return { nameDelay, descDelay, statsDelay };
  });
}

/* ──────────────────────────────────────────────────────────────
 *  OpenSource — Terminal Typewriter Showcase
 *
 *  ANIMATION ARCHITECTURE
 *  ─────────────────────
 *  Layer 1 — Terminal entrance:          Framer Motion whileInView
 *  Layer 2 — Prompt / name / stats:      CSS keyframes (computed delay)
 *  Layer 3 — Typewriter chars:           CSS keyframes (computed delay)
 *  Layer 4 — Trigger:                    IntersectionObserver adds
 *                                        .typing-active to section
 *
 *  This layered approach means zero reliance on GSAP or
 *  ScrollTrigger for the core animation.  Content is always
 *  guaranteed to appear because:
 *    a) No CSS opacity: 0 on structural elements
 *    b) Typewriter chars are the only hidden elements (opacity: 0
 *       via .typewriter-char), and they're revealed by CSS
 *       animations triggered by a reliable IntersectionObserver
 *    c) Reduced-motion fallback shows everything at full opacity
 * ────────────────────────────────────────────────────────────── */

export default function OpenSource() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [typingActive, setTypingActive] = useState(false);
  const [terminalEntered, setTerminalEntered] = useState(false);

  const timings = useMemo(() => computeTiming(), []);

  /* ── Reduced-motion detection ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (e: MediaQueryListEvent | MediaQueryList) =>
      setPrefersReducedMotion(e.matches);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ── IntersectionObserver to trigger typewriter ──
   *  When the terminal wrapper enters the viewport we
   *  add .typing-active so CSS keyframes kick in.
   *  This is decoupled from Framer Motion's whileInView
   *  to avoid any coordination race.                     */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          /* Small delay so the Framer Motion terminal
           * entrance gets a head start */
          setTimeout(() => setTypingActive(true), 600);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReducedMotion]);

  /* ── When to show the terminal frame ──
   *  For reduced motion, always visible.
   *  Otherwise, wait for Framer Motion whileInView. */
  const showTerminal = prefersReducedMotion || terminalEntered;

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          Heading section
         ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-accent/15 to-transparent" />

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <ScrollFloat
            containerClassName="mb-4"
            textClassName="!font-mono !text-4xl md:!text-6xl lg:!text-7xl !font-bold !tracking-[-0.02em] !text-white"
            animationDuration={1.2}
            ease="power2.out"
            scrollStart="top bottom"
            scrollEnd="top center"
            stagger={0.035}
          >
            Open Source
          </ScrollFloat>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent/70">
            Projects I&apos;ve Built
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          Terminal section
         ═══════════════════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className={[
          "relative w-full px-4 pb-28 sm:pb-40 overflow-hidden",
          typingActive || prefersReducedMotion ? "typing-active" : "",
          prefersReducedMotion ? "reduce-motion" : "",
        ].join(" ")}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full bg-accent/4 blur-[200px]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* ── Terminal ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true, margin: "-60px" }}
            onViewportEnter={() => setTerminalEntered(true)}
            transition={{
              duration: 0.7,
              ease: EASE.smooth,
            }}
            style={showTerminal ? {} : { opacity: 0, y: 30 }}
          >
            <div className="terminal-root">
              {/* ── Title bar ── */}
              <div className="terminal-titlebar">
                <div className="terminal-dots">
                  <span className="terminal-dot terminal-dot-red" />
                  <span className="terminal-dot terminal-dot-yellow" />
                  <span className="terminal-dot terminal-dot-green" />
                </div>
                <span className="terminal-title">open-source.sh</span>
                <div className="terminal-spacer" />
              </div>

              {/* ── Body ── */}
              <div className="terminal-body">
                {/* Prompt */}
                <p
                  className="terminal-header-line"
                  style={{
                    animationDelay: "0.85s",
                    animationDuration: "0.3s",
                    animationFillMode: "forwards",
                    animationTimingFunction: "ease-out",
                  }}
                >
                  <span className="terminal-prompt">~/portfolio</span>
                  <span className="terminal-caret">❯</span>
                  ls open-source/
                </p>

                {/* Repos */}
                <div className="terminal-output">
                  {openSourceProjects.map((repo, idx) => (
                    <div key={repo.id} className="repo-entry">
                      {/* Name */}
                      <p
                        className="repo-name"
                        style={{
                          animationDelay: `${timings[idx].nameDelay}s`,
                          animationDuration: `${NAME_DUR}s`,
                        }}
                      >
                        <span className="terminal-index">
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="terminal-folder-icon" aria-hidden="true">
                          📦
                        </span>
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="terminal-repo-name"
                        >
                          {repo.name}
                        </a>
                      </p>

                      {/* Description — typewriter */}
                      <p className="repo-description">
                        <span className="terminal-arrow" aria-hidden="true">
                          └─
                        </span>
                        <span className="terminal-desc-text">
                          <TypewriterText
                            text={repo.description}
                            baseDelay={timings[idx].descDelay}
                          />
                        </span>
                      </p>

                      {/* Stats */}
                      <p
                        className="repo-stats"
                        style={{
                          animationDelay: `${timings[idx].statsDelay}s`,
                          animationDuration: `${STATS_DUR}s`,
                        }}
                      >
                        <span className="terminal-stat">
                          ★ {repo.stars.toLocaleString()}
                        </span>
                        <span className="terminal-stat">
                          ⑂ {repo.forks}
                        </span>
                        <span
                          className="terminal-lang-dot"
                          style={{ background: repo.languageColor }}
                          aria-hidden="true"
                        />
                        <span className="terminal-lang">{repo.language}</span>
                        <span className="terminal-url">{repo.url}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Final prompt */}
                <p
                  className="terminal-final-prompt"
                  style={{
                    animationDelay: `${(timings[timings.length - 1].statsDelay + 0.4).toFixed(3)}s`,
                    animationDuration: "0.3s",
                  }}
                >
                  <span className="terminal-prompt">~/portfolio</span>
                  <span className="terminal-caret">❯</span>
                  <span
                    className={`terminal-cursor ${typingActive || prefersReducedMotion ? "cursor-blink" : ""}`}
                    aria-label="blinking cursor"
                  >
                    ▊
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
