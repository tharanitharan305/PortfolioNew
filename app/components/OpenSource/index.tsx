"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { openSourceProjects, type OpenSourceProject } from "@/data/openSource";
import ScrollFloat from "@/app/components/ScrollFloat";

import "./OpenSource.css";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────
 *  Types
 * ────────────────────────────────────────────────────────────── */

type LineType =
  | "command"
  | "response"
  | "response-typing"
  | "link"
  | "separator";

interface TerminalLine {
  id: string;
  type: LineType;
  text: string;
  weight: number;
  linkData?: [string, string];
}

/* ──────────────────────────────────────────────────────────────
 *  Generate terminal lines from project data
 * ────────────────────────────────────────────────────────────── */

function generateLines(projects: OpenSourceProject[]): TerminalLine[] {
  const lines: TerminalLine[] = [];

  projects.forEach((p, pIdx) => {
    /* Install */
    lines.push({
      id: `${p.id}-install-cmd`,
      type: "command",
      text: `❯ ${p.installCmd}`,
      weight: 2.0,
    });
    lines.push({
      id: `${p.id}-install-resp`,
      type: "response",
      text: p.installResponse,
      weight: 1.0,
    });

    /* --explain */
    lines.push({
      id: `${p.id}-explain-cmd`,
      type: "command",
      text: `❯ ${p.name} --explain`,
      weight: 1.8,
    });
    lines.push({
      id: `${p.id}-explain-resp`,
      type: "response-typing",
      text: p.explainOutput,
      weight: 3.0,
    });

    /* --links */
    lines.push({
      id: `${p.id}-links-cmd`,
      type: "command",
      text: `❯ ${p.name} --links`,
      weight: 1.8,
    });
    lines.push({
      id: `${p.id}-link-repo`,
      type: "link",
      text: "",
      weight: 0.6,
      linkData: ["Repository", p.links.repo],
    });
    lines.push({
      id: `${p.id}-link-pkg`,
      type: "link",
      text: "",
      weight: 0.6,
      linkData: [p.links.packageLabel, p.links.package],
    });

    /* Separator */
    if (pIdx < projects.length - 1) {
      lines.push({
        id: `${p.id}-sep`,
        type: "separator",
        text: "",
        weight: 0.4,
      });
    }
  });

  return lines;
}

/* ──────────────────────────────────────────────────────────────
 *  Map scroll progress → visible state
 * ────────────────────────────────────────────────────────────── */

function computeVisible(
  progress: number,
  lines: TerminalLine[],
): { pastCount: number; activeIdx: number; partialChars: number } {
  if (progress <= 0) return { pastCount: 0, activeIdx: -1, partialChars: 0 };
  if (progress >= 1)
    return {
      pastCount: lines.length,
      activeIdx: lines.length - 1,
      partialChars: 0,
    };

  const totalWeight = lines.reduce((s, l) => s + l.weight, 0);
  const raw = progress * totalWeight;
  let acc = 0;

  for (let i = 0; i < lines.length; i++) {
    const w = lines[i].weight;
    if (raw < acc + w) {
      const within = (raw - acc) / w;
      const line = lines[i];
      const hasTyping =
        line.type === "command" || line.type === "response-typing";
      const chars = hasTyping
        ? Math.floor(within * line.text.length)
        : within > 0.4
          ? line.text.length
          : 0;
      return { pastCount: i, activeIdx: i, partialChars: chars };
    }
    acc += w;
  }

  return {
    pastCount: lines.length,
    activeIdx: lines.length - 1,
    partialChars: 0,
  };
}

/* ──────────────────────────────────────────────────────────────
 *  Sub-components
 * ────────────────────────────────────────────────────────────── */

function PromptLine({ text }: { text: string }) {
  /* Split "❯ cmd" into prefix and cmd parts */
  const cmd = text.startsWith("❯ ") ? text.slice(2) : text;
  return (
    <span className="term-prompt-line">
      <span className="term-prompt">~/portfolio</span>
      <span className="term-caret">❯</span>
      <span className="term-cmd-body">{cmd}</span>
    </span>
  );
}

function TypewriterLine({
  text,
  charsVisible,
}: {
  text: string;
  charsVisible: number;
}) {
  const cmd = text.startsWith("❯ ") ? text.slice(2) : text;
  const safe = Math.max(0, Math.min(charsVisible, cmd.length));
  return (
    <span className="term-prompt-line">
      <span className="term-prompt">~/portfolio</span>
      <span className="term-caret">❯</span>
      <span className="term-cmd-body">
        <span className="term-type-text">{cmd.slice(0, safe)}</span>
        {safe < cmd.length && <span className="term-cursor-type">▊</span>}
      </span>
    </span>
  );
}

function ResponseBlock({ text }: { text: string }) {
  return (
    <div className="term-response">
      {text.split("\n").map((line, i) => (
        <p key={i} className="term-resp-line">
          {line}
        </p>
      ))}
    </div>
  );
}

function RespTypewriter({
  text,
  charsVisible,
}: {
  text: string;
  charsVisible: number;
}) {
  const safe = Math.max(0, Math.min(charsVisible, text.length));
  return (
    <div className="term-response term-resp-type">
      <span className="term-type-text">{text.slice(0, safe)}</span>
      {safe < text.length && <span className="term-cursor-type">▊</span>}
    </div>
  );
}

function LinkLine({
  label,
  url,
  show,
}: {
  label: string;
  url: string;
  show: boolean;
}) {
  return (
    <div
      className="term-link-row"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(4px)",
      }}
    >
      <span className="term-ll-label">{label}</span>
      <span className="term-ll-sep">:</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="term-ll-url"
      >
        {url}
      </a>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Main component
 * ────────────────────────────────────────────────────────────── */

export default function OpenSource() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const lines = useMemo(() => generateLines(openSourceProjects), []);
  const { pastCount, activeIdx, partialChars } = useMemo(
    () => computeVisible(progress, lines),
    [progress, lines],
  );

  /* ── Reduced motion detection ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (e: MediaQueryListEvent | MediaQueryList) =>
      setPrefersReducedMotion(e.matches);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ── ScrollTrigger progress tracker — NO pin ──
   *
   *  Instead of GSAP pinning (which can conflict with Journey's
   *  existing pin + Lenis), we use CSS `position: sticky` on the
   *  terminal wrapper and a tall spacer container.
   *
   *  ScrollTrigger simply watches the section's position and
   *  reports 0→1 progress as the user scrolls through it.
   * ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        invalidateOnRefresh: true,
        onUpdate(self) {
          setProgress(Math.min(self.progress, 1));
        },
      });
      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  /* ── Render a terminal line ── */
  function renderLine(line: TerminalLine, idx: number) {
    const isPast = idx < pastCount;
    const isActive = idx === activeIdx;
    if (!isPast && !isActive) return null;

    const key = line.id;

    switch (line.type) {
      case "command":
        return (
          <div key={key} className="term-line">
            {isPast ? (
              <PromptLine text={line.text} />
            ) : (
              <TypewriterLine
                text={line.text}
                charsVisible={partialChars}
              />
            )}
          </div>
        );

      case "response":
        return (
          <div key={key} className="term-line" style={{ opacity: isActive ? 0.3 : 1 }}>
            <ResponseBlock text={line.text} />
          </div>
        );

      case "response-typing":
        return (
          <div key={key} className="term-line">
            {isPast ? (
              <ResponseBlock text={line.text} />
            ) : (
              <RespTypewriter
                text={line.text}
                charsVisible={partialChars}
              />
            )}
          </div>
        );

      case "link":
        return (
          <div key={key} className="term-line">
            <LinkLine
              label={line.linkData![0]}
              url={line.linkData![1]}
              show={isPast || partialChars > 0}
            />
          </div>
        );

      case "separator":
        return <hr key={key} className="term-sep" />;

      default:
        return null;
    }
  }

  /* ── Render ── */
  return (
    <>
      {/* ═══════════════════════════════════════════════
          Heading
         ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-accent/15 to-transparent" />
        <div className="text-center max-w-4xl mx-auto relative z-10">
          {prefersReducedMotion ? (
            <>
              <h2 className="font-mono text-4xl md:text-6xl font-bold text-white mb-4">
                Open Source
              </h2>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent/70">
                Projects I&apos;ve Built
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          Terminal — CSS sticky + ScrollTrigger progress
         ═══════════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="relative os-track"
        style={{ height: `${lines.length * 10}vh` }}
      >
        {/* Sticky terminal wrapper */}
        <div
          className={[
            "os-sticky-wrap",
            prefersReducedMotion ? "os-reduced" : "",
          ].join(" ")}
        >
          {/* Accent line */}
          <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-accent/20 to-transparent z-10" />

          {/* Background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[700px] rounded-full bg-accent/4 blur-[200px]" />
          </div>

          {/* Terminal */}
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 lg:px-8">
            <div className="terminal-root">
              {/* Title bar */}
              <div className="term-titlebar">
                <div className="term-dots">
                  <span className="term-dot term-dot-red" />
                  <span className="term-dot term-dot-yellow" />
                  <span className="term-dot term-dot-green" />
                </div>
                <span className="term-title">open-source.sh</span>
                <div className="term-spacer" />
              </div>

              {/* Body */}
              <div className="term-body">
                {prefersReducedMotion ? (
                  <div className="term-session">
                    {openSourceProjects.map((p) => (
                      <div key={p.id} className="term-pb">
                        <p className="term-sl">
                          <span className="term-prompt">~/portfolio</span>
                          <span className="term-caret">❯</span>
                          <span className="term-static-cmd">
                            {p.installCmd}
                          </span>
                        </p>
                        <p className="term-static-resp">{p.installResponse}</p>
                        <p className="term-sl">
                          <span className="term-prompt">~/portfolio</span>
                          <span className="term-caret">❯</span>
                          <span className="term-static-cmd">
                            {p.name} --explain
                          </span>
                        </p>
                        <p className="term-static-resp">{p.explainOutput}</p>
                        <p className="term-sl">
                          <span className="term-prompt">~/portfolio</span>
                          <span className="term-caret">❯</span>
                          <span className="term-static-cmd">
                            {p.name} --links
                          </span>
                        </p>
                        <p className="term-static-resp">
                          Repository : {p.links.repo}
                        </p>
                        <p className="term-static-resp">
                          {p.links.packageLabel} : {p.links.package}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="term-session">
                    {lines.map((line, idx) => renderLine(line, idx))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
