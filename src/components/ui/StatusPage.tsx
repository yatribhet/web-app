"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Navbar } from "@/src/components/layout/Navbar";
import { ArrowRight, ArrowLeft } from "lucide-react";

// ─── Shared mountain silhouette SVG ──────────────────────────────────────────
function MountainScape({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 220"
      preserveAspectRatio="none"
      className={`w-full ${className}`}
      aria-hidden
    >
      {/* Far range — muted */}
      <polygon
        points="0,220 120,90 260,150 400,60 560,130 700,50 860,110 1000,40 1140,100 1200,70 1200,220"
        className="fill-current opacity-10"
      />
      {/* Mid range */}
      <polygon
        points="0,220 80,130 200,170 360,100 500,155 640,80 780,140 920,70 1080,130 1200,90 1200,220"
        className="fill-current opacity-20"
      />
      {/* Fore range — bold */}
      <polygon
        points="0,220 100,160 220,200 340,140 480,185 610,120 740,175 880,130 1010,165 1130,125 1200,155 1200,220"
        className="fill-current opacity-40"
      />
    </svg>
  );
}

// ─── Animated golden sun / star ──────────────────────────────────────────────
function SunGlow({ type }: { type: "404" | "ComingSoon" }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0.05, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-ember"
      />
      {/* Mid ring */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.1, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full bg-ember"
      />
      {/* Core disc */}
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#f5a623] via-ember to-dusk shadow-[0_0_60px_rgba(234,112,34,0.5)] flex items-center justify-center"
      >
        <img
          src="/images/logo-short-dark.svg"
          alt=""
          aria-hidden
          className="w-10 h-10 md:w-14 md:h-14 opacity-90 invert dark:invert-0"
        />
      </motion.div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface StatusPageProps {
  title: string;
  subtitle: string;
  eyebrow: string;
  message: string;
  primaryButton: { text: string; href: string };
  type: "404" | "ComingSoon";
}

// ─── Main component ───────────────────────────────────────────────────────────
export function StatusPage({
  title,
  subtitle,
  eyebrow,
  message,
  primaryButton,
  type,
}: StatusPageProps) {
  // Parallax on mouse move
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      rawX.set(e.clientX / innerWidth - 0.5);
      rawY.set(e.clientY / innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [rawX, rawY]);

  // Stagger word animation for title
  const words = title.split(" ");

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col min-h-screen bg-sand dark:bg-[#0e0b08] overflow-hidden"
    >
      <Navbar />

      {/* ── Atmospheric sky gradient ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        {/* Golden-hour horizon glow */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-ember/10 via-[#f5a623]/5 to-transparent dark:from-ember/20 dark:via-ember/5" />
        {/* Top vignette */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-sand/80 dark:from-[#0e0b08]/80 to-transparent" />
      </div>

      {/* ── Stars (Coming Soon) / Fog patches (404) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {type === "ComingSoon"
          ? [...Array(28)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{
                  duration: 2 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                className="absolute rounded-full bg-white dark:bg-[#f5ede4]"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 55}%`,
                }}
              />
            ))
          : [...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: ["-10%", "110%"],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 18 + i * 5,
                  repeat: Infinity,
                  delay: i * 6,
                  ease: "linear",
                }}
                className="absolute rounded-full bg-white/20 dark:bg-white/10 blur-3xl"
                style={{
                  width: 200 + i * 80,
                  height: 60 + i * 20,
                  top: `${20 + i * 12}%`,
                }}
              />
            ))}
      </div>

      {/* ── Mountain parallax layer ── */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 text-ember/70 dark:text-[#ea7022]"
        aria-hidden
      >
        <MountainScape />
      </motion.div>

      {/* ── Main content ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-24 text-center">

        {/* Sun glow orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "backOut" }}
          className="mb-10 md:mb-14"
        >
          <SunGlow type={type} />
        </motion.div>

        {/* Eyebrow label */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, letterSpacing: "0.2em" }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-ember text-xs md:text-sm uppercase tracking-[0.2em] font-medium mb-4 md:mb-6"
        >
          {eyebrow}
        </motion.p>

        {/* Title — word-by-word reveal */}
        <h1
          className="font-display italic text-ink dark:text-[#f5ede4] mb-4 md:mb-5 leading-tight"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.6, ease: "easeOut" }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="font-display text-xl md:text-2xl text-stone dark:text-[#b09a8a] mb-5 md:mb-6 max-w-xl"
        >
          {subtitle}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.85, duration: 0.6, ease: "easeOut" }}
          className="w-16 h-px bg-ember mx-auto mb-6 md:mb-8 origin-left"
        />

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="font-body text-stone/80 dark:text-[#8c7b6f] text-base md:text-lg max-w-md mx-auto leading-relaxed mb-10 md:mb-12"
        >
          {message}
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href={primaryButton.href}
            className="group inline-flex items-center gap-2 bg-ember text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide shadow-[0_4px_24px_rgba(234,112,34,0.35)] hover:bg-dusk hover:shadow-[0_8px_32px_rgba(234,112,34,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ember/30"
          >
            {primaryButton.text}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-stone/70 hover:text-ink dark:hover:text-[#f5ede4] text-sm font-medium transition-colors px-4 py-2 focus-visible:outline-none"
          >
            <ArrowLeft size={15} />
            Go back
          </button>
        </motion.div>
      </main>
    </div>
  );
}
