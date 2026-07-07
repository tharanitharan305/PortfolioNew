/* ──────────────────────────────────────────────────────────────
 *  Open Source Projects
 *
 *  5 projects across Node.js, Flutter, and VS Code extension
 *  ecosystems.  Each has ecosystem-specific install commands,
 *  an --explain output, and --links output for the terminal
 *  showcase section.
 * ────────────────────────────────────────────────────────────── */

export type Ecosystem = "node" | "flutter" | "vscode";

export interface OpenSourceProject {
  id: number;
  name: string;
  ecosystem: Ecosystem;
  description: string;
  /** Full --explain output that types out in the terminal */
  explainOutput: string;
  installCmd: string;
  installResponse: string;
  links: {
    repo: string;
    package: string;
    packageLabel: string; // "NPM" | "Pub.dev" | "VS Marketplace"
  };
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
}

export const openSourceProjects: OpenSourceProject[] = [
  {
    id: 1,
    name: "gitm8",
    ecosystem: "node",
    description:
      "A CLI tool that automates Git workflows with smart commit templates, branch naming conventions, and PR checklists.",
    explainOutput:
      "GitM8 automates your Git workflow — smart commit messages with conventional commit templates, automated branch naming from issue IDs, interactive PR checklists, and pre-push hook validation.  Works with any Git project and integrates with GitHub & GitLab APIs for MR/PR metadata.",
    installCmd: "npm i -g gitm8",
    installResponse: "added 142 packages in 3.2s\n\nRun `gitm8 --help` to get started.",
    links: {
      repo: "https://github.com/tharanitharan/gitm8",
      package: "https://www.npmjs.com/package/gitm8",
      packageLabel: "NPM",
    },
    stars: 142,
    forks: 23,
    language: "TypeScript",
    languageColor: "#3178C6",
  },
  {
    id: 2,
    name: "pkgzilla",
    ecosystem: "node",
    description:
      "A Node.js CLI that analyzes package.json dependencies and suggests updates, duplicates, and security patches.",
    explainOutput:
      "Pkgzilla scans your package.json and lockfile to detect outdated dependencies, duplicate transitive deps, unused packages, and known CVEs.  Exports a JSON report for CI pipelines and supports monorepo workspaces.  Use `pkgzilla audit` to get a full health score for your project.",
    installCmd: "npm i -g pkgzilla",
    installResponse: "added 89 packages in 2.1s\n\nRun `pkgzilla audit` to scan your project.",
    links: {
      repo: "https://github.com/tharanitharan/pkgzilla",
      package: "https://www.npmjs.com/package/pkgzilla",
      packageLabel: "NPM",
    },
    stars: 89,
    forks: 12,
    language: "TypeScript",
    languageColor: "#3178C6",
  },
  {
    id: 3,
    name: "flutter_animate_plus",
    ecosystem: "flutter",
    description:
      "A Flutter package that supercharges animations with pre-built easing curves, sequence controllers, and performance optimizations.",
    explainOutput:
      "Flutter Animate Plus extends Flutter's animation framework with 40+ pre-built easing curves, a declarative sequence controller for chaining tweens, automatic dispose tracking, and a performance profiler that highlights janky frames.  Drop-in replacement for AnimatedContainer, TweenAnimationBuilder, and Hero with zero breaking changes.",
    installCmd: "flutter pub add flutter_animate_plus",
    installResponse: "Resolving dependencies...\n+ flutter_animate_plus 2.1.0\nDownloading... done.",
    links: {
      repo: "https://github.com/tharanitharan/flutter_animate_plus",
      package: "https://pub.dev/packages/flutter_animate_plus",
      packageLabel: "Pub.dev",
    },
    stars: 215,
    forks: 34,
    language: "Dart",
    languageColor: "#0175C2",
  },
  {
    id: 4,
    name: "dart_pocketbase",
    ecosystem: "flutter",
    description:
      "A Dart client for PocketBase with real-time subscriptions, offline-first caching, and auto-generated typed models.",
    explainOutput:
      "Dart PocketBase provides a type-safe Dart client for PocketBase backends with real-time collection subscriptions via WebSocket, offline-first SQLite caching with sync conflict resolution, auto-generated model classes from your schema, and built-in auth helpers for OAuth2 & magic-link flows.  Supports both Flutter and standalone Dart projects.",
    installCmd: "dart pub add dart_pocketbase",
    installResponse: "Resolving dependencies...\n+ dart_pocketbase 0.8.3\nDownloading... done.",
    links: {
      repo: "https://github.com/tharanitharan/dart_pocketbase",
      package: "https://pub.dev/packages/dart_pocketbase",
      packageLabel: "Pub.dev",
    },
    stars: 178,
    forks: 19,
    language: "Dart",
    languageColor: "#0175C2",
  },
  {
    id: 5,
    name: "themeswitch",
    ecosystem: "vscode",
    description:
      "A VS Code extension that automatically switches themes based on time of day, project language, and ambient light.",
    explainOutput:
      "ThemeSwitch auto-detects your ideal VS Code theme based on three signals: time of day (sunrise/sunset via geolocation or manual offset), active project language (dark themes for backend, light for frontend), and ambient light sensor data on supported devices.  Ships with 20 curated theme pairs and supports any installed theme.  Use `theme: Switch` from the command palette to trigger manually.",
    installCmd: "ext install tharanitharan.themeswitch",
    installResponse: "Installing extension 'tharanitharan.themeswitch'...\n✓ Installed. Reload window to activate.",
    links: {
      repo: "https://github.com/tharanitharan/themeswitch",
      package: "https://marketplace.visualstudio.com/items?itemName=tharanitharan.themeswitch",
      packageLabel: "VS Marketplace",
    },
    stars: 56,
    forks: 8,
    language: "TypeScript",
    languageColor: "#3178C6",
  },
];
