"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { milestones } from "@/data/milestones";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import TechStackTray from "@/app/components/TechStackTray";
import { EASE, DUR, createScaleInItem, createStaggerItem, staggerContainer, STAGGER } from "@/lib/animation";
import TimelineProgress from "./TimelineProgress";
import MilestoneContent from "./MilestoneContent";
import Lanyard from "./Lanyard";
import ScrollFloat from "@/app/components/ScrollFloat";

/* ──────────────────────────────────────────────────────────────
 *  Journey — Pinned-scroll cinematic storytelling section
 *
 *  OVERVIEW
 *  ────────
 *  This is the orchestrator for the entire Journey experience.
 *  It owns the scroll-driven state and passes it down to focused
 *  sub-components that each handle one visual responsibility.
 *
 *  ARCHITECTURE
 *  ────────────
 *  • GSAP ScrollTrigger  → pinning + scroll-distance math
 *  • Framer Motion       → all visual transitions (both panels)
 *  • Custom hooks        → mouse tracking, scroll progress
 *  • Sub-components      → background, particles, timeline, panels
 *
 *  DATA FLOW
 *  ─────────
 *  ScrollTrigger.onUpdate()
 *    → setActiveIndex(n)   → MilestoneContent + Lanyard swap
 *
 *  PERFORMANCE
 *  ───────────
 *  • Only activeIndex (integer) triggers React re-renders.
 *  • Fine-grained progress updates the background via CSS + motion
 *    values — no re-renders.
 *  • Sub-components each contain their own rendering.
 *  • Canvas particles run off the main thread.
 *  • IntersectionObserver pauses expensive animations off-screen.
 * ────────────────────────────────────────────────────────────── */

export default function Journey() {
  // ── Refs ────────────────────────────────────────
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // ── State ────────────────────────────────────────
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [entered, setEntered] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  // Mutable refs to avoid stale closures in GSAP callbacks
  const idxRef = useRef(0);
  const inited = useRef(false);
  // Ref for RAF-throttled progress to avoid re-render storms on every scroll frame
  const progressRef = useRef(0);
  const rafIdRef = useRef(0);

  // ── Milestone data ───────────────────────────────
  const milestone = milestones[activeIndex];

  // ── Fallback detection (mobile + reduced motion) ─
  useEffect(() => {
    const mq = window.matchMedia(
      "(max-width: 768px), (prefers-reduced-motion: reduce)",
    );
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsFallback(e.matches);
      if (e.matches) setEntered(true); // skip entry animation
    };
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ── Entry animation: IntersectionObserver ────────
  useEffect(() => {
    if (isFallback) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isFallback]);

  // ── GSAP ScrollTrigger (desktop only) ────────────
  useEffect(() => {
    if (isFallback || inited.current) return;
    inited.current = true;

    let kill = false;

    import("gsap").then(({ default: gsap }) =>
      import("gsap/ScrollTrigger").then(({ default: ST }) => {
        if (kill) return;

        gsap.registerPlugin(ST);

        const section = sectionRef.current;
        if (!section) return;

        const st = ST.create({
          trigger: section,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          start: "top top",
          end: `+=${milestones.length * 100}vh`,
          invalidateOnRefresh: true,
          onUpdate(self) {
            // Store progress in ref — only push to React state once per frame
            const p = Math.min(self.progress, 1);
            progressRef.current = p;

            if (!rafIdRef.current) {
              rafIdRef.current = requestAnimationFrame(() => {
                rafIdRef.current = 0;
                setProgress(progressRef.current);
              });
            }

            // ── Index calculation with hysteresis ──────────
            // Each milestone occupies 1 / milestones.length of total progress.
            // Hysteresis (0.15 raw-milestone units) prevents boundary jitter:
            //   forward  N → N+1  only when  raw > N + 1.15
            //   backward N → N-1  only when  raw < N - 0.15
            // This gives a clean ±9% (of a milestone) dead zone around each threshold.
            const HYST = 0.15;
            const raw = p * milestones.length;
            const current = idxRef.current;
            let next = current;

            if (raw > current + 1 + HYST && current < milestones.length - 1) {
              next = current + 1;
            } else if (raw < current - HYST && current > 0) {
              next = current - 1;
            }

            if (next !== current) {
              idxRef.current = next;
              setActiveIndex(next);
            }
          },
        });

        ST.refresh();

        // Cleanup
        return () => {
          kill = true;
          st.kill();
          inited.current = false;
        };
      }),
    );

    return () => {
      kill = true;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
      import("gsap/ScrollTrigger").then(({ default: ST }) => {
        ST.getAll().forEach((t: ScrollTriggerType) => t.kill());
      });
      inited.current = false;
    };
  }, [isFallback]);

  // ── Staggered entry variants ─────────────────────
  const staggerContainerVariants = staggerContainer(STAGGER.slow);
  const leftItemVariants = createStaggerItem("up", 24);
  const rightItemVariants = createScaleInItem();

  // ── Responsive fallback ──────────────────────────
  if (isFallback) {
    return (
      <section
        id="journey"
        className="py-24 px-6 max-w-6xl mx-auto"
        ref={sectionRef}
      >
        <ScrollFloat
          containerClassName="mb-2"
          textClassName="!font-heading !text-4xl md:!text-5xl !font-bold !text-white"
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
        >
          Professional Journey
        </ScrollFloat>
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-16">
          Milestones
        </p>

        <div className="space-y-16">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              <div>
                <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent/60 mb-2">
                  {m.period}
                </p>
                <h3 className="font-heading text-2xl font-semibold text-white mb-1">
                  {m.title}
                </h3>
                {m.type === "work" && (
                  <p className="font-mono text-sm text-text-body/60 mb-4">
                    {m.org}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {m.tech.map((t) => (
                    <span
                      key={t.name}
                      className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-teal/10 text-accent-teal border border-accent-teal/20"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <Lanyard
                  position={[0, 0, 16]}
                  gravity={[0, -40, 0]}
                  fov={20}
                  frontImage="/card-front.svg"
                  backImage="/card-back.svg"
                  lanyardWidth={0.8}
                  height={360}
                  width={280}
                />
              </div>

              <div className="md:col-span-2 flex justify-center">
                <TechStackTray milestones={milestones.slice(0, m.id)} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ── Desktop: cinematic pinned-scroll layout ──────
  return (
    <>
      {/* ── Journey heading — animated on scroll via ScrollFloat ── */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-6 overflow-hidden bg-bg-deep">
        <div className="text-center max-w-4xl mx-auto">
          <ScrollFloat
            containerClassName="mb-4"
            textClassName="!font-heading !text-5xl md:!text-7xl lg:!text-8xl !font-bold !tracking-tight !text-white"
            animationDuration={1.2}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.04}
          >
            Professional Journey
          </ScrollFloat>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent/70">
            Milestones
          </p>
        </div>
      </section>

      {/* ── Pinned timeline section ── */}
      <section
        id="journey"
        ref={sectionRef}
        className="relative overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/*
        Pinned content wrapper — fills the viewport while
        ScrollTrigger keeps us pinned.
      */}
      <motion.div
        ref={contentRef}
        className="absolute inset-0 flex items-center"
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : {}}
        transition={{ duration: DUR.glacial, ease: EASE.smooth }}
        style={{ contain: "layout" }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-start gap-8 lg:gap-12">
            {/* ── Left: Timeline progress ── */}
            <div className="hidden lg:flex items-start pt-2 flex-shrink-0">
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
              >
                <motion.div variants={leftItemVariants}>
                  <TimelineProgress
                    activeIndex={activeIndex}
                    progress={progress}
                    enabled={entered}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* ── Center: Milestone content ── */}
            <div className="flex-1 min-w-0 pt-2">
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                className="max-w-xl"
              >
                <motion.div variants={leftItemVariants}>
                  <MilestoneContent
                    milestone={milestone}
                    total={milestones.length}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* ── Right: ID Card + Tech Stack ── */}
            <div className="hidden sm:flex flex-col items-center gap-6 flex-shrink-0 pt-2">
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
              >
                <motion.div
                  variants={rightItemVariants}
                  className="origin-center"
                >
                  <Lanyard
                    position={[0, 0, 10]}
                    gravity={[0, -40, 0]}
                    fov={20}
                    frontImage="/card-front.svg"
                    backImage="/card-back.svg"
                    lanyardWidth={0.8}
                    height={480}
                    width={360}
                  />
                </motion.div>

                <motion.div
                  className="mt-6 flex justify-center"
                  variants={createStaggerItem("up", 16)}
                >
                  <TechStackTray
                    milestones={milestones.slice(0, activeIndex + 1)}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
    </>
  );
}
