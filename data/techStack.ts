/* ──────────────────────────────────────────────────────────────
 *  Tech Stack & Tools
 *
 *  Each item appears in the InfiniteMenu 3D carousel on the
 *  TechStack section.  Images are pulled from the Simple Icons
 *  CDN (https://cdn.simpleicons.org/<slug>) which serves the
 *  official brand-colored SVG logos and is CORS-friendly.
 *  Swap any URL for a locally-hosted asset whenever you prefer.
 *
 *  NOTE: "SQL" and "Google ML Kit" don't have dedicated logos in
 *  Simple Icons, so they're mapped to the closest official mark
 *  (MySQL and the Google "G" respectively) — replace with a
 *  custom asset if you want something more precise.
 * ────────────────────────────────────────────────────────────── */

export interface TechStackItem {
  /** Technology / tool name */
  title: string;
  /** Short blurb — shown as the menu overlay description */
  description: string;
  /** Image (logo or representative photo) */
  image: string;
  /** External site for the technology */
  link: string;
}

export const techStackItems: TechStackItem[] = [
  {
    title: "Flutter",
    description:
      "Built cross‑platform mobile apps with custom animations, Riverpod state management, and native‑feeling UIs for iOS and Android from a single Dart codebase.",
    image: "https://cdn.simpleicons.org/flutter",
    link: "https://flutter.dev",
  },
  {
    title: "Dart",
    description:
      "Leveraged strong typing, async/await patterns, and sound null safety to write clean, maintainable code for Flutter apps and backend services.",
    image: "https://cdn.simpleicons.org/dart",
    link: "https://dart.dev",
  },
  {
    title: "C",
    description:
      "Developed system‑level programs and embedded applications, gaining deep understanding of memory management and low‑level optimisation.",
    image: "https://cdn.simpleicons.org/c",
    link: "https://en.wikipedia.org/wiki/C_(programming_language)",
  },
  {
    title: "Java",
    description:
      "Built scalable Android apps and backend services with Spring Boot, leveraging OOP principles and the JVM ecosystem.",
    image: "https://cdn.simpleicons.org/java",
    link: "https://www.java.com",
  },
  {
    title: "Docker",
    description:
      "Containerised applications for consistent dev‑to‑prod workflows using multi‑stage builds and Docker Compose.",
    image: "https://cdn.simpleicons.org/docker",
    link: "https://www.docker.com",
  },
  {
    title: "Node.js",
    description:
      "Built high‑performance REST APIs and real‑time services with Express.js, handling asynchronous I/O at scale.",
    image: "https://cdn.simpleicons.org/nodedotjs",
    link: "https://nodejs.org",
  },
  {
    title: "Firebase",
    description:
      "Integrated real‑time databases, authentication, cloud functions, and push notifications for full‑stack mobile apps.",
    image: "https://cdn.simpleicons.org/firebase",
    link: "https://firebase.google.com",
  },
  {
    title: "MongoDB",
    description:
      "Designed flexible document schemas for scalable NoSQL storage with aggregation pipelines and indexes.",
    image: "https://cdn.simpleicons.org/mongodb",
    link: "https://www.mongodb.com",
  },
  {
    title: "PostgreSQL",
    description:
      "Architected relational databases with complex queries, triggers, and views for robust data integrity.",
    image: "https://cdn.simpleicons.org/postgresql",
    link: "https://www.postgresql.org",
  },
  {
    title: "SQL",
    description:
      "Wrote optimised queries, stored procedures, and database schemas for relational data management across multiple projects.",
    image: "https://cdn.simpleicons.org/mysql",
    link: "https://en.wikipedia.org/wiki/SQL",
  },
  {
    title: "PHP",
    description:
      "Built dynamic web applications and RESTful APIs using Laravel, with MVC architecture and Eloquent ORM.",
    image: "https://cdn.simpleicons.org/php",
    link: "https://www.php.net",
  },
  {
    title: "Supabase",
    description:
      "Leveraged the open‑source Firebase alternative for real‑time subscriptions, Row‑Level Security, and auto‑generated REST APIs.",
    image: "https://cdn.simpleicons.org/supabase",
    link: "https://supabase.com",
  },
  {
    title: "Google Cloud",
    description:
      "Deployed and scaled applications on GCP using Compute Engine, Cloud Storage, Cloud Run, and managed databases.",
    image: "https://cdn.simpleicons.org/googlecloud",
    link: "https://cloud.google.com",
  },
  {
    title: "Vercel",
    description:
      "Deployed frontend applications and serverless functions with instant rollbacks and automatic SSL certificates.",
    image: "https://cdn.simpleicons.org/vercel",
    link: "https://vercel.com",
  },
  {
    title: "Render",
    description:
      "Hosted full‑stack applications with automated deployments, managed PostgreSQL, and background workers.",
    image: "https://cdn.simpleicons.org/render",
    link: "https://render.com",
  },
  {
    title: "Google ML Kit",
    description:
      "Integrated on‑device machine‑learning features — text recognition, face detection, and barcode scanning — into mobile apps.",
    image: "https://cdn.simpleicons.org/google",
    link: "https://developers.google.com/ml-kit",
  },
  {
    title: "Drive API",
    description:
      "Implemented file‑management features including upload, sync, and real‑time collaboration via the Google Drive REST API.",
    image: "https://cdn.simpleicons.org/googledrive",
    link: "https://developers.google.com/drive",
  },
  {
    title: "Maps SDK",
    description:
      "Embedded interactive maps, geocoding, directions, and location‑based features in mobile and web applications.",
    image: "https://cdn.simpleicons.org/googlemaps",
    link: "https://developers.google.com/maps",
  },
  {
    title: "AdMob",
    description:
      "Monetised mobile apps with banner, interstitial, and rewarded‑video ads using the Google AdMob SDK.",
    image: "https://cdn.simpleicons.org/googleadmob",
    link: "https://admob.google.com",
  },
  {
    title: "AdSense",
    description:
      "Implemented contextual ad placements and optimised revenue through responsive ad units and performance analysis.",
    image: "https://cdn.simpleicons.org/googleadsense",
    link: "https://adsense.google.com",
  },
];