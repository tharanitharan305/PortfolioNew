"use client";

import { motion } from "framer-motion";
import ScrollCue from "./ScrollCue";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Accent line decoration */}
      <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={childVariants}
          className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-6"
        >
          Full-Stack Developer
        </motion.p>

        {/* Main heading */}
        <motion.h1
          variants={childVariants}
          className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none text-white mb-6"
        >
          THARANITHARAN
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={childVariants}
          className="font-heading text-xl md:text-2xl text-text-body/80 mb-4"
        >
          a software developer.
        </motion.p>

        {/* Pitch line */}
        <motion.p
          variants={childVariants}
          className="font-mono text-sm text-text-body/60 max-w-xl mx-auto leading-relaxed"
        >
          full-stack developer specializing in{" "}
          <span className="text-accent">Flutter</span>
          <span className="mx-2">·</span>
          <span className="text-accent-teal">Node.js</span>
          <span className="mx-2">·</span>
          <span className="text-accent">LLM integration</span>
        </motion.p>
      </motion.div>

      <ScrollCue />
    </section>
  );
}
