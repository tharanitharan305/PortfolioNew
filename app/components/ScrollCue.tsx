"use client";

export default function ScrollCue() {
  return (
    <div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-scroll-cue flex flex-col items-center gap-2"
      aria-hidden="true"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/60">
        Scroll
      </span>
      <svg
        width="20"
        height="28"
        viewBox="0 0 20 28"
        fill="none"
        className="text-accent/60"
      >
        <rect
          x="1.5"
          y="1.5"
          width="17"
          height="25"
          rx="8.5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="10" cy="10" r="2" fill="currentColor">
          <animate
            attributeName="cy"
            values="8;14;8"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
