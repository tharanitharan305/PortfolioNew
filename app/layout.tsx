import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import DotField from "@/app/components/DotField";
import SmoothScrollProvider from "@/app/components/SmoothScrollProvider";
import { cn } from "@/lib/utils";

// Geist font was bundled by create-next-app but isn't available in Next 14's next/font/google.
// The app already uses Inter for body text via the --font-inter variable.

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tharanitharan — Full Stack Developer",
  description:
    "Portfolio of Tharanitharan, a full-stack developer specializing in Flutter, Node.js, and LLM integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(spaceGrotesk.variable, ibmPlexMono.variable, inter.variable, "font-sans")}
    >
      <body className="font-body bg-bg-deep text-text-body antialiased">
        {/* ── Full-site interactive dot-field background (React Bits) ── */}
        <DotField
          className="fixed inset-0 -z-10"
          dotRadius={1.5}
          dotSpacing={14}
          cursorRadius={500}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(192, 132, 252, 0.35)"
          gradientTo="rgba(45, 212, 191, 0.25)"
          glowColor="#0d0618"
        />

        {/* ── Page content ── */}
        <main className="relative z-0">
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </main>
      </body>
    </html>
  );
}
