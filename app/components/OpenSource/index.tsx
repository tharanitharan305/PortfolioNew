"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { openSourceProjects } from "@/data/openSource";
import ScrollFloat from "@/app/components/ScrollFloat";

import "./OpenSource.css";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────
 *  TypewriterText — splits a string into individually targetable
 *  character spans so GSAP can stagger-reveal them.
 *
 *  Each span starts at opacity 0 (matching the fromTo "from"
 *  state) so there's no flash before GSAP takes over.
 * ────────────────────────────────────────────────────────────── */

function TypewriterText({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span key={i} className="typewriter-char">
          {char === " " ? " " : char}
        </span>
      ))}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  OpenSource — Terminal Typewriter Showcase
 *
 *  OVERVIEW
 *  A scroll-triggered terminal window that types out each open
 *  source repository entry — name, description (character by
 *  character), and GitHub-style stats.
 *
 *  ANIMATION
 *  ─────────
 *  GSAP timeline with ScrollTrigger ("play once on enter"):
 *    1. Terminal frame fades in + slides up
 *    2. Prompt line appears
 *    3. Each repo entry: name slides in → description chars
 *       stagger-reveal → stats fade in
 *    4. Final prompt with blinking cursor
 *
 *  ACCESSIBILITY
 *  ─────────────
 *  - prefers-reduced-motion disables all GSAP work and shows
 *    everything at full opacity via a CSS class override.
 *  - Every element uses semantic markup and proper aria labels.
 * ────────────────────────────────────────────────────────────── */

export default function OpenSource() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  /* ── Reduced-motion detection ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (e: MediaQueryListEvent | MediaQueryList) =>
      setPrefersReducedMotion(e.matches);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ── GSAP timeline (desktop with motion) ── */
  useEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power2.out" },
      });

      /* 1. Terminal frame */
      tl.fromTo(
        ".terminal-root",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7 },
      );

      /* 2. Prompt / header line */
      tl.fromTo(
        ".terminal-header-line",
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
      );

      /* 3. Each repo entry in sequence */
      const repos = gsap.utils.toArray<Element>(".repo-entry");

      repos.forEach((repo) => {
        /* Repo name — slides in from the left */
        tl.fromTo(
          repo.querySelector(".repo-name")!,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.3 },
        );

        /* Description — typewriter stagger on individual chars */
        const chars = repo.querySelectorAll(".typewriter-char");
        if (chars.length) {
          tl.fromTo(
            chars,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.02,
              stagger: 0.025,
              ease: "none",
            },
          );
        }

        /* Stats row — fades in */
        tl.fromTo(
          repo.querySelector(".repo-stats")!,
          { opacity: 0, y: 4 },
          { opacity: 1, y: 0, duration: 0.2 },
        );

        /* Brief pause between repos */
        tl.to({}, { duration: 0.12 });
      });

      /* 4. Final prompt line with cursor */
      tl.fromTo(
        ".terminal-final-prompt",
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
      );
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          Heading section — consistent with Journey & TechStack
          ScrollFloat character reveal on the title + subtitle.
         ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Decorative accent line (left edge) */}
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
          The terminal window rests inside a clean section with
          enough padding for the animation to breathe.
         ═══════════════════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className={[
          "relative w-full px-4 pb-28 sm:pb-40 overflow-hidden",
          prefersReducedMotion ? "reduce-motion" : "",
        ].join(" ")}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full bg-accent/4 blur-[200px]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
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

            {/* ── Terminal body ── */}
            <div className="terminal-body">
              {/* Initial prompt */}
              <p className="terminal-header-line">
                <span className="terminal-prompt">~/portfolio</span>
                <span className="terminal-caret">❯</span>
                ls open-source/
              </p>

              {/* Repo output */}
              <div className="terminal-output">
                {openSourceProjects.map((repo, index) => (
                  <div key={repo.id} className="repo-entry">
                    <p className="repo-name">
                      <span className="terminal-index">
                        {(index + 1).toString().padStart(2, "0")}
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

                    <p className="repo-description">
                      <span className="terminal-arrow" aria-hidden="true">
                        └─
                      </span>
                      <span className="terminal-desc-text">
                        <TypewriterText text={repo.description} />
                      </span>
                    </p>

                    <p className="repo-stats">
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

              {/* Final prompt with blinking cursor */}
              <p className="terminal-final-prompt">
                <span className="terminal-prompt">~/portfolio</span>
                <span className="terminal-caret">❯</span>
                <span className="terminal-cursor" aria-label="blinking cursor">
                  ▊
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
