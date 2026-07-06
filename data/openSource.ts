/* ──────────────────────────────────────────────────────────────
 *  Open Source Projects
 *
 *  5 dummy repos for the Terminal Typewriter showcase section.
 *  Replace with real projects when ready.
 * ────────────────────────────────────────────────────────────── */

export interface OpenSourceProject {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  url: string;
}

export const openSourceProjects: OpenSourceProject[] = [
  {
    id: 1,
    name: "flutter-magic-scroll",
    description:
      "A Flutter package providing magical scroll-driven animations for lists, grids, and custom scroll views with minimal boilerplate.",
    stars: 142,
    forks: 23,
    language: "Dart",
    languageColor: "#0175C2",
    url: "https://github.com/tharanitharan/flutter-magic-scroll",
  },
  {
    id: 2,
    name: "node-api-kit",
    description:
      "Lightweight Node.js API starter with built-in authentication, rate limiting, request validation, and auto-generated OpenAPI documentation.",
    stars: 89,
    forks: 12,
    language: "TypeScript",
    languageColor: "#3178C6",
    url: "https://github.com/tharanitharan/node-api-kit",
  },
  {
    id: 3,
    name: "pixel-palette",
    description:
      "AI-powered color palette generator that extracts harmonious color schemes from images using k-means clustering and color theory rules.",
    stars: 215,
    forks: 34,
    language: "Python",
    languageColor: "#3572A5",
    url: "https://github.com/tharanitharan/pixel-palette",
  },
  {
    id: 4,
    name: "react-form-wizard",
    description:
      "Headless React form builder with drag-and-drop field ordering, multi-step validation, and conditional field logic for complex forms.",
    stars: 56,
    forks: 8,
    language: "TypeScript",
    languageColor: "#3178C6",
    url: "https://github.com/tharanitharan/react-form-wizard",
  },
  {
    id: 5,
    name: "dockerfile-optimizer",
    description:
      "CLI tool that analyzes Dockerfiles and suggests optimizations for layer caching, image size reduction, and multi-stage build improvements.",
    stars: 178,
    forks: 19,
    language: "Go",
    languageColor: "#00ADD8",
    url: "https://github.com/tharanitharan/dockerfile-optimizer",
  },
];
