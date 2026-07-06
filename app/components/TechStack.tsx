"use client";

import { useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Highlighter } from "@/registry/magicui/highlighter";
import InfiniteMenu from "@/app/components/InfiniteMenu";
import { techStackItems } from "@/data/techStack";
import ScrollFloat from "@/app/components/ScrollFloat";

import "./TechStack.css";

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────────────────────────────────────────
 *  Helpers
 * ─────────────────────────────────────────────────────────── */

/** Split text into inline‑block word spans for GSAP targeting.
 *  Spaces become non‑breaking to preserve layout. */
function WordSpans({ text }: { text: string }) {
  return text.split(/(\s+)/).map((seg, i) => (
    <span key={i} className="gsap-word inline-block">
      {seg === " " ? " " : seg}
    </span>
  ));
}

/* ───────────────────────────────────────────────────────────
 *  Floating Motes — subtle particle field behind the carousel
 * ─────────────────────────────────────────────────────────── */

function FloatingMotes({ count = 14 }: { count?: number }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const left = (i / count) * 100;
        const size = 2 + (i % 3); // 2–4 px
        const drift = ((i % 5) - 2) * 20; // -40 .. 40 px horizontal drift
        const duration = 4 + (i % 4) * 2; // 4–10 s
        const delay = i * 0.45;
        return { i, left, size, drift, duration, delay };
      }),
    [count],
  );

  return (
    <div className="tech-motes" aria-hidden="true">
      {motes.map(({ i, left, size, drift, duration, delay }) => (
        <motion.span
          key={i}
          className="tech-mote"
          style={{ left: `${left}%`, width: size, height: size }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.7, 0.5, 0],
            y: [0, -120, -240, -360],
            x: [0, drift, drift * 0.6, drift * 0.3],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 *  Magnetic Glow — react‑spring driven mouse follower
 * ─────────────────────────────────────────────────────────── */

function MagneticGlow({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [{ sx, sy, so }, api] = useSpring(() => ({
    sx: 0.5,
    sy: 0.5,
    so: 0.25,
    config: { mass: 1.2, tension: 140, friction: 18 },
  }));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number;
    let currentX = 0.5;
    let currentY = 0.5;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      currentX = (e.clientX - rect.left) / rect.width;
      currentY = (e.clientY - rect.top) / rect.height;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          api.start({ sx: currentX, sy: currentY, so: 0.7 });
          rafId = 0;
        });
      }
    };

    const handleLeave = () => {
      api.start({ sx: 0.5, sy: 0.5, so: 0.2 });
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef, api]);

  return (
    <animated.div
      className="tech-magnetic-glow"
      style={{
        left: sx.to((v) => `${v * 100}%`),
        top: sy.to((v) => `${v * 100}%`),
        opacity: so,
      }}
    />
  );
}

/* ───────────────────────────────────────────────────────────
 *  Description section with word‑level GSAP reveal
 * ─────────────────────────────────────────────────────────── */

function AnimatedDescription() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const words = container.querySelectorAll<HTMLElement>(".gsap-word");
      if (!words.length) return;

      gsap.fromTo(
        words,
        { opacity: 0, y: 18, filter: "blur(6px)", rotateX: 8 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          rotateX: 0,
          stagger: {
            each: 0.04,
            from: "start",
          },
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 75%",
            end: "bottom 30%",
            scrub: 1.2,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-6 font-mono text-sm md:text-base text-text-body/70 leading-relaxed max-w-3xl mx-auto flex flex-wrap justify-center"
    >
      <WordSpans text="I have worked with these" />
      <span className="mx-1" />
      <Highlighter
        action="highlight"
        color="#c084fc"
        className="gsap-word"
      >
        languages
      </Highlighter>
      <span className="gsap-word inline-block">,</span>
      <span className="mx-1" />
      <Highlighter
        action="highlight"
        color="#c084fc"
        className="gsap-word"
      >
        frameworks
      </Highlighter>
      <span className="gsap-word inline-block">,</span>
      <span className="mx-1" />
      <Highlighter
        action="highlight"
        color="#c084fc"
        className="gsap-word"
      >
        SDKs
      </Highlighter>
      <WordSpans text=" and tools across" />
      <span className="mx-1" />
      <Highlighter
        action="underline"
        color="#2dd4bf"
        className="gsap-word"
      >
        mobile
      </Highlighter>
      <span className="gsap-word inline-block">,</span>
      <span className="mx-1" />
      <Highlighter
        action="underline"
        color="#2dd4bf"
        className="gsap-word"
      >
        web
      </Highlighter>
      <span className="gsap-word inline-block">,</span>
      <span className="mx-1" />
      <Highlighter
        action="underline"
        color="#2dd4bf"
        className="gsap-word"
      >
        backend
      </Highlighter>
      <WordSpans text=" and" />
      <span className="mx-1" />
      <Highlighter
        action="underline"
        color="#2dd4bf"
        className="gsap-word"
      >
        cloud
      </Highlighter>
      <WordSpans text=" projects." />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 *  Main Component
 * ─────────────────────────────────────────────────────────── */

export default function TechStack() {
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const section2GlowRef = useRef<HTMLDivElement>(null);

  /* ── GSAP ScrollTrigger — Section 1 ── */
  useEffect(() => {
    const s1 = section1Ref.current;
    const accent = accentLineRef.current;
    if (!s1 || !accent) return;

    const ctx = gsap.context(() => {
      /* Accent line: grow from top as user scrolls */
      gsap.fromTo(
        accent,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: s1,
            start: "top 85%",
            end: "center 50%",
            scrub: 0.8,
          },
        },
      );

      /* Background parallax layer: gentle drift */
      const bgLayer = s1.querySelector<HTMLElement>(".tech-bg-layer");
      if (bgLayer) {
        gsap.fromTo(
          bgLayer,
          { y: -30 },
          {
            y: 30,
            ease: "none",
            scrollTrigger: {
              trigger: s1,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      }
    }, s1);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — Scroll‑driven header narrative
          ───────────────────────────────────────────────────────
          As the user scrolls:
          1. Accent line grows top→bottom
          2. Each word in the description fades & slides up
          3. Background gradients drift for parallax depth
         ═══════════════════════════════════════════════════════ */}
      <section
        ref={section1Ref}
        className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden"
      >
        {/* ── Parallax background ── */}
        <div className="tech-bg-layer absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-accent-teal/[0.03]" />
          <div className="absolute top-1/3 -left-24 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[160px]" />
          <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-accent-teal/5 blur-[140px]" />
        </div>

        {/* ── Animated accent line ── */}
        <div
          ref={accentLineRef}
          className="absolute left-0 top-0 w-[1px] h-full origin-top"
        >
          <div className="w-full h-full bg-gradient-to-b from-transparent via-accent/25 to-transparent" />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <ScrollFloat
            textClassName="!font-mono !text-4xl md:!text-6xl lg:!text-7xl !font-bold !tracking-[-0.02em] !text-white"
            animationDuration={1.2}
            ease="power2.out"
            scrollStart="top bottom"
            scrollEnd="top center"
            stagger={0.035}
          >
            Tools I Used
          </ScrollFloat>

          <AnimatedDescription />
        </div>

        {/* ── Scroll cue ── */}
        <div className="tech-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-body/20">
            Scroll
          </span>
          <motion.div
            className="w-[1px] h-8 bg-gradient-to-b from-accent/40 to-transparent"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — 3D carousel with enhanced presence
          ───────────────────────────────────────────────────────
          - Magnetic mouse‑following glow (react‑spring)
          - Floating particle motes (Framer Motion)
          - Decorative rotating ring
          - Smooth fade‑in entrance
         ═══════════════════════════════════════════════════════ */}
      <section
        ref={section2Ref}
        className="relative w-full px-4 pb-24 sm:pb-32 overflow-hidden"
      >
        {/* ── Ambient glow geometry ── */}
        <div
          ref={section2GlowRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          {/* Static base glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-accent/6 blur-[180px]" />

          {/* Mouse‑reactive magnetic glow */}
          <MagneticGlow containerRef={section2GlowRef} />
        </div>

        {/* ── Subtle gradient overlay ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-deep/60 pointer-events-none" />

        {/* ── Decorative ring ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[520px] h-[520px] rounded-full border border-accent/[0.04] tech-ring" />
        </div>

        {/* ── Floating motes ── */}
        <FloatingMotes count={16} />

        {/* ── Menu entrance ── */}
        <motion.div
          className="relative z-10 w-full"
          style={{ height: "clamp(450px, 80vh, 800px)" }}
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1], // smooth deceleration curve
          }}
        >
          <InfiniteMenu items={techStackItems} scale={1.0} />
        </motion.div>
      </section>
    </>
  );
}
